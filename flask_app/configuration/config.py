import os
from dotenv import load_dotenv

class Config:
    DATABASE_NAME=os.getenv("DATABASE_NAME")

    GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY") 
    CLIENT_ID=os.getenv("CLIENT_ID")
    CLIENT_SECRET=os.getenv("CLIENT_SECRET")
    NEWS_API_KEY=os.getenv("NEWS_API_KEY")

    PORT=os.getenv("PORT")
    HOST=os.getenv("HOST")

class ProductionConfig(Config):
    DEBUG=False 

class DevelopmentConfig(Config):
    DEBUG=True 


def get_config():
    env_load_result = os.getenv("ENV") 

    if env_load_result == "DEV":
        return DevelopmentConfig
    return ProductionConfig

    
