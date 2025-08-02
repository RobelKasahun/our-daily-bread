from flask import jsonify, request
from app.models import Post
from app import db

def get_posts():
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
    

def create_post(post_data, current_user):
    title = post_data.get('title').title()
    content = post_data.get('content')
    user_id = int(current_user)
    
    if not all([title, content]):
        if not title:   
            return jsonify({'error': 'Post title is required.'}), 400
            
        if not content:
            return jsonify({'error': 'Post content is required.'}), 400
        
        # check if the post is in db
        if Post.query.filter_by(title=title, content=content).first():
            return jsonify({'error': 'Post with this title and content already exists'}), 409
        
    # create a post with title, content, and user ID who created the post
    post = Post(title=title, content=content, user_id=user_id)
        
    # Add the post to the session
    db.session.add(post)
        
    # Commit the transaction to the database
    db.session.commit()
        
    return jsonify({
        'message': f'Welcome {current_user}!',
        'user_id': current_user, 
        'type': str(type(current_user))
        
        }), 201
    

def update(post, logged_in_user):
    # the post with the given id [ post_id ] is not found
    if not post:
        return jsonify({'result_message': 'Post Not Found'}), 404
    
    # check if the post being ready for update belong to the logged in user
    if post.user_id != logged_in_user:
        return jsonify({'result_message': 'You can only update your own posts.'}), 403
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    
    # check if the post exists in the database before adding the post to the database
    posts = Post.query.all()
    existing_post = False
    for current_post in posts:
        if current_post.title.lower() == title.lower() and current_post.content.lower() == content.lower():
            existing_post = True
            break
        
    
    if existing_post:
        return jsonify({'error': 'Oops! That post already exists. Maybe tweak the title or content?'}), 409
    
    # check for emptyness
    if not all([title, content]):
        return jsonify({'message': 'Post title and contents are required.'}), 400
    
    # non duplicate title and content
    if post.title.lower() != title.lower() or post.content.lower() != content.lower():
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
    else:
        if post.title.lower() == title.lower():
            return jsonify({'message': 'No changes detected in the post title.'})
        
        if post.content.lower() == content.lower():
            return jsonify({'message': 'No changes detected in the post content.'})
        

def delete(post, logged_in_user):
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