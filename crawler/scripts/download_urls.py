'''
<FILE>
download_urls.py


<DESCRIPTION>
The purpose of this script is to download the data files listed in the data
URLs text file.


<FUNCTIONS>
This script can be run by calling download_urls.run(<args>). All other functions
in this script should remain private. This section only lists a brief description
of each function. For more comprehensive documentation, see each method directly.

    * run(...): Downloads the URLs listed in the data file URLs file

    * request(...): Will try to request a file from a

    * get_filename(...): Detects a file name in a web request

    * is_downloadable(...): Checks if a request is downloadable
'''

import requests
import re
import os
import random
import time
from pathlib import Path

# https://www.codementor.io/@aviaryan/downloading-files-from-urls-in-python-77q3bs0un
def run(DATA_URLS_FILE, RAW_DATA_DIRECTORY, logger):
    '''
    Downloads the URLs listed in the data file URLs file

    <EXTENDED_DESCRIPTION>
    Tries to download files from the URLs listed in the data URLs text file.
    It will also sort each file into a directory based on its classification.
    (See <find_pdf_urls.get_file_classification(...)>)

    <ARGUMENTS>
        * DATA_URLS_FILE [String]: The path to the input data URLs text file.

        * RAW_DATA_DIRECTORY [String]: The path to the output directory.

        * logger [utils.Logger]: The current Logger instance.
    '''

    logger.indent()
    data_urls_file = open(DATA_URLS_FILE, "r")

    for line in data_urls_file:

        logger.write(f'Checking: {url}')
        logger.indent()

        split_line = line.strip().split("; ")
        file_class = split_line[0]
        url = split_line[1]

        request = request(url)

        if request is None:
            continue

        if is_downloadable(request, logger):
            filename = get_filename(request, logger)
            directory = DATA_DIRECTORY + "/" + file_class + "/"
            filepath = directory + filename

            Path(directory).mkdir(parents=True, exist_ok=True)

            if os.path.exists(filepath):
                logger.write("File already exists!")
                exit()

            file = open(filepath, 'wb')
            file.write(request.content)
            file.close()

        logger.unindent()

    data_urls_file.close()
    logger.unindent()

def request(url):
    '''
    Will try to request a file from a given URL.

    <EXTENDED_DESCRIPTION>
    Will try to reach the webpage a maximum of 5 tries. After 5 errors, it will
    fail.

    <ARGUMENTS>
        * url [String]: The URL of the data file.

    <RETURN>
        * [Request | None]:
            The web request, if successful.
            None, otherwise.
    '''

    attempts = 0
    max_attempts = 5

    while True: # Will repeatedly try to reach the URL
        request = requests.get(url)

        if not request.ok:
            logger.write(f'Failed Request: {url}')
            logger.write(f'Status Code: {request.status_code}')

            if attempts < max_attempts:
                attempts = attempts + 1
                logger.write(f'Request Failed [{attempts}/{max_attempts}]. Attempting again in 5 seconds...')
                time.sleep(5) # Waits incase of rate-limiting
                continue
            else:
                logger.warn('Max attempt count reached.')
                logger.warn(f'Could not reach {page_url}!')
                return None

def get_filename(request, logger):
    '''
    Detects a file name in a web request

    <EXTENDED_DESCRIPTION>
    Will try to detect the name from the request header's content disposition.
    It failed, the name will be pulled from the request URL.

    <ARGUMENTS>
        * request [Request]: The web request for the file

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * [String]: The request's file name
    '''

    cd = request.headers.get("content-disposition")

    if cd:
        filename = re.findall('filename=(.*?);', cd)

        if len(filename) != 0:
            logger.write(f'Found filename in cd: {filename[0]}')
            return filename[0]

        logger.write(f'No file name in cd... Checking url')

    filename = request.url.split("/")[-1].replace("%20", " ")
    logger.write(f'Found filename without cd: {filename}')
    return filename

def is_downloadable(request, logger):
    '''
    Checks if a request is downloadable

    <EXTENDED_DESCRIPTION>
    Uses the request's headers to detect if the request is downloadable

    <ARGUMENTS>
        * request [Request]: The web request for the file

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * [Boolean]: If the request is downloadable
    '''

    content_type = request.headers.get('content-type').lower()

    if 'text' in content_type:
        logger.write(f'Invalid content')
        return False
    if 'html' in content_type:
        logger.write(f'Invalid content')
        return False

    logger.write(f'Found data')
    return True





