import nltk
from langdetect import detect
import requests
from bs4 import BeautifulSoup
BOOL_OPERATORS = ['AND', 'OR', 'NOT']

def check_language(text):
    return detect(text)

def convert_bool_ops(query: str):
    for op in BOOL_OPERATORS:
        if query.find(op.lower()) != -1:
            query = query.replace(op.lower(), ' '+op.upper().strip()+' ')
    return query


def expansion_semantica(words: list):
    synonims = []
    bool_flag = False
    print('expansion semantica. . .')
    for word in words:
        url='http://www.wordreference.com/sinonimos/'
        buscar=url+word
        
        if(word.upper() in BOOL_OPERATORS):
            bool_flag = word.upper()
            synonims.append(bool_flag) or synonims.append('(')
            continue
        
        resp=requests.get(buscar)
        bs=BeautifulSoup(resp.text,'lxml')
        lista=bs.find_all(class_='trans clickable')
        
        aux_synonims = []
        for sin in lista:
            sino=sin.find_all('li')
            for fin in sino:
                elem = fin.next_element
                if elem.find('Antónimos') == -1 and elem.strip() != '':
                    aux_synonims.append(elem)
                    aux_synonims = [synonim.replace(',',' ') for synonim in aux_synonims] if len(aux_synonims) > 0 else []
                
        if bool_flag:
            # check if the array is empty to delete the last parenthesis and operator
            if aux_synonims != []:
                synonims += aux_synonims
                synonims.append(')')
            else:
                synonims.pop() and synonims.pop()
            bool_flag = False
            
            
    return synonims