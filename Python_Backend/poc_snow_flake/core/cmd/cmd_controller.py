# cmd_controller.py

from flask import Blueprint, request, jsonify
from flask_cors import CORS
import logging
import mysql.connector
from mysql.connector import Error

from core.cmd.cmd_helper import CMDHelper  # Updated import statement

# Configure logging
logger = logging.getLogger('cmd_controller')

cmd_bp = Blueprint('cmd_controller', __name__)
cmd_helper = CMDHelper()

CORS(cmd_bp)

# Helper function to handle database errors
def handle_db_error(e, operation):
    """Handle database errors and return appropriate response"""
    logger.error(f"Database error during {operation}: {e}")
    
    if isinstance(e, Error):
        # MySQL specific errors
        if e.errno == 2003:  # Can't connect to MySQL server
            return jsonify({"error": "Database server is currently unavailable. Please try again later."}), 503
        elif e.errno == 1045:  # Access denied
            return jsonify({"error": "Database authentication error. Please contact support."}), 500
        elif e.errno == 1049:  # Unknown database
            return jsonify({"error": "Database configuration error. Please contact support."}), 500
        elif e.errno == 1054:  # Unknown column
            return jsonify({"error": "Invalid data or database schema mismatch. Please contact support."}), 400
    
    # Generic error response
    return jsonify({"error": "An unexpected database error occurred. Please try again later."}), 500
@cmd_bp.route('/addCMD', methods=['POST'])
def create_cmd():
    try:
        data = request.json
        target = data.get('target')
        sub_target = data.get('subTarget')
        incorporation_city = data.get('incorporationCity')
        sector_classification = data.get('sectorClassification')
        
        # Validate required fields
        if not all([target, sub_target, incorporation_city, sector_classification]):
            return jsonify({'error': 'All fields are required'}), 400
            
        cmd_id = cmd_helper.create_cmd(target, sub_target, incorporation_city, sector_classification)
        return jsonify({'message': "CMD created successfully.", 'cmd_id': cmd_id}), 201
    except Exception as e:
        return handle_db_error(e, "create CMD")


@cmd_bp.route('/Allcmd', methods=['GET'])
def get_cmd():
    try:
        cmd = cmd_helper.get_cmd()
        return jsonify(cmd), 200
    except Exception as e:
        return handle_db_error(e, "get all CMD")


@cmd_bp.route('/getcmd/<int:id>', methods=['GET'])
def get_cmd_id(id):
    try:
        cmd = cmd_helper.get_cmd_id(id)
        if not cmd:
            return jsonify({"error": "CMD not found"}), 404
        return jsonify(cmd), 200
    except Exception as e:
        return handle_db_error(e, f"get CMD {id}")


@cmd_bp.route('/updatecmd/<int:id>', methods=['PUT'])
def update_cmd(id):
    try:
        data = request.json
        target = data.get('target')
        sub_target = data.get('subTarget')
        incorporation_city = data.get('incorporationCity')
        sector_classification = data.get('sectorClassification')
        
        # Validate required fields
        if not all([target, sub_target, incorporation_city, sector_classification]):
            return jsonify({'error': 'All fields are required'}), 400
        
        rowcount = cmd_helper.update_cmd(id, target, sub_target, incorporation_city, sector_classification)
        if rowcount == 0:
            return jsonify({"error": "CMD not found"}), 404

        return jsonify({"message": "CMD updated successfully"}), 200
    except Exception as e:
        return handle_db_error(e, f"update CMD {id}")


@cmd_bp.route('/deletecmd/<int:id>', methods=['DELETE'])
def delete_cmd(id):
    try:
        response, status_code = cmd_helper.delete_cmd(id)
        return jsonify(response), status_code
    except Exception as e:
        return handle_db_error(e, f"delete CMD {id}")


@cmd_bp.route('/addCAD', methods=['POST'])
def create_cad():
    try:
        data = request.json
        country_of_residence = data.get('countryOfResidence')
        target = data.get('target')
        incorporation_city = data.get('incorporationCity')
        sector_classification = data.get('sectorClassification')
        emirates_id = data.get('emiratesId')
        created_by = data.get('createdBy', 'system')

        if not all([country_of_residence, target, incorporation_city, sector_classification, emirates_id]):
            return jsonify({'error': 'All fields are required'}), 400

        cad_id = cmd_helper.create_cad(country_of_residence, target, incorporation_city, sector_classification,
                                        emirates_id, created_by)
        return jsonify({'message': "CAD created successfully.", 'cad_id': cad_id}), 201
    except Exception as e:
        return handle_db_error(e, "create CAD")


@cmd_bp.route('/allCAD', methods=['GET'])
def get_cad():
    try:
        cads = cmd_helper.get_cad()
        return jsonify(cads), 200
    except Exception as e:
        return handle_db_error(e, "get all CAD")


@cmd_bp.route('/getCAD/<int:id>', methods=['GET'])
def get_cad_id(id):
    try:
        cad = cmd_helper.get_cad_id(id)
        if not cad:
            return jsonify({"error": "CAD not found"}), 404
        return jsonify(cad), 200
    except Exception as e:
        return handle_db_error(e, f"get CAD {id}")


@cmd_bp.route('/updateCAD/<int:id>', methods=['PUT'])
def update_cad(id):
    try:
        data = request.json
        country_of_residence = data.get('countryOfResidence')
        target = data.get('target')
        incorporation_city = data.get('incorporationCity')
        sector_classification = data.get('sectorClassification')
        emirates_id = data.get('emiratesId')
        updated_by = data.get('updatedBy', 'system')

        if not all([country_of_residence, target, incorporation_city, sector_classification, emirates_id]):
            return jsonify({'error': 'All fields are required'}), 400

        rowcount = cmd_helper.update_cad(id, country_of_residence, target, incorporation_city, sector_classification,
                                          emirates_id, updated_by)
        if rowcount == 0:
            return jsonify({"error": "CAD not found"}), 404

        return jsonify({"message": "CAD updated successfully"}), 200
    except Exception as e:
        return handle_db_error(e, f"update CAD {id}")


@cmd_bp.route('/deleteCAD/<int:id>', methods=['DELETE'])
def delete_cad(id):
    try:
        response, status_code = cmd_helper.delete_cad(id)
        return jsonify(response), status_code
    except Exception as e:
        return handle_db_error(e, f"delete CAD {id}")


