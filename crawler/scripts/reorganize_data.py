import os
from pathlib import Path
import shutil
from scripts.utils import detect_year


def run(DATA_DIRECTORY, ORGANIZED_DATA_DIRECTORY, logger):
    logger.indent()

    for subdirectory in os.listdir(DATA_DIRECTORY):
        for filename in os.listdir(DATA_DIRECTORY + "/" + subdirectory):

            new_dir = get_new_directory(filename, subdirectory, logger)
            new_name = get_new_name(filename, new_dir, logger)

            copy(DATA_DIRECTORY + "/" + subdirectory, filename, ORGANIZED_DATA_DIRECTORY + "/" + new_dir, new_name, logger)

    logger.unindent()

def get_new_directory(filename, directory, logger):
    if not directory == "FRPA":
        return directory

    if "District Fiscal" in filename:
        return "Fiscal_District"

    if "School Fiscal" in filename:
        return "Fiscal_School"

    if "DistrictFast" in filename:
        return "Fast_Facts_District"

    if "SchoolFast" in filename:
        return "Fast_Facts_School"

    if "Datafile" in filename:
        return "FRP"

    logger.warn("INVALID DIRECTORY")
    return "INVALID"

def get_new_name(filename, directory, logger):
    if filename[0] == "\"" and filename[-1] == "\"":
        filename = filename[1:-1]

    year = -1
    if filename == "DistrictFastFacts.xlsx" or filename == "SchoolFastFacts.xlsx":
        year = 2017
    else:
        year = detect_year(filename)

    year_str = str(year) + "-" + str(year+1)
    type_str = "." + filename.split(".")[-1]

    new_name = ""

    if directory == "Cohorts":
        cohort_year = -1
        if "4-Year" in filename:
            cohort_year = 4
        elif "5-Year" in filename:
            cohort_year = 5
        elif "6-Year" in filename:
            cohort_year = 6
        else:
            logger.warn("Invalid Year!")

        return "Cohort " + str(cohort_year) + "-Year_Grad_Rates_" + year_str + type_str

    if directory == "Keystones":
        level = ""
        if "State" in filename:
            level = "State"
        elif "School" in filename:
            level = "School"

        return "Keystone_Exams_" + level + "_Level_" + year_str + type_str

    if directory == "PSSAs":
        level = ""
        if "State" in filename:
            level = "State"
        elif "School" in filename:
            level = "School"

        return "PSSA_" + level + "_Level_" + year_str + type_str


    return directory + "_" + year_str + type_str


def copy(old_dir, old_name, new_dir, new_name, logger):
    Path(new_dir).mkdir(parents=True, exist_ok=True)

    old_path = old_dir + "/" + old_name
    new_path = new_dir + "/" + new_name

    logger.write(f'Moving {old_path} to {new_path}')

    shutil.copy2(old_path, new_path)

