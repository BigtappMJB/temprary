"""Database helper functions for user management and related operations.

This module provides functions for managing users, roles, permissions, menus,
and other database operations in the application.
"""

import json
import logging
import random
import string
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional

import mysql.connector
from mysql.connector import Error
from flask import jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_table(params: Dict[str, Any]) -> Tuple[Dict[str, str], int]:
    """Create a new table in the database.

    Args:
        params (Dict[str, Any]): Dictionary containing table creation parameters.
            Must include 'table_name' and 'columns' keys.

    Returns:
        Tuple[Dict[str, str], int]: A tuple containing the response message and status code.

    Raises:
        ValueError: If required parameters are missing or invalid.
    """
    if not params.get('table_name'):
        raise ValueError("Table name is required")
    if not params.get('columns'):
        raise ValueError("At least one column is required")

    query_parts = [f"CREATE TABLE IF NOT EXISTS {params['table_name']} ("]
    try:
        for column in params['columns']:
            column_def = []
            
            # Column name is required
            if not column.get('column_name'):
                raise ValueError(f"Column name is required for all columns")
            column_def.append(column['column_name'])
            
            # Data type is required
            if not column.get('data_type'):
                raise ValueError(f"Data type is required for column {column['column_name']}")
            
            # Add data type with optional length
            if column.get('length'):
                column_def.append(f"{column['data_type']}({column['length']})")
            else:
                column_def.append(column['data_type'])
            
            # Add column constraints
            if column.get('auto_increment'):
                column_def.append("AUTO_INCREMENT")
            if column.get('primary_key'):
                column_def.append("PRIMARY KEY")
            if column.get('default') is not None:
                column_def.append(f"DEFAULT '{column['default']}'")
            if column.get('nullable') is False:
                column_def.append("NOT NULL")
            
            query_parts.append(" ".join(column_def))
            query_parts.append(",")
            
            # Add foreign key if specified
            if column.get('foreign_key'):
                if not column.get('fk_table_name') or not column.get('fk_column_name'):
                    raise ValueError(f"Foreign key reference table and column are required for {column['column_name']}")
                query_parts.append(
                    f"FOREIGN KEY ({column['column_name']}) REFERENCES {column['fk_table_name']}({column['fk_column_name']})")
                query_parts.append(",")
        
        # Remove trailing comma and close parenthesis
        if query_parts[-1] == ",":
            query_parts.pop()
        query_parts.append(");")

        create_table_query = " ".join(query_parts)
        logger.info(f"Creating table with query: {create_table_query}")

        conn = None
        cursor = None
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            cursor.execute(create_table_query)
            conn.commit()
            return {"message": f"Table {params['table_name']} created successfully"}, 201
        except Error as err:
            logger.error(f"Error creating table: {err}")
            return {"error": str(err)}, 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    except ValueError as ve:
        logger.error(f"Validation error: {ve}")
        return {"error": str(ve)}, 400
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {"error": "An unexpected error occurred"}, 500


def get_data_types() -> List[Dict[str, Any]]:
    """Get a list of supported MySQL data types.

    Returns:
        List[Dict[str, Any]]: List of dictionaries containing data type information.
    """
    return [
        {"id": 1, "name": "INT", "description": "Integer data type"},
        {"id": 2, "name": "VARCHAR", "description": "Variable-length string"},
        {"id": 3, "name": "TEXT", "description": "Long text string"},
        {"id": 4, "name": "DATE", "description": "Date without time"},
        {"id": 5, "name": "DATETIME", "description": "Date and time"},
        {"id": 6, "name": "DECIMAL", "description": "Decimal numbers"},
        {"id": 7, "name": "BOOLEAN", "description": "True/False values"},
        {"id": 8, "name": "FLOAT", "description": "Floating point numbers"},
        {"id": 9, "name": "DOUBLE", "description": "Double precision numbers"},
        {"id": 10, "name": "TIMESTAMP", "description": "Timestamp with timezone"},
        {"id": 11, "name": "CHAR", "description": "Fixed-length string"},
        {"id": 12, "name": "BIGINT", "description": "Large integer"}
    ]

