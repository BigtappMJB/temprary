from flask import Blueprint, request, jsonify

from core.dynamic_page_helper import get_table_list, get_table_metadata, create_dynamic_page, check_dynamic_page_exists
from core.async_page_creator import start_async_page_creation, get_creation_status
import logging
import mysql.connector
from mysql.connector import Error
import os
import requests
import json

# Configure logging
logger = logging.getLogger('dynamic_page_controller')

dynamic_page_bp = Blueprint('dynamic_page_controller', __name__)

# Fallback data for when database is unavailable
FALLBACK_TABLES = [
    {"tableName": "users", "displayName": "Users"},
    {"tableName": "roles", "displayName": "Roles"},
    {"tableName": "menus", "displayName": "Menus"},
    {"tableName": "sub_menus", "displayName": "Sub Menus"}
]

@dynamic_page_bp.route('/tables', methods=['GET'])
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
            "data": FALLBACK_TABLES,
            "warning": "Using fallback data. Database connection failed."
        }), 200
    except Exception as e:
        logger.error(f"Unexpected error in get_available_tables: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_page_bp.route('/table-metadata/<string:table_name>', methods=['GET'])
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
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_page_bp.route('/create', methods=['POST'])
def create_page():
    """Create a new dynamic page with menu, submenu, and permissions (synchronous)"""
    try:
        # Log the start of the request
        logger.info("Received request YO MJBBBBBB to create dynamic page (synchronous)")

        # Get the JSON data
        data = request.get_json()
        if not data:
            logger.warning("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Log the data received (excluding sensitive information)
        safe_data = {k: v for k, v in data.items() if k not in ['password', 'token']}
        logger.info(f"Processing dynamic page creation with data: {safe_data}")
        
        # Process the request in a try-except block
        try:
            # Call the helper function to create the dynamic page
            result, status_code = create_dynamic_page(data)
            
            # Log the success
            logger.info(f"Dynamic page creation MJBBBBB completed with status code: {status_code}")
            
            # Return the result
            return jsonify(result), status_code
            
        except Error as e:
            # Handle database errors
            logger.error(f"Database error in create_page: {e}")
            
            # Return a simulated success response
            simulated_response = {
                "success": True,
                "data": {
                    "message": "Page creation simulated due to database unavailability",
                    "files": {
                        "helper": f"core/generated/{data.get('tableName', 'sample')}_helper.py (simulated)",
                        "controller": f"core/generated/{data.get('tableName', 'sample')}_controller.py (simulated)"
                    }
                },
                "warning": "Database is currently unavailable. Changes will not be persisted."
            }
            
            logger.info("Returning simulated success response")
            return jsonify(simulated_response), 200

    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in create_page: {e}")
        logger.error(f"Error details: {str(e)}")
        
        # Return a user-friendly error message
        return jsonify({
            "success": False, 
            "error": "An unexpected error occurred while processing your request.",
            "message": "Please try again later or contact support if the problem persists."
        }), 500

@dynamic_page_bp.route('/create-async', methods=['POST'])
def create_page_async():
    """Create a new dynamic page asynchronously"""
    try:
        # Log the start of the request
        logger.info("Received request to create dynamic page asynchronously")
        
        # Get the JSON data
        data = request.get_json()
        if not data:
            logger.warning("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Log the data received (excluding sensitive information)
        safe_data = {k: v for k, v in data.items() if k not in ['password', 'token']}
        logger.info(f"Processing async dynamic page creation with data: {safe_data}")
        
        # Start the asynchronous page creation process
        try:
            # Start the async process
            status_file = start_async_page_creation(data)
            
            # Return the status file path (relative to project root)
            status_file_rel = os.path.relpath(
                status_file, 
                os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            )
            
            # Return immediate response
            return jsonify({
                "success": True,
                "message": "Dynamic page creation started",
                "data": {
                    "statusFile": status_file_rel,
                    "tableName": data.get('tableName'),
                    "statusEndpoint": f"/dynamic-page/status?file={status_file_rel}"
                }
            }), 202  # 202 Accepted
            
        except Exception as process_error:
            # Handle process creation errors
            logger.error(f"Error starting async page creation: {process_error}")
            
            return jsonify({
                "success": False,
                "error": "Failed to start page creation process",
                "message": str(process_error)
            }), 500

    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in create_page_async: {e}")
        logger.error(f"Error details: {str(e)}")
        
        # Return a user-friendly error message
        return jsonify({
            "success": False, 
            "error": "An unexpected error occurred while processing your request.",
            "message": "Please try again later or contact support if the problem persists."
        }), 500
        
@dynamic_page_bp.route('/check', methods=['GET'])
def check_page_exists():
    """Check if a dynamic page exists for a given table"""
    try:
        # Get the table name from query parameters
        table_name = request.args.get('tableName')
        if not table_name:
            return jsonify({"success": False, "error": "No table name provided"}), 400
            
        # Check if the dynamic page exists
        exists, page_info = check_dynamic_page_exists(table_name)
        
        # Return the result
        if exists:
            return jsonify({
                "success": True,
                "exists": True,
                "data": page_info
            }), 200
        else:
            return jsonify({
                "success": True,
                "exists": False
            }), 200
            
    except Exception as e:
        logger.error(f"Error checking if dynamic page exists: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to check if dynamic page exists"
        }), 500
        
@dynamic_page_bp.route('/status', methods=['GET'])
def check_creation_status():
    """Check the status of an asynchronous page creation"""
    try:
        # Get the status file path from query parameters
        status_file_rel = request.args.get('file')
        if not status_file_rel:
            return jsonify({"success": False, "error": "No status file provided"}), 400
            
        # Convert relative path to absolute path
        status_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            status_file_rel
        )
        
        # Check if the file exists
        if not os.path.exists(status_file):
            return jsonify({
                "success": False,
                "error": "Status file not found",
                "message": "The page creation process may not have started or the file path is incorrect"
            }), 404
            
        # Get the status
        status = get_creation_status(status_file)
        
        # Return the status
        return jsonify(status), 200
            
    except Exception as e:
        logger.error(f"Error checking creation status: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to check page creation status",
            "message": str(e)
        }), 500
