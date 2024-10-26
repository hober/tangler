/* tangle.js - Tangler, a tool for literate programming
 *
 * Copyright © 2024  Theresa O'Connor <tess@oconnor.cx>
 */
(function() {
    globalThis.Tangler = {};
    if ('require' in globalThis) {
        if (process.argv.length < 4) {
            console.error(
                "USAGE: node tangle.js tangler-filename chunk-id");
            process.exit(1);
        }
        const { JSDOM } = require("jsdom");
        const html = require('fs').readFileSync(process.argv[2], 'utf-8');
        const dom = new JSDOM(html);
        globalThis.Node = dom.window.Node;
        globalThis.DocumentFragment = dom.window.DocumentFragment;
        globalThis.document = dom.window.document;
    }
    function isAncestor(node, possibleAncestor) {
        return Node.DOCUMENT_POSITION_CONTAINS &
            node.compareDocumentPosition(possibleAncestor);
    }
    function spaces(length) {
        return Array(length).fill(" ").join("");
    }
    Tangler.tangle = function(chunk, indent = 0) {
        let tangled = "";
        const prefix = "\n" + spaces(indent);
        let text = "";
        let xref = null;
        const walker = document.createTreeWalker(
            chunk.querySelector("pre"));
        while (walker.nextNode()) {
            switch (walker.currentNode.nodeType) {
            case Node.ELEMENT_NODE:
                if (walker.currentNode.localName != "a")
                    continue;
                if (!walker.currentNode.classList.contains("chunk"))
                    continue;
                xref = walker.currentNode;
                const lines = text.split("\n");
                tangled += lines.join(prefix);
                text = "";
                const last = lines[lines.length - 1];
                tangled += Tangler.tangle(
                    document.querySelector(
                        walker.currentNode.getAttribute("href")),
                    indent + last.length);
                break;
            case Node.TEXT_NODE:
                if (xref && isAncestor(walker.currentNode, xref))
                    continue;
                else if (xref) // We’re no longer inside xref, so forget it
                    xref = null;
                text += walker.currentNode.data;
                break;
            default:
                break;
            }
        }
        tangled += text.split("\n").join(prefix);
        return tangled;
    }
    Tangler.createChunkIndex = function(id) {
        const index = new DocumentFragment();
    
        const heading = document.createElement("h2");
        if (id)
            heading.id = id;
        index.appendChild(heading);
        heading.appendChild(document.createTextNode("Chunk index"));
        const chunkList = document.createElement("ul");
        index.appendChild(chunkList);
        
        const chunkNameMap = new Map();
        
        for (const chunk of document.querySelectorAll("figure.chunk")) {
            chunkNameMap.set(
                chunk.querySelector("figcaption").textContent,
                chunk);
        }
        
        for (const chunkName of Array.from(chunkNameMap.keys()).sort()) {
            const chunk = chunkNameMap.get(chunkName);
            const indexEntry = document.createElement("li");
            chunkList.appendChild(indexEntry);
            const link = document.createElement("a");
            indexEntry.appendChild(link);
            
            link.href = "#" + chunk.id;
            link.classList.add("chunk");
            
            const title = chunk.querySelector("figcaption").cloneNode(true);
            while (title.childNodes.length > 0) {
                link.appendChild(title.childNodes[0]);
            }
        }
    
        return index;
    }
    Tangler.createChunkDownloadLink = function(chunk, filename, mediaType) {
        const link = document.createElement("a");
        link.download = filename;
        link.href = `data:${mediaType};charset=utf-8,${
                        encodeURIComponent(Tangler.tangle(chunk))
                    }`;
        let filename_el = document.createElement("code");
        filename_el.appendChild(document.createTextNode(filename));
        link.appendChild(filename_el);
        return link;
    }
    if ('require' in globalThis) {
        console.log(
            Tangler.tangle(document.getElementById(process.argv[3])));
    }
})();

