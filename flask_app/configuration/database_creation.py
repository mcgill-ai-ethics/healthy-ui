import os
from pymongo import MongoClient

from schemas import antonym_schema
from data import political_antonyms

def get_db_connection():
    port = os.getenv("DATABASE_PORT")
    assert port != None

    client = MongoClient(host=os.getenv("DATABASE_HOST"), port=int(port), authSource=os.getenv("DATABASE_AUTH"))
    db = client.healthy_ui
    collection_name = "antonym_words"

    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name, validator={"$jsonSchema": antonym_schema.get_antonym_schema()})
        collection = db.antonym_words

        political_antonyms_list = political_antonyms.get_political_antonyms()
        for word_object in political_antonyms_list:
            collection.insert_one({"word1": word_object["word1"], "word2": word_object["word2"]})

    return db

