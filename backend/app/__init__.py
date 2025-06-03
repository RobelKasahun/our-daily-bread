from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
import os
from flask_jwt_extended import JWTManager

'''
    sets up the connection to your database 
    and prepares you to create models.
'''
db = SQLAlchemy()
    
'''
    enables database migrations, so when you change models, 
    you can update the database schema smoothly.
'''
migrate = Migrate()

def create_app():
    # initialize Flask app
    app = Flask(__name__)

    # load the configuration settings from the Config class
    '''
        load database uri, secret key, and track object modification
    '''
    app.config.from_object(Config)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    jwt = JWTManager(app)
    
    # initialize db
    db.init_app(app)
    # initialize migration
    migrate.init_app(app, db)

    '''
        it allows backend to accept requests from your frontend, 
        even if they are on different domains/ports
        
        Allows your frontend (maybe running on localhost:3000) 
        to talk to this Flask backend (usually on localhost:5000).
    '''
    # allows the front end to talk to the backend
    CORS(app)
    
    with app.app_context():
        from app.models import User, Post, Comment, Like
        # Register the blueprint with the app
        from app.routes.auth_routes import auth_blueprint
        from app.routes.profile_route import profile_blueprint
        
        app.register_blueprint(auth_blueprint, url_prefix='/auth')
        app.register_blueprint(profile_blueprint, url_prefix='/profile')
    
    return app