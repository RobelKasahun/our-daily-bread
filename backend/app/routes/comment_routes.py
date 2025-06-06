from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Comment, Post
from app import db

comment_blue_print = Blueprint('comment', __name__)

@comment_blue_print.route('/<int:post_id>', methods=['GET', 'POST'])
@jwt_required()
def comments(post_id):
    if request.method == 'GET':
        # Get comments that belong to the post_id
        comments = Comment.query.filter_by(post_id=post_id).all()
        list_of_comments = []
        for comment in comments:
            current_comment = {
                'id': comment.id, 
                'content': comment.content, 
                'created_at': comment.created_at, 
                'updated_at': comment.updated_at, 
                'user_id': comment.user_id, 
                'post_id': comment.post_id
            }
            list_of_comments.append(current_comment)
        return jsonify(list_of_comments)
    
    elif request.method == 'POST':
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
    
# update a comment
@comment_blue_print.route('/<int:comment_id>/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id, post_id):
    # get the comment
    comment = Comment.query.filter_by(id=comment_id, post_id=post_id).first()
    logged_in_user = int(get_jwt_identity())
    
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    
    if comment.user_id != logged_in_user:
        return jsonify({'result_message': 'You can only update your own comment.'}), 403
    
    # # get the new data
    data = request.get_json()
    new_content = data.get('content')
    
    # # if the new content is empty
    if not new_content:
        return jsonify({"error": "No content provided"}), 400
    
    # # update the comment
    if comment.content.lower() == new_content.lower():
        return jsonify({"message": "No changes made"})
    
    comment.content = new_content
    
    # # save and apply the update
    db.session.commit()
    
    return jsonify(
        {
            "message": "Comment updated successfully",
            'id': comment.id, 
            'content': comment.content, 
            'created_at': comment.created_at, 
            'updated_at': comment.updated_at, 
            'user_id': comment.user_id, 
            'post_id': comment.post_id
        }
    )
        
# delete a comment
@comment_blue_print.route('/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    pass
    