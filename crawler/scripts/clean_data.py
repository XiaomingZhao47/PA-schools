import openpyxl
import shutil
import os
import re
from xls2xlsx import XLS2XLSX
from pathlib import Path
from scripts.utils import Logger, detect_year, SheetDict, detect_type

def do_conversions(ORGANIZED_DATA_DIRECTORY, logger):
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

def parse_standard_sheet(sheet, year, rename_attr_cb, get_id):
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

def rename_attribute(attribute):
    if attribute == None:
        return None

    new_name = attribute.lower()
    new_name = "_".join(new_name.split())
    new_name = new_name.replace(",", "")
    new_name = new_name.replace("§", "")
    new_name = new_name.replace("&", "and")
    new_name = new_name.replace("district_name", "lea_name")

    if new_name == "school_district":
        return "lea_name"

    return new_name

def rename_fast_fact_attribute(attribute):
    new_name = rename_attribute(attribute)

    new_name = new_name.replace("_-_percent_enrollment_by_student_groups", "").replace("district_", "lea_")
    new_name = new_name.replace("_-_percent_enrollment_by_race/ethnicity", "").replace("district_", "lea")

    if "2_or_more_races" in new_name:
        return new_name.replace("2_or_more_races", "multiracial")

    if "gifted" in new_name:
        return "gifted"

    if "american_indian/alaskan_native" in new_name:
        return "ai_an"

    if "black/african_american" in new_name:
        return "african_american"

    if "english_learner" in new_name:
        return "english_learner"

    if "career_and_technical_center" in new_name:
        return new_name.replace("career_and_technical_center", "ctc")

    if "native_hawaiian_or_other_pacific_islander" in new_name:
        return "nh_pi"

    if "enrollment_in" in new_name:
        return "ctc_enrollment"

    if "charter_school" in new_name:
        return "cs_enrollment"

    if "intermediate_unit" in new_name:
        return new_name.replace("intermediate_unit", "iu")

    if "geographic_size" in new_name:
        return "district_size"

    if "male_(school)" in new_name:
        return "male"

    if "female_(school)" in new_name:
        return "female"

    if "(street)" in new_name:
        return new_name.replace("(street)", "street")

    if "(city)" in new_name:
        return new_name.replace("(city)", "city")

    if  "(state)" in new_name:
        return new_name.replace("(state)", "state")

    if "zip" in new_name:
        return new_name.replace("zip_code", "address_zip")

    if "telephone_number" in new_name:
        return new_name.replace("telephone_number", "telephone")

    return new_name

def parse_district_fast_facts(wb):
    def rename_district_fast_facts_attribute(attr):
        new_name = rename_fast_fact_attribute(attr)
        if new_name is None:
            return None
        if new_name == "website":
            return "lea_website"
        if new_name == "telephone":
            return "lea_telephone"

        return new_name

    districts = {}
    sheet = wb.active

    first = True
    for row in sheet.rows:
        if first:
            first = False
            continue

        district_name = row[0].value
        aun = detect_type(row[1].value)
        attr = rename_district_fast_facts_attribute(row[2].value)
        value = detect_type(row[3].value)

        if attr is None:
            continue
        if "offered" in attr:
            continue

        if aun not in districts:
            districts[aun] = {"lea_name": district_name}

        districts[aun][attr] = value

    return SheetDict(districts, "aun")

def parse_school_fast_facts(wb):
    def rename_school_fast_facts_attribute(attr):
        new_name = rename_fast_fact_attribute(attr)
        if new_name is None:
            return None
        if new_name == "website":
            return "school_website"
        if new_name == "telephone":
            return "school_telephone"
        if new_name == "iu_website":
            return None
        if new_name == "iu_name":
            return None
        return new_name

    schools = {}
    sheet = wb.active

    first = True
    for row in sheet.rows:
        if first:
            first = False
            continue

        lea_name = row[0].value
        school_name = row[1].value
        aun = detect_type(row[2].value)
        school_id = detect_type(row[3].value)
        attr = rename_school_fast_facts_attribute(row[4].value)
        value = detect_type(row[5].value)

        if attr is None:
            continue
        if "lea_1" in attr or "lea_2" in attr:
            continue

        if school_id not in schools:
            schools[school_id] = {"school_name": school_name, "lea_name": lea_name, "aun": aun}

        schools[school_id][attr] = value

    return SheetDict(schools, "school_id")

