# cmd_controller.py

from flask import Blueprint, request, jsonify
from flask_cors import CORS

from core.cmd.cmd_helper import CMDHelper  # Updated import statement

cmd_bp = Blueprint('cmd_controller', __name__)
cmd_helper = CMDHelper()

CORS(cmd_bp)
@cmd_bp.route('/addCMD', methods=['POST'])
def create_cmd():
    data = request.json
    target = data.get('target')
    sub_target = data.get('subTarget')
    incorporation_city = data.get('incorporationCity')
    sector_classification = data.get('sectorClassification')
    cmd_helper.create_cmd(target, sub_target,incorporation_city,sector_classification)
    return jsonify({'message' :"CMD created successfully."}), 201


@cmd_bp.route('/Allcmd', methods=['GET'])
def get_cmd():
    cmd = cmd_helper.get_cmd()
    return jsonify(cmd), 200


@cmd_bp.route('/getcmd/<int:id>', methods=['GET'])
def get_cmd_id(id):
    cmd = cmd_helper.get_cmd_id(id)
    if not cmd:
        return jsonify({"error": "CMD not found"}), 404
    return jsonify(cmd), 200


@cmd_bp.route('/updatecmd/<int:id>', methods=['PUT'])
def update_cmd(id):
    data = request.json
    target = data.get('target')
    sub_target = data.get('subTarget')
    incorporation_city = data.get('incorporationCity')
    sector_classification = data.get('sectorClassification')
    
    rowcount = cmd_helper.update_cmd(id, target, sub_target,incorporation_city,sector_classification)
    if rowcount == 0:
        return jsonify({"error": "CMD not found"}), 404

    return jsonify({"message": "CMD updated successfully"}), 200


@cmd_bp.route('/deletecmd/<int:id>', methods=['DELETE'])
def delete_cmd(id):
    response, status_code = cmd_helper.delete_cmd(id)
    return jsonify(response), status_code


@cmd_bp.route('/addCAD', methods=['POST'])
def create_cad():
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


@cmd_bp.route('/allCAD', methods=['GET'])
def get_cad():
    cads = cmd_helper.get_cad()
    return jsonify(cads), 200


@cmd_bp.route('/getCAD/<int:id>', methods=['GET'])
def get_cad_id(id):
    cad = cmd_helper.get_cad_id(id)
    if not cad:
        return jsonify({"error": "CAD not found"}), 404
    return jsonify(cad), 200


@cmd_bp.route('/updateCAD/<int:id>', methods=['PUT'])
def update_cad(id):
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


@cmd_bp.route('/deleteCAD/<int:id>', methods=['DELETE'])
def delete_cad(id):
    response, status_code = cmd_helper.delete_cad(id)
    return jsonify(response), status_code


