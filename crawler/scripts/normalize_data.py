import openpyxl
import shutil
import os
import re
from xls2xlsx import XLS2XLSX
from scripts.utils import Logger, detect_year, detect_type, detect_db_type, SheetDict


schools = SheetDict({}, "school_id")
leas = SheetDict({}, "aun")
ius = SheetDict({}, "aun")

def can_safely_replace(val1, val2):
    if val1 == val2:
        return True

    if not (type(val1) == str and type(val2) == str):
        return False

    val1 = val1.replace(" CHS", "CS")
    val2 = val2.replace(" CHS", "CS")

    removal_list = [" ", ".", ",", "-", "&"]
    replacement_list = [("charterschool", "cs"), ("charterhighschool", "cs"), ("charterscholars", "cs"), ("saint", "st"), ("road", "rd"), ("drive", "dr"), ("careerandtechnicalcenter", "ctc"), ("careertechnicalcenter", "ctc"), ("schooldistrict", "sd"), ("charterelementaryschool", "ces")]

    val1 = val1.lower()
    val2 = val2.lower()

    for removal in removal_list:
        val1 = val1.replace(removal, "")
        val2 = val2.replace(removal, "")

    for replacement in replacement_list:
        val1 = val1.replace(replacement[0], replacement[1])
        val2 = val2.replace(replacement[0], replacement[1])

    return val1 == val2


def add_to_sheet_dict(logger, sheet_dict, id, attribute, value):
    dict = sheet_dict.dict

    if id not in dict:
        dict[id] = {}

    if value is None:
        return

    if attribute in dict[id]:
        old_val = dict[id][attribute]
        if not can_safely_replace(old_val, value):
            logger.write(f'Clobbering {attribute} in dict[{id}]. Replacing {old_val} with {value}');

    dict[id][attribute] = value

def add_to_composite_dict(logger, composite_dict, id, year, attribute, value):
    if year not in composite_dict:
        composite_dict[year] = {}

    if id not in composite_dict[year]:
        composite_dict[year][id] = {}

    if value is None:
        return

    if attribute in composite_dict[year][id]:
        old_val = composite_dict[year][id][attribute]
        if not can_safely_replace(old_val, value):
            logger.write(f'Clobbering {attribute} in composite_dict[{year}][{id}]. Replacing {old_val} with {value}');

    composite_dict[year][id][attribute] = value

def merge_composite_dicts(dest, source):
    dest_dict = dest.dict
    source_dict = source.dict

    for year, year_dict in source_dict.items():
        if year not in dest_dict:
            dest_dict[year] = {}

        for id, id_dict in year_dict.items():
            if id not in dest_dict[year]:
                dest_dict[year][id] = {}

            dest_dict[year][id].update(id_dict)
            #print(f'Yearss: {dest_dict[year]}')

        #if id not in dest_dict[year].keys():
        #    dest_dict[year][id] = {}

    if not (dest.identifier == "" or dest.identifier == source.identifier):
        logger.warn(f'Dicts have different identifier. Source: {source.identifier}, Dest: {dest.identifier}')

    dest.identifier = source.identifier

def parse_standard_wb(wb, logger):
    data_dict = {}
    col_types = {}

    logger.indent()

    for sheet in wb.worksheets:
        year = detect_type(sheet.title)

        for col_idx, col in enumerate(sheet.iter_cols()):
            attr = col[0].value
            col_types[attr] = detect_db_type(col)

            if col_idx == 0:
                continue

            is_lea_attr = attr in ["lea_type", "lea_name", "county", "lea_address_street", "lea_address_city", "lea_address_state", "lea_address_zip", "lea_website", "lea_telephone"]
            is_iu_attr = attr in ["iu_name"]
            #is_school_attr = attr in ["school_name", "school_address_street", "school_address_state", "school_address_zip", "school_website", "school_telephone"]

            for row_idx, cell in enumerate(col):
                if row_idx == 0:
                    continue

                aun = sheet.cell(row=row_idx+1, column=1).value
                value = cell.value

                #if attr == "lea_type":
                #    print("SDLFJKJSLKDFJLSKDJF")
                #    exit()
                if not isinstance(aun, int):
                    print(year)
                    exit()

                if is_lea_attr:
                    add_to_sheet_dict(logger, leas, aun, attr, value)
                elif is_iu_attr:
                    add_to_sheet_dict(logger, ius, aun, attr, value)
                    #logger.warn(f'Cannot add to iu dict. Attr: {attr}, Val: {value}' )
                else:
                    add_to_composite_dict(logger, data_dict, aun, year, attr, value)


    logger.unindent()
    return (SheetDict(data_dict, "aun"), col_types)

