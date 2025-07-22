from flask import jsonify, Blueprint, request
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Follow
from app import db

follow_blueprint = Blueprint('followers', __name__)

@follow_blueprint.route('/following/ids', methods=['GET'])
@jwt_required()
def get_following_ids():
    user_id = int(get_jwt_identity())
    
    # Query only followed user IDs
    follow_entries = Follow.query.filter_by(follower_id=user_id).all()
    followed_ids = [follow.followed_id for follow in follow_entries]

    return jsonify({"following_ids": followed_ids}), 200

@follow_blueprint.route('/<int:user_id>', methods=['POST'])
@jwt_required()
def follow(user_id):
    # current logged in user
    logged_in_user = int(get_jwt_identity())
    
    # following himself or herself
    if logged_in_user == user_id:
        return jsonify({"message": "You can't follow yourself"}), 400
    
    # check if user exists
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found.'}), 400
    
    # check if there is a table logged_in_user is following the user_id
    existing_follow = Follow.query.filter_by(follower_id=logged_in_user, followed_id=user_id).first()
    
    if existing_follow:
        return jsonify({"message": "Already following"}), 400
    
    # logged_user is following the user_id
    follow = Follow(follower_id=logged_in_user, followed_id=user_id)
    db.session.add(follow)
    db.session.commit()
    
    return jsonify({"message": "Followed successfully"}), 200