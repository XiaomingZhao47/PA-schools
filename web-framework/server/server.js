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
        console.error("Error opening database: ", err.message);
    } else {
        console.log("Connected to database.");
    }
});

// get demographics data for all schools
app.get('/api/demographics', (req, res) => {
    const query = `
    SELECT s.school_name, 
           f.ai_an AS american_indian,
           f.asian,
           f.nh_pi AS native_hawaiian,
           f.african_american AS black,
           f.hispanic,
           f.white,
           f.multiracial AS two_or_more_races,
           f.economically_disadvantaged,
           f.english_learner,
           f.special_education,
           f.female_school AS female,
           f.male_school AS male,
           f.year
    FROM FastFactsSchool f
    JOIN Schools s ON f.school_id = s.school_id
    WHERE f.year = (
        SELECT MAX(year) 
        FROM FastFactsSchool
    )
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// get demographics data grouped by cities
app.get('/api/cities', (req, res) => {
    const query = `
    SELECT s.school_address_city,
           s.school_name,
           f.ai_an AS american_indian,
           f.asian,
           f.nh_pi AS native_hawaiian,
           f.african_american AS black,
           f.hispanic,
           f.white,
           f.multiracial AS two_or_more_races,
           f.economically_disadvantaged,
           f.english_learner,
           f.special_education,
           f.female_school AS female,
           f.male_school AS male,
           f.year
    FROM FastFactsSchool f
    JOIN Schools s ON f.school_id = s.school_id
    WHERE f.year = (
        SELECT MAX(year) 
        FROM FastFactsSchool
    )
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Group schools by city
            const cities = rows.reduce((acc, row) => {
                if (!acc[row.school_address_city]) {
                    acc[row.school_address_city] = [];
                }
                acc[row.school_address_city].push(row);
                return acc;
            }, {});

            res.json(cities);
        }
    });
});

// endpoint to get district-level demographics
app.get('/api/district-demographics', (req, res) => {
    const query = `
    SELECT l.lea_name AS district_name,
           l.county,
           f.ai_an AS american_indian,
           f.asian,
           f.nh_pi AS native_hawaiian,
           f.african_american AS black,
           f.hispanic,
           f.white,
           f.multiracial AS two_or_more_races,
           f.economically_disadvantaged,
           f.english_learner,
           f.special_education,
           f.female AS female,
           f.male AS male,
           f.lea_enrollment AS total_enrollment,
           f.year
    FROM FastFactsDistrict f
    JOIN LEAs l ON f.aun = l.aun
    WHERE f.year = (
        SELECT MAX(year) 
        FROM FastFactsDistrict
    )
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
    console.log(`Server is running on http://localhost:${port}`);
});