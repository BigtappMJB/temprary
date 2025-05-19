from flask import Blueprint, request, jsonify
from core.generated.sample_table_helper import SampleTableHelper

sample_table_bp = Blueprint('sample_table_controller', __name__)

@sample_table_bp.route('/list', methods=['GET'])
def get_all_sample_table():
    """Get all sample_table records"""
    result, status_code = SampleTableHelper.get_all_sample_table()
    return jsonify(result), status_code

@sample_table_bp.route('/create', methods=['POST'])
def create_sample_table():
    """Create a new sample_table record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = SampleTableHelper.create_sample_table(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@sample_table_bp.route('/update/<int:id>', methods=['PUT'])
def update_sample_table(id):
    """Update a sample_table record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = SampleTableHelper.update_sample_table(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@sample_table_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_sample_table(id):
    """Delete a sample_table record"""
    try:
        result, status_code = SampleTableHelper.delete_sample_table(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500