import os


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    # SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_DATABASE_URI = "postgresql:///photohub_dev"
    SECRET_KEY = 'Hello kitty I wanna see your heart123'
    BASE_DIR = "/home/drowerik3/PycharmProjects/PhotoHub/front/static/user/"


class ProductionConfing(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BUNDLE_ERRORS = True
    CORS_HEADERS = 'Content-Type'