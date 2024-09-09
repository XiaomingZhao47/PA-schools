#!/bin/bash

# If the pdf file ever changes, you can rename this
PDF_FILE="./TeamProject.pdf"
URLS_FILE="./pdf_urls.txt"
URLS=""

# Pulls the links from the pdf file
URLS=$(grep -a "http" $PDF_FILE)

# Removes the parenthesis
URLS=$(echo "$URLS" | cut -d "(" -f 2 | cut -d ")" -f 1)

# Removes duplicate links
URLS=$(echo "$URLS" | sort -u)

# Removes the links we don't care about
URLS=$(echo "$URLS" | grep -Evi "ruby|django|flask|Search/District")

echo "$URLS" > $URLS_FILE
