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

from ..parsers import PostParser
from ..serializers import UserSchema
from ..serializers import UserSchemaWithoutPosts
from ..serializers import FollowingSchema
from ..serializers import FollowersSchema
from ..models import User
from ..models import FollowRelationship
from ..models import db
from ..utils import generate_user_folder
from ..utils import generate_filename
from sqlalchemy.sql import and_

import os

mod = Blueprint('profile', __name__)
api = Api(mod)
auth = HTTPBasicAuth()

user_schema = UserSchema()
follower_schema = FollowersSchema()
following_schema = FollowingSchema()


@auth.verify_password
def verify_password(token_or_username, password):
    user = User.verify_auth_token(token_or_username)
    if not user:
        user = User.query.filter_by(username=token_or_username).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


class ProfileView(Resource):
    @auth.login_required
    def get(self, username):
        if username == g.user.username:
            user = g.user
        else:
            user = User.query.filter(User.username == username).first()

        if not user:
            return {'error': 'No such user'}, 400

        followers_rel = FollowRelationship.query. \
            filter(FollowRelationship.following_id == user.id).all()
        following_rel = FollowRelationship.query. \
            filter(FollowRelationship.follower_id == user.id).all()
        return {'user': user_schema.dump(user),
                'followers': follower_schema.dump(followers_rel, many=True),
                'following': following_schema.dump(following_rel, many=True)}, 200


class BiographyView(Resource):

    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('username', type=str, required=True)
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('email', type=str, required=True)

    @auth.login_required
    def post(self):
        args = self.parser.parse_args()
        username, name, email = args['username'], args['name'], args['email']
        user = g.user
        if User.query.filter(User.id != g.user.id, User.username == username).first():
            return {'error': 'User with such username already exists'}, 400

        if User.query.filter(User.id != g.user.id, User.email == email).first():
            return {'error': 'User with such email already exists'}, 400
        user.username = username
        user.name = name
        user.email = email
        db.session.commit()
        return {'ok': 'ok'}, 200


class PasswordView(Resource):

    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('conf_password', type=str, required=True)

    @auth.login_required
    def post(self):
        args = self.parser.parse_args()
        password, re_password = args['password'], args['conf_password']
        if password != re_password:
            return {'error': 'Passwords are not equal'}, 400
        user = g.user
        user.hash_password(password)
        db.session.commit()
        return {'ok': 'ok'}, 200


class SearchView(Resource):

    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('query', type=str, required=True)

    @auth.login_required
    def post(self):
        args = self.parser.parse_args()
        query = args['query']
        users = User.query.filter(User.name.ilike(query) | User.username.ilike(query))
        return {'response': user_schema.dump(users, many=True)}, 200


class FollowView(Resource):
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('user_id', type=int, required=True)

    @auth.login_required
    def post(self):
        args = self.parser.parse_args()
        user_id = args['user_id']
        print(user_id)
        follow_rel = FollowRelationship.query.filter(
            and_(FollowRelationship.follower_id == g.user.id, FollowRelationship.following_id == user_id)).first()
        if follow_rel:
            db.session.delete(follow_rel)
            db.session.commit()
        else:
            follow_rel = FollowRelationship(follower_id=g.user.id, following_id=user_id)
            db.session.add(follow_rel)
            db.session.commit()

        return {'ok': 'ok'}, 200


class PhotoView(Resource):

    post_parser = PostParser()

    @auth.login_required
    def post(self):
        data = self.post_parser.parse_form(request.form)
        image_blob = data['file']
        image_name = data['filename']
        image_type = data['type']
        image_blob = image_blob[image_blob.index(',') + 1:]
        im = Image.open(BytesIO(base64.b64decode(image_blob)))
        image_name = generate_filename(image_name)
        if not g.user.directory:
            g.user.directory = generate_user_folder(g.user.id, g.user.username)
            db.session.commit()
        im.save(os.environ['BASE_DIR'] + g.user.directory + image_name, image_type)
        g.user.avatar_url = g.user.directory + image_name
        db.session.commit()

        return {'ok': 'ok'}, 201
# Routes
api.add_resource(ProfileView, '/api/profile/<username>')
api.add_resource(BiographyView, '/api/profile/editbio')
api.add_resource(PasswordView, '/api/profile/editpass')
api.add_resource(SearchView, '/api/profile/search')
api.add_resource(FollowView, '/api/profile/follow/')
api.add_resource(PhotoView, '/api/profile/change_photo/')
