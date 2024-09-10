import os
import find_pdf_urls
import find_data_urls
import download_urls
from utils import Logger
import subprocess
from pathlib import Path

PDF_FILE = "./TeamProject.pdf"
PDF_URLS_FILE = "./pdf_urls.txt"
DATA_URLS_FILE = "./data_urls.txt"

DATA_DIRECTORY = "./data"
LOGS_FILE = "./crawler_logs.txt"

logger = Logger(LOGS_FILE)
logger.write("Running script...")
logger.indent()

def prompt_bool(message):
    while(True):
        user_input = input(message + " ").lower()

        if user_input == "yes" or user_input == "y":
            return True
        elif user_input == "no" or user_input == "n":
            return False

        print("Invalid input. ", end = "")


# Generates the PDF_URLS_FILE if it doesn't exist

if not os.path.exists(PDF_URLS_FILE):
    logger.newline()
    logger.write("Could not find pdf urls")

    prompt_bool("  Would you like to run the pdf url finder script? (y/n)")

    if prompt_bool:
        logger.newline()
        logger.write("Generating pdf urls...")

        find_pdf_urls.run(PDF_FILE, PDF_URLS_FILE, logger)

        logger.write("Done!")
    else:
        logger.write("Aborting!")
        exit()

# Generates the DATA_URLS_FILE if it doesn't exist
if not os.path.exists(DATA_URLS_FILE):
    logger.newline()
    logger.write("Could not find data urls")

    prompt_bool("  Would you like to run the data url finder script? (y/n)")

    if prompt_bool:
        logger.newline()
        logger.write("Starting Data Url Finder...")

        find_data_urls.run(PDF_URLS_FILE, DATA_URLS_FILE, logger)

        logger.write("Done!")
    else:
        logger.write("Aborting!")
        exit()

# Creates the DATA_DIRECTORY if it doesn't exist
Path(DATA_DIRECTORY).mkdir(parents=True, exist_ok=True)
Path(DATA_DIRECTORY).mkdir(parents=True, exist_ok=True)


if len(os.listdir(DATA_DIRECTORY)) == 0:
    logger.newline()
    logger.write("Data directory is empty")

    prompt_bool("  Would you like to run the data downloader script? (y/n)")

    if prompt_bool:
        logger.newline()
        logger.write("Starting Data Downloader...")
        download_urls.run(DATA_URLS_FILE, DATA_DIRECTORY, logger)

        logger.write("Done!")
    else:
        logger.write("Aborting!")
        exit()

logger.unindent()
logger.write("Done!")
logger.close()





















