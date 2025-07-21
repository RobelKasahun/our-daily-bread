from flask import jsonify, Blueprint, request
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
user_blueprint = Blueprint('users', __name__)

@user_blueprint.route('', methods=['GET'])
@jwt_required()
def get_users():
    '''
        # Get all posts
        posts = Post.query.all()
        list_of_posts = []
        for post in posts:
            current_post = {
                'id': post.id,
                'title': post.title, 
                'content': post.content, 
                'created_at': post.created_at, 
                'updated_at': post.updated_at, 
                'comment_count': post.comment_count, 
                'like_count': post.like_count, 
                'user_id': post.user_id
            }
            
            list_of_posts.append(current_post)
            
        return jsonify(list_of_posts), 200
    '''
    
    if request.method == 'GET':
        users = User.query.all()
        
        list_of_users = []
        for user in users:
            current_user = {
                'id': user.id, 
                'first_name': user.first_name, 
                'last_name': user.last_name, 
                'username': user.username, 
                'email': user.email, 
                'created_at': user.created_at
            }
            
            list_of_users.append(current_user)
        
        return jsonify(list_of_users), 200

@user_blueprint.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'user_not_found_message': 'User Not Found'}), 404
    
    return jsonify({'first_name': user.first_name, 'last_name': user.last_name}), 200
    
    