from flask import jsonify
from app.models import Like
from app import db

def like_post(post, logged_in_user, post_id):
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