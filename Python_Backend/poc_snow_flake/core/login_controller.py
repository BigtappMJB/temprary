from flask import Blueprint, jsonify, request

from core.login_helper import *

login_bp = Blueprint('login_controller', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user_identifier = data.get('login_id') or data.get('email')
    password = data.get('password')  # Assuming password is also sent in the request

    # Fetch user data from the database
    user = get_user_by_id_or_email(user_identifier)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Decrypt and validate the password
    # if not check_password_hash(user['password'], password):
    #     return jsonify({"error": "Invalid password"}), 401

    # Check permissions based on role
    print(user['role'])
    permissions = get_permissions_by_role(user['role'])

    return jsonify({"message": "Login successful", "permissions": permissions}), 200


@login_bp.route('/logot', methods=['POST'])
def logot():
    print("logout method is called")


@login_bp.route('/enrollPassword', methods=['PUT'])
def enroll_password():
    data_j = request.get_json()
    user_id = request.args.get('id')
    return update_password(data_j, user_id)
