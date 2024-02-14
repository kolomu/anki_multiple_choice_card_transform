# Anki Card Transform

Script for generating multiple choice anki cards given a specific template and using the anki addon: [Multiple Choice for Anki](https://ankiweb.net/shared/info/1566095810)


Given the string:
```
<< QUESTION >>
What is the best way to start in the day?
A. Having a great breakfast
B. Getting a coffee
C. Doing 50 Push-Ups
D. Getting some sunlight early in the day 
~~ ANSWER ~~ D
```

The script will create the anki card which can be imported
Result:
```
#separator:tab
#html:false
#tags column:12
Morning Quiz	What is the best way to start in the day?	2	Having a great breakfast 	Getting a coffee 	Doing 50 Push-Ups 	Getting some sunlight early in the day		0 0 0 1			
```

> The file to be imported will be written in the data folder (anki_cards.txt). 

- Also change the `title` constant to your needs.