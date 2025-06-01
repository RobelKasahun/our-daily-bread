import os
from dotenv import load_dotenv

loaded = load_dotenv()

class Config:
    # Get the DATABASE_URL from .env
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

    # stop tracking every changes in objects
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Get the SECRET_KEY from .env
    SECRET_KEY = os.getenv('SECRET_KEY')