from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post, Like
from app.controllers.like_controller import like_post
like_blueprint = Blueprint('likes', __name__)

@like_blueprint.route('/<int:post_id>', methods=['POST'])
@jwt_required()
def like(post_id):
    # Get the logged in user id
    logged_in_user = int(get_jwt_identity())
    # Get the post
    post = Post.query.get(post_id)
    
    return like_post(post, logged_in_user, post_id)

@like_blueprint.route('/<int:post_id>/liking_ids', methods=['GET'])
@jwt_required()
def liking_ids(post_id):
    likes = Like.query.filter_by(post_id=post_id).all()
    user_ids = [like.user_id for like in likes]
    
    for user_id in user_ids:
        print(user_id)
    
    return jsonify(user_ids), 200