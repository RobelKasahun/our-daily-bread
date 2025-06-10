from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post
from app.controllers.like_controller import like_post

like_blueprint = Blueprint('like', __name__)

@like_blueprint.route('/<int:post_id>', methods=['POST'])
@jwt_required()
def like(post_id):
    # Get the logged in user id
    logged_in_user = int(get_jwt_identity())
    # Get the post
    post = Post.query.get(post_id)
    
    return like_post(post, logged_in_user, post_id)