from flask import jsonify, Blueprint, request
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
user_blueprint = Blueprint('users', __name__)

@user_blueprint.route('', methods=['GET'])
@jwt_required()
def get_users():  
    if request.method == 'GET':
        users = User.query.all()
        
        list_of_users = []
        for user in users:
            current_user = {
                'id': user.id, 
                'first_name': user.first_name, 
                'last_name': user.last_name, 
                'username': user.username, 
                'email': user.email, 
                'created_at': user.created_at
            }
            
            list_of_users.append(current_user)
        
        return jsonify(list_of_users), 200

@user_blueprint.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'user_not_found_message': 'User Not Found'}), 404
    
    return jsonify({'first_name': user.first_name, 'last_name': user.last_name}), 200
    
    