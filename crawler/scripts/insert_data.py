'''
<FILE>
insert_data.py


<DESCRIPTION>
The purpose of this script is to insert the normalized data into an automatically
generated SQLite3 database file.

<CLASSES>
This section only lists a brief description of each class. For more
comprehensive documentation, see each class directly.

    * Attribute(...): A simple structure to facilitate storing attributes.


<FUNCTIONS>
This script can be run by calling insert_data.run(<args>). All other functions
in this script should remain private. This section only lists a brief description
of each function. For more comprehensive documentation, see each method directly.

    * run(...): Inserts the normalized data into the database file.

    * reset_database(...): Wipes the entirety of the database.

    * insert_file(...): Creates and inserts a new table into the database.
'''

import sqlite3
import os
import openpyxl

class Attribute:
    '''
    A simple structure to facilitate storing attributes.

    <ATTRIBUTES>
        * name [String]: A given attribute's name.

        * type: [String]: The attributes SQLite3 data type (INTEGER, REAL, TEXT).

    <FUNCTIONS>
        * __init__(...): The constructor for an Attribute.
    '''

    name = None
    '''A given attribute's name.'''

    type = None
    '''The attributes SQLite3 data type (INTEGER, REAL, TEXT).'''

    def __init__(self, name, type):
        '''
        The constructor for an Attribute.

        <ARGUMENTS>
            * name [String]: A given attribute's name.

            * type: [String]: The attributes SQLite3 data type (INTEGER, REAL, TEXT).
        '''

        self.name = name
        self.type = type

def run(NORMALIZED_DATA_DIRECTORY, DATABASE_FILE, logger):
    '''
    Inserts the normalized data into the database file.

    <ARGUMENTS>
        * NORMALIZED_DATA_DIRECTORY [String]:
            The path to the input directory containing the data files.

        * DATABASE_FILE [String]:
            The path to the database file.

        * logger [utils.Logger]:
            The current Logger instance.
    '''

    logger.indent()

    con = sqlite3.connect(DATABASE_FILE)
    reset_database(con, logger)

    for filename in os.listdir(NORMALIZED_DATA_DIRECTORY):
        if "#" in filename:
            continue

        logger.write(f'Processing {filename}')

        logger.indent()
        insert_file(NORMALIZED_DATA_DIRECTORY, filename, con, logger)
        logger.unindent()

    con.close()
    logger.unindent()

def reset_database(con, logger):
    '''
    Wipes the entirety of the database.

    <EXTENDED DESCRIPTION>
    All Tables, Indices, and Triggers will be cleared, and the database will
    also be vacuumed to save on file space.

    <ARGUMENTS>
        * con [sqlite3 Connection]: The active connection to the database file.

        * logger [utils.Logger]: The current Logger instance.
    '''

    cur = con.cursor()

    res1 = cur.execute("PRAGMA writable_schema = 1;")
    res2 = cur.execute("DELETE FROM sqlite_master WHERE type IN ('table', 'index', 'trigger');")
    res3 = cur.execute("PRAGMA writable_schema = 0;")
    con.commit()

    res4 = cur.execute("VACUUM;")
    res5 = cur.execute("PRAGMA INTEGRITY_CHECK;")
    con.commit()

    print(res1.fetchall())
    print(res2.fetchall())
    print(res3.fetchall())
    print(res4.fetchall())
    print(res5.fetchall())

def insert_file(dir, filename, con, logger):
    '''
    Creates and inserts a new table into the database.

    <ARGUMENTS>
        * dir [String]: The path to the data file's directory.

        * filename [String]: The name of the file being inserted into the database.

        * con [sqlite3 Connection]: The active connection to the database file.

        * logger [utils.Logger]: The current Logger instance.
    '''

    table_name = filename.replace("_", "").replace(".xlsx", "")
    cur = con.cursor()

    wb = openpyxl.open(dir + "/" + filename)
    sheet = wb.active

    if len(list(sheet.rows)) < 2:
        return

    # Splits columns up into name / data type
    raw_attrs = tuple(cell.value.split(" ") for cell in list(sheet.rows)[0])
    attrs = []
    pks = []

    if "Keystone" in filename:
        raw_attrs = (["demographic_group", "PK_TEXT"],) + raw_attrs
        raw_attrs = (["subject", "PK_TEXT"],) + raw_attrs

    for i in range(len(raw_attrs)):
        raw_key = raw_attrs[i]

        if len(raw_key) == 1: # No data type provided
            logger.write(f'{raw_key[0]} does not have a type. Defaulting to TEXT.')
            raw_key = [raw_key[0], "TEXT"]
        elif len(raw_key) == 2:
            pass
        else: # Atribute is malformatted
            logger.warn(f'Invalid key: {raw_key}')
            continue

        key_name = raw_key[0]
        key_type = raw_key[1]

        if "PK_" in key_type:
            key_type = key_type.replace("PK_", "")
            pks.append(key_name)

        attrs.append(Attribute(key_name, key_type))

    # Automatically builds the query to create the table
    create_query = f'CREATE TABLE IF NOT EXISTS {table_name} ('

    if len(pks) == 0: # No Primary Keys Specified
        pks = [attrs[0].name]
        logger.warn(f'PKs are empty. Defaulting to ${pks[0]}')

    for key in attrs: # Specify the PKs when creating the table
        create_query = create_query + "\n  " + key.name + " " + key.type + ","

    create_query = create_query + "\n\n  PRIMARY KEY ("
    for pk in pks:
        create_query = create_query + pk + ","
    create_query = create_query[0:-1] + ")\n);"


    insert_query = f'INSERT INTO {table_name} VALUES ('
    insert_query = insert_query + ("?," * len(attrs))
    insert_query = insert_query[0:-1] + ")"

    # Automatically builds the query to add data to the table
    data = []
    for rowIdx, row in enumerate(sheet.rows):
        if(rowIdx == 0):
            continue

        data_tuple = tuple(cell.value for cell in row)

        if "Keystone" in filename:
            key = data_tuple[0]
            key_components = key.split("_")

            school_id = key_components[0]
            group = key_components[1]
            subject = key_components[2]

            data_tuple = (subject, group, school_id) + data_tuple[1:]

        data.append(data_tuple)

    # Executes both queries
    try:
        cur.execute(create_query)
        cur.executemany(insert_query, data)
        con.commit()
    except:
        logger.warn(f'SQL Error. \nCreate query: {create_query}\n')

        res = cur.execute(f'SELECT * FROM {table_name} LIMIT 25;')
        print(res.fetchall())

    wb.close()