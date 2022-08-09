from PyPDF2 import PdfReader
import sys

reader = PdfReader(sys.argv[1])
number_of_pages = len(reader.pages)
page = reader.pages[0]
text = page.extract_text()
print(text)