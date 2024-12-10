import os
from scripts import find_pdf_urls
from scripts import find_data_urls
from scripts import download_urls
from scripts import organize_data
from scripts import clean_data
from scripts import normalize_data
from scripts import insert_data
from scripts.utils import Logger
import subprocess
from pathlib import Path

PDF_FILE = "./data/TeamProject.pdf"
PDF_URLS_FILE = "./data/pdf_urls.txt"
DATA_URLS_FILE = "./data/data_urls.txt"

DATA_DIRECTORY = "./data/data-raw"
ORGANIZED_DATA_DIRECTORY = "./data/data-organized"
CLEAN_DATA_DIRECTORY = "./data/data-clean"
NORMALIZED_DATA_DIRECTORY = "./data/data-norm"
DATABASE_FILE = "../web-framework/server/database2.db"
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
def run_operation(operation_file, script_input, script_output, script_name, check_msg, check_type = "DIR_DIR"):
    if "_DIR" in check_type:
        Path(script_output).mkdir(parents=True, exist_ok=True)

    if check_type == "FILE_FILE":
        result = Path.exists(Path(script_input)) and not Path.exists(Path(script_output))
    elif check_type == "FILE_DIR":
        result = Path.exists(Path(script_input)) and len(os.listdir(script_output)) == 0
    elif check_type == "DIR_DIR":
        result = len(os.listdir(script_input)) > len(os.listdir(script_output))
    elif check_type == "DIR_DB" or check_type == "REQUIRE":
        result = True
    elif check_type == "SKIP":
        result = False
    else:
        print("Invalid check type. Must be <FILE_FILE, FILE_DIR, DIR_DIR, DIR_DB, SKIP, REQUIRE>")
        return


    if result:
        logger.newline()
        if not check_msg == None:
            logger.write(check_msg)

        run = prompt_bool(f'  Would you like to run the {script_name} script? (y/n)')

        if run:
            logger.newline()
            logger.write(f'Starting {script_name} script...')

            operation_file.run(script_input, script_output, logger)

            logger.write("Done!")
        else:
            logger.write("Aborting!")
            exit()

run_operation(find_pdf_urls, PDF_FILE, PDF_URLS_FILE, "pdf url finder", "Could not find pdf urls", check_type="FILE_FILE")
run_operation(find_data_urls, PDF_URLS_FILE, DATA_URLS_FILE, "data url finder", "Could not find data urls", check_type="FILE_FILE")
run_operation(download_urls, DATA_URLS_FILE, DATA_DIRECTORY, "data downloader", "Data directory is empty", check_type="FILE_DIR")
run_operation(organize_data, DATA_DIRECTORY, ORGANIZED_DATA_DIRECTORY, "data organizer", "Not all data has been organized")
run_operation(clean_data, ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, "data cleaner", "Not all data has been cleaned")#, check_type="REQUIRE")
run_operation(normalize_data, CLEAN_DATA_DIRECTORY, NORMALIZED_DATA_DIRECTORY, "data normalizer", "Not all data has been normalized")#, check_type="REQUIRE")
run_operation(insert_data, NORMALIZED_DATA_DIRECTORY, DATABASE_FILE, "data inserter", None, check_type="DIR_DB")#check_type="SKIP")#

logger.unindent()
logger.write("Done!")
logger.close()
