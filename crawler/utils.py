import re

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
        print(f' ==================== {message} ====================')
        self.log_file.write(f' ==================== {message} ====================')

def detect_year(file):
    name = file.replace("%20", " ")

    regex1 = re.findall(r"20\d\d", name)
    if len(regex1) != 0:
        return int(regex1[0].split("-")[0])

    regex2 = re.findall(r"\d{4}", name)
    if len(regex2) != 0:
        return int("20" + regex2[0][0:2])

    return "COULD NOT DETERMINE YEAR!!"




