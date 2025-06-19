




from flask import jsonify
from utility.jason_transformer import JsonTransformer
from core.database import get_database_connection, close_connection

import json
import os
import time
import random
import requests
import string
import re
import logging
import traceback
from mysql.connector import Error
from typing import Dict, List, Tuple, Any, Optional

# Configure logging
logger = logging.getLogger('dynamic_page_helper')
  # Change to actual URL

def get_table_list():
    """Get list of available tables from the database"""
    conn = None
    try:
        logger.info("Getting list of available tables")
        conn = get_database_connection()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        table_list = []
        for table in tables:
            table_name = table[0]
            # Convert snake_case to Title Case for display
            display_name = " ".join(word.capitalize() for word in table_name.split("_"))
            table_list.append({
                "tableName": table_name,
                "displayName": display_name
            })
        
        cursor.close()
        logger.info(f"Found {len(table_list)} tables")
        return {"success": True, "data": table_list}, 200
    except Error as e:
        logger.error(f"Database error in get_table_list: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_table_list: {e}")
        return {"success": False, "error": str(e)}, 500
    finally:
        if conn:
            close_connection(conn)

def get_table_metadata(table_name):
    """Get detailed metadata for a specific table"""
    conn = None
    try:
        logger.info(f"Getting metadata for table: {table_name}")
        conn = get_database_connection()
        cursor = conn.cursor()
        
        # Get table columns
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        
        metadata = {}
        for col in columns:
            col_name = col[0]
            col_type = col[1].lower()
            is_nullable = col[2] == "YES"
            
            # Generate a unique ID for the column
            unique_id = f"id-{int(time.time())}-{''.join(random.choices(string.ascii_lowercase, k=3))}"
            
            # Determine input type based on column type
            input_type = "text"  # default
            if "int" in col_type:
                input_type = "number"
            elif "date" in col_type:
                input_type = "date"
            elif "time" in col_type:
                input_type = "time"
            elif col_name.lower() in ["email", "mail"]:
                input_type = "email"
            elif col_name.lower() in ["password", "pwd"]:
                input_type = "password"
            
            # Generate validations
            validations = {
                "required": not is_nullable
            }
            
            # Add length validations for varchar
            if "varchar" in col_type:
                length_match = re.search(r'varchar\((\d+)\)', col_type)
                if length_match:
                    max_length = int(length_match.group(1))
                    validations["maxLength"] = max_length
            
            metadata[unique_id] = {
                "COLUMN_NAME": col_name,
                "DATA_TYPE": col_type,
                "inputType": input_type,
                "validations": validations
            }
        
        cursor.close()
        logger.info(f"Found {len(metadata)} columns for table {table_name}")
        return {"success": True, "data": metadata}, 200
    except Error as e:
        logger.error(f"Database error in get_table_metadata for table {table_name}: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_table_metadata for table {table_name}: {e}")
        return {"success": False, "error": str(e)}, 500
    finally:
        if conn:
            close_connection(conn)

def check_menu_exists(menu_name):
    """Check if a menu with the given name exists, return its ID if it does"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM menus WHERE name = %s", (menu_name,))
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if result:
            return True, result[0]
        return False, None
    except Exception as e:
        print(f"Error checking menu existence: {e}")
        return False, None

def create_menu(menu_name):
    """Create a new menu with the given name"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO menus (name, description, created_by) VALUES (%s, %s, %s)",
            (menu_name, menu_name, 'SYSTEM')
        )
        conn.commit()
        
        # Get the ID of the newly created menu
        cursor.execute("SELECT LAST_INSERT_ID()")
        menu_id = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        return True, menu_id
    except Exception as e:
        print(f"Error creating menu: {e}")
        return False, None

def check_submenu_exists(menu_id, submenu_name):
    """Check if a submenu with the given name exists under the specified menu"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM sub_menus WHERE menu_id = %s AND name = %s", 
                      (menu_id, submenu_name))
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if result:
            return True, result[0]
        return False, None
    except Exception as e:
        print(f"Error checking submenu existence: {e}")
        return False, None

def create_or_update_submenu(menu_id, submenu_name, route_path):
    """Create a new submenu or update an existing one"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        # Check if submenu exists
        exists, submenu_id = check_submenu_exists(menu_id, submenu_name)
        
        if exists:
            # Update existing submenu
            cursor.execute(
                "UPDATE sub_menus SET route = %s, updated_by = %s, updated_date = CURRENT_TIMESTAMP WHERE id = %s",
                (route_path, 'SYSTEM', submenu_id)
            )
        else:
            # Create new submenu
            cursor.execute(
                "INSERT INTO sub_menus (menu_id, name, description, route, created_by) VALUES (%s, %s, %s, %s, %s)",
                (menu_id, submenu_name, submenu_name, route_path, 'SYSTEM')
            )
            # Get the ID of the newly created submenu
            cursor.execute("SELECT LAST_INSERT_ID()")
            submenu_id = cursor.fetchone()[0]
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return True, submenu_id
    except Exception as e:
        print(f"Error creating/updating submenu: {e}")
        return False, None

