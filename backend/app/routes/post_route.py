from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.post_controller import get_posts, create_post, update, delete
from app.models import Post
from app import db

post_blueprint = Blueprint('posts', __name__)

@post_blueprint.route('/', methods=['GET', 'POST'])
@jwt_required()
def posts():
    ''' Get all posts '''
    current_user = get_jwt_identity()
    
    if request.method == 'GET':
        # get all posts
        return get_posts()
    
    elif request.method == 'POST':
        # Create a new post
        # get the title and content
        post_data = request.get_json()
        
        return create_post(post_data, current_user)
    else:
        return jsonify({'message': ''})
    
    
# read post by id
@post_blueprint.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'result_message': 'Post Not Found'}), 404
    
    return jsonify({
        'id': post.id,
        'title': post.title, 
        'content': post.content, 
        'created_at': post.created_at, 
        'updated_at': post.updated_at, 
        'comment_count': post.comment_count, 
        'like_count': post.like_count, 
        'user_id': post.user_id
    }), 200
    
    
# update a post
@post_blueprint.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    # prepare the post using post_id
    post = Post.query.get(post_id)
    # get an id of the current logged in user
    logged_in_user = int(get_jwt_identity())
    
    # update a post
    return update(post, logged_in_user)
    
    
# delete a post 
@post_blueprint.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    # get post using post_id
    post = Post.query.get(post_id)
    # get the logged in user id
    logged_in_user = int(get_jwt_identity())
    
    # delete a post
    return delete(post, logged_in_user)