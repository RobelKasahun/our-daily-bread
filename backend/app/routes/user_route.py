from flask import jsonify, Blueprint
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

user_blueprint = Blueprint('users', __name__)

@user_blueprint.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'user_not_found_message': 'User Not Found'}), 404
    
    return jsonify({'first_name': user.first_name, 'last_name': user.last_name}), 200
    
    