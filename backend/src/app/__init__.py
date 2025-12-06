import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from .models.quiz import db


# Load environment variables
load_dotenv()


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    CORS(app, resources={r"/quiz": {"origins": "*"}, r"/quiz/*": {"origins": "*"}})
    
    # Database configuration
    db_user = os.getenv('DB_USER', 'riddler_user')
    db_password = os.getenv('DB_PASSWORD', 'riddler_password')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '3306')
    db_name = os.getenv('DB_NAME', 'riddler_db')
    
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI=f'mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ECHO=True  # Set to False in production
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # Initialize database
    db.init_app(app)
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    # Register blueprints
    from .routes import quiz_bp
    app.register_blueprint(quiz_bp)

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    return app