def parse_afr_expenditure(wb, year):
    def get_exp_aun(row, year):
        return row[1].value

    def get_exp_adm_aun(row, year):
        if year == 2018 or year == 2022:
            return row[1].value
        return row[0].value

    def rename_afr_exp_attr(attribute):
        new_name = rename_attribute(attribute)
        if new_name is None:
            return None
        if "actual_instruction_expense" in new_name:
            return None

        search = re.search(r'\d{4}$', new_name)

        if search is None:

            if new_name == "aun":
                return None
            if "cuurent" in new_name:
                return None
            if "current" in new_name:
                return None
            if new_name == "ctgy":
                return None
            if new_name == "cat":
                return None
            if "actual_instruction" in new_name:
                return None

            return new_name

        id = int(search.group(0))
        match id:
            case 1000:
                return "instruction"
            case 1100:
                return "regular_programs"
            case 1200:
                return "gifted_programs"
            case 1300:
                return "vocational_programs"
            case 1400:
                return "other_instructional"
            case 1500:
                return "nonpublic_programs"
            case 1600:
                return "adult_programs"
            case 1700:
                return "secondary_programs"
            case 1800:
                return "pre_k"
            case 2000:
                return "support_services"
            case 2100:
                return "personell"
            case 2200:
                return "staff"
            case 2300:
                return "administration"
            case 2400:
                return "health"
            case 2500:
                return "business"
            case 2600:
                return "plant_ops"
            case 2700:
                return "transportation"
            case 2800:
                return "central"
            case 2900:
                return "other_support"
            case 3000:
                return "noninstructional_services"
            case 4000:
                return "facai"
            case 5000:
                return "oefu"
            case _:
                print("Invalid ID!")
                print(id)
                print(new_name)
                exit()

    def rename_afr_exp_adm_attr(attribute):
        new_name = rename_attribute(attribute)
        if new_name is None:
            return None
        if new_name == "aun":
            return None
        if new_name == "ctgy":
                return None
        if new_name == "cat":
            return None

        if bool(re.match(r'^\d{4}\-\d{2}\_', new_name)):
            new_name = new_name[8:]

        new_name = new_name.replace("memebership", "membership")
        new_name = new_name.replace("average_daily_membership", "adm")

        if not (new_name == "adm" or new_name == "weighted_adm"):
            return None

        return new_name


    expenditures = parse_standard_sheet(wb.worksheets[0], year, rename_afr_exp_attr, get_exp_aun)
    expenditures_dict =  SheetDict(expenditures, "aun")

    expenditures_adm = parse_standard_sheet(wb.worksheets[1], year, rename_afr_exp_adm_attr, get_exp_adm_aun)
    expenditures_adm_dict =  SheetDict(expenditures_adm, "aun")

    return [expenditures_dict, expenditures_adm_dict]

def parse_afr_revenue(wb, year):
    def get_rbs_aun(row, year):
        return row[1].value

    def get_rpa_aun(row, year):
        if year == 2019:
            return row[1].value
        return row[0].value

    def get_tcem_aun(row, year):
        return row[0].value

    def rename_rbs_attr(attr):
        new_name = rename_attribute(attr)

        if new_name is None:
            return None
        if "total_local" in new_name:
            return None
        if "total_revenue" in new_name:
            return None
        if "%" in new_name:
            return None

        search = re.search(r'\d{4}', new_name)

        if search is None:

            if new_name == "aun":
                return None
            if "cuurent" in new_name:
                return None
            if "current" in new_name:
                return None
            if new_name == "ctgy":
                return None
            if new_name == "cat":
                return None

            return new_name

        id = int(search.group(0))
        match id:
            case 6111:
                return "local_taxes"
            case 6500:
                return "local_other"
            case 7000:
                return "state_revenue"
            case 8000:
                return "federal_revenue"
            case 9000:
                return "other_revenue"
            case _:
                print("Invalid ID!")
                print(id)
                print(new_name)
                exit()

    def rename_rpa_attr(attr):
        new_name = rename_attribute(attr)

        if new_name is None:
            return None
        if new_name == "aun":
            return None
        if new_name == "cat":
            return None
        if "rank" in new_name:
            return None
        if  "total" in new_name:
            return None
        if "average_daily" in new_name:
            return "adm"
        return new_name

    def rename_tcem_attr(attr):
        new_name = rename_attribute(attr)

        if new_name is None:
            return None
        if new_name == "aun":
            return None
        if "total" in new_name:
            return None
        if "rank" in new_name:
            return None
        if "steb" in new_name:
            return new_name[5:]
        if "equalized" in new_name:
            return new_name[8:]
        if "679" in new_name:
            return new_name[4:]
        return new_name

    if year in [2013, 2017, 2018, 2022]:
        rpa_sheet = wb.worksheets[1]
        tcem_sheet = wb.worksheets[2]
    else:
        rpa_sheet = wb.worksheets[2]
        tcem_sheet = wb.worksheets[1]

    rbs = parse_standard_sheet(wb.worksheets[0], year, rename_rbs_attr, get_rbs_aun)
    rpa = parse_standard_sheet(rpa_sheet, year, rename_rpa_attr, get_rpa_aun)
    tcem = parse_standard_sheet(tcem_sheet, year, rename_tcem_attr, get_tcem_aun)

    rbs_dict = SheetDict(rbs, "aun")
    rpa_dict = SheetDict(rpa, "aun")
    tcem_dict = SheetDict(tcem, "aun")

    return [rbs_dict, rpa_dict, tcem_dict]

