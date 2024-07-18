from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail, Message
from core.registration_helper import generate_otp, generate_default_password, insert_user, get_user_by_email, \
    update_user_password_and_verify, update_user_password
from share.general_utils import sender_mail_config
import smtplib

registration_bp = Blueprint('registration_controller', __name__)

mail = Mail()

@registration_bp.record_once
def on_load(state):
    mail_settings = {
        "MAIL_SERVER": sender_mail_config['server'],
        "MAIL_PORT": sender_mail_config['port'],
        "MAIL_USE_TLS": sender_mail_config['use_tls'],
        "MAIL_USERNAME": sender_mail_config['username'],
        "MAIL_PASSWORD": sender_mail_config['password'],
    }
    state.app.config.update(mail_settings)
    mail.init_app(state.app)

# Helper functions
def send_otp_email(user_email, otp):
    msg = Message("Your OTP Code", sender=sender_mail_config['username'], recipients=[user_email])
    msg.body = f"Your OTP code is: {otp}"

    try:
        with mail.connect() as conn:
            conn.host.set_debuglevel(1)  # Enable debug output
            conn.send(msg)
        return True
    except smtplib.SMTPNotSupportedError as e:
        current_app.logger.error(f"SMTP AUTH extension not supported by server: {e}")
    except Exception as e:
        current_app.logger.error(f"An error occurred while sending OTP email: {e}")
    return False

def send_default_password(email, password):
    msg = Message("Your Default Password", sender=sender_mail_config['username'], recipients=[email])
    msg.body = f"Your default password is: {password}"

    try:
        with mail.connect() as conn:
            conn.host.set_debuglevel(1)  # Enable debug output
            conn.send(msg)
    except smtplib.SMTPNotSupportedError as e:
        current_app.logger.error(f"SMTP AUTH extension not supported by server: {e}")
    except Exception as e:
        current_app.logger.error(f"An error occurred while sending default password email: {e}")

# Route for Registration and Sending OTP
@registration_bp.route('/registration', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    mobile = data.get('mobile')
    role = 701  # Default role from the roles table

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    otp = generate_otp()
    if send_otp_email(email, otp):
        insert_user(email, first_name, last_name, mobile, role, otp)
        return jsonify({"message": "OTP sent to email successfully"}), 200
    else:
        return jsonify({"error": "Failed to send OTP"}), 500

# Route for Verifying OTP
@registration_bp.route('/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    user = get_user_by_email(email)
    if not user or user[7] != otp:  # Assuming the password field is used to store the OTP temporarily
        return jsonify({"error": "Invalid OTP or email"}), 400

    default_password = generate_default_password(length=6)
    update_user_password_and_verify(email, default_password)
    send_default_password(email, default_password)
    return jsonify({"message": "OTP verified, default password sent to  mail"}), 200

# Route for Changing Password
@registration_bp.route('/change_password', methods=['POST'])
def change_password():
    data = request.json
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    user = get_user_by_email(email)
    if not user or user[7] != old_password:  # Assuming the password is stored at index 7
        return jsonify({"error": "Invalid email or password"}), 400

    update_user_password(email, new_password)
    return jsonify({"message": "Password updated successfully"}), 200

@registration_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:  # Ensure email and new_password are provided
        return jsonify({"error": "Missing email or new password"}), 400

    user = get_user_by_email(email)
    if not user:  # Check if user exists
        return jsonify({"error": "User does not exist"}), 400

    # Assuming index 7 is no longer relevant, as no OTP check is required
    update_user_password(email, new_password)
    return jsonify({"message": "Password reset successfully"}), 200


