const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5001;

app.use(cors());

const dbPath = 'schools_facts.db';

// connect to database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("error opening database: ", err.message);
    } else {
        console.log("connected to database.");
    }
});

app.get('/api/demographics', (req, res) => {
    const query = `
    SELECT School_Name, American_Indian_Alaskan_Native AS AmericanIndian, Asian, 
           Native_Hawaiian_or_other_Pacific_Islander AS NativeHawaiian, 
           Black_African_American AS Black, Hispanic, White, 
           Two_or_More_Races AS TwoOrMoreRaces
    FROM SchoolFacts
  `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
