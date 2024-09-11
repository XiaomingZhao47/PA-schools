import requests
import re
import os
import random
from pathlib import Path

# https://www.codementor.io/@aviaryan/downloading-files-from-urls-in-python-77q3bs0un
def run(DATA_URLS_FILE_PATH, DATA_DIRECTORY, logger):
    logger.indent()
    data_urls_file = open(DATA_URLS_FILE_PATH, "r")

    for line in data_urls_file:

        split_line = line.strip().split("; ")
        file_class = split_line[0]
        url = split_line[1]

        logger.write(f'Checking: {url}')
        logger.indent()

        # Download the file and save it to a file
        request = requests.get(url)


        if not request.ok:
            logger.write(f'Failed Request: {url}')
            logger.write(f'Status Code: {request.status_code}')
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


def get_filename(request, logger):
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
    content_type = request.headers.get('content-type').lower()

    if 'text' in content_type:
        logger.write(f'Invalid content')
        return False
    if 'html' in content_type:
        logger.write(f'Invalid content')
        return False

    logger.write(f'Found data')
    return True





