import openpyxl
from utils import Logger
import shutil
import os
from xls2xlsx import XLS2XLSX

def do_conversions(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.write("Converting files...")
    logger.indent()

    for subdirectory in os.listdir(ORGANIZED_DATA_DIRECTORY):
        for filename in os.listdir(ORGANIZED_DATA_DIRECTORY + "/" + subdirectory):
            file = ORGANIZED_DATA_DIRECTORY + "/" + subdirectory + "/" + filename
            logger.write(f'Processing {file}')
            logger.indent()

            if ".xls" not in file:
                logger.write("Invalid file")
                logger.unindent()
                continue

            if ".xlsx" not in file:
                logger.write(f'xls detected!')

                xlsx_file = ".".join(xls_file.split(".")[0:-1]) + ".xlsx"
                XLS2XLSX(xls_file).to_xlsx(xlsx_file)

                os.remove(xls_file)

            logger.unindent()

    logger.unindent()
    logger.write("Done!")

def remove_extra_files(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.write("Converting files...")
    logger.indent()

    for subdirectory in os.listdir(ORGANIZED_DATA_DIRECTORY):
        for filename in os.listdir(ORGANIZED_DATA_DIRECTORY + "/" + subdirectory):
            file = ORGANIZED_DATA_DIRECTORY + "/" + subdirectory + "/" + filename
            logger.write(f'Processing {file}')
            logger.indent()

            if ".xlsx" not in file:
                os.remove(file)
                logger.write("Removing file")

            logger.unindent()



    logger.unindent()
    logger.write("Done!")

def move_files(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.write("Moving files")
    logger.indent()

    shutil.rmtree(CLEAN_DATA_DIRECTORY)
    shutil.copytree(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY)

    logger.unindent()
    logger.write("Done")




def run(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.indent()

    do_conversions(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger)
    remove_extra_files(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger)
    move_files(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger)


    logger.unindent()
