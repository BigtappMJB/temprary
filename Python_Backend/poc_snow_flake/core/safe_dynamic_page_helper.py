"""
Safe version of the dynamic page helper with additional error handling
to prevent server crashes.
"""

import os
import time
import random
import string
import re
import logging
import traceback
from mysql.connector import Error
from typing import Dict, List, Tuple, Any, Optional

from core.database import get_database_connection, close_connection
from core.dynamic_page_helper import (
    get_table_list, get_table_metadata, check_menu_exists, create_menu,
    check_submenu_exists, create_or_update_submenu, get_permission_level_ids,
    get_all_roles, create_or_update_role_permissions
)

# Configure logging
logger = logging.getLogger('safe_dynamic_page_helper')

def safe_create_dynamic_page(data):
    """
    A safer version of create_dynamic_page with additional error handling
    to prevent server crashes.
    """
    conn = None
    cursor = None
    try:
        logger.info("Creating dynamic page with data: %s", data)
        
        # Extract data from the request
        table_name = data.get('tableName')
        menu_name = data.get('menuName')
        submenu_name = data.get('subMenuName')
        page_name = data.get('pageName', '')  # Default to empty string
        route_path = data.get('routePath', '')  # Default to empty string
        module_name = data.get('moduleName', '')  # Default to empty string
        permission_levels = data.get('permissionLevels', [])
        
        logger.info(f"Extracted data: table={table_name}, menu={menu_name}, submenu={submenu_name}, page={page_name}, route={route_path}, module={module_name}, permissions={permission_levels}")
        
        # Validate required fields
        missing_fields = []
        if not table_name: missing_fields.append('tableName')
        if not menu_name: missing_fields.append('menuName')
        if not submenu_name: missing_fields.append('subMenuName')
        if not page_name: missing_fields.append('pageName')
        if not route_path: missing_fields.append('routePath')
        if not module_name: missing_fields.append('moduleName')
        
        if missing_fields:
            return {
                "success": False, 
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }, 400
        
        # 1. Check if the table exists
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            logger.info(f"Checking if table {table_name} exists")
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]
            
            if table_name not in tables:
                logger.warning(f"Table '{table_name}' does not exist")
                return {"success": False, "error": f"Table '{table_name}' does not exist"}, 404
        except Exception as e:
            logger.error(f"Error checking if table exists: {e}")
            return {"success": False, "error": f"Database error: {str(e)}"}, 500
        
        # 2. Check if menu exists, create if not
        try:
            menu_exists, menu_id = check_menu_exists(menu_name)
            if not menu_exists:
                success, menu_id = create_menu(menu_name)
                if not success:
                    return {"success": False, "error": "Failed to create menu"}, 500
        except Exception as e:
            logger.error(f"Error checking/creating menu: {e}")
            return {"success": False, "error": f"Menu error: {str(e)}"}, 500
        
        # 3. Check if submenu exists, create or update if needed
        try:
            success, submenu_id = create_or_update_submenu(menu_id, submenu_name, route_path)
            if not success:
                return {"success": False, "error": "Failed to create/update submenu"}, 500
        except Exception as e:
            logger.error(f"Error checking/creating submenu: {e}")
            return {"success": False, "error": f"Submenu error: {str(e)}"}, 500
        
        # 4. Get permission level IDs
        try:
            success, permission_ids = get_permission_level_ids(permission_levels)
            if not success:
                return {"success": False, "error": "Failed to get permission level IDs"}, 500
        except Exception as e:
            logger.error(f"Error getting permission level IDs: {e}")
            return {"success": False, "error": f"Permission error: {str(e)}"}, 500
        
        # 5. Get all roles
        try:
            success, role_ids = get_all_roles()
            if not success:
                return {"success": False, "error": "Failed to get roles"}, 500
        except Exception as e:
            logger.error(f"Error getting roles: {e}")
            return {"success": False, "error": f"Roles error: {str(e)}"}, 500
        
        # 6. Create or update role permissions for each role and permission level
        try:
            for role_id in role_ids:
                for level, level_id in permission_ids.items():
                    success = create_or_update_role_permissions(role_id, menu_id, submenu_id, level_id)
                    if not success:
                        return {"success": False, "error": f"Failed to create/update role permission for role {role_id}"}, 500
        except Exception as e:
            logger.error(f"Error creating/updating role permissions: {e}")
            return {"success": False, "error": f"Role permissions error: {str(e)}"}, 500
        
        # 7. Generate code files - SKIP FILE OPERATIONS FOR SAFETY
        # Instead of generating files, just return success
        logger.info("Skipping file generation for safety")
        
        # 8. Return success response
        return {
            "success": True,
            "message": "Dynamic page created successfully (file generation skipped for safety)",
            "data": {
                "menuId": menu_id,
                "subMenuId": submenu_id,
                "tableName": table_name,
                "pageName": page_name,
                "routePath": route_path
            }
        }, 200
        
    except Error as e:
        logger.error(f"Database error in safe_create_dynamic_page: {e}")
        logger.error(traceback.format_exc())
        return {"success": False, "error": f"Database error: {str(e)}"}, 500
    except Exception as e:
        logger.error(f"Unexpected error in safe_create_dynamic_page: {e}")
        logger.error(traceback.format_exc())
        return {"success": False, "error": f"Unexpected error: {str(e)}"}, 500
    finally:
        if cursor:
            try:
                cursor.close()
            except:
                pass
        if conn:
            try:
                close_connection(conn)
            except:
                pass