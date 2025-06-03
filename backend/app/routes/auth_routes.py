from app import db
from flask import request, Blueprint, jsonify
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

# create Flask Blueprint named auth
auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    # get json data from react
    data = request.get_json()
    
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
    if User.query.filter((User.username == username) | (User.email == email)).first():      # first() --> get the first matching
        return jsonify({'error': 'Username or email already taken'}), 409
    
    # new user
    user = User(
        first_name=first_name, 
        last_name=last_name, 
        username=username, 
        email=email,
        password_hash=generate_password_hash(password)
    )
    
    # add the user
    db.session.add(user)
    # save the user to the database
    db.session.commit()
    
    # redirect to the login page
    return jsonify({'message': 'User registered successfully'}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    # get the data
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # filter by email
    user = User.query.filter_by(email=email).first()
    
    # successful login if user with the email and password exists
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        
        # redirect to the landing page
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        # The user with email address does not exist
        return jsonify({'error': 'Invalid credentials'}), 401
    