def parse_aid_ratio(wb, year):
    def rename_aid_ratio_attr(attr):

        new_name = rename_attribute(attr)

        if new_name is None:
            return None

        new_name = new_name.replace("market_value", "mv")
        new_name = new_name.replace("personal_income", "pi")

        if new_name == "h":
            return None
        if new_name == "aun":
            return None
        if new_name == "fiscal_year":
            return None
        if new_name == "career_and_technology_center_(and_participating_sd)":
            return "lea_name"
        if  "filter" in new_name:
             return None
        if "sort" in new_name:
            return None
        if "ctc_aun" in new_name:
            return None
        if "iu_aun" in new_name:
            return None
        if "cyber" in new_name:
            return None
        if "cs_aun" in new_name:
            return None
        if "july_2020" in new_name: # This case and the next only apply to 2020-2021
            return None
        if "percent" in new_name:
            return None
        if "mv_/_pi" in new_name:
            return "mv_pi_aid_ratio"
        if "charter_school" in new_name:
            return "lea_name"

        new_name = new_name.replace("wadm", "weighted_adm")

        if "weighted_adm" in new_name:
            if "mv" in new_name or "pi" in new_name:
                return None
            return "weighted_adm"

        if "ratio" in new_name:
            if "mv" in new_name:
                return "mv_aid_ratio"
            if "pi" in new_name:
                return "pi_aid_ratio"
            print("Invalid Match:")
            print(attr)
            exit()

        if "mv" in new_name:
            return "mv"
        if "pi" in new_name:
            return "pi"

        return new_name

    def rename_aid_ratio_iu_attr(attr):
        new_name = rename_aid_ratio_attr(attr)

        if new_name == "intermediate_unit_(and_participating_sd)":
            return "iu_name"
        if new_name == "lea_name":
            return "iu_name"
        return new_name

    def get_sd_id(row, year):
        if year <= 2016:
            return row[0].value
        return row[1].value

    def get_iu_id(row, year):
        if year <= 2016:
            aun = row[0].value
        else:
            aun = row[1].value

        if str(aun).endswith("000000"):
            return aun
        return None

    def get_ctc_id(row, year):
        if year <= 2016:
            aun = row[0].value
        else:
            aun = row[1].value

        if str(aun).endswith("07") or str(aun).endswith("57"):
            return aun

        return None

    def get_cs_id(row, year):
        if year < 2015:
            return row[1].value
        if year <= 2016:
            return row[0].value
        return row[1].value

    lea = parse_standard_sheet(wb.worksheets[0], year, rename_aid_ratio_attr, get_sd_id)
    iu = parse_standard_sheet(wb.worksheets[1], year, rename_aid_ratio_iu_attr, get_iu_id)
    ctc = parse_standard_sheet(wb.worksheets[2], year, rename_aid_ratio_attr, get_ctc_id)
    cs = parse_standard_sheet(wb.worksheets[3], year, rename_aid_ratio_attr, get_cs_id)

    lea_dict = SheetDict(lea | ctc | cs, "aun")
    iu_dict = SheetDict(iu, "aun")

    return [lea_dict, iu_dict]

def parse_apd(wb):
    def rename_apd_attr(attr):
        new_name = rename_attribute(attr)
        new_name = new_name.replace("_-_", "_").replace("/", "_").replace(":", "_").replace("-", "_").replace("(", "").replace(")", "")

        return new_name

    schools = {}
    sheet = wb.active

    first = True
    for row in sheet.rows:
        if first:
            first = False
            continue

        lea_name = row[0].value
        school_name = row[1].value
        aun = detect_type(row[2].value)
        school_id = detect_type(row[3].value)
        attr = rename_apd_attr(row[4].value)
        value = detect_type(row[5].value)

        if attr is None:
            continue

        if school_id not in schools:
            schools[school_id] = {"school_name": school_name, "lea_name": lea_name, "aun": aun}

        schools[school_id][attr] = value

    return SheetDict(schools, "school_id")

