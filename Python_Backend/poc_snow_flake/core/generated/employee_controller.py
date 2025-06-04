from flask import Blueprint, request, jsonify
from core.generated.employee_helper import EmployeeHelper

employee_bp = Blueprint('employee_controller', __name__)

@employee_bp.route('/list', methods=['GET'])
def get_all_employee():
    """Get all employee records"""
    result, status_code = EmployeeHelper.get_all_employee()
    return jsonify(result), status_code

@employee_bp.route('/create', methods=['POST'])
def create_employee():
    """Create a new employee record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmployeeHelper.create_employee(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@employee_bp.route('/update/<int:id>', methods=['PUT'])
def update_employee(id):
    """Update a employee record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmployeeHelper.update_employee(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@employee_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_employee(id):
    """Delete a employee record"""
    try:
        result, status_code = EmployeeHelper.delete_employee(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500