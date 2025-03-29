import os
import requests

from jsonschema import validate, ValidationError

from configuration import database_creation 
from schemas import synonyms_api_schema

def fetch_political_antonyms(query: str) -> str:
    database = database_creation.get_db_connection()
    antonym_collection = database.antonym_words

    print("in fetch_political_antonyms")#test

    query_words = query.split(" ")
    antonym_words = []

    for word in query_words:
        if not word:
            continue

        antonym = antonym_collection.find_one({"word1": {"$regex": f"^{word}$", "$options": "i"}})
        if antonym != None:
            print(f"word: {word} -> found in antonym_words collection")
            antonym_words.append(antonym["word2"])
            continue

        antonym = antonym_collection.find_one({"word2": {"$regex": f"^{word}$", "$options": "i"}})
        if antonym != None:
            print(f"word: {word} -> found in antonym_words collection")
            antonym_words.append(antonym["word1"])
            continue

        synonyms_api_params = {
            "uid": os.getenv("SYNONYMS_UID"),
            "tokenid": os.getenv("SYNONYMS_TOKENID"),
            "word": word,
            "format": "json"
        }
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
        }

        response = requests.get("https://www.stands4.com/services/v2/syno.php", headers=headers, params=synonyms_api_params)

        if response.status_code != 200:
            print(f"Unable to fetch from synonyms api the antonym of {word}")
            continue
        
        print("json: ",response.json())#test
        results = response.json()
        try:
            validate(instance=results, schema=synonyms_api_schema.get_synonyms_api_schema())
        except ValidationError as e:
            print(f"Validation error for synonyms api schema: {e.message}")
            continue

        new_antonym = results["result"][0]["antonyms"]
        if new_antonym == None or not new_antonym:
            print(f"Not antonym for {word}")
            new_antonym_object = {"word1": word, "word2": ""} 
            antonym_words.append(word)
        else:
            new_antonym = new_antonym.split(",")[0]
            new_antonym_object = {"word1": word, "word2": new_antonym}
            antonym_words.append(new_antonym)


        try:
            antonym_collection.insert_one(new_antonym_object)
        except Exception as e:
            print(f"Unable to insert new antonym document into antonym collection: {e}")

    return " ".join(antonym_words)

