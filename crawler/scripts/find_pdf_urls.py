import os

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
    logger.indent()
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

    # Bonus urls that weren't in the pdf file
    valid_urls.append("https://www.education.pa.gov/Teachers%20-%20Administrators/School%20Finances/Finances/AFR%20Data%20Summary/Pages/AFR-Data-Summary-Level.aspx")
    valid_urls.append("https://www.education.pa.gov/Teachers%20-%20Administrators/School%20Finances/Finances/FinancialDataElements/Pages/default.aspx")
    valid_urls.append("https://www.education.pa.gov/Teachers%20-%20Administrators/School%20Finances/Finances/GFBData/Pages/default.aspx")
    valid_urls.append("https://www.education.pa.gov/Teachers%20-%20Administrators/School%20Finances/Finances/Historical%20Files/Pages/default.aspx")

    valid_urls.sort()
    for valid_url in valid_urls:
        pdf_urls_file.write(valid_url + "\n")
        logger.write(f'Found valid url: {valid_url}')

    pdf_urls_file.close()
    logger.unindent()
