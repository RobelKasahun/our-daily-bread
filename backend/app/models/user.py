from app import db
from datetime import datetime, timezone
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now())
    
    # relationships
    # user can write many posts
    posts = db.relationship('Post', backref='user', lazy=True, cascade='all, delete-orphan')
    
    # user can write many comments
    comments = db.relationship('Comment', backref='user', lazy=True, cascade='all, delete-orphan')
    
    # user can like many posts
    likes = db.relationship('Like', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at
        }
        
    def set_password(self, password):
         """Hash the password and store it in password_hash"""
         self.password_hash = generate_password_hash(password=password)
        
    def check_password(self, password):
        """Verify a plaintext password against the stored hash"""
        return check_password_hash(self.password_hash, password)
    
    # List of authors the user following 
    following = db.relationship(
        'Follow',
        foreign_keys='Follow.follower_id',
        backref='follower',
        lazy='dynamic'
    )
    
    # List of authors the user followed by
    followers = db.relationship(
        'Follow',
        foreign_keys='Follow.followed_id',
        backref='followed',
        lazy='dynamic'
    )