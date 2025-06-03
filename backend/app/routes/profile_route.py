from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({
        'message': f'Welcome {current_user}!',
        'user_data': current_user
    }), 200