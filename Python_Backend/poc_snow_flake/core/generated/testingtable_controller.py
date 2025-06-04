from flask import Blueprint, request, jsonify
from core.generated.testingtable_helper import TestingtableHelper

testingtable_bp = Blueprint('testingtable_controller', __name__)

@testingtable_bp.route('/list', methods=['GET'])
def get_all_testingtable():
    """Get all testingtable records"""
    result, status_code = TestingtableHelper.get_all_testingtable()
    return jsonify(result), status_code

@testingtable_bp.route('/create', methods=['POST'])
def create_testingtable():
    """Create a new testingtable record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = TestingtableHelper.create_testingtable(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@testingtable_bp.route('/update/<int:id>', methods=['PUT'])
def update_testingtable(id):
    """Update a testingtable record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = TestingtableHelper.update_testingtable(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@testingtable_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_testingtable(id):
    """Delete a testingtable record"""
    try:
        result, status_code = TestingtableHelper.delete_testingtable(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500