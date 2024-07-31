from flask import Blueprint, request, jsonify, make_response

from core.user_helper import *
users_bp = Blueprint('users_controller', __name__)


# Helper functions to return consistent responses
def make_response(data, status_code):
    return jsonify(data), status_code


@users_bp.route('/user', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user():
    if request.method == 'POST':
        data = request.get_json()
        response, status_code = create_user(data)
    elif request.method == 'GET':
        user_id = request.args.get('id')
        if user_id:
            response, status_code = get_user(user_id)
        else:
            response, status_code = get_all_users()
    elif request.method == 'PUT':
        user_id = request.args.get('id')
        data = request.get_json()
        response, status_code = update_user(user_id, data)
    elif request.method == 'DELETE':
        user_id = request.args.get('id')
        response, status_code = delete_user(user_id)

    return jsonify(response), status_code


@users_bp.route('/Allusers', methods=['GET'])
def get_all_users():
    try:
        users = fetch_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/menu', methods=['GET', 'POST', 'PUT', 'DELETE'])
def menu():
    if request.method == 'POST':
        data = request.get_json()
        result, status_code = create_menu(data)
    elif request.method == 'GET':
        menu_id = request.args.get('id')
        if menu_id:
            result, status_code = get_menu(menu_id)
        else:
            result, status_code = get_all_menus()
    elif request.method == 'PUT':
        menu_id = request.args.get('id')
        data = request.get_json()
        result, status_code = update_menu(menu_id, data)
    elif request.method == 'DELETE':
        menu_id = request.args.get('id')
        result, status_code = delete_menu(menu_id)

    return jsonify(result), status_code

@users_bp.route('/submenu', methods=['GET', 'POST', 'PUT', 'DELETE'])
def submenu():
    if request.method == 'POST':
        data = request.get_json()
        result, status_code = create_sub_menu(data)
    elif request.method == 'GET':
        submenu_id = request.args.get('id')
        if submenu_id:
            result, status_code = get_sub_menu(submenu_id)
        else:
            result, status_code = get_all_sub_menus()
    elif request.method == 'PUT':
        submenu_id = request.args.get('id')
        data = request.get_json()
        result, status_code = update_sub_menu(submenu_id, data)
    elif request.method == 'DELETE':
        submenu_id = request.args.get('id')
        result, status_code = delete_sub_menu(submenu_id)

    return jsonify(result), status_code


@users_bp.route('/tableConfigurator', methods=['GET', 'POST'])
def table_configurator():
    response = "ssd"
    status_code = 200
    if request.method == 'POST':
        data = request.get_json()
        response, status_code = create_table(data)
        print(f"The type is {type(response)}")
    elif request.method == 'GET':
        param_type = request.args.get('type')
        if param_type == 'dataType':
            response, status_code = get_data_type()

    return response, status_code


@users_bp.route('/permission', methods=['GET', 'POST', 'PUT', 'DELETE'])
def permission():
    global response
    global status_code

    if request.method == 'POST':
        data = request.get_json()
        response, status_code = create_permission(data)
    elif request.method == 'GET':
        permission_id = request.args.get('id')
        if permission_id:
            response, status_code = get_permission(permission_id)
            if status_code == 200:
                response = json.loads(response)
        else:
            response, status_code = get_all_permissions()
            if status_code == 200:
                response = json.loads(response)
    elif request.method == 'PUT':
        permission_id = request.args.get('id')
        data = request.get_json()
        response, status_code = update_permission(permission_id, data)
    elif request.method == 'DELETE':
        permission_id = request.args.get('id')
        response, status_code = delete_permission(permission_id)

    return jsonify(response), status_code


@users_bp.route('/rolePermission', methods=['GET', 'POST', 'PUT', 'DELETE'])
def role_permission():
    if request.method == 'POST':
        data = request.get_json()
        response, status_code = create_role_permission(data)
    elif request.method == 'GET':
        role_permission_id = request.args.get('id')
        if role_permission_id:
            response, status_code = get_role_permission(role_permission_id)
        else:
            response, status_code = get_all_role_permissions()
    elif request.method == 'PUT':
        role_permission_id = request.args.get('id')
        data = request.get_json()
        response, status_code = update_role_permission(role_permission_id, data)
    elif request.method == 'DELETE':
        role_permission_id = request.args.get('id')
        response, status_code = delete_role_permission(role_permission_id)

    return jsonify(response), status_code

