from app import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # relationships
    # user can write many posts
    posts = db.relationship('Post', backref='user', lazy=True)
    
    # user can write many comments
    comments = db.relationship('Comment', backref='user', lazy=True)
    
    # user can like many posts
    likes = db.relationship('Like', backref='user', lazy=True)