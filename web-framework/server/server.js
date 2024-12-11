const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5001;

app.use(cors());

const dbPath = 'database2.db';

// connect to database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database: ", err.message);
    } else {
        console.log("Connected to database.");
    }
});

/* *
*
* Five API for query data from database, will do SQL optimization later
*
* */

// 1. demographics data for all schools
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

// 2. graduation rates data
app.get('/api/graduation-rates', (req, res) => {
    const query = `
    SELECT 
        l.lea_name AS district_name,
        l.county,
        c4.total_grads AS four_year_grads,
        c4.total_cohort AS four_year_cohort,
        c4.white_grad_rate AS four_year_white_rate,
        c4.african_american_grad_rate AS four_year_black_rate,
        c4.hispanic_grad_rate AS four_year_hispanic_rate,
        c4.economically_disadvantaged_grad_rate AS four_year_econ_disadvantaged_rate,
        c5.total_grads AS five_year_grads,
        c5.total_cohort AS five_year_cohort,
        c6.total_grads AS six_year_grads,
        c6.total_cohort AS six_year_cohort
    FROM LEAs l
    LEFT JOIN CohortFourYear c4 ON l.aun = c4.aun
    LEFT JOIN CohortFiveYear c5 ON l.aun = c5.aun AND c5.year = c4.year
    LEFT JOIN CohortSixYear c6 ON l.aun = c6.aun AND c6.year = c4.year
    WHERE c4.year = (SELECT MAX(year) FROM CohortFourYear)
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 3. financial data
app.get('/api/financial-analysis', (req, res) => {
    const query = `
    SELECT 
        l.lea_name AS district_name,
        l.county,
        r.local_taxes,
        r.state_revenue,
        r.federal_revenue,
        r.steb_market_value,
        e.instruction AS instruction_spending,
        e.support_services AS support_spending,
        e.transportation AS transportation_spending,
        e.total_expenditures,
        ROUND(CAST(e.instruction AS FLOAT) / NULLIF(e.total_expenditures, 0) * 100, 2) AS instruction_percentage,
        a.mv_pi_aid_ratio AS market_value_aid_ratio
    FROM LEAs l
    JOIN AFRRevenue r ON l.aun = r.aun
    JOIN AFRExpenditure e ON l.aun = e.aun AND e.year = r.year
    JOIN AidRatios a ON l.aun = a.aun AND a.year = r.year
    WHERE r.year = (SELECT MAX(year) FROM AFRRevenue)
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 4. school performance
app.get('/api/school-performance', (req, res) => {
    const query = `
    SELECT 
        s.school_name,
        s.school_address_city,
        l.county,
        f.school_enrollment,
        f.title_i_school,
        f.economically_disadvantaged,
        f.english_learner,
        f.special_education,
        f.essa_school_designation,
        f.career_and_technical_programs
    FROM Schools s
    JOIN LEAs l ON s.aun = l.aun
    JOIN FastFactsSchool f ON s.school_id = f.school_id
    WHERE f.year = (SELECT MAX(year) FROM FastFactsSchool)
    ORDER BY l.county, s.school_address_city, s.school_name
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 5. home page search
app.get('/api/schools/search', (req, res) => {
    const searchTerm = req.query.term;
    const sortBy = req.query.sortBy || 'school';

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    // Map frontend sort parameters to database columns
    const sortMapping = {
        school: 's.school_name',
        district: 'l.lea_name',
        city: 's.school_address_city',
        county: 'l.county',
        grades: 'f.grades_offered',
        enrollment: 'f.school_enrollment'
    };

    const orderByColumn = sortMapping[sortBy] || sortMapping.school;

    const query = `
        SELECT DISTINCT
            s.school_id,
            s.school_name,
            s.school_address_city,
            l.lea_name AS district_name,
            l.county,
            f.school_enrollment AS total_enrollment,
            f.grades_offered AS grades,
            f.title_i_school,
            f.economically_disadvantaged,
            f.english_learner,
            f.special_education
        FROM Schools s
                 JOIN LEAs l ON s.aun = l.aun
                 LEFT JOIN FastFactsSchool f ON s.school_id = f.school_id
        WHERE (
            LOWER(s.school_name) LIKE LOWER(?) OR
            LOWER(l.lea_name) LIKE LOWER(?) OR
            LOWER(s.school_address_city) LIKE LOWER(?) OR
            LOWER(l.county) LIKE LOWER(?)
        )
        AND f.year = (
            SELECT MAX(year)
            FROM FastFactsSchool
        )
        ORDER BY ${orderByColumn}
        LIMIT 100
    `;

    const searchPattern = `%${searchTerm}%`;

    db.all(query, [searchPattern, searchPattern, searchPattern, searchPattern], (err, rows) => {
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