# Tangler

Tangler is a literate programming tool whose input format is HTML.

You can simply open [the HTML file](index.html) and click the download
links, or you can use the provided Makefile. To extract the Makefile,
run the following:

    node - index.html Makefile < bootstrap/tangle.js > Makefile

After this, a simple `make` should do the right thing.
