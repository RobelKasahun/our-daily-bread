from app import db
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
from sqlalchemy.sql import func

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    comment_count = db.Column(db.Integer, default=0, nullable=False)
    like_count = db.Column(db.Integer, default=0, nullable=False)
    
    # Foreign Key
    # user who wrote the post
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")
    likes = db.relationship('Like', backref='post', lazy=True, cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint('title', 'content', name='uix_title_content'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title, 
            'content': self.content, 
            'created_at': self.created_at, 
            'updated_at': self.updated_at, 
            'comment_count': self.comment_count, 
            'like_count': self.like_count, 
            'user_id': self.user_id
        }