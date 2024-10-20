import re

class SheetDict:
    def __init__(self, dict, identifier):
        self.dict = dict
        self.identifier = identifier

class Logger:
    def __init__(self, log_file_path):
        self.log_file = open(log_file_path, "a+")
        self.indentation = 0

    def indent(self):
        self.indentation += 1

    def unindent(self):
        self.indentation -= 1

    def newline(self):
        print("")
        self.log_file.write("\n")

    def write(self, message):
        indented_message = ("  " * self.indentation) +  message

        print(indented_message)
        self.log_file.write(indented_message + "\n")

    def close(self):
        self.log_file.close()

    def warn(self, message):
        print(f' =============== {message} ===============')
        self.log_file.write(f' =============== {message} ===============')
        self.newline()

def detect_year(str):
    str = str.replace("%20", " ")

    regex1 = re.findall(r"20\d\d", str)
    if len(regex1) != 0:
        return int(regex1[0].split("-")[0])

    regex2 = re.findall(r"\d{4}", str)
    if len(regex2) != 0:
        return int("20" + regex2[0][0:2])

    return "COULD NOT DETERMINE YEAR!!"

def detect_type(value):
    if not isinstance(value, str):
        return value

    new_value = value.strip()

    if new_value.isdigit():
        return int(new_value)

    # Matches floating point value
    if bool(re.match(r'^[+-]?(\d+(\.\d*)?|\.\d+)$', new_value)):
        return float(new_value)

    # Matches phone number
    if bool(re.match(r'\d{3}\-\d{3}\-\d{4}', new_value)):
        return int(new_value[0:3] + new_value[4:7] + new_value[8:12])

    return new_value



def detect_iuid(iu_name):
    digits = re.findall(r'\d+', iu_name)

    if len(digits) != 1:
        printf("Unusual amount of digits!")
        return "Unusual amount of digits!"

    return int(digits[0])





