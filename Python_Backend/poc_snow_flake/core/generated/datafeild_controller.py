from flask import Blueprint, request, jsonify
from core.generated.datafeild_helper import DatafeildHelper

datafeild_bp = Blueprint('datafeild_controller', __name__)

@datafeild_bp.route('/list', methods=['GET'])
def get_all_datafeild():
    """Get all datafeild records"""
    result, status_code = DatafeildHelper.get_all_datafeild()
    return jsonify(result), status_code

@datafeild_bp.route('/create', methods=['POST'])
def create_datafeild():
    """Create a new datafeild record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DatafeildHelper.create_datafeild(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@datafeild_bp.route('/update/<int:id>', methods=['PUT'])
def update_datafeild(id):
    """Update a datafeild record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = DatafeildHelper.update_datafeild(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@datafeild_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_datafeild(id):
    """Delete a datafeild record"""
    try:
        result, status_code = DatafeildHelper.delete_datafeild(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500