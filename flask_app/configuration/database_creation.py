from pymongo import MongoClient
import json

def database_initialization():
    client = MongoClient('HealthyUI_DB', 27017)
    db = client.healthy_ui
    siloing_data = db.siloing_data

# drop table on save/start of program -> remove this when production ready
    db.siloing_data.drop()


# read json schema file and add it as validator
    with open("schemas/siloing_data_schema.json", "r") as file:
        json_validator = json.load(file)

    db.create_collection('siloing_data', validator={'$jsonSchema': json_validator})
