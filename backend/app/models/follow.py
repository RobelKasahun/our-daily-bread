from app import db
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
from sqlalchemy.sql import func

class Follow(db.Model):
    __tablename__ = 'followers'
    
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now())