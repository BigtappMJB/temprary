from flask import Blueprint, request, jsonify
from core.Project_Estimate_helper import (
    create_project_estimate,
    get_project_estimate,
    get_all_project_estimates,
    update_project_estimate,
    delete_project_estimate,
    get_all_project_phases,
    get_all_project_roles,
    get_all_project_types,
    get_all_clients,
    create_project_detail,
    get_project_detail,
    update_project_detail,
    delete_project_detail,
get_all_project_details
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



@project_estimate_bp.route('/project_type', methods=['GET'])
def get_project_type():
    try:
        response, status_code = get_all_project_types()
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_estimate_bp.route('/client_info', methods=['GET'])
def get_client_info():
        try:
            response, status_code = get_all_clients()
            return jsonify(response), status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500


@project_estimate_bp.route('/project_details', methods=['POST', 'GET'])
@project_estimate_bp.route('/project_details/<int:project_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_project_details(project_id=None):
    try:
        if request.method == 'POST':
            # Handle creating a new project detail
            data = request.get_json()
            response, status_code = create_project_detail(data)
            return jsonify(response), status_code

        elif request.method == 'GET':
            if project_id:
                # Handle getting a specific project detail
                response, status_code = get_project_detail(project_id)
                return jsonify(response), status_code
            else:
                # Handle getting all project details
                response, status_code = get_all_project_details()
                return jsonify(response), status_code

        elif request.method == 'PUT':
            # Handle updating a specific project detail
            if not project_id:
                return jsonify({"error": "Project ID is required for update operations"}), 400
            data = request.get_json()
            response, status_code = update_project_detail(project_id, data)
            return jsonify(response), status_code

        elif request.method == 'DELETE':
            # Handle deleting a specific project detail
            if not project_id:
                return jsonify({"error": "Project ID is required for delete operations"}), 400
            response, status_code = delete_project_detail(project_id)
            return jsonify(response), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500