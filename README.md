# PA School OneSearch

## Overview

The PA School Analysis System is a web application that allows users to compare and analyze various aspects of schools across multiple dimensions including demographics, graduation rates, school performance, and financial metrics.

### Group Name: Query Conquerers
### Group Member: Pedro dos Santos, Xiaoming Zhao

## Features

### 1. OneSearch
- School search functionality with auto-complete
- Up to 5 schools can be selected for comparison
- Display of basic school information including:
    - School name
    - District name
    - Location (city, county)
    - Total enrollment

### 2. Demographics Analysis
#### Data Visualization
- radar chart
    - Economically disadvantaged students percentage
    - English learners percentage
    - Special education percentage

### 3. Graduation Rates Analysis
- Comparison of graduation rates across selected schools
- Multiple timeframe:
    - 4-year graduation rate
    - 5-year graduation rate
    - 6-year graduation rate

- Demographic performance radar chart
    - White student graduation rates
    - Black student graduation rates
    - Hispanic student graduation rates
    - Economically disadvantaged student graduation rates

### 4. School Performance Analysis
-  Enrollment and programs bar chart
    - Total enrollment
    - Career and technical programs participation

### 5. Financial Analysis
#### Revenue Analysis
- Bar chart visualization
    - Local taxes
    - State revenue
    - Federal revenue

#### Expenditure Distribution
- Individual pie charts for each selected school 
  - Instruction spending percentage
  - Support services percentage
  - Transportation spending percentage

#### Market Value Aid Ratio
- Bar chart comparison across selected schools

## Source Code Structure
    /PA-schools/web-framework/client/src
    .
    ├── App.css
    ├── App.test.tsx
    ├── App.tsx
    ├── components
    │   ├── AddDataForm.tsx
    │   ├── ChartVisualization.tsx
    │   ├── CityComparison.tsx
    │   ├── DeleteData.tsx
    │   ├── DemographicComparison.tsx
    │   ├── DisplayData.tsx
    │   ├── FinancialAnalysisComparison.tsx
    │   ├── GraduationComparison.tsx
    │   ├── GraduationSearch.tsx
    │   ├── HomeSearch.tsx
    │   ├── SchoolPerformanceComparison.tsx
    │   ├── SearchComponent.tsx
    │   ├── SearchTab.tsx
    │   ├── StreetComparison.tsx
    │   └── UpdateDataForm.tsx
    ├── index.css
    ├── index.tsx
    ├── logo.svg
    ├── react-app-env.d.ts
    ├── reportWebVitals.ts
    ├── setupTests.ts
    ├── styles
    │   ├── FinancialAnalysis.css
    │   ├── GraduationAnalysis.css
    │   └── SearchTab.css
    └── types.ts

    3 directories, 28 files


## How To Run the crawler:

### 1. (Opt.) Set up virtual environment

Depending on your OS, you may have to set up a
virtual environment. Here are some common methods:

Linux:
```
$ python -m venv ./.venv
$ source ./.venv/bin/activate
```

Other:  
&emsp;https://docs.python.org/3/library/venv.html

### 2. Install the required packages

This project requires a few additional dependencies.
These are listed in requirements.txt.

To install, run:
```
$ pip install -r requirements.txt
```

If, for some reason, not all dependencies are installed,
refresh the dependencies list using pipreqs
```
$ pip install pipreqs  
$ pipreqs . --ignore .venv, __pycache__  
$ pip install -r requirements.txt
```

### 3. Execute the crawler script

To run execute the script, run:
```
$ python3 crawler.py
```

## Web Framework Setup

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- SQLite3

### Project Structure
```
PA-schools/
├── web-framework/
│   ├── client/         # React frontend
│   └── server/         # Node.js backend
```

### How To Run the Application

#### 1. Start the Backend Server

First, navigate to the server directory
```bash
$ cd /PA-schools/web-framework/server
```

Install the required dependencies
```bash
$ npm install express
$ npm install sqlite3
$ npm install cors
$ npm install dotenv
$ npm install axios
```

Start the server:
```bash
$ node server.js
```

The server should now be running on http://localhost:5001

#### 2. Start the Frontend Application

Open a new terminal window and navigate to the client directory
```bash
$ cd /PA-schools/web-framework/client
```

