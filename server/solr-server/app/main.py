from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pysolr
import requests
from tempfile import NamedTemporaryFile
from app.utils import expansion_semantica, check_language, convert_bool_ops

app = FastAPI()
solr = pysolr.Solr('http://localhost:8983/solr/solrhelp', always_commit=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_server_status():
    try:
        ping = solr.ping()
        status_index = ping.rfind('status')
        server_ok = ping[243:-1].index('"OK"') and True
    except:
        server_ok = False
    return server_ok

@app.get("/")
def index():
    server_ok = 'OK' if get_server_status() else 'Not OK'
    return {"message": f"Solr status is: {server_ok}"}

@app.get('/post_example_documents')
def post_documents():
    solr.add([
        {'id': '1', 'title': 'A test document'},
    ])
    
    return {"message": "Document added"}

@app.get('/extract_html')
def extract_html(url: str = None):
    url = url
    if url is None:
        return {"message": "No url provided"}
    try:
        session = requests.Session()
        request = requests.Request('GET', url).prepare()
        r = session.send(request, stream=True)
        with NamedTemporaryFile() as f:
            r = session.send(request, stream=True)
            r.raise_for_status()
            
            f.write(b'<meta property="url" content="' + url.encode() + b'"/>')
            
            for chunk in r.iter_content(chunk_size=1024):
                f.write(chunk)
            
            f.flush()
            f.seek(0)
            data = solr.extract(f, extractOnly=False,extractFormat='text/html')
            solr.commit()
        return data
    except:
        raise HTTPException(status_code=400, detail='Error extracting html')
    
@app.get('/delete_all_documents')
def delete_documents():
    solr.delete(q='*:*')
    return {"message": "Documents deleted"}

@app.get('/search')
def search(facet= None,query = '*:*'):
    
    list_query = query.split(' ')
    query = query.lower()
    query = convert_bool_ops(query)
    aux = ' '.join(expansion_semantica(list_query))
    query = query.strip()
    query += ' ' + aux
    query = query.strip()
    options = {'fl': '*,score', 'hl': 'true', 'hl.fl': 'description', 'hl.simple.pre': '<strong>', 'hl.simple.post': '</strong>'}
    
    print(query)
    if facet:
        options['facet'] = 'true'
        options['facet.field'] = facet
        results = solr.search(query, **options)
        dict_facets = []
        
        for i in range(0,len(results.facets["facet_fields"].get(facet,[])),2):
            if results.facets["facet_fields"].get(facet,[])[i+1] != 0:
                name = results.facets["facet_fields"].get(facet,[])[i]
                count = results.facets["facet_fields"].get(facet,[])[i+1]
                dict_facets.append({'name': name, 'count': count})
        
        filtered_res = {'facets': dict_facets, 'docs': results.docs, 'highlighting': results.highlighting}
        return filtered_res
    
    results = solr.search(query, **options)
    if not results.docs:
        raise HTTPException(status_code=404, detail="No results found")
    response = {'docs': results.docs, 'highlighting': results.highlighting}
    return response


@app.get('/suggest')
def suggest(query = ''):
    query = query.lower()
    
    results = solr.suggest_terms('keywords',prefix=query)
    return results

@app.get('/spellcheck')
def spellcheck(query =''):

    res = requests.get('http://localhost:8983/solr/solrhelp/spell', params={'q': query})
    spellcheck_corrects = res.json()['spellcheck']
    del spellcheck_corrects['collations']
    if(len(spellcheck_corrects['suggestions']) == 0):
        return {'word': query, 'message': 'No hay sugerencias'}
    
    return spellcheck_corrects


@app.get('/test_search')
def search(facet= None,query = '*:*'):
    
    return {'message': 'Tell me why. . . '}