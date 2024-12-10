# How To Run the crawler:

## 1. (Opt.) Set up virtual environment

Depending on your OS, you may have to set up a
virtual environment. Here are some common methods:

Linux:
```
$ python -m venv ./.venv
$ source ./.venv/bin/activate
```

Other:  
&emsp;https://docs.python.org/3/library/venv.html

## 2. Install the required packages

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

## 3. Execute the crawler script

To run execute the script, run:
```
$ python3 crawler.py
```
