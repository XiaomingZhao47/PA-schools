from lxml import html
import requests

def run(PDF_URLS_FILE_PATH, DATA_URLS_FILE_PATH, logger):
    pdf_urls_file = open(PDF_URLS_FILE_PATH, "r")
    data_urls_file = open(DATA_URLS_FILE_PATH, "w")

    def log(message):
        logger.write(message + "\n")
        print(message)

    # Finds all the files on the url
    def find_file_urls(page_url):

        request = requests.get(page_url)
        content = html.fromstring(request.content)
        possible_file_urls = content.xpath("//a/@href")

        if not request.ok:
            log(f'      Failed Request: {page_url}')
            log(f'      Status Code: {request.status_code}')

        file_urls = []
        for possible_file_url in possible_file_urls:
            if is_valid_file(possible_file_url):
                file_urls.append(page_url + possible_file_url)

        return file_urls

    # Checks if a url is a file
    def is_valid_file(possible_file_url):
        file_url = possible_file_url.lower()

        if "getdatafile" in file_url:
            return True

        if "data.zip" in file_url:
            return True

        if ".xls" in file_url:
            return True

        return False


    # ============ Main Code ============
    log("Starting script...")
    file_urls = []

    for url in pdf_urls_file:
        url_clean = url.strip()

        log(f'    Checking {url_clean}')

        file_urls.extend(find_file_urls(url_clean))


    for file_url in file_urls:
        data_urls_file.write(file_url + "\n")

    pdf_urls_file.close()
    data_urls_file.close()
