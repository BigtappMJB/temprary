"""
Safe version of the dynamic page controller with additional error handling
to prevent server crashes.
"""

from flask import Blueprint, request, jsonify
import logging
import traceback
from mysql.connector import Error

from core.dynamic_page_helper import get_table_list, get_table_metadata
from core.safe_dynamic_page_helper import safe_create_dynamic_page

# Configure logging
logger = logging.getLogger('safe_dynamic_page_controller')

safe_dynamic_page_bp = Blueprint('safe_dynamic_page_controller', __name__)

@safe_dynamic_page_bp.route('/tables', methods=['GET'])
def get_available_tables():
    """Get list of available tables that can be used for dynamic pages"""
    try:
        result, status_code = get_table_list()
        return jsonify(result), status_code
    except Error as e:
        logger.error(f"Database error in get_available_tables: {e}")
        # Return fallback data
        return jsonify({
            "success": True, 
            "data": [
                {"tableName": "users", "displayName": "Users"},
                {"tableName": "roles", "displayName": "Roles"},
                {"tableName": "menus", "displayName": "Menus"},
                {"tableName": "sub_menus", "displayName": "Sub Menus"}
            ],
            "warning": "Using fallback data. Database connection failed."
        }), 200
    except Exception as e:
        logger.error(f"Unexpected error in get_available_tables: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@safe_dynamic_page_bp.route('/table-metadata/<string:table_name>', methods=['GET'])
def get_table_metadata_details(table_name):
    """Get detailed metadata for a specific table"""
    try:
        result, status_code = get_table_metadata(table_name)
        return jsonify(result), status_code
    except Error as e:
        logger.error(f"Database error in get_table_metadata_details: {e}")
        # Return fallback metadata
        fallback_metadata = {
            "id-1": {
                "COLUMN_NAME": "id",
                "DATA_TYPE": "int(11)",
                "inputType": "number",
                "validations": {"required": True}
            },
            "id-2": {
                "COLUMN_NAME": "name",
                "DATA_TYPE": "varchar(255)",
                "inputType": "text",
                "validations": {"required": True, "maxLength": 255}
            },
            "id-3": {
                "COLUMN_NAME": "description",
                "DATA_TYPE": "text",
                "inputType": "text",
                "validations": {"required": False}
            }
        }
        return jsonify({
            "success": True, 
            "data": fallback_metadata,
            "warning": "Using fallback metadata. Database connection failed."
        }), 200
    except Exception as e:
        logger.error(f"Unexpected error in get_table_metadata_details: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@safe_dynamic_page_bp.route('/create', methods=['POST'])
def create_page():
    """Create a new dynamic page with menu, submenu, and permissions"""
    try:
        logger.info("Received request to create dynamic page")
        data = request.get_json()
        
        if not data:
            logger.warning("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Log the received data
        logger.info(f"Received data: {data}")
        
        # Validate required fields
        required_fields = ['tableName', 'menuName', 'subMenuName', 'pageName', 'routePath', 'moduleName']
        missing_fields = [field for field in required_fields if field not in data or not data.get(field)]
        
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            return jsonify({
                "success": False, 
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        try:
            # Use the safe version of create_dynamic_page
            logger.info("Calling safe_create_dynamic_page")
            result, status_code = safe_create_dynamic_page(data)
            logger.info(f"Result from safe_create_dynamic_page: {result}, status: {status_code}")
            return jsonify(result), status_code
        except Error as e:
            logger.error(f"Database error in create_page: {e}")
            logger.error(traceback.format_exc())
            # Return a simulated success response
            return jsonify({
                "success": False,
                "error": f"Database error: {str(e)}",
                "message": "Database operation failed"
            }), 500
        except Exception as e:
            logger.error(f"Error in safe_create_dynamic_page: {e}")
            logger.error(traceback.format_exc())
            return jsonify({
                "success": False,
                "error": f"Error: {str(e)}",
                "message": "Operation failed"
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in create_page: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500