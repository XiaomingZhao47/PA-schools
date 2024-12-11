'''
<FILE>
utils.py


<DESCRIPTION>
The purpose of this script is to provide important or frequently used utilities
to multiple scripts.


<CLASSES>
This section only lists a brief description of each class. For more
comprehensive documentation, see each class directly.

    * SheetDict(...):
        A dictionary capable of describing an entire worksheet worth of
        data values.

    * Logger(...):
        A helper class to write statements both to the terminal and to
        a log file.


<FUNCTIONS>
This section only lists a brief description of each function. For more
comprehensive documentation, see each method directly.

    * detect_year(...):
        Determines the academic year for which a file describes.

    * detect_db_type(...):
        Determines the best SQLite3 data type (TEXT, REAL, INTEGER) to assign
        to an column of openpyxl worksheet values.

    * detect_type(...):
        Casts a data value to the best Python3 data type detected.

    * detect_iuid(...):
        Detects an Intermediate Unit's (IU) ID number from its name.
'''

import re

class SheetDict:
    '''
    A dictionary capable of describing an entire worksheet worth of
    data values.

    <EXTENDED_DESCRIPTION>
    A SheetDict provides its functionality by representing the data in nested
    dictionaries. The outermost dictionary represents each entity (e.g. each
    school), while the innermost dictioary represents data points about each
    one (e.g. name, address, etc.).

    <ATTRIBUTES>
        * dict [Dictionary]:
            The outermost dictionary in which the data is stored.

        * identifier: [String]:
            The name of the identifier for each structure (e.g. "aun" for LEAs, etc.).

    <FUNCTIONS>
        * __init__(...): The constructor for a SheetDict.
    '''

    dict = None
    '''[Dictionary]: The outermost dictionary in which the data is stored.'''
    identifier = None
    '''[String]: The name of the identifier for each structure (e.g. "aun" for LEAs, etc.).'''

    def __init__(self, dict, identifier):
        '''
        The constructor for a SheetDict.

        <ARGUMENTS>
            * dict [Dictionary]:
                The outermost dictionary in which the data is stored.

            * identifier [String]:
                The name of the identifier for each structure (e.g. "aun" for
                LEAs, etc.).

        '''

        self.dict = dict
        self.identifier = identifier

class Logger:
    '''
    A helper class to write statements both to the terminal and to a log file.

    <EXTENDED_DESCRIPTION>
    This class also provides formatting utilities, such as indentation and
    warning systems.

    <ATTRIBUTES>
        * log_file [File]:
            The log file to which the statements are written to.

        * indentation: [Integer]:
           The current level of text indentation.

    <FUNCTIONS>
        * __init__(...): The constructor for a Logger.

        * indent(): Increments the indentation level.

        * unindent(): Decrements the indentation level.

        * newline(): Moves the terminal and log file to the next line.

        * write(...): Writes a message to both the terminal and a log file.

        * warn(...): Writes a warning to both the terminal and log file.

        * close(): Closes the log file being written to.
    '''


    log_file = None
    '''The log file to which the statements are written to.'''

    indentation = 0
    '''The current level of text indentation.'''

    def __init__(self, log_file_path):
        '''
        The constructor for a Logger.

        <ARGUMENTS>
            * log_file_path [String]:
                The path to the log file to be written to.
        '''
        self.log_file = open(log_file_path, "a+")

    def indent(self):
        '''
        Increments the indentation level.
        '''

        self.indentation += 1

    def unindent(self):
        '''
        Decrements the indentation level.
        '''

        self.indentation -= 1

    def newline(self):
        '''
        Moves the terminal and log file to the next line.
        '''

        print("")
        self.log_file.write("\n")

    def write(self, message):
        '''
        Writes a message to both the terminal and a log file.

        <EXTENDED_DESCRIPTION>
        Will automatically indent the message according to the indentation level.

        <ARGUMENTS>
            * message [Any]: The message to write.
        '''

        indented_message = ("  " * self.indentation) +  message

        print(indented_message)
        self.log_file.write(indented_message + "\n")

    def warn(self, message):
        '''
        Writes a warning to both the terminal and a log file.

        <EXTENDED_DESCRIPTION>
        Ignores the indentation level, but adds markings before/after the message.

        <ARGUMENTS>
            * message [Any]: The message to write.
        '''
        print(f' =============== {message} ===============')
        self.log_file.write(f' =============== {message} ===============')

    def close(self):
        '''
        Closes the log file being written to.
        '''
        self.log_file.close()

def detect_year(filename):
    '''
    Determines the academic year for which a file describes.

    <ARGUMENTS>
        * filename [String]: The name of the file which is being detected.

    <RETURN>
        * [Integer]: The year for which the file describes.

    <RAISE>
        * ValueError: If no year is detected.

    '''

    filename = filename.replace("%20", " ")

    regex1 = re.findall(r"20\d\d", filename)
    if len(regex1) != 0:
        return int(regex1[0].split("-")[0])

    regex2 = re.findall(r"\d{4}", filename)
    if len(regex2) != 0:
        return int("20" + regex2[0][0:2])

    raise ValueError("COULD NOT DETERMINE YEAR!!")

def detect_db_type(col):
    '''
    Determines the best SQLite3 data type (TEXT, REAL, INTEGER) to assign
    to an column of openpyxl sheet values.

    <ENTENDED_DESCRIPTION>
    The data type assigment prioritizes [INTEGER > REAL > TEXT].

    <ARGUMENTS>
        * col [Generator]: An openpyxl sheet column.

    <RETURN>
        * [String]: The best SQLite3 data type to describe the column.
    '''

    possible_type = "INTEGER"


    for cellIdx, cell in enumerate(col):
        if cellIdx == 0:
            continue

        val = cell.value

        if val is None:
            continue
        if isinstance(val, str):
            return "TEXT"
        if not int(val) == val:
            possible_type = "REAL"
    return possible_type

def detect_type(value):
    '''
    Casts a data value to the best Python3 data type detected.

    <ENTENDED_DESCRIPTION>
    Will also detect if a value should be empty (in the case of "NA", etc.), and return None
    The data type assigment prioritizes [None > Integer > Float > String > Any].

    <ARGUMENTS>
        * col [Generator]: An openpyxl sheet column.

    <RETURN>
        * [String]: The best SQLite3 data type to describe the column.
    '''

    if not isinstance(value, str):
        return value

    new_value = value.strip()
    lower_value = new_value.lower().replace(" ", "")

    if lower_value in ["", "na", "notavailable", "notapplicable", "insufficientsample", "is", "null", "--"]:
        return None

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
    '''
    Detects an Intermediate Unit's (IU) ID number from its name.

    <ARGUMENTS>
        * iu_name [String]: The name of the Intermediate Unit.

    <RETURN>
        * [Integer]: The IU's ID.

    <RAISE>
        * ValueError: If no id is detected.
    '''
    digits = re.findall(r'\d+', iu_name)

    if len(digits) != 1:
        raise ValueError("COULD NOT DETERMINE YEAR!!")

    return int(digits[0])