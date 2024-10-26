document.addEventListener("DOMContentLoaded", function() {
    const files = [{
        filename: "tangle.js",
        mediaType: "text/javascript"
    }, {
        filename: "tangle.css",
        mediaType: "text/css"
    }, {
        filename: "tangler.el",
        mediaType: "text/elisp"
    }, {
        filename: "Makefile",
        mediaType: "text/plain"
    }, {
        filename: "README.md",
        mediaType: "text/markdown"
    }];

    const list = document.createElement("ul");
    document.querySelector("h2:last-of-type + p").after(list);

    for (const file of files) {
        const li = document.createElement("li");
        list.appendChild(li);
        li.appendChild(Tangler.createChunkDownloadLink(
            document.getElementById(file.filename),
            file.filename, file.mediaType));
    }

    document.querySelector("article").appendChild(
        Tangler.createChunkIndex("chunk-index"));
});
