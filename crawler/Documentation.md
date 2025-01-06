# Crawler Documentation

The main crawler script is, in actuality, running several smaller scripts. Each
of these smaller scripts manipulate the data in some form, and save the results
so that the next script can continue where the last left off. This was done so
that, should one fail, the crawler can be restarted without needing to recompute
the previous steps.

Each script file has documentation of how and why it manipulates the data, but here
is a general overview of each script, in order of execution.

- `cralwer.py`: Runs the other scripts
- `./scripts/find_pdf_urls.py`: Finds the list of websites containing data files in the Project Overview document.
- `./scripts/find_data_urls.py`: Finds the list of data file URLs contained on each website.
- `./scripts/download_urls.py`: Downloads each data file from the list of URLs.
- `./scripts/organize_data.py`: Reorganizes the data files and renames them to follow a universal naming convention.
- `./scripts/clean_data.py`: Converts each file to .xlsx, removes formatting, and makes the data structure consistent.
- `./scripts/normalize_data.py`: Converts the data to 3NF (Third Normal Form).
- `./scripts/insert_data.py`: Creates the database and inserts the normalized data into it.