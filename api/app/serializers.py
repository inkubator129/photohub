from marshmallow import Schema
from marshmallow import fields


class CommentsSchema(Schema):
    id = fields.Int(dump_only=True)
    date = fields.DateTime(dump_only=True)
    user_id = fields.Int(dump_only=True)
    user = fields.Nested('UserSchema', exclude=('posts',))
    text = fields.Str()


class LikesSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    # user = fields.Nested(UserSchema)


class PostsSchema(Schema):
    id = fields.Int()
    width = fields.Int()
    height = fields.Int()
    date = fields.DateTime(dump_only=True)
    img_url = fields.Str()
    comments = fields.Nested(CommentsSchema, many=True)
    likes = fields.Nested(LikesSchema, many=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Str()
    name = fields.Str()
    sex = fields.Str()
    avatar_url = fields.Str()
    posts = fields.Nested(PostsSchema, many=True, exclude=('user_id',))

    following = fields.Nested('UserSchema', many=True, exclude=('posts', 'followers', 'following'))


class UserSchemaWithoutPosts(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Str()
    name = fields.Str()
    sex = fields.Str()
    avatar_url = fields.Str()


class FollowersSchema(Schema):
    follower = fields.Nested('UserSchema', exclude=('posts',))


class FollowingSchema(Schema):
    following = fields.Nested('UserSchema', exclude=('posts',))

