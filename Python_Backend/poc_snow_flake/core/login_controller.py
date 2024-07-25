import hashlib

from flask import Blueprint, jsonify, request, current_app

from core.login_helper import *

login_bp = Blueprint('login_controller', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    current_app.logger.info(f"Login attempt for email: {email}")

    # Fetch user data from the database
    user = get_user_by_email(email)
    if not user:
        current_app.logger.error(f"User not found for email: {email}")
        return jsonify({"error": "User not found. Please check your email and try again."}), 404

    # Decrypt and validate the password
    print(user['password'])
    print(password)
    # if not check_password_hash(user['password'], password):
    #     return jsonify({"error": "Invalid password"}), 401

    # Strip leading/trailing whitespace from passwords
    provided_password = password.strip()
    stored_password = user['password'].strip()

    current_app.logger.info(f"Provided password (stripped): '{provided_password}'")
    current_app.logger.info(f"Stored password (stripped): '{stored_password}'")

    # Validate the password
    if stored_password != provided_password:
        current_app.logger.error(f"Incorrect password for email: {email}")
        return jsonify({"error": "The password you entered is incorrect. Please check your password and try again."}), 401

    current_app.logger.info(f"Password validated for email: {email}")

    # Update the last login datetime
    update_last_login(email)

    # Check permissions based on email
    permissions = get_permissions_by_email(email)
    current_app.logger.info(f"Permissions for email {email}: {permissions}")

    return jsonify({
        "message": "Login successful",
        "permissions": permissions,
        "is_default_password_changed": user['is_default_password_changed'],
        "is_verified": user['is_verified'],
        "last_login_datetime": user['last_login_datetime']
    }), 200



@login_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful"}), 200


@login_bp.route('/enrollPassword', methods=['PUT'])
def enroll_password():
    data_j = request.get_json()
    user_id = request.args.get('id')
    return update_password(data_j, user_id)
