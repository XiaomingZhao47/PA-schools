'''
<FILE>
organize_data.py


<DESCRIPTION>
The purpose of this script is to resort the data files into better categories,
and to rename each file to follow a consistant naming / dating convention.


<FUNCTIONS>
This script can be run by calling organize_data.run(<args>). All other functions
in this script should remain private. This section only lists a brief description
of each function. For more comprehensive documentation, see each method directly.

    * run(...): Reorganizes/renames the data files.

    * get_new_directory(...): Determines what directory a file should be sorted into.

    * get_new_name(...): Determines a file's new name.

    * copy(...): Copies a data file to its new name/location.
'''

import os
from pathlib import Path
import shutil
from scripts.utils import detect_year

def run(DATA_DIRECTORY, ORGANIZED_DATA_DIRECTORY, logger):
    '''
    Reorganizes/renames the data files.

    <ARGUMENTS>
        * DATA_DIRECTORY [String]: The path to the input directory.

        * ORGANIZED_DATA_DIRECTORY [String]: The path to the output directory.

        * logger [utils.Logger]: The current Logger instance.
    '''

    logger.indent()

    for subdirectory in os.listdir(DATA_DIRECTORY):
        for filename in os.listdir(DATA_DIRECTORY + "/" + subdirectory):
            logger.write(f'Checking ./{subdirectory}/{filename}')

            new_dir = get_new_directory(filename, subdirectory, logger)
            new_name = get_new_name(filename, new_dir, logger)

            if new_name is None:
                logger.warn(f'Could not detect year. Ignoring file.')
                continue

            if subdirectory != new_dir or new_name != filename:
                logger.write(f'Moving to ./{new_dir}/{new_name}')

            copy(DATA_DIRECTORY + "/" + subdirectory, filename, ORGANIZED_DATA_DIRECTORY + "/" + new_dir, new_name, logger)

    logger.unindent()


def get_new_directory(filename, directory, logger):
    '''
    Determines what directory a file should be sorted into.

    <ARGUMENTS>
        * filename [String]: The file's original name.

        * directory [String]: The file's original directory name.

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * The file's new directory name.
    '''
    if not directory == "FRPA" and not directory == "Cohorts":
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

    if "4-year" in filename:
        return "Cohort_Four_Year"

    if "5-year" in filename:
        return "Cohort_Five_Year"

    if "6-year" in filename:
        return "Cohort_Six_Year"

    logger.warn("INVALID DIRECTORY")
    return "INVALID"

def get_new_name(filename, directory, logger):
    '''
    Determines a file's new name.

    <EXTENDED_DESCRIPTION>
    The file's updated name will follow the pattern "File_Name_Year-Year.*".
    E.g., "AFR_Revenue_2018-2019.xlsx".

    <ARGUMENTS>
        * filename [String]: The file's original name.

        * directory [String]: The file's original directory name.

        * logger [utils.Logger]: The current Logger instance.

    <RETURN>
        * The file's new name.
    '''

    # Removes quotation marks
    if filename[0] == "\"" and filename[-1] == "\"":
        filename = filename[1:-1]


    # 2017 is the only year in which the dates are not labeled for these files
    if filename == "DistrictFastFacts.xlsx" or filename == "SchoolFastFacts.xlsx":
        year = 2017
    else:
        try:
            year = detect_year(filename)
        except:
            return None

    # Labels the file with the year. E.g. 2015-2016.
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
        if "state" in filename:
            level = "State"
        elif "school" in filename:
            level = "School"

        return "Keystone_Exams_" + level + "_Level_" + year_str + type_str

    if directory == "PSSAs":
        level = ""
        if "state" in filename:
            level = "State"
        elif "school" in filename:
            level = "School"

        return "PSSA_" + level + "_Level_" + year_str + type_str


    return directory + "_" + year_str + type_str


def copy(old_dir, old_name, new_dir, new_name, logger):
    '''
    Copies a data file to its new name/location.

    <ARGUMENTS>
        * old_dir [String]: The file's original directory.

        * old_name [String]: The file's original name.

        * new_dir [String]: The file's new directory.

        * new_name [String]: The file's new name.

        * logger [utils.Logger]: The current Logger instance.
    '''

    Path(new_dir).mkdir(parents=True, exist_ok=True)

    old_path = old_dir + "/" + old_name
    new_path = new_dir + "/" + new_name

    shutil.copy2(old_path, new_path)

