from bs4 import BeautifulSoup
def if_rule(soup,element):
	if_structure_start = "<%if(:condition){%> \n"
	if_structure_end = "<% } %>"
	if 'condition' in element.attrs:
		if_structure_start = if_structure_start.replace(":condition",element.attrs['condition'])
		new_element = BeautifulSoup(if_structure_start + str(element.contents).strip('[]') + if_structure_end)
		element.replace_with(new_element)
	return 	soup
