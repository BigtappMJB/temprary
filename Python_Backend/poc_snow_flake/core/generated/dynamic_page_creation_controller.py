from flask import Blueprint, request, jsonify
from core.generated.dynamic_page_creation_helper import DynamicPageCreationHelper

dynamic_page_creation_bp = Blueprint('dynamic_page_creation_controller', __name__)

@dynamic_page_creation_bp.route('/list', methods=['GET'])
def get_all_dynamic_page_creation():
    """Get all dynamic_page_creation records"""
    result, status_code = DynamicPageCreationHelper.get_all_dynamic_page_creation()
    return jsonify(result), status_code

@dynamic_page_creation_bp.route('/create', methods=['POST'])
def create_dynamic_page_creation():
    """Create a new dynamic_page_creation record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DynamicPageCreationHelper.create_dynamic_page_creation(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_page_creation_bp.route('/update/<int:id>', methods=['PUT'])
def update_dynamic_page_creation(id):
    """Update a dynamic_page_creation record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DynamicPageCreationHelper.update_dynamic_page_creation(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_page_creation_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_dynamic_page_creation(id):
    """Delete a dynamic_page_creation record"""
    try:
        result, status_code = DynamicPageCreationHelper.delete_dynamic_page_creation(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500