def fetch_all_tables() -> List[Dict[str, Any]]:
    """Fetch all tables from the database with their metadata.

    Returns:
        List[Dict[str, Any]]: List of dictionaries containing table information.

    Raises:
        Exception: If database query fails.
    """
    conn = None
    cursor = None
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                table_name as name,
                table_rows as row_count,
                create_time,
                update_time
            FROM information_schema.tables 
            WHERE table_schema = 'automationUtil'
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in tables]
        
        # Convert datetime objects to strings for JSON serialization
        for table in data:
            if table.get('create_time'):
                table['create_time'] = table['create_time'].isoformat()
            if table.get('update_time'):
                table['update_time'] = table['update_time'].isoformat()
        
        return data
    except Error as err:
        logger.error(f"Error fetching tables: {err}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# Function to validate the incoming JSON and ensure all required keys are present
def validate_json(data):
    if "table_name" not in data or not isinstance(data["table_name"], str):
        return False, "Invalid or missing 'table_name'."

    if "columns" not in data or not isinstance(data["columns"], list):
        return False, "Invalid or missing 'columns' list."

    for column in data["columns"]:
        if "column_name" not in column or not isinstance(column["column_name"], str):
            return False, f"Invalid or missing 'column_name' in one of the columns."

        if "data_type" not in column or not isinstance(column["data_type"], dict):
            return False, f"Invalid or missing 'data_type' in column {column['column_name']}."

        if "name" not in column["data_type"] or not isinstance(column["data_type"]["name"], str):
            return False, f"Invalid or missing 'data_type.name' in column {column['column_name']}."

        if "length" not in column or not isinstance(column["length"], int):
            return False, f"Invalid or missing 'length' in column {column['column_name']}."

        if "primary_key" in column and not isinstance(column["primary_key"], bool):
            return False, f"Invalid 'primary_key' in column {column['column_name']}."

        if "auto_increment" in column and not isinstance(column["auto_increment"], bool):
            return False, f"Invalid 'auto_increment' in column {column['column_name']}."

        if "nullable" in column and not isinstance(column["nullable"], bool):
            return False, f"Invalid 'nullable' in column {column['column_name']}."

        if "foreign_keys" in column and not isinstance(column["foreign_keys"], (list, bool)):
            return False, f"Invalid 'foreign_keys' in column {column['column_name']}."

    return True, None

# Function to create a MySQL CREATE TABLE query based on input JSON
def generate_create_query(data):
    dataTypeRequiredLength = [
    'CHAR',
    'VARCHAR',
    'BINARY',
    'VARBINARY',
    'DECIMAL',
    'FLOAT',
    'DOUBLE',
    'ENUM',
    'SET'
]
    
    table_name = data.get("table_name")
    columns = data.get("columns")
    include_audit = data.get("includeAuditColumns", False)
    created_by = data.get("created_by")

    # Start building the query
    query = f"CREATE TABLE {table_name} (\n"

    column_definitions = []

    # Loop through each column in the input data
    for column in columns:
        column_name = column["column_name"]
        data_type = column["data_type"]["name"]
        length = column["length"]
        is_mandatory = "NOT NULL" if column["isMandatory"] else "NULL"
        auto_increment = "AUTO_INCREMENT" if column.get("auto_increment", False) else ""
        primary_key = column.get("primary_key", False)

        # If length is greater than 0, include it in the data type
        if length > 0 and data_type in dataTypeRequiredLength:
            data_type = f"{data_type}({length})"

        # Build the column definition
        column_def = f"    {column_name} {data_type} {is_mandatory} {auto_increment}"
        column_definitions.append(column_def.strip())

        # Check if the column is a foreign key
        if column.get("foreign_key", False):
            fk_table_name = column["fk_table_name"]
            fk_column_name = column["fk_column_name"]
            foreign_key_constraint = f"    CONSTRAINT fk_{column_name} FOREIGN KEY ({column_name}) REFERENCES {fk_table_name}({fk_column_name})"
            column_definitions.append(foreign_key_constraint)

    # Add the column definitions to the query
    query += ",\n".join(column_definitions)

    # Add audit columns if specified
    if include_audit:
        audit_columns = """
     created_by VARCHAR(255) DEFAULT "System",   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) DEFAULT "System", 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"""
        query += f",\n{audit_columns}"

    # Add primary key if defined
    primary_keys = [col["column_name"] for col in columns if col.get("primary_key", False)]
    if primary_keys:
        primary_key_def = f"    PRIMARY KEY ({', '.join(primary_keys)})"
        query += f",\n{primary_key_def}"

    # End the query
    query += "\n) ENGINE=InnoDB;"

    return query
    return query


def get_database_connection() -> mysql.connector.MySQLConnection:
    """Create a connection to the MySQL database.

    Returns:
        MySQLConnection: A connection to the MySQL database.

    Raises:
        Exception: If connection fails or database does not exist.
    """
    try:
        conn = mysql.connector.connect(
            host='13.201.216.64',
            port=3306,
            user='automation',
            password='Welcome@2024*',
            database='automationUtil'
        )
        return conn
    except Error as err:
        logger.error(f"Database connection error: {err}")
        if err.errno == 2003:
            raise Exception("Could not connect to MySQL server. Please check if the server is accessible.")
        elif err.errno == 1049:
            raise Exception("Database does not exist. Please check the database name.")
        else:
            raise Exception(f"MySQL Error: {str(err)}")

def fetch_all_users():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT u.*, r.name as role_name 
            FROM users u 
            LEFT JOIN roles r ON r.id = u.role_id 
            ORDER BY u.id DESC
        """)
        users = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in users]
        return data
    except Exception as e:
        raise e
    finally:
        cursor.close()
        conn.close()



def generate_default_password(length=8):
    """Generate a random default password."""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

def create_user(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    default_pass = "V2VsY29tZUAxMjMk"
    try:
        # Generate default password
        default_password = generate_default_password()

        # Send default password to user's email using existing email method
        send_default_password(data['email'], default_password)

        # Insert the new user into the users table
        cursor.execute(
            "INSERT INTO users (first_name, middle_name, last_name, email, mobile, role_id, password, is_verified, is_default_password_changed, created_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)",
            (data['first_name'], data['middle_name'], data['last_name'], data['email'], data['mobile'], data['role_id'], default_password, True, False)
        )
        conn.commit()
        return {"message": "User created successfully"}, 201
    except Exception as e:
        current_app.logger.error(f"Error occurred while creating user: {e}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_user(user_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = %s ORDER BY u.id DESC",
            (user_id,))
        user = cursor.fetchone()
        if user:
            column_names = [description[0] for description in cursor.description]
            user_dict = dict(zip(column_names, user))
            # Convert datetime objects to strings
            for key, value in user_dict.items():
                if isinstance(value, datetime):
                    user_dict[key] = value.isoformat()
            return user_dict, 200
        else:
            return {"message": "User not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_users():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON r.id = u.role_id ORDER BY u.id DESC")
        users = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in users]
        json_data = json.dumps(data, indent=4)
        return json_data, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
        
        
def get_all_input_field():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM input_field")
        input_fields = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in input_fields]
        return data
    except Exception as e:
        raise e
    finally:
        cursor.close()
        conn.close()


def update_user(user_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE users SET first_name = %s, middle_name = %s, last_name = %s, mobile = %s, email = %s, role_id = %s WHERE id = %s",
            (data['first_name'], data['middle_name'], data['last_name'], data['mobile'], data['email'], data['role_id'], user_id)
        )
        conn.commit()
        return {"message": "User updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_user(user_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        return {"message": "User deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
        cursor.execute("""SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE();
                       """)
        users = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in users]
        return data
    except Exception as e:
        raise e
    finally:
        cursor.close()
        conn.close()

def fetch_column_details(table_name):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
     
        query = f"""   SELECT
COLUMN_NAME,COLUMN_KEY,EXTRA, IS_NULLABLE, DATA_TYPE,COLUMN_DEFAULT, CHARACTER_MAXIMUM_LENGTH, NUMERIC_SCALE, NUMERIC_PRECISION
FROM
   INFORMATION_SCHEMA.COLUMNS
WHERE
   TABLE_NAME = '{table_name.upper()}' 
#    AND EXTRA NOT LIKE '%auto_increment%'  -- No identity/auto_increment
   AND TABLE_SCHEMA = DATABASE()
ORDER BY
   ORDINAL_POSITION;"""
        cursor.execute(query)
        users = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in users]
        return data
    except Exception as e:
        raise e
    finally:
        cursor.close()
        conn.close()
        
        

def dynamic_page_creation(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO dynamic_page_creation (table_name, description) VALUES (%s, %s)",
            (data['table_name'], data['description'])
        )
        conn.commit()
        return {"message": "Dynamic page created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def dynamic_page_creation(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO dynamic_page_creation (table_name, description) VALUES (%s, %s)",
            (data['table_name'], data['description'])
        )
        conn.commit()
        return {"message": "Dynamic page created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def create_menu(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO menus (name, description) VALUES (%s, %s)",
            (data['name'], data['description'])
        )
        conn.commit()
        return {"message": "Menu created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_menu(menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM menus WHERE id = %s", (menu_id,))
        menu = cursor.fetchone()
        if menu:
            column_names = [desc[0] for desc in cursor.description]
            menu_dict = dict(zip(column_names, menu))
            return menu_dict, 200
        else:
            return {"message": "Menu not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_menus():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM menus")
        menus = cursor.fetchall()
        if menus:
            column_names = [desc[0] for desc in cursor.description]
            menus_list = [dict(zip(column_names, menu)) for menu in menus]
            return menus_list, 200
        else:
            return {"message": "No menus found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def update_menu(menu_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE menus SET name = %s, description = %s WHERE id = %s",
            (data['name'], data['description'], menu_id)
        )
        conn.commit()
        return {"message": "Menu updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def delete_menu(menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Check if there are any submenus associated with this menu
        cursor.execute("SELECT COUNT(*) FROM sub_menus WHERE menu_id = %s", (menu_id,))
        sub_menu_count = cursor.fetchone()[0]

        if sub_menu_count > 0:
            return {"error": "Cannot delete menu with associated submenus"}, 400

        # If no submenus are associated, proceed to delete the menu
        cursor.execute("DELETE FROM menus WHERE id = %s", (menu_id,))
        conn.commit()
        return {"message": "Menu deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def create_sub_menu(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Insert a new submenu into the sub_menus table
        cursor.execute(
            "INSERT INTO sub_menus (menu_id, name, description, route) VALUES (%s, %s, %s, %s)",
            (data['menu_id'], data['name'], data['description'], data['route'])
        )
        conn.commit()
        return {"message": "SubMenu created successfully"}, 201
    except Exception as e:
        # Return error message and status code 500 if any exception occurs
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_sub_menu(sub_menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """SELECT sm.*, m.name as menu_name 
            FROM sub_menus sm 
            LEFT JOIN menus m ON m.id = sm.menu_id 
            WHERE sm.id = %s""", 
            (sub_menu_id,)
        )
        sub_menu = cursor.fetchone()
        if sub_menu:
            column_names = [desc[0] for desc in cursor.description]
            sub_menu_dict = dict(zip(column_names, sub_menu))
            return sub_menu_dict, 200
        else:
            return {"message": "SubMenu not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_sub_menus():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """SELECT sm.*, m.name as menu_name 
            FROM sub_menus sm 
            LEFT JOIN menus m ON m.id = sm.menu_id 
            ORDER BY sm.id DESC"""
        )
        sub_menus = cursor.fetchall()
        if sub_menus:
            column_names = [desc[0] for desc in cursor.description]
            sub_menus_list = [dict(zip(column_names, sub_menu)) for sub_menu in sub_menus]
            return sub_menus_list, 200
        else:
            return {"message": "No submenus found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def update_sub_menu(sub_menu_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE sub_menus SET menu_id = %s, name = %s, description = %s, route = %s WHERE id = %s",
            (data['menu_id'], data['name'], data['description'], data['route'], sub_menu_id)
        )
        conn.commit()
        return {"message": "SubMenu updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_sub_menu(sub_menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM sub_menus WHERE id = %s", (sub_menu_id,))
        conn.commit()
        return {"message": "SubMenu deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def create_permission(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO permission_level (level) VALUES (%s)",
            (data['level'],)
        )
        conn.commit()
        return {"message": "Permission created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def default_json_serializer(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def get_permission(permission_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM permission_level WHERE id = %s", (permission_id,))
        permission = cursor.fetchone()
        if permission:
            column_names = [desc[0] for desc in cursor.description]
            permission_dict = dict(zip(column_names, permission))
            json_data = json.dumps(permission_dict, default=default_json_serializer, indent=4)
            return json_data, 200
        else:
            return {"message": "Permission not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_permissions():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM permission_level")
        permissions = cursor.fetchall()
        if permissions:
            column_names = [desc[0] for desc in cursor.description]
            permissions_list = [dict(zip(column_names, permission)) for permission in permissions]
            json_data = json.dumps(permissions_list, default=default_json_serializer, indent=4)
            return json_data, 200
        else:
            return {"message": "No permissions found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def update_permission(permission_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE permission_level SET level = %s WHERE id = %s",
            (data['level'], permission_id)
        )
        conn.commit()
        return {"message": "Permission updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def delete_permission(permission_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM permission_level WHERE id = %s", (permission_id,))
        conn.commit()
        return {"message": "Permission deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def create_role_permission(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO role_permission (role_id, menu_id, sub_menu_id, permission_level) VALUES (%s, %s, %s, %s)",
            (data['role_id'], data['menu_id'], data['submenu_id'], data['permission_level'])
        )
        conn.commit()
        return {"message": "Role permission created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
        

def get_role_permission(role_permission_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        SELECT rp.*, r.name as role_name, m.name as menu_name, sm.name AS sub_menu_name, p.level AS permission 
        FROM role_permission rp 
        LEFT JOIN roles r ON r.id = rp.role_id
        LEFT JOIN menus m ON m.id = rp.menu_id 
        LEFT JOIN sub_menus sm ON sm.id = rp.sub_menu_id 
        LEFT JOIN permission_level p ON p.id = rp.permission_level
        WHERE rp.id = %s""", (role_permission_id,))

        role_permission = cursor.fetchone()
        if role_permission is None:
            return {"message": "Role permission not found"}, 404
        column_names = [desc[0] for desc in cursor.description]
        role_permission_dict = dict(zip(column_names, role_permission))
        return role_permission_dict, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_role_permissions():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        SELECT rp.*, r.name as role_name, m.name as menu_name, sm.name AS sub_menu_name, p.level AS permission 
        FROM role_permission rp 
        LEFT JOIN roles r ON r.id = rp.role_id
        LEFT JOIN menus m ON m.id = rp.menu_id 
        LEFT JOIN sub_menus sm ON sm.id = rp.sub_menu_id 
        LEFT JOIN permission_level p ON p.id = rp.permission_level
        ORDER BY rp.id DESC
        """)
        role_permissions = cursor.fetchall()
        if role_permissions:
            column_names = [desc[0] for desc in cursor.description]
            role_permissions_list = [dict(zip(column_names, role_permission)) for role_permission in role_permissions]
            return role_permissions_list, 200
        else:
            return {"message": "No role permissions found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def update_role_permission(role_permission_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE role_permission SET role_id = %s, menu_id = %s, sub_menu_id = %s, permission_level = %s WHERE id = %s",
            (data['role_id'], data['menu_id'], data['submenu_id'], data['permission_level'], role_permission_id)
        )
        conn.commit()
        return {"message": "Role permission updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_role_permission(role_permission_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM role_permission WHERE id = %s", (role_permission_id,))
        conn.commit()
        return {"message": "Role permission deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()