def parse_cohort(wb, year, fix = False):
    def get_cohort_lea_aun(row, year):
        aun = row[1].value
        if aun == "STATE":
            return None
        if aun == "'-  1  -" or aun == "-  1  -": # This only occurance I found of this was Cohort_Five_Year_2014-2015
            return None

        return aun

    def get_cohort_school_id(row, year):
        school_id = row[3].value
        if school_id == "STATE":
            return None

        return school_id

    def get_cohort_lea_aun_fix(row, year):
        aun = row[0].value
        if aun == "State":
            return None

    def rename_cohort_attr(attr):
        new_name = rename_attribute(attr)

        if new_name == None:
            return None

        if "black" in new_name:
            return new_name.replace("black", "african_american")
        if "american_indian/alaskan_native" in new_name:
            return new_name.replace("american_indian/alaskan_native", "ai_an")
        if "american_indian/_alaskan_native" in new_name:
            return new_name.replace("american_indian/_alaskan_native", "ai_an")
        if "aian" in new_name:
            return new_name.replace("aian", "ai_an")
        if "native_hawaiian_or_pacific_islander" in new_name:
            return new_name.replace("native_hawaiian_or_pacific_islander", "nh_pi")
        if "multi-racial" in new_name:
            return new_name.replace("multi-racial", "multiracial")
        if "sp_ed_" in new_name:
            return new_name.replace("sp_ed_", "special_ed_")
        if "ell_" in new_name or "el_" in new_name:
            return new_name.replace("ell_", "english_learner_").replace("el_", "english_learner_")
        if "econ_disadv_" in new_name:
            return new_name.replace("econ_disadv_", "economically_disadvantaged_")
        if new_name == "grades" or new_name == "grads":
            return "total_grads"
        if new_name == "cohort_grad_rate" or new_name == "grad_rate" or new_name == "total_grad_rate": # unecessary because it can be calculated
            return None
        if new_name == "lea":
            return "lea_name"
        if new_name == "cohort":
            return "total_cohort"
        if new_name == "school_number":
            return "school_id"
        if new_name == "school":
            return "school_name"

        return new_name

    def rename_cohort_lea_attr(attr):
        new_name = rename_cohort_attr(attr)

        if new_name == "aun":
            return None

        return new_name

    def rename_cohort_lea_attr_fix(attr):
        new_name = rename_cohort_lea_attr(attr)
        if new_name == "lea_type":
            return "aun"
        if new_name == "aun":
            return "lea_name"
        if new_name == "lea":
            return lea_type

        return new_name

    def rename_cohort_school_attr(attr):
        new_name = rename_cohort_attr(attr)

        if new_name == "school_id":
            return None

        return new_name

    if fix: # This is needed because Cohort_Four_Year_2012-2013 misslabled the attributes. This swaps the names/positions so that they match up again
        cohort_lea_sheet = parse_standard_sheet(trim_sheet(wb.worksheets[2], 2, 1), year, rename_cohort_lea_attr_fix, get_cohort_lea_aun_fix)
    else:
        cohort_lea_sheet = parse_standard_sheet(trim_sheet(wb.worksheets[2], 2, 1), year, rename_cohort_lea_attr, get_cohort_lea_aun)

    cohort_sch_sheet = parse_standard_sheet(trim_sheet(wb.worksheets[3], 2, 1), year, rename_cohort_school_attr, get_cohort_school_id)

    cohort_lea_dict = SheetDict(cohort_lea_sheet, "aun")
    cohort_sch_dict = SheetDict(cohort_sch_sheet, "school_id")

    return [cohort_lea_dict, cohort_sch_dict]

def write_dicts(classified_sheet_dicts, subdirectory, CLEAN_DATA_DIRECTORY):

    Path(CLEAN_DATA_DIRECTORY + "/" + subdirectory).mkdir(parents=True, exist_ok=True)
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

        wb.save(CLEAN_DATA_DIRECTORY + "/" + subdirectory + "/" + classification + ".xlsx")
        wb.close()