def parse_ffs_wb(wb, logger):
    data_dict = {}
    col_types = {}

    logger.indent()

    for sheet in wb.worksheets:
        year = detect_type(sheet.title)

        for col_idx, col in enumerate(sheet.iter_cols()):
            attr = col[0].value
            col_types[attr] = detect_db_type(col)

        for row_idx, row in enumerate(sheet.iter_rows()):
            if row_idx == 0:
                continue

            for col_idx, cell in enumerate(row):
                attr = sheet.cell(row=1, column=col_idx+1).value
                school_id = sheet.cell(row=row_idx+1, column=1).value
                aun = sheet.cell(row=row_idx+1, column=4).value
                value = cell.value

                if attr is None:
                    continue
                if attr == "school_id":
                    continue

                is_lea_attr = attr in ["lea_name", "county", "lea_name", "lea_address_street", "lea_address_city", "lea_address_state", "lea_address_zip", "lea_website", "lea_telephone"]
                is_iu_attr = attr in ["iu_name"]
                is_school_attr = attr in ["school_name", "aun", "school_address_street", "school_address_state", "school_address_zip", "school_website", "school_telephone"]

                if is_lea_attr:
                    pass
                    #add_to_sheet_dict(logger, leas, aun, attr, value)
                    #logger.warn(f'Cannot add to lea dict. Attr: {attr}, Val: {value}')
                elif is_iu_attr:
                    logger.warn(f'Cannot add to iu dict. Attr: {attr}, Val: {value}')
                elif is_school_attr:
                    add_to_sheet_dict(logger, schools, school_id, attr, value)
                else:
                    add_to_composite_dict(logger, data_dict, school_id, year, attr, value)

                # This bit of code is absolutely attrocious. It is meant to handle CTCs, which are LEAs but not SDs!
                school_name = sheet.cell(row=row_idx+1, column=2).value
                lea_name = sheet.cell(row=row_idx+1, column=3).value
                if school_name == lea_name and is_school_attr and attr != "aun":
                    #logger.write("Doing garbage")
                    #logger.write(f'fast fact attr: school_id: {school_id}, year: {year}, attr: {attr}. aun: {aun}')
                    add_to_sheet_dict(logger, leas, aun, attr.replace("school_", "lea_"), value)

    logger.unindent()
    return (SheetDict(data_dict, "school_id"), col_types)

def parse_cohort_school(wb, logger):
    pass

def write_composite_dict(sheet_dict, col_types, filename):
    wb = openpyxl.Workbook()
    sheet = wb.active

    sheet.cell(row=1, column=1).value = sheet_dict.identifier + " PK_INTEGER"
    sheet.cell(row=1, column=2).value = "year PK_INTEGER"

    next_key_index = 3
    key_indices = {}

    rowIdx = 2

    for year, year_dict in sheet_dict.dict.items():
        for id, record in year_dict.items():
            for record_key, attribute in record.items():
                sheet.cell(row=rowIdx, column=1).value = id
                sheet.cell(row=rowIdx, column=2).value = year

                if record_key not in key_indices:
                    key_indices[record_key] = next_key_index
                    next_key_index = next_key_index + 1

                if record_key is not None:
                    sheet.cell(row=1, column = key_indices[record_key]).value = record_key + " " + col_types[record_key]
                    #print(f'Record Key: {record_key} + {record_key in col_types}')
                sheet.cell(row=rowIdx, column=key_indices[record_key]).value = attribute
            rowIdx = rowIdx + 1

    wb.save(filename)
    wb.close()

def write_sheet_dict(sheet_dict, filename):
    wb = openpyxl.Workbook()
    sheet = wb.active
    sheet.cell(row=1, column=1).value = sheet_dict.identifier + " PK_INTEGER"

    next_key_index = 2
    key_indices = {}

    rowIdx = 2

    for id, record in sheet_dict.dict.items():
        for record_key, attribute in record.items():
            sheet.cell(row=rowIdx, column=1).value = id

            if "aun" in record_key or "zip" in record_key or "phone" in record_key:
                key_type = " INTEGER"
            else:
                key_type = " TEXT"

            if record_key not in key_indices:
                key_indices[record_key] = next_key_index
                next_key_index = next_key_index + 1

            sheet.cell(row=1, column = key_indices[record_key]).value = record_key + key_type
            sheet.cell(row=rowIdx, column=key_indices[record_key]).value = attribute
        rowIdx = rowIdx + 1


    wb.save(filename)
    wb.close()

def run(CLEAN_DATA_DIRECTORY, NORMALIZED_DATA_DIRECTORY, logger):
    logger.indent()

    for subdirectory in os.listdir(CLEAN_DATA_DIRECTORY):
        data_dict = SheetDict({}, "")
        col_types_dict = {}

        new_file = NORMALIZED_DATA_DIRECTORY + "/" + subdirectory + ".xlsx"
        for filename in os.listdir(CLEAN_DATA_DIRECTORY + "/" + subdirectory):
            if "#" in filename:
                continue

            logger.write(f'Processing {subdirectory}/{filename}')
            if "AFR" not in filename and "IU" not in filename and "Fast_Facts" not in filename and "LEA" not in filename:
                continue

            file = CLEAN_DATA_DIRECTORY + "/" + subdirectory + "/" + filename

            #print(f'File: {file}')

            wb = openpyxl.open(file)

            if "Fast_Facts_School" in filename:
                [dict, col_types] = parse_ffs_wb(wb, logger)
            elif "Cohort_School" in filename:
                continue
                [dict, col_types] = parse_cohort_school(wb, logger)
            else:
                [dict, col_types] = parse_standard_wb(wb, logger)

            merge_composite_dicts(data_dict, dict)

            col_types_dict.update(col_types)

            wb.close()

        #print(f'Data dict at end: {data_dict}')
        write_composite_dict(data_dict, col_types_dict, new_file)


    write_sheet_dict(schools, NORMALIZED_DATA_DIRECTORY + "/Schools.xlsx")
    write_sheet_dict(leas, NORMALIZED_DATA_DIRECTORY + "/LEAs.xlsx")
    write_sheet_dict(ius, NORMALIZED_DATA_DIRECTORY + "/IUs.xlsx")




    logger.unindent()

#logger = Logger("crawler-logs.txt")
#logger.write("Staring Script...")
#run("./data-organized", "./data-clean", logger)
#logger.write("Done!")
