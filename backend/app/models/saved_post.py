from app import db
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
from sqlalchemy.sql import func

class SavedPost(db.Model):
    __tablename__ = 'saved_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)