import fitz
import re
import json

doc = fitz.open('banco/2.pdf')
text = ""
for page in doc:
    text += page.get_text()

with open('banco/2_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)
