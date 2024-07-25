# cmd_controller.py

from flask import Blueprint, request, jsonify
from core.cmd.cmd_helper import CMDHelper  # Updated import statement

cmd_bp = Blueprint('cmd_controller', __name__)
cmd_helper = CMDHelper()


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




