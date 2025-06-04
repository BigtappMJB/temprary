from flask import Blueprint, request, jsonify
from core.generated.data_test_helper import DataTestHelper

data_test_bp = Blueprint('data_test_controller', __name__)

@data_test_bp.route('/list', methods=['GET'])
def get_all_data_test():
    """Get all data_test records"""
    result, status_code = DataTestHelper.get_all_data_test()
    return jsonify(result), status_code

@data_test_bp.route('/create', methods=['POST'])
def create_data_test():
    """Create a new data_test record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DataTestHelper.create_data_test(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@data_test_bp.route('/update/<int:id>', methods=['PUT'])
def update_data_test(id):
    """Update a data_test record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DataTestHelper.update_data_test(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@data_test_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_data_test(id):
    """Delete a data_test record"""
    try:
        result, status_code = DataTestHelper.delete_data_test(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500