def get_permission_level_ids(permission_levels):
    """Get IDs for the specified permission levels"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        permission_ids = {}
        for level in permission_levels:
            cursor.execute("SELECT id FROM permission_level WHERE level = %s", (level,))
            result = cursor.fetchone()
            if result:
                permission_ids[level] = result[0]
        
        cursor.close()
        conn.close()
        
        return True, permission_ids
    except Exception as e:
        print(f"Error getting permission level IDs: {e}")
        return False, {}

def get_all_roles():
    """Get all roles from the database"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM roles")
        roles = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return True, [role[0] for role in roles]
    except Exception as e:
        print(f"Error getting roles: {e}")
        return False, []

def create_or_update_role_permissions(role_id, menu_id, submenu_id, permission_level_id):
    """Create or update role permissions"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        # Check if the role permission already exists
        cursor.execute(
            "SELECT id FROM role_permission WHERE role_id = %s AND menu_id = %s AND sub_menu_id = %s",
            (role_id, menu_id, submenu_id)
        )
        result = cursor.fetchone()
        
        if result:
            # Update existing role permission
            cursor.execute(
                "UPDATE role_permission SET permission_level = %s, updated_by = %s, updated_date = CURRENT_TIMESTAMP WHERE id = %s",
                (permission_level_id, 'SYSTEM', result[0])
            )
        else:
            # Create new role permission
            cursor.execute(
                "INSERT INTO role_permission (role_id, menu_id, sub_menu_id, permission_level, created_by) VALUES (%s, %s, %s, %s, %s)",
                (role_id, menu_id, submenu_id, permission_level_id, 'SYSTEM')
            )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Error creating/updating role permission: {e}")
        return False
JAVA_API_URL = "http://localhost:8080/api/generator/hello"
def create_dynamic_page(data):

    """Create a new dynamic page based on the provided data"""
    conn = None
    cursor = None
    try:
        logger.info("Creating dynamic page with data: %s", data)



        # logger.info("Creating dynamicMJJJJBBBBBBBBBBBBBBBBBBBBB$################@D")
        # Extract data from the request
        table_name = data.get('tableName')
        menu_name = data.get('menuName')
        submenu_name = data.get('subMenuName')
        page_name = data.get('pageName')
        route_path = data.get('routePath')
        module_name = data.get('moduleName')
        permission_levels = data.get('permissionLevels', [])
        
        logger.info(f"Extracted data: table={table_name}, menu={menu_name}, submenu={submenu_name}, page={page_name}, route={route_path}, module={module_name}, permissions={permission_levels}")
        
        # Validate required fields with detailed error message
        missing_fields = []
        if not table_name: missing_fields.append('tableName')
        if not menu_name: missing_fields.append('menuName')
        if not submenu_name: missing_fields.append('subMenuName')
        if not page_name: missing_fields.append('pageName')
        if not route_path: missing_fields.append('routePath')
        if not module_name: missing_fields.append('moduleName')
        
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.warning(error_msg)
            return {"success": False, "error": error_msg}, 400
        
        # 1. Check if the table exists
        conn = get_database_connection()
        cursor = conn.cursor()
        
        logger.info(f"Checking if table {table_name} exists")
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        
        if table_name not in tables:
            logger.warning(f"Table '{table_name}' does not exist")
            return {"success": False, "error": f"Table '{table_name}' does not exist"}, 404
        
        # 2. Check if menu exists, create if not
        menu_exists, menu_id = check_menu_exists(menu_name)
        if not menu_exists:
            success, menu_id = create_menu(menu_name)
            if not success:
                return {"success": False, "error": "Failed to create menu"}, 500
        
        # 3. Check if submenu exists, create or update if needed
        success, submenu_id = create_or_update_submenu(menu_id, submenu_name, route_path)
        if not success:
            return {"success": False, "error": "Failed to create/update submenu"}, 500
        
        # 4. Get permission level IDs
        success, permission_ids = get_permission_level_ids(permission_levels)
        if not success:
            return {"success": False, "error": "Failed to get permission level IDs"}, 500
        
        # 5. Get all roles
        success, role_ids = get_all_roles()
        if not success:
            return {"success": False, "error": "Failed to get roles"}, 500
        
        # 6. Create or update role permissions for each role and permission level
        for role_id in role_ids:
            for level, level_id in permission_ids.items():
                success = create_or_update_role_permissions(role_id, menu_id, submenu_id, level_id)
                if not success:
                    return {"success": False, "error": f"Failed to create/update role permission for role {role_id}"}, 500
        try:
            # Test call to Java API hello endpoint
            test_response = requests.get(JAVA_API_URL, timeout=5)
            if test_response.status_code == 200:
                logger.info(f"Java API hello test success: {test_response.text}")
            else:
                logger.warning(f"Java API hello test failed with status {test_response.status_code}")
        except Exception as test_ex:
            logger.error(f"Error testing Java API hello endpoint: {test_ex}")

        try:
            # Actual Java code generation call
            transformer = JsonTransformer()
            # java_payload= {
            #     "className": "com.codegen.model.ihnji",
            #     "fields": [
            #         {"name": "inni", "type": "Double", "primary": True},
            #         {"name": "knkkin", "type": "String", "primary": False},
            #         {"name": "knmkn", "type": "String", "primary": False}
            #     ]
            # }
            java_payload = transformer.transform(data)

            logger.info(f"Java API payload: {java_payload}")
            java_response = requests.post("http://localhost:8080/api/generator/generateApp", json=java_payload, timeout=20)
            if java_response.status_code == 200:
                logger.info("Java API code generation successful.")
                java_result = java_response.json()
            else:
                logger.error(f"Java API failed with status {java_response.status_code}: {java_response.text}")
                java_result = None
        except Exception as ex:
            logger.error(f"Error calling Java API: {ex}")
            java_result = None

        # 7. Generate code files
        # Get table metadata for code generation
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        
        columns_data = {}
        for col in columns:
            col_name = col[0]
            col_type = col[1].lower()
            is_nullable = col[2] == "YES"
            
            # Determine input type based on column type
            input_type = "text"  # default
            if "int" in col_type:
                input_type = "number"
            elif "date" in col_type:
                input_type = "date"
            elif "time" in col_type:
                input_type = "time"
            elif col_name.lower() in ["email", "mail"]:
                input_type = "email"
            elif col_name.lower() in ["password", "pwd"]:
                input_type = "password"
            
            # Generate validations
            validations = {
                "required": not is_nullable
            }
            
            # Add length validations for varchar
            if "varchar" in col_type:
                length_match = re.search(r'varchar\((\d+)\)', col_type)
                if length_match:
                    max_length = int(length_match.group(1))
                    validations["maxLength"] = max_length
            
            unique_id = f"id-{int(time.time())}-{''.join(random.choices(string.ascii_lowercase, k=3))}"
            
            columns_data[unique_id] = {
                "COLUMN_NAME": col_name,
                "DATA_TYPE": col_type,
                "inputType": input_type,
                "validations": validations
            }

        # Generate code files using code generator
        try:
            from core.code_generator import generate_code
            
            page_details = {
                "pageName": page_name,
                "routePath": route_path,
                "moduleName": module_name
            }
            
            logger.info("Generating code files")
            generated_files = generate_code(table_name, columns_data, page_details)
            logger.info(f"Code generation successful: {generated_files}")
            
            # Register the blueprint immediately without restarting the server
            try:
                from flask import current_app
                from core.dynamic_blueprint_loader import register_new_blueprint
                
                logger.info(f"Registering blueprint for table {table_name} immediately")
                success = register_new_blueprint(current_app, table_name)
                
                if success:
                    logger.info(f"Successfully registered blueprint for table {table_name}")
                else:
                    logger.warning(f"Failed to register blueprint for table {table_name}")
            except Exception as register_error:
                logger.error(f"Error registering blueprint: {register_error}")
                logger.info("Blueprint will be registered on next server start")
        
        except Exception as code_gen_error:
            logger.error(f"Error in code generation: {code_gen_error}")
            # Continue execution even if code generation fails
            logger.info("Continuing without code generation")
        
        # 9. Return success response
        response_data = {
            "success": True,
            "message": "Dynamic page created successfully",
            "data": {
                "menuId": menu_id,
                "subMenuId": submenu_id
            }
        }
        
        # Add generated files info if code generation was successful
        if 'generated_files' in locals() and generated_files and 'files' in generated_files:
            try:
                response_data["data"]["generatedFiles"] = [
                    os.path.basename(generated_files['files']['helper']),
                    os.path.basename(generated_files['files']['controller'])
                ]
            except Exception as e:
                logger.warning(f"Could not add generated files to response: {e}")
                response_data["data"]["generatedFiles"] = ["File generation completed but details unavailable"]
        else:
            response_data["data"]["generatedFiles"] = []
            response_data["warning"] = "Code generation was skipped or failed"
        
        # Add note about dynamic blueprint loading
        response_data["note"] = "The dynamic page has been created. The new endpoints will be available immediately without server reload."
            
        return response_data, 200


    except Error as e:
        logger.error(f"Database error in create_dynamic_page: {e}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return {
            "success": False, 
            "error": f"Database error: {str(e)}",
            "message": "There was a problem connecting to the database. Please try again later."
        }, 500


    except Exception as e:
        logger.error(f"Unexpected error in create_dynamic_page: {e}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return {
            "success": False, 
            "error": str(e),
            "message": "An unexpected error occurred while creating the dynamic page."
        }, 500
    finally:
        try:
            if cursor:
                cursor.close()
        except Exception as e:
            logger.warning(f"Error closing cursor: {e}")
            
        try:
            if conn:
                close_connection(conn)
        except Exception as e:
            logger.warning(f"Error closing connection: {e}")

def generate_crud_endpoints(table_name):
    """Generate CRUD API endpoint paths for a table"""
    return {
        "list": f"/api/{table_name}/list",
        "create": f"/api/{table_name}/create",
        "update": f"/api/{table_name}/update",
        "delete": f"/api/{table_name}/delete"
    }

def check_dynamic_page_exists(table_name):
    """
    Check if a dynamic page exists for a given table
    
    Args:
        table_name: The name of the table
        
    Returns:
        tuple: (exists, page_info)
            - exists: True if the page exists, False otherwise
            - page_info: Dictionary with page information if exists, None otherwise
    """
    try:
        # Check if the controller file exists
        controller_path = os.path.join(os.path.dirname(__file__), 'generated', f'{table_name}_controller.py')
        helper_path = os.path.join(os.path.dirname(__file__), 'generated', f'{table_name}_helper.py')
        
        controller_exists = os.path.exists(controller_path)
        helper_exists = os.path.exists(helper_path)
        
        # If both files exist, the page exists
        if controller_exists and helper_exists:
            # Get the creation time of the files
            controller_time = os.path.getmtime(controller_path)
            helper_time = os.path.getmtime(helper_path)
            
            # Get the API endpoints
            endpoints = generate_crud_endpoints(table_name)
            
            # Return the page info
            return True, {
                "tableName": table_name,
                "files": {
                    "controller": os.path.basename(controller_path),
                    "helper": os.path.basename(helper_path)
                },
                "createdAt": max(controller_time, helper_time),
                "endpoints": endpoints
            }
        
        # If only one file exists, something went wrong
        if controller_exists or helper_exists:
            logger.warning(f"Incomplete dynamic page for table {table_name}: controller={controller_exists}, helper={helper_exists}")
        
        # Page doesn't exist
        return False, None
        
    except Exception as e:
        logger.error(f"Error checking if dynamic page exists for table {table_name}: {e}")
        return False, None

def generate_crud_queries(table_name, columns):
    """Generate SQL queries for CRUD operations"""
    # CREATE query
    placeholders = ", ".join([f"%({col})s" for col in columns])
    columns_str = ", ".join(columns)
    insert_query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
    
    # READ query
    select_query = f"SELECT * FROM {table_name}"
    select_by_id_query = f"SELECT * FROM {table_name} WHERE id = %(id)s"
    
    # UPDATE query
    update_parts = [f"{col} = %({col})s" for col in columns]
    update_query = f"UPDATE {table_name} SET {', '.join(update_parts)} WHERE id = %(id)s"
    
    # DELETE query
    delete_query = f"DELETE FROM {table_name} WHERE id = %(id)s"
    
    return {
        "create": insert_query,
        "read": {
            "all": select_query,
            "by_id": select_by_id_query
        },
        "update": update_query,
        "delete": delete_query
    }
