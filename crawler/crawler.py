'''
<FILE>
crawler.py


<DESCRIPTION>
The purpose of this script is to run all other scripts, so that the process from
finding data files to inserting them into the database is entirely automated.

<FUNCTIONS>
This section only lists a brief description of each function. For more
comprehensive documentation, see each method directly.

    * prompt_bool(...):
        Prompts the user for a boolean input.

    * run_operation(...):
        Sets-up for and runs a given script, if needed.
'''

import os
from scripts import find_pdf_urls
from scripts import find_data_urls
from scripts import download_urls
from scripts import organize_data
from scripts import clean_data
from scripts import normalize_data
from scripts import insert_data
from scripts.utils import Logger
from pathlib import Path

PDF_FILE = "./data/TeamProject.pdf"
PDF_URLS_FILE = "./data/pdf_urls.txt"
DATA_URLS_FILE = "./data/data_urls.txt"

RAW_DATA_DIRECTORY = "./data/data-raw"
ORGANIZED_DATA_DIRECTORY = "./data/data-organized"
CLEAN_DATA_DIRECTORY = "./data/data-clean"
NORMALIZED_DATA_DIRECTORY = "./data/data-norm"
DATABASE_FILE = "../web-framework/server/database2.db"
LOGS_FILE = "./crawler_logs.txt"

logger = Logger(LOGS_FILE)
logger.write("Running script...")
logger.indent()

def prompt_bool(message):
    '''
    Prompts the user for a boolean input.

    <ARGUMENTS>
        * message [String]: The prompt to ask the user.

    <RETURN>
        * [Boolean]: The user's input.
    '''
    while(True):
        user_input = input(message + " ").lower()

        if user_input == "yes" or user_input == "y":
            return True
        elif user_input == "no" or user_input == "n":
            return False

        print("Invalid input. ", end = "")


def run_operation(operation_file, script_input, script_output, script_name, check_msg, check_type="DIR_DIR"):
    '''
    Sets-up for and runs a given script, if needed.

    <EXTENDED_DESCRIPTION>
    Should it be determined that the operation had previously succeeded, it will
    skip it. This is to reduce expensive and unnecessary repeated computations.

    <ARGUMENTS>
        * operation_file [Python Script]:
            The Python script to run.

        * script_input [String]:
            The path to the script's input file/directory.

        * script_output [String]:
            The path to the script's output file/directory.

        * script_name [String]:
            The script's name.

        * check_msg [String]:
            The message to send the user if the recomputation check fails.

        * check_type="DIR_DIR" [String]:
            The type of recomputation check to run before running the script.
            It can be any one of the following:

                * "FILE_FILE":
                    The script reads input from a file and outputs to another
                    file. If the output file does not exist, it will run the script.

                * "FILE_DIR":
                    The script reads input from a file and outputs to a directory.
                    If the directory is empty, it will run the script.

                * "DIR_DIR":
                    The script reads input from a directory and outputs to
                    another directory. If the size of the input directory is
                    greater than that of the output, it will run the script.

                * "DIR_FILE":
                    The script reads input from a directory and outputs to a
                    file. It will always run the script.

                * "REQURE":
                    The script will always run. Intended for debugging purposes
                    only.

                * "SKIP":
                    The script will never run. Inteded for debugging purposes
                    only.

            Should the script be writting to a directory, this function will
            create it, if necessary.
    '''

    if "_DIR" in check_type:
        Path(script_output).mkdir(parents=True, exist_ok=True)

    if check_type == "FILE_FILE":
        result = Path.exists(Path(script_input)) and not Path.exists(Path(script_output))
    elif check_type == "FILE_DIR":
        result = Path.exists(Path(script_input)) and len(os.listdir(script_output)) == 0
    elif check_type == "DIR_DIR":
        result = len(os.listdir(script_input)) > len(os.listdir(script_output))
    elif check_type == "DIR_FILE" or check_type == "REQUIRE":
        result = True
    elif check_type == "SKIP":
        result = False
    else:
        print("Invalid check type. Must be <FILE_FILE, FILE_DIR, DIR_FILE, DIR_DB, SKIP, REQUIRE>")
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
run_operation(download_urls, DATA_URLS_FILE, RAW_DATA_DIRECTORY, "data downloader", "Data directory is empty", check_type="FILE_DIR")
run_operation(organize_data, RAW_DATA_DIRECTORY, ORGANIZED_DATA_DIRECTORY, "data organizer", "Not all data has been organized")
run_operation(clean_data, ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, "data cleaner", "Not all data has been cleaned")
run_operation(normalize_data, CLEAN_DATA_DIRECTORY, NORMALIZED_DATA_DIRECTORY, "data normalizer", "Not all data has been normalized")
run_operation(insert_data, NORMALIZED_DATA_DIRECTORY, DATABASE_FILE, "data inserter", None, check_type="DIR_FILE")

logger.unindent()
logger.write("Done!")
logger.close()
