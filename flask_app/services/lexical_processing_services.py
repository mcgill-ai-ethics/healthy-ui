from bidict import bidict
from jsonschema import validate, ValidationError

from data import political_antonyms 

def antonym_processing_for_query_string(query: str):
    political_antonyms_bimap: bidict = political_antonyms.get_political_antonyms_bimap() 

