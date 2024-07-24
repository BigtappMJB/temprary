import hashlib
from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail, Message
from core.registration_helper import generate_otp, generate_default_password, insert_user, get_user_by_email, \
    update_user_password_and_verify, update_user_password,get_user_by_email, update_user_otp
from share.general_utils import sender_mail_config
import smtplib
import random
import string
from datetime import datetime

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

def generate_otp(length=6):
    """Generate a random OTP of specified length."""
    return ''.join(random.choices(string.digits, k=length))
# Route for Registration and Sending OTP


def send_password_update_email(user_email):
    msg = Message("Password Update Notification", sender=sender_mail_config['username'], recipients=[user_email])
    msg.body = "Your password has been successfully updated."

    try:
        with mail.connect() as conn:
            conn.host.set_debuglevel(1)  # Enable debug output
            conn.send(msg)
        current_app.logger.info(f"Password update notification email sent to {user_email}")
    except smtplib.SMTPNotSupportedError as e:
        current_app.logger.error(f"SMTP AUTH extension not supported by server: {e}")
    except Exception as e:
        current_app.logger.error(f"An error occurred while sending password update email: {e}")



@registration_bp.route('/registration', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    middle_name = data.get('middle_name')
    last_name = data.get('last_name')
    mobile = data.get('mobile')
    role_id = 701  # Default role from the roles table
    created_date = datetime.now()

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    otp = generate_otp()
    if send_otp_email(email, otp):
        insert_user(email, first_name, middle_name, last_name, mobile, role_id, otp, created_date)  # Save OTP in password field
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

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user['password'] != otp:  # Assuming the password field is used to store the OTP temporarily
        return jsonify(
            {"error": "The OTP you have entered is incorrect. Please check the OTP email for the valid code."}), 400

    # Update IS_VERIFIED to true and set a default password
    default_password = generate_default_password(length=8)
    update_user_password_and_verify(email, default_password)
    send_default_password(email, default_password)
    return jsonify({"message": "OTP verified, default password sent to mail"}), 200





# Route for Changing Password
@registration_bp.route('/change_password', methods=['POST'])
def change_password():
    data = request.json
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    current_app.logger.info(f"Request received to change password for email: {email}")

    user = get_user_by_email(email)
    if not user:
        current_app.logger.error(f"User not found for email: {email}")
        return jsonify({"error": "User not found"}), 404

    current_app.logger.info(f"User found: {user}")

    # Strip leading/trailing whitespace from passwords
    provided_old_password = old_password.strip()
    stored_password = user['password'].strip()

    current_app.logger.info(f"Provided old password (stripped): '{provided_old_password}'")
    current_app.logger.info(f"Stored password (stripped): '{stored_password}'")

    if provided_old_password != stored_password:  # Direct comparison after stripping whitespace
        current_app.logger.error(f"Invalid email or password for email: {email}")
        return jsonify({"error": "Invalid default/Current password"}), 400

    current_app.logger.info(f"Old password verified for email: {email}")

    update_user_password(email, new_password)
    current_app.logger.info(f"Password updated successfully for email: {email}")

    # Send password update notification email
    send_password_update_email(email)

    return jsonify({"message": "Password updated successfully"}), 200




@registration_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')
    otp = data.get('otp')

    if not email or not new_password or not otp:  # Ensure email, new_password, and otp are provided
        return jsonify({"error": "Missing email, new password, or OTP"}), 400

    user = get_user_by_email(email)
    if not user:  # Check if user exists
        return jsonify({"error": "User does not exist"}), 400

    if user['otp'] != otp:  # Check if OTP is correct
        return jsonify({"error": "The OTP you have entered is incorrect. Please check your OTP and try again."}), 400

    update_user_password(email, new_password)
    current_app.logger.info(f"Password reset successfully for email: {email}")

    # Send password reset notification email
    send_password_update_email(email)

    return jsonify({"message": "Password reset successfully"}), 200



@registration_bp.route('/generate_otp', methods=['POST'])
def generate_otp_api():
    data = request.json
    email = data.get('email')

    current_app.logger.info(f"OTP generation requested for email: {email}")

    user = get_user_by_email(email)
    if not user:
        current_app.logger.error(f"User not found for email: {email}")
        return jsonify({"error": "User not found"}), 404

    otp = generate_otp()
    if send_otp_email(email, otp):
        update_user_otp(email, otp)  # Save the OTP in the database
        current_app.logger.info(f"OTP sent and saved for email: {email}")
        return jsonify({"message": "OTP generated and sent to email successfully"}), 200
    else:
        return jsonify({"error": "Failed to send OTP"}), 500
