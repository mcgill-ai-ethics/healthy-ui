def get_antonym_schema():
    return {
        "bsonType": "object",
        "properties": {
            "word1": {"bsonType": "string"},  # First word, stored as a string
            "word2": {"bsonType": "string"}   # Second word, stored as a string
        },
        "required": ["word1", "word2"],  # Both fields are mandatory
    }

