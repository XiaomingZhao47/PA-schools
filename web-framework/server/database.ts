import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import xlsx from 'xlsx';

// open the database connection
export async function openDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  // create table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY,
      DistrictName TEXT,
      Name TEXT,
      AUN TEXT,
      Schl TEXT,
      DataElement TEXT,
      DisplayValue TEXT
    )
  `);

  // load data
  const result = await db.get('SELECT COUNT(*) as count FROM schools');
  if (result.count === 0) {
    await loadDataFromExcel(db);
  }

  return db;
}

// load data from Excel and insert it into the database
async function loadDataFromExcel(db) {
  try {

    const excelFilePath = path.resolve(__dirname, './data-clean/Fast-Facts-School/Fast-Facts-School 2017-2018.xlsx');
    const workbook = xlsx.readFile(excelFilePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    console.log('Excel data loaded:', jsonData.length, 'rows');

    for (const row of jsonData) {
      const districtName = row['DistrictName'] || '';
      const name = row['Name'] || '';
      const aun = row['AUN'] || '';
      const schl = row['Schl'] || '';
      const dataElement = row['DataElement'] || '';
      const displayValue = row['DisplayValue'] || '';

      // insert data into schools table
      await db.run(
          `INSERT INTO schools (DistrictName, Name, AUN, Schl, DataElement, DisplayValue) 
         VALUES (?, ?, ?, ?, ?, ?)`,
          [districtName, name, aun, schl, dataElement, displayValue]
      );
    }

    console.log('data loaded successfully');
  } catch (error) {
    console.error('error loading data:', error);
  }
}
