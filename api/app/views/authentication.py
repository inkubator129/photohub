from flask import Blueprint
from flask import g
from flask import session
from flask_restful import Resource
from flask_restful import Api
from flask_restful import reqparse
from flask_httpauth import HTTPBasicAuth
from sqlalchemy import or_

from ..models import db
from ..models import User
from ..serializers import UserSchema
from ..serializers import UserSchemaWithoutPosts

mod = Blueprint('authentication', __name__)
api = Api(mod)
auth = HTTPBasicAuth()

user_schema = UserSchema()
user_schema_without_posts = UserSchemaWithoutPosts()


@auth.verify_password
def verify_password(token_or_username, password):
    user = User.verify_auth_token(token_or_username)
    if not user:
        user = User.query.filter_by(username=token_or_username).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


class SignUpView(Resource):

    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('username', type=str, required=True)
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('email', type=str, required=True)

    def post(self):
        args = self.parser.parse_args()
        if User.query.filter(or_(User.username == args['username'],
                                 User.email == args['email'])).first() is not None:
            return {'error': 'Such user already exists'}, 400
        user = User(username=args['username'],
                    email=args['email'],
                    name=args['name'])
        user.hash_password(args['password'])
        db.session.add(user)
        db.session.commit()
        token = user.generate_auth_token()
        return {'user': user_schema.dump(user),
                'token': token.decode('ascii')}, 200


class SignInView(Resource):

    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('username', type=str, required=True)
    parser.add_argument('password', type=str, required=True)

    def post(self):
        args = self.parser.parse_args()
        username, password = args['username'], args['password']
        if verify_password(username, password):
            token = g.user.generate_auth_token()
            return {'user': user_schema_without_posts.dump(g.user),
                    'token': token.decode('ascii')}, 200
        return {'error': 'Username or password is incorrect'}, 400


class SignOutView(Resource):

    @auth.login_required
    def get(self):
        return {'user': 'logged out'}, 200




# Routes
api.add_resource(SignUpView, '/api/authentication/signup')
api.add_resource(SignInView, '/api/authentication/signin')
api.add_resource(SignOutView, '/api/authentication/signout')