from jsonschema import validate, ValidationError
import jsonschema
from pymongo import MongoClient
import os

def get_synonyms_api_schema():
    return {
    "type": "object",
    "properties": {
        "result": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "term": {
                        "type": "string",
                        "description": "The word or term being queried."
                    },
                    "definition": {
                        "type": ["string", "object"],
                        "description": "The definition of the term."
                    },
                    "partofspeech": {
                        "type": ["string", "object"],
                        "description": "The part of speech for the term (e.g., noun, verb)."
                    },
                    "synonyms": {
                        "type": ["string", "object"],
                        "description": "Comma-separated synonyms for the term."
                    },
                    "antonyms": {
                        "type": "string",
                        "description": "Comma-separated antonyms for the term."
                    }
                },
                "required": ["antonyms"],
                "additionalProperties": True 
            }
        }
    },
    "required": ["result"],
        "additionalProperties": False
}

def get_antonym_schema():
    return {
        "bsonType": "object",
        "properties": {
            "word1": {"bsonType": "string"},  # First word, stored as a string
            "word2": {"bsonType": "string"}   # Second word, stored as a string
        },
        "required": ["word1", "word2"],  # Both fields are mandatory
    }

def get_synonyms_api_value():
    return {'result': [{'term': 'war, warfare', 'definition': 'the waging of armed conflict against an enemy', 'example': '"thousands of people were killed in the war"', 'partofspeech': 'noun', 'synonyms': 'warfare,\
    war, state of war', 'antonyms': 'peace, make peace'}, {'term': 'war, state of war', 'definition': 'a legal state created by a declaration of war and ended by official declaration during which the international ru\
    les of war apply', 'example': '"war was declared in November but actual fighting did not begin until the following spring"', 'partofspeech': 'noun', 'synonyms': 'warfare, war, state of war', 'antonyms': 'peace, m\
    ake peace'}, {'term': 'war, warfare', 'definition': 'an active struggle between competing entities', 'example': '"a price war"; "a war of wits"; "diplomatic warfare"', 'partofspeech': 'noun', 'synonyms': 'warfare\
    , war, state of war', 'antonyms': 'peace, make peace'}, {'term': 'war', 'definition': 'a concerted campaign to end something that is injurious', 'example': '"the war on poverty"; "the war against crime"', 'partof\
    speech': 'verb', 'synonyms': 'warfare, state of war', 'antonyms': 'peace, make peace'}, {'term': 'war', 'definition': 'make or wage war', 'example': {}, 'partofspeech': 'verb', 'synonyms': {}, 'antonyms': 'peace,\
    make peace'}]}

def get_antonym_value():
    return {
        "word1": "war",
        "word2": "peace"
    }
def main():

    try:
        validate(instance=get_synonyms_api_value(), schema=get_synonyms_api_schema())
        print("validated")
    except ValidationError as e:
        print(f"Validation error for synonyms api schema: {e.message}")

    print(get_synonyms_api_value()["result"][0]["antonyms"].split(",")[0])

    try:
        validate(instance=get_antonym_value(), schema=get_antonym_schema())
    except ValidationError as e:
        print(f"Validation error for antonym schema: {e.message}")

    client = MongoClient(os.getenv("DATABASE_URL"))
    db = client.healthy_ui
    collection_name = "antonym_words"

    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name, validator={"$jsonSchema": get_antonym_schema()})
    
    db.antonym_words.insert_one(get_antonym_value())
if __name__ == '__main__':
    main()
