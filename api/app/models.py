from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature
from itsdangerous import SignatureExpired
from .config import DevelopmentConfig as config
import enum

db = SQLAlchemy()


class GenderType(enum.Enum):
    MALE = 'male'
    FEMALE = 'female'


class NotificationType(enum.Enum):
    FOLLOW = 'follow'
    REQUEST = 'request'
    COMMENT = 'comment'
    LIKE = 'like'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    directory = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)
    name = db.Column(db.String(20))
    sex = db.Column(db.Enum(GenderType))
    avatar_url = db.Column(db.String)
    account_status = db.Column(db.Boolean, default=False)
    authenticated = db.Column(db.Boolean, default=False)
    posts = db.relationship('Post', backref='user', lazy='dynamic', cascade="all, delete-orphan")

    @staticmethod
    def is_active():
        return True

    @staticmethod
    def is_anonymous():
        return False

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.authenticated

    def __str__(self):
        return self.username

    def hash_password(self, password):
        self.password = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)

    def generate_auth_token(self, expiration=3600):
        s = Serializer(config.SECRET_KEY, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(config.SECRET_KEY)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.get(data['id'])
        return user


class FollowRelationship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    following_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    follower = db.relationship('User',
                                backref=db.backref('followrelationship1', uselist=False),
                                primaryjoin='FollowRelationship.follower_id==User.id')
    following = db.relationship('User',
                                backref=db.backref('followrelationship', uselist=False),
                                primaryjoin='FollowRelationship.following_id==User.id')

    def __init__(self, follower_id, following_id):
        self.follower_id = follower_id
        self.following_id = following_id


class FollowRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    following_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, follower_id, following_id):
        self.follower_id = follower_id
        self.following_id = following_id


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    img_url = db.Column(db.String, unique=True, nullable=False)
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade="all, delete-orphan")
    likes = db.relationship('Like', backref='post', lazy='dynamic', cascade="all, delete-orphan")


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',
                           backref=db.backref('comment', uselist=False))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    text = db.Column(db.String, nullable=False)

    def __init__(self, user_id, post_id, text):
        self.user_id = user_id
        self.post_id = post_id
        self.text = text

    def __str__(self):
        return self.text


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',
                           backref=db.backref('like', uselist=False))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id
