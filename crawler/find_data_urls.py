from lxml import html
from utils import log
import tldextract
import requests

def run(PDF_URLS_FILE_PATH, DATA_URLS_FILE_PATH, logger):
    pdf_urls_file = open(PDF_URLS_FILE_PATH, "r")
    data_urls_file = open(DATA_URLS_FILE_PATH, "w")

    # Finds all the files on the url
    def find_file_urls(page_url):

        request = requests.get(page_url)
        content = html.fromstring(request.content)
        possible_file_urls = content.xpath("//a/@href")

        if not request.ok:
            log(logger, f'      Failed Request: {page_url}')
            log(logger, f'      Status Code: {request.status_code}')

        file_urls = []
        for possible_file_url in possible_file_urls:
            if is_valid_file(possible_file_url):
                tld = tldextract.extract(page_url).fqdn
                file_urls.append(tld + possible_file_url)

        return file_urls

    # Checks if a url is a file
    def is_valid_file(possible_file_url):
        file_url = possible_file_url.lower()

        if "getdatafile" in file_url:
            log(logger, f'      Accepting: {possible_file_url}')
            return True

        if ".zip" in file_url:
            log(logger, f'      Accepting: {possible_file_url}')
            return True

        if ".xls" in file_url:
            log(logger, f'      Accepting: {possible_file_url}')
            return True

        log(logger, f'      Rejecting: {possible_file_url}')
        return False


    # ============ Main Code ============
    file_urls = []

    for url in pdf_urls_file:
        url_clean = url.strip()

        log(logger, f'    Checking {url_clean}')

        file_urls.extend(find_file_urls(url_clean))


    for file_url in file_urls:
        data_urls_file.write(file_url + "\n")

    pdf_urls_file.close()
    data_urls_file.close()
