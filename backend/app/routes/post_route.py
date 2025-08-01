from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.post_controller import get_posts, create_post, update, delete
from app.models import Post
from app.models import SavedPost
from app import db

post_blueprint = Blueprint('posts', __name__)

@post_blueprint.route('/save/<int:post_id>', methods=['POST'])
@jwt_required()
def save_post(post_id):
    # logged in user
    current_user_id = int(get_jwt_identity())
    
    # get post
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found.'}), 404
    
    # get the first post found from the database
    existing_post = SavedPost.query.filter_by(user_id=current_user_id, post_id=post_id).first()
    if existing_post:
        return jsonify({'message': 'Post has been saved already.'}), 200
    
    saved_post = SavedPost(user_id=current_user_id, post_id=post_id)
    # add saved post to database
    db.session.add(saved_post)
    # save the change
    db.session.commit()
    
    return jsonify({'message': 'Post has been saved successfully'}), 200

@post_blueprint.route('/saved', methods=['GET'])
@jwt_required()
def saved_posts():
    current_logged_user = int(get_jwt_identity())
    # get all saved posts
    saved_posts = SavedPost.query.filter_by(user_id=current_logged_user).all()
    # store all the saved posts ids
    saved_posts_ids = [ids.post_id for ids in saved_posts]
    
    # get all the saved post using their ids
    saved_posts = []
    for post_id in saved_posts_ids:
        saved_posts.append(get_post(post_id)[0].get_json())
        
    return jsonify(saved_posts), 200
    

@post_blueprint.route('', methods=['GET', 'POST'])
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
    
# Get all posts that are associated to the given user id
@post_blueprint.route('/all/<int:user_id>', methods=['GET'])
@jwt_required()
def get_all_posts(user_id):
    # current_logged_in_user = int(get_jwt_identity())
    
    posts = Post.query.filter_by(user_id=user_id).all()
    
    list_of_posts = []
    for post in posts:
        list_of_posts.append(get_post(post.id)[0].get_json())
    
    return jsonify(list_of_posts), 200
    
    
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
    # get the logged in user id
    logged_in_user = int(get_jwt_identity())
    
    # get post using post_id
    post = Post.query.get(post_id)
    
    # delete a post
    return delete(post, logged_in_user)