from flask_mail import Mail, Message
from flask import Flask

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'rxchit.01@gmail.com'
app.config['MAIL_PASSWORD'] = 'djxy bapc ewxl mjww'

mail = Mail(app)

def send_verification_email(email, token):
    msg = Message('Verify Your Email', sender='rxchit.01@gmail.com', recipients=[email])
    msg.body = f'Click the following link to verify your email: http://localhost:5000/auth/verify/{email}/{token}'
    mail.send(msg)
