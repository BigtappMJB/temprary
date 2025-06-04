from flask import Blueprint, request, jsonify
from core.generated.sub_menus_helper import SubMenusHelper

sub_menus_bp = Blueprint('sub_menus_controller', __name__)

@sub_menus_bp.route('/list', methods=['GET'])
def get_all_sub_menus():
    """Get all sub_menus records"""
    result, status_code = SubMenusHelper.get_all_sub_menus()
    return jsonify(result), status_code

@sub_menus_bp.route('/create', methods=['POST'])
def create_sub_menus():
    """Create a new sub_menus record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = SubMenusHelper.create_sub_menus(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@sub_menus_bp.route('/update/<int:id>', methods=['PUT'])
def update_sub_menus(id):
    """Update a sub_menus record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = SubMenusHelper.update_sub_menus(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@sub_menus_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_sub_menus(id):
    """Delete a sub_menus record"""
    try:
        result, status_code = SubMenusHelper.delete_sub_menus(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500