def clean_data(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.write("Cleaning Data...")
    logger.indent()

    for subdirectory in os.listdir(ORGANIZED_DATA_DIRECTORY):
        sheet_dicts = {}

        if "Fast" not in subdirectory and "AFR" not in subdirectory and "Aid" not in subdirectory and "APD" not in subdirectory and "Cohort" not in subdirectory:
            continue

        for filename in os.listdir(ORGANIZED_DATA_DIRECTORY + "/" + subdirectory):
            if "#" in filename:
                continue

            logger.write(filename)
            file = ORGANIZED_DATA_DIRECTORY + "/" + subdirectory + "/" + filename
            new_file = CLEAN_DATA_DIRECTORY + "/" + filename

            year = detect_year(file)
            wb = openpyxl.open(file)

            if "Fast_Facts_District" in file:
                if "Fast_Facts_District" not in sheet_dicts:
                    sheet_dicts["Fast_Facts_District"] = {}
                sheet_dicts["Fast_Facts_District"][year] = parse_district_fast_facts(wb)

            elif "Fast_Facts_School" in file:
                if "Fast_Facts_School" not in sheet_dicts:
                    sheet_dicts["Fast_Facts_School"] = {}
                sheet_dicts["Fast_Facts_School"][year] = parse_school_fast_facts(wb)

            elif "AFR_Expenditure" in file:
                if "AFR_Expenditure" not in sheet_dicts:
                    sheet_dicts["AFR_Expenditure"] = {}
                    #sheet_dicts["AFR_Expenditure_Per_ADM"] = {}

                afr_expenditures = parse_afr_expenditure(wb, year)
                sheet_dicts["AFR_Expenditure"][year] = afr_expenditures[0]
                #sheet_dicts["AFR_Expenditure_Per_ADM"][year] = afr_expenditures[1] Doesn't provide new data

            elif "AFR_Revenue" in file:
                if "AFR_Revenue" not in sheet_dicts:
                    sheet_dicts["AFR_Revenue"] = {}
                    #sheet_dicts["AFR_Revenue_Per_ADM"] = {}
                    sheet_dicts["AFR_Revenue_TCEM"] = {}


                afr_revenues = parse_afr_revenue(wb, year)
                sheet_dicts["AFR_Revenue"][year] = afr_revenues[0]
                #sheet_dicts["AFR_Revenue_Per_ADM"][year] = afr_revenues[1] Doesn't provide new data
                sheet_dicts["AFR_Revenue_TCEM"][year] = afr_revenues[2]

            elif "Aid_Ratios" in file:
                if "Aid_Ratios_LEA" not in sheet_dicts:
                    sheet_dicts["Aid_Ratios_LEA"] = {}
                    sheet_dicts["Aid_Ratios_IU"] = {}

                aid_ratios = parse_aid_ratio(wb, year)
                sheet_dicts["Aid_Ratios_LEA"][year] = aid_ratios[0]
                sheet_dicts["Aid_Ratios_IU"][year] = aid_ratios[1]

            elif "APD" in file:
                if "APD" not in sheet_dicts:
                    sheet_dicts["APD"] = {}

                sheet_dicts["APD"][year] = parse_apd(wb)

            elif "Cohort" in file:
                if "Cohort_LEA" not in sheet_dicts:
                    sheet_dicts["Cohort_LEA"] = {}
                    sheet_dicts["Cohort_School"] = {}

                fix = "Four" in subdirectory and year == 2012

                cohorts = parse_cohort(wb, year, fix)
                sheet_dicts["Cohort_LEA"][year] = cohorts[0]
                sheet_dicts["Cohort_School"][year] = cohorts[1]

            else:
                logger.write(f'No parser for: {file}')
                wb.close()
                continue
            wb.close()
        write_dicts(sheet_dicts, subdirectory, CLEAN_DATA_DIRECTORY)

    logger.unindent()
    logger.write("Done!")

def remove_extra_files(ORGANIZED_DATA_DIRECTORY, logger):
    logger.write("Removing Extra Files...")
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

def trim_sheet(sheet, rows, cols):
    sheet.delete_rows(1, rows)
    sheet.delete_cols(1, cols)

    return sheet

def run(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger):
    logger.indent()

    do_conversions(ORGANIZED_DATA_DIRECTORY, logger)
    remove_extra_files(ORGANIZED_DATA_DIRECTORY, logger)

    clean_data(ORGANIZED_DATA_DIRECTORY, CLEAN_DATA_DIRECTORY, logger)

    logger.unindent()

#logger = Logger("crawler-logs.txt")
#logger.write("Staring Script...")
#run("./data-organized", "./data-clean", logger)
#logger.write("Done!")