Install the required dependencies
```bash
$ npm install react
$ npm install react-dom
$ npm install react-router-dom
$ npm install axios
$ npm install recharts
$ npm install @types/react
$ npm install @types/react-dom
$ npm install typescript
$ npm install tailwindcss
$ npm install @tailwindcss/typography
$ npm install @tailwindcss/forms
$ npm install lucide-react
```

Start the React application
```bash
$ npm start
```

The application should now be running on http://localhost:3000

### Additional Configuration

#### Environment Variables
Create a `.env` file in the server directory with the following content
```
PORT=5001
DB_PATH=../crawler/schools.db
```

Current database used in `server.js`
```
/PA-schools/web-framework/server/database2.db
```

Schema for database2.db
```
CREATE TABLE FastFactsDistrict (
  aun INTEGER,
  year INTEGER,
  lea_enrollment INTEGER,
  gifted REAL,
  ctc_name TEXT,
  ctc_website TEXT,
  iu_website TEXT,
  ai_an REAL,
  asian REAL,
  african_american REAL,
  hispanic REAL,
  multiracial REAL,
  white REAL,
  nh_pi REAL,
  economically_disadvantaged REAL,
  english_learner REAL,
  special_education REAL,
  female REAL,
  male REAL,
  number_of_schools INTEGER,
  enrollment_in_partnering_ctcs INTEGER,
  cs_enrollment INTEGER,
  district_size REAL,
  foster_care REAL,
  homeless REAL,
  military_connected REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE CohortSixYear (
  aun INTEGER,
  year INTEGER,
  total_grads INTEGER,
  total_cohort INTEGER,
  male_grad_rate TEXT,
  female_grad_rate REAL,
  white_grad_rate REAL,
  hispanic_grad_rate REAL,
  african_american_grad_rate REAL,
  multiracial_grad_rate REAL,
  economically_disadvantaged_grad_rate REAL,
  special_ed_grad_rate REAL,
  ai_an_grad_rate REAL,
  asian_grad_rate REAL,
  nh_pi_grad_rate REAL,
  english_learner_grad_rate REAL,
  migrant_grad_rate REAL,
  homeless_grad_rate REAL,
  military_grad_rate REAL,
  foster_grad_rate REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE CohortFiveYear (
  aun INTEGER,
  year INTEGER,
  total_grads INTEGER,
  total_cohort INTEGER,
  male_grad_rate TEXT,
  female_grad_rate REAL,
  white_grad_rate REAL,
  hispanic_grad_rate REAL,
  african_american_grad_rate REAL,
  multiracial_grad_rate REAL,
  economically_disadvantaged_grad_rate REAL,
  special_ed_grad_rate REAL,
  ai_an_grad_rate REAL,
  asian_grad_rate REAL,
  nh_pi_grad_rate REAL,
  english_learner_grad_rate REAL,
  migrant_grad_rate REAL,
  foster_grad_rate REAL,
  homeless_grad_rate REAL,
  military_grad_rate REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE AFRRevenue (
  aun INTEGER,
  year INTEGER,
  current_and_interim_real_estate_taxes_collected REAL,
  public_utility_realty_taxes_collected REAL,
  payment_in_lieu_of_taxes_collected REAL,
  per_capita_taxes_collected REAL,
  act_1_act_511_and_first_class_sd_taxes_collected REAL,
  delinquent_taxes_collected REAL,
  steb_market_value INTEGER,
  equalized_mills REAL,
  local_taxes REAL,
  local_other REAL,
  state_revenue REAL,
  federal_revenue REAL,
  other_revenue REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE Keystones (
  subject TEXT,
  demographic_group TEXT,
  school_id INTEGER,
  year INTEGER,
  scored INTEGER,
  advanced REAL,
  proficient REAL,
  basic REAL,
  below_basic REAL,

  PRIMARY KEY (subject,demographic_group,school_id,year)
);
CREATE TABLE AFRExpenditure (
  aun INTEGER,
  year INTEGER,
  instruction REAL,
  support_services REAL,
  noninstructional_services REAL,
  oefu REAL,
  total_expenditures REAL,
  regular_programs REAL,
  gifted_programs REAL,
  vocational_programs REAL,
  other_instructional REAL,
  adult_programs REAL,
  personnel REAL,
  staff REAL,
  administration REAL,
  health REAL,
  business REAL,
  plant_ops REAL,
  transportation REAL,
  central REAL,
  other_support REAL,
  nonpublic_programs REAL,
  facai REAL,
  secondary_programs REAL,
  pre_k REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE LEAs (
  aun INTEGER,
  lea_name TEXT,
  county TEXT,
  lea_type TEXT,
  lea_address_street TEXT,
  lea_address_city TEXT,
  lea_address_state TEXT,
  lea_address_zip INTEGER,
  lea_website TEXT,
  lea_telephone INTEGER,

  PRIMARY KEY (aun)
);
CREATE TABLE FastFactsSchool (
  school_id INTEGER,
  year INTEGER,
  grades_offered TEXT,
  title_i_school TEXT,
  school_enrollment INTEGER,
  gifted REAL,
  ai_an REAL,
  asian REAL,
  nh_pi REAL,
  african_american REAL,
  hispanic REAL,
  white REAL,
  multiracial REAL,
  economically_disadvantaged REAL,
  english_learner REAL,
  special_education REAL,
  female_school REAL,
  male_school REAL,
  career_and_technical_programs TEXT,
  foster_care REAL,
  homeless REAL,
  military_connected REAL,
  essa_school_designation TEXT,

  PRIMARY KEY (school_id,year)
);
CREATE TABLE AidRatios (
  aun INTEGER,
  year INTEGER,
  mv_pi_aid_ratio REAL,
  mv_aid_ratio REAL,
  pi_aid_ratio REAL,
  mv INTEGER,
  pi INTEGER,
  weighted_adm REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE CohortFourYear (
  aun INTEGER,
  year INTEGER,
  total_grads INTEGER,
  total_cohort INTEGER,
  male_grad_rate TEXT,
  female_grad_rate REAL,
  white_grad_rate REAL,
  hispanic_grad_rate REAL,
  african_american_grad_rate REAL,
  multiracial_grad_rate REAL,
  economically_disadvantaged_grad_rate REAL,
  special_ed_grad_rate REAL,
  ai_an_grad_rate REAL,
  asian_grad_rate REAL,
  nh_pi_grad_rate REAL,
  english_learner_grad_rate REAL,
  migrant_grad_rate REAL,
  homeless_grad_rate REAL,
  military_grad_rate REAL,
  foster_grad_rate REAL,

  PRIMARY KEY (aun,year)
);
CREATE TABLE Schools (
  school_id INTEGER,
  school_name TEXT,
  aun INTEGER,
  school_address_street TEXT,
  school_address_city TEXT,
  school_address_state TEXT,
  school_address_zip INTEGER,
  school_website TEXT,
  school_telephone INTEGER,

  PRIMARY KEY (school_id)
);
CREATE TABLE IUs (
  aun INTEGER,
  iu_name TEXT,

  PRIMARY KEY (aun)
);

```

