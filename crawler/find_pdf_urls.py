import os
from utils import log

# Checks if the url is valid and one we care about
def is_valid_url(line):
    lower_line = line.lower()

    if "http" not in lower_line:
        return False

    if "django" in lower_line:
        return False

    if "flask" in lower_line:
        return False

    if "ruby" in lower_line:
        return False

    if "/search/district" in lower_line:
        return False

    return True

# Removes the opening/closing parenthesis and newline
def clean(url):
    return url[1:-2]


def run(PDF_FILE, PDF_URLS_FILE, logger):
    pdf_file = open(PDF_FILE, "rb")

    valid_urls = []

    for b_line in pdf_file:
        line = b_line.decode("latin-1")

        if is_valid_url(line):
            url = clean(line)

            if url not in valid_urls:
                valid_urls.append(url)

    pdf_file.close()
    pdf_urls_file = open(PDF_URLS_FILE, "w")

    valid_urls.sort()
    for valid_url in valid_urls:
        pdf_urls_file.write(valid_url + "\n")
        log(logger, f'    Found valid url: {valid_url}')

    pdf_urls_file.close()
