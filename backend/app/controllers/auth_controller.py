from flask import jsonify, redirect
from app import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies

def register_user(data):
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # make sure all the required fields are not empty
    if not all([first_name, last_name, username, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # check username or email    
    existing_email = User.query.filter_by(email=email.lower()).first()
    # existing_username = User.query.filter_by(username=username.lower()).first()
    
    # if existing_email or existing_username:
    if existing_email:
        return jsonify({'error': 'An account with this email already exists. Please try logging in or use a different email.'}), 409
    
    # new user
    user = User(
        first_name=first_name, 
        last_name=last_name, 
        username=username, 
        email=email.lower(),
        password_hash=generate_password_hash(password)
    )
    
    # add the user
    db.session.add(user)
    # save the user to the database
    db.session.commit()
    
    # redirect to the login page
    return jsonify({'message': 'User registered successfully'}), 201


def authenticate_user(user, password):
    # successful login if user with the email and password exists
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # redirect to the landing page
        response = jsonify({'message': 'Login successful', 'access_token': access_token})
        
        set_refresh_cookies(response, refresh_token)
        
        return response, 200
    else:
        # The user with email address does not exist
        # a user associated with the given email does not exist
        if not user:
            return jsonify({'error': 'Oops! That email doesn\'t match our records.'}), 401
        
        # the given password with the password in the database does not match
        if not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Oops! That password doesn\'t match our records.'}), 401