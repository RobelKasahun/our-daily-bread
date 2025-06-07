from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post, Like
from app import db

like_blueprint = Blueprint('like', __name__)

@like_blueprint.route('/<int:post_id>', methods=['POST'])
@jwt_required()
def like(post_id):
    # Get the logged in user id
    logged_in_user = int(get_jwt_identity())
    # Get the post
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({"message": "Post not found"}), 404
    
    existing_like = Like.query.filter_by(user_id=logged_in_user, post_id=post_id).first()
    
    if existing_like:
        # User already liked it — so we remove the like (unlike)
        db.session.delete(existing_like)
        if post.like_count > 0:
            post.like_count = post.like_count - 1
            message = "Post unliked"
    else:
        # Add a like
        like = Like(user_id=logged_in_user, post_id=post_id)
        db.session.add(like)
        post.like_count += 1
        message = "Post liked"
    
    db.session.commit()
    return jsonify({"message": message, "like_count": post.like_count}), 200