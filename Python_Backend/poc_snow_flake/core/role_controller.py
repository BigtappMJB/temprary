# role_controller.py

from flask import Blueprint, request, jsonify
from core.role_helper import RoleHelper  # Updated import statement

roles_bp = Blueprint('roles_controller', __name__)
role_helper = RoleHelper()


@roles_bp.route('/roles', methods=['POST'])
def create_role():
    data = request.json
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"error": "Role name is required"}), 400

    role_id = role_helper.create_role(name, description)
    return jsonify({"id": role_id, "name": name, "description": description}), 201


@roles_bp.route('/Allroles', methods=['GET'])
def get_roles():
    roles = role_helper.get_roles()
    return jsonify(roles), 200


@roles_bp.route('/getroles/<int:id>', methods=['GET'])
def get_role(id):
    role = role_helper.get_role(id)
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return jsonify(role), 200


@roles_bp.route('/updaterole/<int:id>', methods=['PUT'])
def update_role(id):
    data = request.json
    name = data.get('name')
    description = data.get('description')

    rowcount = role_helper.update_role(id, name, description)
    if rowcount == 0:
        return jsonify({"error": "Role not found"}), 404

    return jsonify({"message": "Role updated successfully"}), 200


@roles_bp.route('/deleteroles/<int:id>', methods=['DELETE'])
def delete_role(id):
    response, status_code = role_helper.delete_role(id)
    return jsonify(response), status_code


@roles_bp.route('/Allpermission', methods=['GET'])
def get_permission():
    roles = role_helper.get_all_permissions()
    return jsonify(roles), 200


