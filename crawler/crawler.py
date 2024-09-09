import os
import find_data_urls
import download_urls
from utils import log, prompt_bool
import subprocess
from pathlib import Path

PDF_URLS_FILE = "./pdf_urls.txt"
DATA_URLS_FILE = "./data_urls.txt"

DATA_DIRECTORY = "./data"
LOGS_FILE = "./crawler_logs.txt"

PDF_URL_FINDER = "./find_pdf_urls.sh"



logger = open(LOGS_FILE, "a")

log(logger, "Running script...")

# Generates the PDF_URLS_FILE if it doesn't exist
if not os.path.exists(PDF_URLS_FILE):
    log(logger, "\n  Could not find pdf urls")

    prompt_bool("  Would you like to run the pdf url finder script? [ONLY WORKS ON LINUX] (y/n)")

    if prompt_bool:
        log(logger, "  Generating pdf urls...")
        subprocess.call(["bash", PDF_URL_FINDER])
        log(logger, "  Done!\n")
    else:
        log("Aborting!")
        exit()

# Generates the DATA_URLS_FILE if it doesn't exist
if not os.path.exists(DATA_URLS_FILE):
    log(logger, "\n  Could not find data urls")

    prompt_bool("  Would you like to run the data url finder script? (y/n)")

    if prompt_bool:
        log(logger, "  Starting Data Url Finder...")
        find_data_urls.run(PDF_URLS_FILE, DATA_URLS_FILE, logger)
        log(logger, "  Done!\n")
    else:
        log("Aborting!")
        exit()

# Creates the DATA_DIRECTORY if it doesn't exist
Path(DATA_DIRECTORY).mkdir(parents=True, exist_ok=True)

# Downloads the data from the urls
download_urls.run(DATA_URLS_FILE, DATA_DIRECTORY, logger)

log(logger, "Done!")
logger.write("")
logger.close()





















