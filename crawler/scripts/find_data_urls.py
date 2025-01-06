'''
<FILE>
find_data_urls.py


<DESCRIPTION>
The purpose of this script is to detect the URLs to the data files in each of
the relevant URLs present in the project description.

<FUNCTIONS>
This script can be run by calling find_data_urls.run(<args>). All other functions
in this script should remain private. This section only lists a brief description
of each function. For more comprehensive documentation, see each method directly.

    * run(...):
        Finds the URLs to each relevant data file.

    * find_file_urls(...):
        Finds all data file URLs from a given webpage.

    * get_file_classification(...):
        Detects what data file classification, if any, a URL falls under. E.g.
        Cohorts, Expenditure Data, Daily Membership, etc.
'''

from lxml import html
import tldextract
import requests
import time
from scripts.utils import detect_year

urls_checked = set()

def run(PDF_URLS_FILE_PATH, DATA_URLS_FILE_PATH, logger):
    '''
    Finds the URLs to each relevant data file.

    <EXTENDED_DESCRIPTION>
    Checks the webpages listed in the PDF URLs file. Should the page contain
    a URL to a relevant data file, it will write it to the Data URLs file.

    <ARGUMENTS>
        * PDF_URLS_FILE_PATH [String]: The path to the input URLs text file.

        * PDF_URLS_FILE [String]: The path to the output URLs text file.

        * logger [utils.Logger]: The current Logger instance.
    '''

    logger.indent()

    pdf_urls_file = open(PDF_URLS_FILE_PATH, "r")
    data_urls_file = open(DATA_URLS_FILE_PATH, "w+")
    file_urls = []

    for url in pdf_urls_file:
        url_clean = url.strip()

        logger.write(f'Checking {url_clean}')

        logger.indent()
        file_urls.extend(find_file_urls(url_clean, logger))
        logger.unindent()

    for file_url in file_urls:
        data_urls_file.write(file_url + "\n")

    pdf_urls_file.close()
    data_urls_file.close()
    logger.unindent()

def find_file_urls(page_url, logger):
    '''
    Finds all data file URLs from a given webpage.

    <EXTENDED_DESCRIPTION>
    Will try to reach the webpage a maximum of 5 tries. After 5 errors, it will
    fail.

    <ARGUMENTS>
        * page_url [String]: The URL of the page to be searched through.

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * [[String...]]: A list of all relevant data file URLs on the webpage.
    '''

    attempts = 0
    max_attempts = 5

    while True: # Will repeatedly try to reach the URL
        request = requests.get(page_url)

        if not request.ok:
            logger.write(f'Failed Request: {page_url}')
            logger.write(f'Status Code: {request.status_code}')

            if attempts < max_attempts:
                attempts = attempts + 1
                logger.write(f'Request Failed [{attempts}/{max_attempts}]. Attempting again in 5 seconds...')
                time.sleep(5) # Waits incase of rate-limiting
                continue
            else:
                logger.warn('Max attempt count reached.')
                logger.warn(f'Could not reach {page_url}!')
                break

        content = html.fromstring(request.content)
        possible_file_urls = content.xpath("//a/@href")

        file_urls = []
        for possible_file_url in possible_file_urls:
            if possible_file_url in urls_checked:
                logger.write(f'Already checked {possible_file_url}')
                continue
            else:
                logger.write(f'Checking {possible_file_url}')
                urls_checked.add(possible_file_url)

            tld = tldextract.extract(page_url).fqdn

            file_class = get_file_classification(possible_file_url, tld, logger)
            if file_class is None:
                continue

            protocol = "https://" if page_url.startswith("https") else "http://"
            slash = "" if possible_file_url.startswith("/") else "/"

            file_urls.append(file_class + "; " + protocol + tld + slash + possible_file_url)

        return file_urls
    return []


def get_file_classification(possible_file_url, tld, logger):
    '''
    Detects what data file classification, if any, a URL falls under. E.g.
    Cohorts, Expenditure Data, Daily Membership, etc.

    <ARGUMENTS>
        * possible_file_url [String]: The URL to check.

        * tld [String]: The Top Level Domain of the webpage.

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * [String | None]:
            The file classification, if the file is detected as relevant.
            None, otherwise.
    '''

    file_url = possible_file_url.lower().replace("%20", " ")
    try:
        file_year = detect_year(file_url)
    except ValueError:
        file_year = -1

    def accept(file_url, type):
        logger.write(f'Accepting: {file_url}')
        return type

    def reject(file_url):
        logger.write(f'Rejecting: {file_url}')
        return None

    if file_url.endswith("aspx"):
        return reject(file_url)

    if file_url.startswith("http"):
        return reject(file_url)

    # 1-5: School/District Facts, School/District Fiscal Data, Future Ready Performace Data
    if "futurereadypa" in tld:
        if "getdatafile" in file_url:
            if "id=46" in file_url:
                return reject(file_url)
            if "id=47" in file_url:
                return reject(file_url)
            return accept(file_url, "FRPA")
        return reject(file_url)

    # 6-9, 11-15, 17: Low Income Public/Private Data, Keystone Data, PSSA Data, Graduates, Dropouts, Cohorts, Enrollments, Personell
    if "pa.gov" in tld:
        if "low income" in file_url:
            if "through" in file_url:
                return reject(file_url)
            if "private" in file_url:
                return accept(file_url, "Low_Income_Private")
            return accept(file_url, "Low_Income_Public")

        if "keystone" in file_url:
            if "technical" in file_url:
                return reject(file_url)
            if file_year >= 2023:
                return reject(file_url)
            return accept(file_url, "Keystones")

        if "pssa" in file_url:
            if "district" in file_url:
                return reject(file_url)
            return accept(file_url, "PSSAs")

        if "graduate" in file_url:
            return accept(file_url, "Graduates")

        if "dropout" in file_url:
            return accept(file_url, "Dropouts")

        if "cohort" in file_url:
            return accept(file_url, "Cohorts")

        if "enrollment" in file_url:
            if "through" in file_url:
                return reject(file_url)
            if "private" in file_url:
                return accept(file_url, "Enrollment_Private")
            return accept(file_url, "Enrollment_Public")

        if "personnel" in file_url:
            return accept(file_url, "Personnel")

        if "afr" in file_url:
            if "expenditure" in file_url:
                return accept(file_url, "AFR_Expenditure")
            if "revenue" in file_url:
                return accept(file_url, "AFR_Revenue")
            return reject(file_url)

        if "financial data elements" in file_url:
            if "aidratio" in file_url:
                if "calc" in file_url:
                    return reject(file_url)
                return accept(file_url, "Aid_Ratios")
            if "membership" in file_url:
                return accept(file_url, "Daily_Membership")
            if "income" in file_url:
                return accept(file_url, "Personal_Income")
            if "tax" in file_url:
                return accept(file_url, "Tax_Rates")
            return reject(file_url)

        if "gfb" in file_url:
            if ".xlsx" in file_url:
                return accept(file_url, "GFB")
            return reject(file_url)

        if "historical" in file_url:
            if "basic" in file_url:
                return accept(file_url, "Funding_Basic")
            if "special" in file_url:
                return accept(file_url, "Funding_Special")
            if "secondary" in file_url:
                return accept(file_url, "Secondary_CTE_Subsidy")
            return reject(file_url)


        return reject(file_url)

    # 10: Academic Performance Data
    if "paschoolperformance" in tld:
        if "apd" in file_url:
            return accept(file_url, "APD")
        return reject(file_url)

    return reject(file_url)