import sys
from app import db
from flask import jsonify, request, Blueprint
from app.models import User
from app.controllers.auth_controller import register_user, authenticate_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies

# create Flask Blueprint named auth
auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    # get form data
    data = request.get_json()
    
    return register_user(data=data)

@auth_blueprint.route('/signin', methods=['POST'])
def login():
    # get form data
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # filter the user by email
    user = User.query.filter_by(email=email.lower()).first()
    
    return authenticate_user(user=user, password=password)

@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=str(identity))
    response = jsonify(access_token=new_access_token)
    set_access_cookies(response, new_access_token)  # ✅ Set cookie again!
    return response, 200
    