from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.routes.auth_routes import auth_routes
from app.routes.question_routes import question_routes
from app.routes.game_routes import game_routes
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

app.config.from_pyfile('config.py')
mongo = PyMongo(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'rxchit.01@gmail.com'








app.config['MAIL_PASSWORD'] = 'djxy bapc ewxl mjww'

mail = Mail(app)

app.register_blueprint(auth_routes)
app.register_blueprint(question_routes)
app.register_blueprint(game_routes)


if __name__ == '__main__':
    app.run(debug=True)