### Common Issues

1. Port Already in Use
```bash
$ lsof -i :5001  # check what's using port 5001
$ kill -9   # kill the process if needed
```

2. Database Connection Issues
```bash
# check database file permissions
$ chmod 644 ../crawler/schools.db
```

3. Node Modules Issues
```bash
# clear npm cache and reinstall dependencies
$ npm cache clean --force
$ rm -rf node_modules
$ npm install
```

### Development Notes

#### Backend API Endpoints
- GET `/api/demographics`
- GET `/api/graduation-rates`
- GET `/api/school-performance`
- GET `/api/financial-analysis`
- GET `/api/search`

#### Frontend Routes
- `/` - OneSearch
- `/demographics` - Demographics Analysis
- `/graduation-rates` - Graduation Rates
- `/school-performance` - School Performance
- `/financial-analysis` - Financial Analysis

## Visualizations

<div align="center">
    <img src="https://github.com/user-attachments/assets/7afba208-9dd2-4f5f-bcd7-1ce9bbdad798", alt="Keystone Exam Scores vs. Revenue (Yearly Breakdown)">
    <p> 
        Keystone Exam Scores vs. Revenue (Yearly Breakdown)  
    </p>
    <br>
    <img src="https://github.com/user-attachments/assets/2b7f4ea6-ebc1-4f2d-b4bf-a47f8370f16a", alt="Keystone 2022 Exam Scores vs. Revenue (Subject Breakdown)">
    <br>
    <p>
        Keystone 2022 Exam Scores vs. Revenue (Subject Breakdown)
    </p>
</div>
