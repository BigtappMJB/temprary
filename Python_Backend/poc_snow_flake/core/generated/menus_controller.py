from flask import Blueprint, request, jsonify
from core.generated.menus_helper import MenusHelper

menus_bp = Blueprint('menus_controller', __name__)

@menus_bp.route('/list', methods=['GET'])
def get_all_menus():
    """Get all menus records"""
    result, status_code = MenusHelper.get_all_menus()
    return jsonify(result), status_code

@menus_bp.route('/create', methods=['POST'])
def create_menus():
    """Create a new menus record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = MenusHelper.create_menus(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@menus_bp.route('/update/<int:id>', methods=['PUT'])
def update_menus(id):
    """Update a menus record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = MenusHelper.update_menus(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@menus_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_menus(id):
    """Delete a menus record"""
    try:
        result, status_code = MenusHelper.delete_menus(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500