from flask import Blueprint, request, jsonify
from core.Project_Estimate_helper import (
    create_project_estimate,
    get_project_estimate,
    get_all_project_estimates,
    update_project_estimate,
    delete_project_estimate,
    get_all_project_phases,
    get_all_project_roles,
    get_all_activity_codes
)

# Define a Blueprint for the project estimate routes
project_estimate_bp = Blueprint('project_estimate', __name__)
# estimate_bp = Blueprint('project_bp', __name__)

# Route for creating a new project estimate
@project_estimate_bp.route('/project_estimate', methods=['POST'])
def create_estimate():
    try:
        data = request.get_json()
        response, status_code = create_project_estimate(data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting a specific project estimate by ID
@project_estimate_bp.route('/project_estimate/<int:estimate_id>', methods=['GET'])
def get_estimate(estimate_id):
    try:
        response, status_code = get_project_estimate(estimate_id)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting all project estimates
@project_estimate_bp.route('/project_estimates', methods=['GET'])
def get_estimates():
    try:
        response, status_code = get_all_project_estimates()
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for updating a project estimate by ID
@project_estimate_bp.route('/project_estimate/<int:estimate_id>', methods=['PUT'])
def update_estimate(estimate_id):
    try:
        data = request.get_json()
        response, status_code = update_project_estimate(estimate_id, data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for deleting a project estimate by ID
@project_estimate_bp.route('/project_estimate/<int:estimate_id>', methods=['DELETE'])
def delete_estimate(estimate_id):
    try:
        response, status_code = delete_project_estimate(estimate_id)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting all project phases
@project_estimate_bp.route('/project_phases', methods=['GET'])
def get_phases():
    try:
        response, status_code = get_all_project_phases()
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting all project roles
@project_estimate_bp.route('/project_roles', methods=['GET'])
def get_roles():
    try:
        response, status_code = get_all_project_roles()
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting all activity codes
@project_estimate_bp.route('/activity_codes', methods=['GET'])
def get_codes():
    try:
        response, status_code = get_all_activity_codes()
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
