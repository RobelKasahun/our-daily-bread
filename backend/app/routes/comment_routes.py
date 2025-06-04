from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Comment, Post
from app import db

comment_blue_print = Blueprint('comment', __name__)

@comment_blue_print.route('/<int:post_id>', methods=['GET', 'POST'])
@jwt_required()
def comments(post_id):
    # get the current users id
    current_user_id = int(get_jwt_identity())
    # parse data as json
    data = request.get_json()
    
    # get the comment data
    content = data.get('content')
    # comment section is empty
    if not content:
        return jsonify({'message': 'Comment content is required'}), 400
    
    # get the post that belongs to the post_id
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # create an instance of comment 
    comment = Comment(content=content, user_id=current_user_id, post_id=post_id)
    
    # prepare the comment
    db.session.add(comment)
    # store the comment in the database
    db.session.commit()
    
    return jsonify({'message': 'Comment added successfully', 'comment_id': comment.id}), 201