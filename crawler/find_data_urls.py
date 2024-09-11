from lxml import html
import tldextract
import requests
from utils import detect_year, Logger

def run(PDF_URLS_FILE_PATH, DATA_URLS_FILE_PATH, logger):
    logger.indent()

    pdf_urls_file = open(PDF_URLS_FILE_PATH, "r")
    data_urls_file = open(DATA_URLS_FILE_PATH, "w+")

    # Finds all the files on the url
    def find_file_urls(page_url):

        request = requests.get(page_url)
        content = html.fromstring(request.content)
        possible_file_urls = content.xpath("//a/@href")

        if not request.ok:
            logger.write(f'Failed Request: {page_url}')
            logger.write(f'Status Code: {request.status_code}')

        file_urls = []
        for possible_file_url in possible_file_urls:
            tld = tldextract.extract(page_url).fqdn

            file_class = get_file_classification(possible_file_url, tld)
            if not file_class == "":

                protocol = "https://" if page_url.startswith("https") else "http://"
                slash = "" if possible_file_url.startswith("/") else "/"

                file_urls.append(file_class + "; " + protocol + tld + slash + possible_file_url)

        return file_urls

    # Checks if a url is a file
    def get_file_classification(possible_file_url, tld):
        file_url = possible_file_url.lower().replace("%20", " ")
        file_year = detect_year(file_url)

        def accept(file_url, type):
            logger.write(f'Accepting: {file_url}')
            return type

        def reject(file_url):
            logger.write(f'Rejecting: {file_url}')
            return ""

        if file_url.endswith("aspx"):
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
        if "education.pa.gov" in tld:
            if "low income" in file_url:
                if "through" in file_url:
                    return reject(file_url)
                if "private" in file_url:
                    return accept(file_url, "Low Income Private")
                return accept(file_url, "Low Income Public")

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
                    return accept(file_url, "Enrollment Private")
                return accept(file_url, "Enrollment Public")

            if "personnel" in file_url:
                return accept(file_url, "Personnel")

            return reject(file_url)

        # 10: Academic Performance Data
        if "paschoolperformance" in tld:
            if "apd" in file_url:
                return accept(file_url, "APD")
            return reject(file_url)

        return reject(file_url)


    # ============ Main Code ============
    file_urls = []

    for url in pdf_urls_file:
        url_clean = url.strip()

        logger.write(f'Checking {url_clean}')

        logger.indent()
        file_urls.extend(find_file_urls(url_clean))
        logger.unindent()


    for file_url in file_urls:
        data_urls_file.write(file_url + "\n")

    pdf_urls_file.close()
    data_urls_file.close()
    logger.unindent()
