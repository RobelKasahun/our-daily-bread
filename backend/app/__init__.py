from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config


def create_app():
    # initialize Flask app
    app = Flask(__name__)

    # load the configuration settings from the Config class
    '''
        load database uri, secret key, and track object modification
    '''
    app.config.from_object(Config)

    '''
        sets up the connection to your database 
        and prepares you to create models.
    '''
    database = SQLAlchemy(app)

    '''
        enables database migrations, so when you change models, 
        you can update the database schema smoothly.
    '''
    migrate = Migrate(app, database)

    '''
        it allows backend to accept requests from your frontend, 
        even if they are on different domains/ports
        
        Allows your frontend (maybe running on localhost:3000) 
        to talk to this Flask backend (usually on localhost:5000).
    '''
    # allows the front end to talk to the backend
    CORS(app)
    
    return app