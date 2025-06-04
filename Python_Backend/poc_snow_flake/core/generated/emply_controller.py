from flask import Blueprint, request, jsonify
from core.generated.emply_helper import EmplyHelper

emply_bp = Blueprint('emply_controller', __name__)

@emply_bp.route('/list', methods=['GET'])
def get_all_emply():
    """Get all emply records"""
    result, status_code = EmplyHelper.get_all_emply()
    return jsonify(result), status_code

@emply_bp.route('/create', methods=['POST'])
def create_emply():
    """Create a new emply record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmplyHelper.create_emply(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@emply_bp.route('/update/<int:id>', methods=['PUT'])
def update_emply(id):
    """Update a emply record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = EmplyHelper.update_emply(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@emply_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_emply(id):
    """Delete a emply record"""
    try:
        result, status_code = EmplyHelper.delete_emply(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500