from app import db
from flask import jsonify, request, Blueprint, current_app, url_for
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies
from itsdangerous import URLSafeTimedSerializer
import app
from flask_mail import Message
from app import mail

# create Flask Blueprint named reset_password
reset_password_blueprint = Blueprint('reset_password', __name__)

@reset_password_blueprint.route('/reset/<token>', methods=['GET', 'POST'])
def reset_with_token(token):
    # extract the original email using the given token
    email = verify_reset_token(token)
    
    if not email:
        return jsonify({"message": "Invalid or expired token."}), 400

    # change password
    if request.method == 'POST':
        data = request.get_json()
        new_password = data.get('password')
        user = User.query.filter_by(email=email).first()
        user.set_password(new_password) 
        db.session.commit()
        return jsonify({"message": "Password successfully updated."}), 200

    return jsonify({"message": "Token valid. Render password reset form."})


@reset_password_blueprint.route('/reset-password', methods=['POST'])
def reset_password():
    # get email data from user
    data = request.get_json()
    email = data.get('email')
    
    # Get a user with the given or specified email
    user = User.query.filter_by(email=email.lower()).first()
    
    # user with the given email does not exist
    if not user:
        return jsonify({'message': f'A user with the given email address [ {email} ] does not exist.'}), 404
    
    # Generate reset token
    token = generate_reset_token(user.email)
    # Create reset link
    frontend_reset_url = f"https://holy-share-app.vercel.app/reset_password/reset/{token}"
    
    # Send email
    msg = Message(
        subject="Password Reset Request",
        recipients=[user.email],
        body=f"Click the link to reset your password: {frontend_reset_url}"
    )
    
    try:
        with current_app.app_context():
            mail.send(msg)
    except Exception as e:
        print(f"Mail sending failed: {e}")
        return jsonify({"message": "Failed to send email. Contact support."}), 500
    
    return jsonify({"message": f'A password reset link has been sent to {user.email}.'}), 200

def generate_reset_token(email):
    ''' 
        Creates a secure, time-sensitive token that encodes a user’s email 
        creates a reset link token that will later be emailed to the user
    '''
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=3600):
    ''' Validates and decodes the token back into the user’s email '''
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=expiration)
    except Exception:
        return None
    return email