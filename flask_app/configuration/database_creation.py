import os
from pymongo import MongoClient

from schemas import antonym_schema

def get_db_connection():
    client = MongoClient(os.getenv("DATABASE_URL"))
    db = client.healthy_ui
    collection_name = "antonym_words"

    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name, validator={"$jsonSchema": antonym_schema.get_antonym_schema()})

    return db

