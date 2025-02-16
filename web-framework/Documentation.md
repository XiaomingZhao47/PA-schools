# Web Framework Documentation

## Source Code Structure
    ```
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
    ```
    
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

## Development Notes

### Backend API Endpoints
- GET `/api/demographics`
- GET `/api/graduation-rates`
- GET `/api/school-performance`
- GET `/api/financial-analysis`
- GET `/api/search`

### Frontend Routes
- `/` - OneSearch
- `/demographics` - Demographics Analysis
- `/graduation-rates` - Graduation Rates
- `/school-performance` - School Performance
- `/financial-analysis` - Financial Analysis