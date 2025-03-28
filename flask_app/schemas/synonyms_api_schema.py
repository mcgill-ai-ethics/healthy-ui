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
