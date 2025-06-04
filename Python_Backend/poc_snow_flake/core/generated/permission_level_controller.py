from flask import Blueprint, request, jsonify
from core.generated.permission_level_helper import PermissionLevelHelper

permission_level_bp = Blueprint('permission_level_controller', __name__)

@permission_level_bp.route('/list', methods=['GET'])
def get_all_permission_level():
    """Get all permission_level records"""
    result, status_code = PermissionLevelHelper.get_all_permission_level()
    return jsonify(result), status_code

@permission_level_bp.route('/create', methods=['POST'])
def create_permission_level():
    """Create a new permission_level record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = PermissionLevelHelper.create_permission_level(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@permission_level_bp.route('/update/<int:id>', methods=['PUT'])
def update_permission_level(id):
    """Update a permission_level record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = PermissionLevelHelper.update_permission_level(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@permission_level_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_permission_level(id):
    """Delete a permission_level record"""
    try:
        result, status_code = PermissionLevelHelper.delete_permission_level(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500