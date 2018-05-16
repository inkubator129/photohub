from flask import Blueprint
from flask import g
from flask import request
from flask_restful import Resource
from flask_restful import Api
from flask_restful import reqparse
from flask_httpauth import HTTPBasicAuth
import base64
from PIL import Image
from io import BytesIO
from ..models import User
from ..parsers import PostParser
from ..parsers import CommentParser
from ..utils import generate_user_folder
from ..utils import generate_filename
from ..models import db
from ..models import Post
from ..models import Comment
from ..models import FollowRelationship
from ..models import Like
import os
from ..serializers import UserSchema

user_schema = UserSchema()
mod = Blueprint('posts', __name__)
api = Api(mod)
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(token_or_username, password):
    user = User.verify_auth_token(token_or_username)
    if not user:
        user = User.query.filter_by(username=token_or_username).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


class PostView(Resource):

    post_parser = PostParser()

    @auth.login_required
    def post(self):
        data = self.post_parser.parse_form(request.form)
        image_blob = data['file']
        image_name = data['filename']
        image_type = data['type']
        image_width = data['width']
        image_height = data['height']
        image_blob = image_blob[image_blob.index(',') + 1:]
        im = Image.open(BytesIO(base64.b64decode(image_blob)))
        image_name = generate_filename(image_name)
        if not g.user.directory:
            g.user.directory = generate_user_folder(g.user.id, g.user.username)
            db.session.commit()
        im.save(os.environ['BASE_DIR'] + g.user.directory + image_name,  image_type)
        post = Post(img_url=g.user.directory + image_name, user_id=g.user.id, width=image_width, height=image_height)
        db.session.add(post)
        db.session.commit()

        return {'ok': 'ok'}, 201


class DashboardView(Resource):

    @auth.login_required
    def get(self):
        relationship = FollowRelationship.query.\
            filter(FollowRelationship.follower_id == g.user.id).all()
        following = []
        for rel in relationship:
            following.append(rel.following)
        print(following)
        return {'following': user_schema.dump(following, many=True)}, 200


class CommentView(Resource):

    comment_parser = CommentParser()

    @auth.login_required
    def post(self):
        data = self.comment_parser.parse_form(request.form)
        post_id = data['post_id']
        text = data['comment']
        comment = Comment(post_id=post_id, user_id=g.user.id, text=text)
        db.session.add(comment)
        db.session.commit()
        return {'ok': 'ok'}, 201

    @auth.login_required
    def delete(self, id):
        comment = Comment.query.get(id)
        if comment and comment.user_id == g.user.id:
            db.session.delete(comment)
            db.session.commit()
            return {'ok': 'ok'}, 200
        return {'error': 'not found'}, 404


class LikeView(Resource):

    @auth.login_required
    def post(self):
        post_id = request.form['post_id']
        like = Like.query.filter_by(post_id=post_id, user_id=g.user.id).first()
        if like:
            db.session.delete(like)
            db.session.commit()
            return {'ok': 'ok'}, 200

        like = Like(post_id=post_id, user_id=g.user.id)
        db.session.add(like)
        db.session.commit()
        return {'ok': 'ok'}, 201


class DeletePostView(Resource):

    @auth.login_required
    def delete(self, id):
        post = Post.query.get(id)
        if post and post.user_id == g.user.id:
            db.session.delete(post)
            db.session.commit()
            return {'ok': 'ok'}, 200
        return {'error': 'not found'}, 404
# Routes
api.add_resource(PostView, '/api/posts/')
api.add_resource(DashboardView, '/api/dashboard/')
api.add_resource(CommentView, '/api/posts/comment', '/api/posts/comment/<id>')
api.add_resource(LikeView, '/api/posts/like')
api.add_resource(DeletePostView, '/api/posts/post/<id>')
