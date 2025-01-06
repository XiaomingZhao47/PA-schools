'''
<FILE>
find_pdf_urls.py


<DESCRIPTION>
The purpose of this script is to detect relevant URLS in the provided project
description PDF file.


<FUNCTIONS>
This script can be run by calling find_pdf_urls.run(<args>). All other functions
in this script should remain private. This section only lists a brief description
of each function. For more comprehensive documentation, see each method directly.

    * run(...): Detects URLs in the provided PDF file.

    * is_valid_url(...): Checks if a data line contains a URL.

    * clean(...): Cleans a string into a valid URL.
'''

import os
import requests

def run(PDF_FILE, PDF_URLS_FILE, logger):
    '''
    Detects URLs in the provided PDF file.

    <EXTENDED_DESCRIPTION>
    Reads the PDF file data to detect any URLs present. Should the URL be one
    worth saving, it writes it to a text file. Additionally, it adds in a few
    URLS which were intended to be a part of the PDF, but weren't written.

    <ARGUMENTS>
        * PDF_FILE_PATH [String]: The path to the input PDF file.

        * PDF_URLS_FILE_PATH [String]: The path to the output text file.

        * logger [utils.Logger]: The current Logger instance.
    '''

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
    valid_urls.append("https://www.pa.gov/agencies/education/programs-and-services/schools/grants-and-funding/school-finances/financial-data/summary-of-annual-financial-report-data/afr-data-summary-level.html")
    valid_urls.append("https://www.pa.gov/agencies/education/programs-and-services/schools/grants-and-funding/school-finances/financial-data/financial-data-elements.html")


    valid_urls.sort()
    for valid_url in valid_urls:
        valid_url = update_url(valid_url, logger)
        pdf_urls_file.write(valid_url + "\n")
        logger.write(f'Found valid url: {valid_url}')

    pdf_urls_file.close()
    logger.unindent()

def update_url(url, logger):
    '''
    Updates URL to point to the updated webpage.

    <EXTENDED_DESCRIPTION>
    Because the state government has updated the structure of its website, the
    links present in the project description document are outdated. However, the
    old links redirect to the new website. This function finds where the URLs
    redirect to.

    <ARGUMENTS>
        * url [String]: The URL to update.

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * [String]: The updated URL.
    '''

    attempts = 0
    max_attempts = 5

    while True: # Will repeatedly try to reach the URL
        try:
            request = requests.get(url)
        except:
            request = None

        if request is None or not request.ok:
            logger.write(f'Failed Request: {url}')
            if request is not None:
                logger.write(f'Status Code: {request.status_code}')

            if attempts < max_attempts:
                attempts = attempts + 1
                logger.write(f'Request Failed [{attempts}/{max_attempts}]. Attempting again in 5 seconds...')
                time.sleep(5) # Waits incase of rate-limiting
                continue
            else:
                logger.warn('Max attempt count reached.')
                logger.warn(f'Could not reach {url}!')
                return url
        else:
            logger.write(f'Replacing "{url}" with "{request.url}"')
            return request.url


def is_valid_url(line):
    '''
    Checks if a data line contains a URL.

    <ARGUMENTS>
        * line [String]: A decoded binary line from the PDF.

    <RETURN>
        * [Boolean]: If the data line contains a URL.
    '''

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

def clean(url):
    '''
    Cleans a string into a valid URL.

    <EXTENDED_DESCRIPTION>
    Removes the opening/closing parentheses and newline.

    <ARGUMENTS>
        * url [String]: The raw URL to be cleaned.

    <RETURN>
        * [String]: The cleaned URL.
    '''

    return url[1:-2]