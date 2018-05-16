from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from .config import DevelopmentConfig
from .models import db
from .views import authentication
from .views import profile
from .views import posts

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

app.register_blueprint(authentication.mod)
app.register_blueprint(profile.mod)
app.register_blueprint(posts.mod)

db.init_app(app)
CORS(app)
api = Api(app)

with app.app_context():
    db.create_all()

