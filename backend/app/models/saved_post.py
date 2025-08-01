from app import db
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
from sqlalchemy.sql import func

class SavedPost(db.Model):
    __tablename__ = 'saved_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete='CASCADE'),
        nullable=False
    )
    
    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id", ondelete='CASCADE'),
        nullable=False
    )
    
    # prevent the same user from saving the same post more than once
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_user_post'),
    )
