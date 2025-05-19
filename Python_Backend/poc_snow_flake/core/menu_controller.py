from flask import Blueprint, request, jsonify
from core.user_helper import get_all_menus, get_menu, create_menu, update_menu, delete_menu
from core.user_helper import get_all_sub_menus, get_sub_menu, create_sub_menu, update_sub_menu, delete_sub_menu

menu_bp = Blueprint('menu_controller', __name__)

@menu_bp.route('/menus', methods=['GET', 'POST'])
def menus():
    """Handle GET and POST requests for menus"""
    if request.method == 'GET':
        menu_id = request.args.get('id')
        if menu_id:
            result, status_code = get_menu(menu_id)
        else:
            result, status_code = get_all_menus()
        return jsonify(result), status_code
    
    elif request.method == 'POST':
        data = request.get_json()
        result, status_code = create_menu(data)
        return jsonify(result), status_code

@menu_bp.route('/menus/<int:menu_id>', methods=['GET', 'PUT', 'DELETE'])
def menu_by_id(menu_id):
    """Handle GET, PUT, and DELETE requests for a specific menu"""
    if request.method == 'GET':
        result, status_code = get_menu(menu_id)
        return jsonify(result), status_code
    
    elif request.method == 'PUT':
        data = request.get_json()
        result, status_code = update_menu(menu_id, data)
        return jsonify(result), status_code
    
    elif request.method == 'DELETE':
        result, status_code = delete_menu(menu_id)
        return jsonify(result), status_code

@menu_bp.route('/submenus', methods=['GET', 'POST'])
def submenus():
    """Handle GET and POST requests for submenus"""
    if request.method == 'GET':
        submenu_id = request.args.get('id')
        menu_id = request.args.get('menu_id')
        
        if submenu_id:
            result, status_code = get_sub_menu(submenu_id)
        elif menu_id:
            result, status_code = get_all_sub_menus(menu_id)
        else:
            result, status_code = get_all_sub_menus()
        
        return jsonify(result), status_code
    
    elif request.method == 'POST':
        data = request.get_json()
        result, status_code = create_sub_menu(data)
        return jsonify(result), status_code

@menu_bp.route('/submenus/<int:submenu_id>', methods=['GET', 'PUT', 'DELETE'])
def submenu_by_id(submenu_id):
    """Handle GET, PUT, and DELETE requests for a specific submenu"""
    if request.method == 'GET':
        result, status_code = get_sub_menu(submenu_id)
        return jsonify(result), status_code
    
    elif request.method == 'PUT':
        data = request.get_json()
        result, status_code = update_sub_menu(submenu_id, data)
        return jsonify(result), status_code
    
    elif request.method == 'DELETE':
        result, status_code = delete_sub_menu(submenu_id)
        return jsonify(result), status_code