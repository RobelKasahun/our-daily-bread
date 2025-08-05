from flask import request, jsonify
from app.models import Comment, Post
from app import db

def get_comments(comments):
    if not comments:
        return jsonify({'message': "Empty comments or not found."})
    
    list_of_comments = []
    for comment in comments:
        current_comment = {
            'id': comment.id, 
            'content': comment.content, 
            'created_at': comment.created_at.isoformat() if comment.created_at else None, 
            'updated_at': comment.updated_at.isoformat() if comment.updated_at else None, 
            'user_id': comment.user_id, 
            'post_id': comment.post_id
            }
        list_of_comments.append(current_comment)
    
    return jsonify(list_of_comments), 200


def create_comment(content, post_id, current_user_id):
    # comment section is empty
        if not content:
            return jsonify({'message': 'Comment content is required'}), 400
        
        # get the post that belongs to the post_id
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        
        existing_comment = Comment.query.filter_by(user_id=current_user_id, post_id=post_id, content=content).first()
        if existing_comment:
            return jsonify({"message": "Duplicate comment not allowed."}), 400
        
        # create an instance of comment 
        comment = Comment(content=content, user_id=current_user_id, post_id=post_id)
        post.comment_count += 1
        
        # prepare the comment
        db.session.add(comment)
        # store the comment in the database
        db.session.commit()
        
        return jsonify({
        'id': comment.id,
        'content': comment.content,
        'created_at': comment.created_at,
        'updated_at': comment.updated_at,
        'user_id': comment.user_id,
        'post_id': comment.post_id
    }), 201
    
    

def update(comment, logged_in_user):
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    
    if comment.user_id != logged_in_user:
        return jsonify({'result_message': 'You can only update your own comment.'}), 403
    
    # get the new data
    data = request.get_json()
    new_content = data.get('content')
    
    # if the new content is empty
    if not new_content:
        return jsonify({"error": "No content provided"}), 400
    
    # update the comment
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
    


def delete(comment, logged_in_user, post_id):
    # get the post that belongs to the post_id
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # comment associated with the given id is not dound
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    
    # comment can only be deleted by the user_id which must be equal to 
    # the logged in user in order to delete the comment
    if comment.user_id != logged_in_user:
        return jsonify({"message": "Unauthorized to delete this comment"}), 403
    
    post.comment_count -= 1
    
    # delete the comment
    db.session.delete(comment)
    # save the change
    db.session.commit()
    
    
    return jsonify({"message": "Comment deleted successfully"}), 200