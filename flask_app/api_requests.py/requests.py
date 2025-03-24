import requests
import os
import json

from typing import List
from jsonschema import validate, ValidationError

def antonyms_requests(words: List[str]) -> List[str]:
    antonyms = []
    uid = os.getenv('SYNONYMS_UID')
    tokenid = os.getenv('SYNONYM_TOKENID')
    synonyms_base_url = "https://www.stands4.com/services/v2/syno.php"

    with open("../schemas/synonyms_api_schema.json", "r") as file:
        synonyms_json_validator = json.load(file)

    if not uid or not tokenid:
        print("Synonyms UID or TokenID have not found")
        return antonyms

    for word in words:
        params = {
            'word': word,
            'uid': uid,
            'tokenid': tokenid,
            'format': 'json'
        }

        response = requests.get(synonyms_base_url, params=params)
        
        if response.status_code != 200:
            print(f"Unable to fetch data related to word %s", word)
            continue

        try:
            validate(instance=response, schema=synonyms_json_validator)
        except ValidationError as e:
            print(f"Data received is not in the expected format: {e.message}")

        received_antonyms = response.json()["result"]["antonyms"].split(",")
        antonyms.append(received_antonyms[0])

    return antonyms


