from flask import Blueprint, request, jsonify
from app.models.user import User
from flask_mail import  Message
import secrets
import string

auth_routes = Blueprint('auth_routes', __name__)

def generate_token(length=32):
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    return token

@auth_routes.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.find_by_username(data['username'])
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    prn = data['prn']
    email = f"{prn}@mitwpu.edu.in"
    role = "user"
    existing_email = User.find_by_email(email)
    if existing_email:
        return jsonify({'error': 'Email already exists'}), 400

    verification_token = generate_token()

    new_user = User(
        username=data['username'],
        email=email,
        password=data['password'],
        prn=prn,
        panel_num=data['panelNum'],
        role=role,
        verification_token=verification_token,
        verified=False
    )
    new_user.save_to_db()
    from main import mail
    msg = Message('Verify Your Email', sender='rxchit.01@gmail.com', recipients=[email])
    msg.body = f'Click the following link to verify your email: http://localhost:5000/auth/verify/{email}/{verification_token}'
    mail.send(msg)
    return jsonify({'message': 'Verification email sent. Please verify your email to complete registration.'}), 200


@auth_routes.route('/auth/verify/<email>/<token>', methods=['GET'])
def verify_email(email, token):
    user = User.find_by_email(email)

    if not user:
        return jsonify({'error': 'Invalid email address'}), 400

    if user.verified:
        return jsonify({'error': 'Email already verified'}), 400

    if user.verification_token != token:
        return jsonify({'error': 'Invalid verification token'}), 400

    user.verified = True
    User.update_verification_status(user.prn, True)

    return jsonify({'message': 'Email verification successful'}), 200

@auth_routes.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    user = User.find_by_email(data['email'])

    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.verified:
        return jsonify({'error': 'Email not verified'}), 401

    if user.password != data['password']:
        return jsonify({'error': 'Invalid credentials'}), 401
    role = user.role
    return jsonify({'message': 'Login successful', 'role': role}), 200
