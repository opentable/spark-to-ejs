import os
import sys
from rules import if_rule
from bs4 import BeautifulSoup

class Spark_parse:
	directory = None
	soup = None

	def __init__(self):
		if len(sys.argv) > 1:
			self.directory =  sys.argv[1]
			for top, dirs, files in os.walk(self.directory):
			    for name in files:
			        path_file = os.path.join(top, name)
			        self.convert_file_spark_to_ejs(path_file)
		else:
			print "It requieres a directory name as as parameter"

	def convert_file_spark_to_ejs(self,path_file):
		soup = BeautifulSoup(open(path_file))
		new_file = open('*.ejs', 'w+')
		rules = [["if", if_rule]]

		for rule in rules:
			elements = soup.find_all(rule[0])
			for element in elements:
					soup = rule[1](soup,element)
		output =  str(soup.body.contents).strip('[]')
		print output
		new_file.write(output)
		new_file.close()
