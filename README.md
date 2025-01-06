# PA School OneSearch

### Group Name: Query Conquerers
### Group Members: Pedro dos Santos, Xiaoming Zhao

The PA School OneSearch System is a web application that allows users to visualize various aspects of schools across multiple dimensions including demographics, graduation rates, school performance, and financial metrics. The intuitive interface makes it easy to compare and contrast different schools and school districts.

## Documentation Overview

The OneSearch System is composed of two major components: the crawler, and the web framework. The crawler downloads all the relevant data files, and through a series of transformations, creates a database with clean and normalized data. The web framework then picks up where the crawler left off, using the database to display the relevant data to the users via charts and graphs.

For a more in-depth description of each component, as well as instructions on how to run both, use the following links:

### Useful Links
 - [How to Run the Cralwer](https://github.com/XiaomingZhao47/PA-schools/blob/main/crawler/Instructions.md)
 - [How to Run the Web Framework](https://github.com/XiaomingZhao47/PA-schools/blob/main/web-framework/Instructions.md)
 - [Crawler Documentation](https://github.com/XiaomingZhao47/PA-schools/blob/main/crawler/Documentation.md)
 - [Web Framework Documentation](https://github.com/XiaomingZhao47/PA-schools/blob/main/web-framework/Documentation.md)
 - [Database Documentation](https://docs.google.com/spreadsheets/d/121YfMEpfjlTQk861BncyhsCJv0BIpc0dGdnskaBMy8g/edit?usp=sharing) [External]
 - [ER Diagram](https://lucid.app/lucidchart/bb029534-250a-46f0-91f3-cf8f36804f6a/edit?invitationId=inv_02a045cf-783b-4e96-b415-5e6533a6cda4) [External]

## Demos
Here are some screenshots of the application in action.
<div align="center">
    <img src="https://github.com/user-attachments/assets/87b10aa2-d573-4883-b824-40572fa8ddc0", alt="">
    <p> 
        OneSearch Home Page
    </p>
    <br>
    <img src="https://github.com/user-attachments/assets/1f9f9066-f654-4ea9-a10b-e5ab57862517", alt="">
    <br>
    <p>
        Demographic Breakdowns
    </p>
</div>


## Visualizations
Here are some quick visualizations made using [Sqliteviz](https://sqliteviz.com/app/#/) using our cleaned data.

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
