from app import db
from flask import request, Blueprint, jsonify
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.controllers.auth_controller import register_user, authenticate_user

# create Flask Blueprint named auth
auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    # get form data
    data = request.get_json()
    
    return register_user(data=data)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    # get form data
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # filter the user by email
    user = User.query.filter_by(email=email.lower()).first()
    
    return authenticate_user(user=user, password=password)
    