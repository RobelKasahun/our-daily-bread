from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Comment
from app.controllers.comment_controller import get_comments, create_comment, update, delete

comment_blue_print = Blueprint('comment', __name__)

@comment_blue_print.route('/<int:post_id>', methods=['GET', 'POST'])
@jwt_required()
def comments(post_id):
    if request.method == 'GET':
        # Get comments that belong to the post_id
        comments = Comment.query.filter_by(post_id=post_id).all()
        
        # get comments associated with the post_id
        return get_comments(comments)
    
    elif request.method == 'POST':
        # get the current users id
        current_user_id = int(get_jwt_identity())
        # parse data as json
        data = request.get_json()
        
        # get the comment data
        content = data.get('content')
        
        # create comment
        return create_comment(content, post_id, current_user_id)


# update a comment
@comment_blue_print.route('/<int:comment_id>/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id, post_id):
    # get the comment
    comment = Comment.query.filter_by(id=comment_id, post_id=post_id).first()
    logged_in_user = int(get_jwt_identity())
    
    # update a comment 
    return update(comment, logged_in_user)


# delete a comment
@comment_blue_print.route('/<int:comment_id>/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id, post_id):
    
    # filter the comment using the given id
    comment = Comment.query.filter_by(id=comment_id, post_id=post_id).first()
    
    # get the current logged in user
    logged_in_user = int(get_jwt_identity())
    
    # delete the comment
    return delete(comment, logged_in_user, post_id)