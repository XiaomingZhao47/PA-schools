#!/bin/bash

# If the pdf file ever changes, you can rename this
PDF_FILE="./TeamProject.pdf"
LINKS_FILE="./links.txt"
LINKS=""

# Pulls the links from the pdf file
LINKS=$(grep -a "http" $PDF_FILE)

# Removes the parenthesis
LINKS=$(echo "$LINKS" | cut -d "(" -f 2 | cut -d ")" -f 1)

# Removes duplicate links
LINKS=$(echo "$LINKS" | sort -u)

# Removes the links we don't care about
LINKS=$(echo "$LINKS" | grep -Evi "ruby|django|flask|Search/District")

echo "$LINKS" > $LINKS_FILE
