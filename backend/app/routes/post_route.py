from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post
from app import db

post_blueprint = Blueprint('posts', __name__)

@post_blueprint.route('/', methods=['GET', 'POST'])
@jwt_required()
def posts():
    ''' Get all posts '''
    current_user = get_jwt_identity()
    
    if request.method == 'GET':
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
    else:
        # Create a new post
        # get the title and content
        post_data = request.get_json()
        
        title = post_data.get('title')
        content = post_data.get('content')
        user_id = int(current_user)
        
        # check if the post is in db
        if Post.query.filter_by(title=title, content=content).first():
            return jsonify({'error': 'Post with this title and content already exists'}), 409
        
        # post object
        post = Post(title=title, content=content, user_id=user_id)
        
        # add post
        db.session.add(post)
        # save post in the database
        db.session.commit()
        
    return jsonify({
        'message': f'Welcome {current_user}!',
        'user_data': current_user, 
        'type': str(type(current_user))
    }), 200
    
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
    
    

# delete a post 
@post_blueprint.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    # get post using post_id
    post = Post.query.get(post_id)
    # get the logged in user id
    logged_in_user = int(get_jwt_identity())
    
    # there is not such post with an id of post_id
    if not post:
        return jsonify({'result_message': 'Post Not Found'}), 404
    
    # attempting to delete a post that does not belong to the current logged in user
    if post.user_id != logged_in_user:
        return jsonify({'result_message': 'You can only delete your own posts.'}), 403
    
    # Post found and is ready to be deleted
    # and the logged in user is allowed to delete this post
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({'message': 'Post deleted successfully'}), 200

# update a post
@post_blueprint.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    # prepare the post using post_id
    post = Post.query.get(post_id)
    # get an id of the current logged in user
    logged_in_user = int(get_jwt_identity())
    
    # the post with the given id [ post_id ] is not found
    if not post:
        return jsonify({'result_message': 'Post Not Found'}), 404
    
    # check if the post being ready for update belong to the logged in user
    if post.user_id != logged_in_user:
        return jsonify({'result_message': 'You can only update your own posts.'}), 403
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    
    # update the title
    if title:
        post.title = title
    
    # update the content
    if content:
        post.content = content
        
    db.session.commit()
    
    return jsonify({'message': 'Post updated successfully', 'post': {
        'id': post.id,
        'title': post.title, 
        'content': post.content, 
        'created_at': post.created_at, 
        'updated_at': post.updated_at, 
        'comment_count': post.comment_count, 
        'like_count': post.like_count, 
        'user_id': post.user_id
    }}), 200