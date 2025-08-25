from app import db
from flask import jsonify, request, Blueprint
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies

# create Flask Blueprint named auth
reset_password_blueprint = Blueprint('reset_password', __name__)

@reset_password_blueprint.route('/reset-password', methods=['POST'])
def reset_password():
    # get email data from user
    data = request.get_json()
    email = data.get('email')
    print(f'email: {email}')
    
    # Get a user with the given or specified email
    user = User.query.filter_by(email=email.lower()).first()
    
    # user with the given email does not exist
    if not user:
        return jsonify({'message': f'A user with the given email address [ {email} ] does not exist.'})
    
    print(f'user: {user}')
    
    return jsonify({'message': f'Success!!! there is a user asscociated with [ {email} ].'})