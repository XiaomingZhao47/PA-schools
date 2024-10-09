import openpyxl
from utils import Logger, detect_year
import shutil
import os
from xls2xlsx import XLS2XLSX
import re

class SheetDict:
    def __init__(self, dict, identifier):
        self.dict = dict
        self.identifier = identifier




def parse_standard_sheet(sheet, year):
    parsed_sheet = {}

    first = True
    for rowIdx, row in enumerate(sheet.rows):
        if first:
            first = False
            continue

        id = detect_type(get_id(row, year))
        if id is None:
            continue

        parsed_sheet[id] = {}

        for colIdx, col in enumerate(row):

            attribute = sheet.cell(row=1, column=colIdx+1).value
            value = sheet.cell(row=rowIdx+1, column=colIdx+1).value

            attribute = rename_attr_cb(attribute)
            if attribute is None:
                continue

            parsed_sheet[id][attribute] = detect_type(value)

    return parsed_sheet


def write_dicts(classified_sheet_dicts, CLEAN_DATA_DIRECTORY):
    for classification, sheet_dicts in classified_sheet_dicts.items():
        wb = openpyxl.Workbook()
        wb.remove(wb.active)

        next_key_index = 2
        key_indices = {}

        for year, sheet_dict in dict(sorted(sheet_dicts.items())).items():
            #if not bool(sheet_dict.dict): # Doesn't write an empty dict
            #    continue

            sheet_name = str(year)
            sheet = wb.create_sheet(title=sheet_name)

            rowIdx = 2

            sheet.cell(row=1, column=1).value = sheet_dict.identifier

            for key, record in sheet_dict.dict.items():
                sheet.cell(row=rowIdx, column=1).value = key

                for record_key, attribute in record.items():
                    if record_key not in key_indices:
                        key_indices[record_key] = next_key_index
                        next_key_index = next_key_index + 1


                    sheet.cell(row=1, column = key_indices[record_key]).value = record_key

                    sheet.cell(row=rowIdx, column=key_indices[record_key]).value = attribute
                rowIdx = rowIdx + 1

        wb.save(NORMALIZED_DATA_DIRECTORY + "/" + classification + ".xlsx")

def run(CLEAN_DATA_DIRECTORY, NORMALIZED_DATA_DIRECTORY, logger):
    logger.indent()

    for filename in os.listdir(CLEAN_DATA_DIRECTORY):
        if "#" in filename:
            continue

        logger.write(filename)
        file = CLEAN_DATA_DIRECTORY + "/" + filename
        new_file = NORMALIZED_DATA_DIRECTORY + "/" + filename


    logger.unindent()

#logger = Logger("crawler-logs.txt")
#logger.write("Staring Script...")
#run("./data-organized", "./data-clean", logger)
#logger.write("Done!")
