import os
from dotenv import load_dotenv

class Config:
    DEBUG = False 
    DATABASE_NAME= os.getenv("HealthyUI_DB")

class ProductionConfig(Config):
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") 
    CLIENT_ID= os.getenv("CLIENT_ID")
    CLIENT_SECRET= os.getenv("CLIENT_SECRET")
    NEWS_API_KEY= os.getenv("NEWS_API_KEY")

    PORT= os.getenv("PORT")
    HOST= os.getenv("HOST")

class DevelopmentConfig(Config):
    load_dotenv()

    DEBUG = True

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") 
    CLIENT_ID= os.getenv("CLIENT_ID")
    CLIENT_SECRET= os.getenv("CLIENT_SECRET")
    NEWS_API_KEY= os.getenv("NEWS_API_KEY")

    PORT= os.getenv("PORT")
    HOST= os.getenv("HOST")


def get_config():
    env = os.getenv("ENV", "PROD")
    
    if env == "PROD":
        return ProductionConfig
    return DevelopmentConfig 
