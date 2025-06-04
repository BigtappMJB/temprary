from flask import Blueprint, request, jsonify
from core.generated.employeee_helper import EmployeeeHelper

employeee_bp = Blueprint('employeee_controller', __name__)

@employeee_bp.route('/list', methods=['GET'])
def get_all_employeee():
    """Get all employeee records"""
    result, status_code = EmployeeeHelper.get_all_employeee()
    return jsonify(result), status_code

@employeee_bp.route('/create', methods=['POST'])
def create_employeee():
    """Create a new employeee record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmployeeeHelper.create_employeee(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@employeee_bp.route('/update/<int:id>', methods=['PUT'])
def update_employeee(id):
    """Update a employeee record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmployeeeHelper.update_employeee(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@employeee_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_employeee(id):
    """Delete a employeee record"""
    try:
        result, status_code = EmployeeeHelper.delete_employeee(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500