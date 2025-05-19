from flask import Blueprint, request, jsonify
from core.generated.data_management_helper import DataManagementHelper

data_management_bp = Blueprint('data_management_controller', __name__)

@data_management_bp.route('/list', methods=['GET'])
def get_all_data_management():
    """Get all data_management records"""
    result, status_code = DataManagementHelper.get_all_data_management()
    return jsonify(result), status_code

@data_management_bp.route('/create', methods=['POST'])
def create_data_management():
    """Create a new data_management record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DataManagementHelper.create_data_management(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@data_management_bp.route('/update/<int:id>', methods=['PUT'])
def update_data_management(id):
    """Update a data_management record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DataManagementHelper.update_data_management(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@data_management_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_data_management(id):
    """Delete a data_management record"""
    try:
        result, status_code = DataManagementHelper.delete_data_management(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500