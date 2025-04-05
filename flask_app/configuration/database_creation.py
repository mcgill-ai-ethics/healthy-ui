import os
from pymongo import MongoClient

from schemas import antonym_schema
#from data import political_antonyms

def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    client = MongoClient()

    try:
        client = MongoClient(database_url)
    except Exception as e:
        print(f"Unable to connect to remote database: {e}")

    db = client.healthy_ui
    collection_name = "antonym_words"

    if collection_name not in db.list_collection_names():
        print("new antonym colelction with using schema created")
        db.create_collection(collection_name, validator={"$jsonSchema": antonym_schema.get_antonym_schema()})

    return db

