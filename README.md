# Tangler

Tangler is a literate programming tool whose input format is HTML.

Read all about it at https://hober.github.io/tangler/

To extract Tangler’s source code from  [the HTML file](https://hober.github.io/tangler/), you can simply [download the source files](https://hober.github.io/tangler/#download), or you can check out this repository and extract the Makefile with the following command:

    node - index.html Makefile < bootstrap/tangle.js > Makefile

After this, a simple `make` should do the right thing.
