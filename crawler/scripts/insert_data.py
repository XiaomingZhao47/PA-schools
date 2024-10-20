import sqlite3
import os
import openpyxl

class Attribute:
    def __init__(self, name, type):
        self.name = name
        self.type = type

def reset_table(con, logger):
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



def insert_file(start_dir, db, filename, con, logger):
    table_name = filename.replace("_", "").replace(".xlsx", "")
    cur = con.cursor()

    wb = openpyxl.open(start_dir + "/" + filename)
    sheet = wb.active

    data = []

    raw_attrs = tuple(cell.value.split(" ") for cell in list(sheet.rows)[0])
    attrs = []
    pks = []

    for i in range(len(raw_attrs)):
        raw_key = raw_attrs[i]

        if len(raw_key) == 1:
            logger.write(f'{raw_key[0]} does not have a type. Defaulting to TEXT.')
            raw_key = [raw_key[0], "TEXT"]
        elif len(raw_key) == 2:
            pass
        else:
            logger.warn(f'Invalid key: {raw_key}')
            continue
        key_name = raw_key[0]
        key_type = raw_key[1]

        if "PK_" in key_type:
            key_type = key_type.replace("PK_", "")
            pks.append(key_name)

        attrs.append(Attribute(key_name, key_type))


    create_query = f'CREATE TABLE IF NOT EXISTS {table_name} ('

    if len(pks) == 0:
        pks = [attrs[0].name]
        logger.warn(f'PKs are empty. Defaulting to ${pks[0]}')

    for key in attrs:
        create_query = create_query + "\n  " + key.name + " " + key.type + ","

    create_query = create_query + "\n\n  PRIMARY KEY ("
    for pk in pks:
        create_query = create_query + pk + ","
    create_query = create_query[0:-1] + ")\n);"


    insert_query = f'INSERT INTO {table_name} VALUES ('
    insert_query = insert_query + ("?," * len(attrs))
    insert_query = insert_query[0:-1] + ")"

    data = []
    for rowIdx, row in enumerate(sheet.rows):
        if(rowIdx == 0):
            continue

        data.append(tuple(cell.value for cell in row))

    cur.execute(create_query)
    cur.executemany(insert_query, data)
    con.commit()

    res = cur.execute("SELECT * FROM AFRExpenditure")
    print(res.fetchall())

    wb.close()



def run(NORMALIZED_DATA_DIRECTORY, DATABASE_FILE, logger):
    logger.indent()

    con = sqlite3.connect(DATABASE_FILE)
    reset_table(con, logger)

    for filename in os.listdir(NORMALIZED_DATA_DIRECTORY):
        if "#" in filename:
            continue

        logger.write(f'Processing {filename}')

        logger.indent()
        insert_file(NORMALIZED_DATA_DIRECTORY, DATABASE_FILE, filename, con, logger)
        logger.unindent()





    con.close()

    logger.unindent()
