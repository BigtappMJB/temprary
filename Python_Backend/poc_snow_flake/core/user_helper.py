import json
import random
import string
from datetime import datetime

from flask import jsonify, current_app
import snowflake.connector
from share.general_utils import snow_conf as conf

from share.snow_flake_conf import set_connections_get, set_connections_post, data_type
from core.registration_controller import send_default_password

def create_table(params):
    query_part = [f"CREATE TABLE IF NOT EXISTS {params['table_name']} ("]
    try:
        for column in params['columns']:
            print(column['default'])
            if column['column_name']:
                query_part.append(f"{column['column_name']}")
            if column['data_type']:
                # if column['length']:
                #     query_part.append(f"{column['data_type']}({column['length']})")
                # else:
                query_part.append(f"{column['data_type']}")
            if bool(column['auto_increment']):
                query_part.append(f"AUTOINCREMENT")
            if column['primary_key']:
                query_part.append(f"PRIMARY KEY")
            if column['default']:
                query_part.append(f"DEFAULT '{column['default']}'")
            if column['nullable']:
                query_part.append(f" NOT NULL")
            query_part.append(",")
        for re_check in params.get('columns', []):
            if re_check['foreign_keys']:
                foreign_key = re_check['foreign_keys']
                query_part.append(
                    f"FOREIGN KEY ({re_check['column_name']}) REFERENCES {foreign_key['table']}({foreign_key['ref_column']})")
                query_part.append(",")
        query_part.pop()
        query_part.append(");")

        create_table_query = " ".join(query_part)
        print(create_table_query)

        # Calling the connections
        return set_connections_post(create_table_query)
    except snowflake.connector.Error as error:
        print("here is the error")
        return json.dumps({"error": str(error)}), 501
    except Exception as error:
        print("here is the error 2")
        return json.dumps({"error": str(error)}), 501


def get_data_type():
    return data_type, 200


def get_snowflake_connection():
    conn = snowflake.connector.connect(
        user=conf.get('user'),
        password=conf.get('password'),
        account=conf.get('account'),
        warehouse=conf.get('warehouse'),
        database=conf.get('database'),
        schema=conf.get('schema')
    )
    return conn


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

        # Insert the new user into the USERS table
        cursor.execute(
            "INSERT INTO NBF_CIA.PUBLIC.USERS (FIRST_NAME, MIDDLE_NAME, LAST_NAME, EMAIL, MOBILE, ROLE_ID, PASSWORD, IS_VERIFIED, IS_DEFAULT_PASSWORD_CHANGED, CREATED_DATE) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)",
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
            "SELECT u.*, r.name as role_name FROM NBF_CIA.PUBLIC.USERS u LEFT JOIN NBF_CIA.PUBLIC.ROLES r ON r.ID = u.ROLE_ID WHERE u.ID = %s ORDER BY u.ID DESC",
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
            "SELECT u.*, r.name as role_name FROM NBF_CIA.PUBLIC.USERS u LEFT JOIN NBF_CIA.PUBLIC.ROLES r ON r.ID = u.ROLE_ID ORDER BY u.ID DESC")
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

def update_user(user_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE NBF_CIA.PUBLIC.USERS SET FIRST_NAME = %s, MIDDLE_NAME = %s, LAST_NAME = %s, MOBILE = %s, EMAIL = %s, ROLE_ID = %s WHERE ID = %s",
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
        cursor.execute("DELETE FROM NBF_CIA.PUBLIC.USERS WHERE ID = %s", (user_id,))
        conn.commit()
        return {"message": "User deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def fetch_all_users():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT u.*, r.name as role_name FROM NBF_CIA.PUBLIC.USERS u LEFT JOIN NBF_CIA.PUBLIC.ROLES r ON r.ID = u.ROLE_ID ORDER BY u.ID DESC")
        users = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in users]
        return data
    except Exception as e:
        raise e
    finally:
        cursor.close()
        conn.close()





def create_menu(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO NBF_CIA.PUBLIC.MENUS (NAME, DESCRIPTION) VALUES (%s, %s)",
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
        cursor.execute("SELECT * FROM NBF_CIA.PUBLIC.MENUS WHERE ID = %s", (menu_id,))
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
        cursor.execute("SELECT * FROM NBF_CIA.PUBLIC.MENUS")
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
            "UPDATE NBF_CIA.PUBLIC.MENUS SET NAME = %s, DESCRIPTION = %s WHERE ID = %s",
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
        cursor.execute("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.SUB_MENUS WHERE MENU_ID = %s", (menu_id,))
        sub_menu_count = cursor.fetchone()[0]

        if sub_menu_count > 0:
            return {"error": "Cannot delete menu with associated submenus"}, 400

        # If no submenus are associated, proceed to delete the menu
        cursor.execute("DELETE FROM NBF_CIA.PUBLIC.MENUS WHERE ID = %s", (menu_id,))
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
        # Insert a new submenu into the SUB_MENUS table
        cursor.execute(
            "INSERT INTO NBF_CIA.PUBLIC.SUB_MENUS (MENU_ID, NAME, DESCRIPTION, ROUTE) VALUES (%s, %s, %s, %s)",
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
        # Select a submenu along with its associated menu name by ID
        cursor.execute(
            "SELECT sm.*, m.NAME as menu_name FROM NBF_CIA.PUBLIC.SUB_MENUS sm LEFT JOIN NBF_CIA.PUBLIC.MENUS m ON m.ID = sm.MENU_ID WHERE sm.ID = %s",
            (sub_menu_id,)
        )
        sub_menu = cursor.fetchone()
        if sub_menu:
            # Create a dictionary with the submenu data if found
            column_names = [desc[0] for desc in cursor.description]
            sub_menu_dict = dict(zip(column_names, sub_menu))
            return sub_menu_dict, 200
        else:
            # Return message and status code 404 if submenu is not found
            return {"message": "SubMenu not found"}, 404
    except Exception as e:
        # Return error message and status code 500 if any exception occurs
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_sub_menus():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Select all submenus along with their associated menu names
        cursor.execute("SELECT sm.*, m.NAME as menu_name FROM NBF_CIA.PUBLIC.SUB_MENUS sm LEFT JOIN NBF_CIA.PUBLIC.MENUS m ON m.ID = sm.MENU_ID")
        sub_menus = cursor.fetchall()
        if sub_menus:
            # Create a list of dictionaries with all submenus data if found
            column_names = [desc[0] for desc in cursor.description]
            sub_menus_list = [dict(zip(column_names, sub_menu)) for sub_menu in sub_menus]
            return sub_menus_list, 200
        else:
            # Return message and status code 404 if no submenus are found
            return {"message": "No sub_menus found"}, 404
    except Exception as e:
        # Return error message and status code 500 if any exception occurs
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def update_sub_menu(sub_menu_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Update the submenu details based on the given ID
        cursor.execute(
            "UPDATE NBF_CIA.PUBLIC.SUB_MENUS SET MENU_ID = %s, NAME = %s, DESCRIPTION = %s, ROUTE = %s WHERE ID = %s",
            (data['menu_id'], data['name'], data['description'], data['route'], sub_menu_id)
        )
        conn.commit()
        return {"message": "SubMenu updated successfully"}, 200
    except Exception as e:
        # Return error message and status code 500 if any exception occurs
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_sub_menu(sub_menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Check if the submenu is mapped to any role permission
        cursor.execute("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.ROLE_PERMISSION WHERE SUB_MENU_ID = %s", (sub_menu_id,))
        count = cursor.fetchone()[0]

        if count > 0:
            return {"message": "SubMenu is mapped to role permission and cannot be deleted"}, 400

        # Delete the submenu based on the given ID
        cursor.execute("DELETE FROM NBF_CIA.PUBLIC.SUB_MENUS WHERE ID = %s", (sub_menu_id,))
        conn.commit()
        return {"message": "SubMenu deleted successfully"}, 200
    except Exception as e:
        # Return error message and status code 500 if any exception occurs
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


def get_permission(permission_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM permission_level WHERE id = %s", (permission_id,))
        permission = cursor.fetchone()
        if permission:
            column_names = [desc[0] for desc in cursor.description]
            permission_dict = dict(zip(column_names, permission))
            json_data = json.dumps(permission_dict, indent=4)
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
        cursor.execute("SELECT * FROM NBF_CIA.PUBLIC.PERMISSION_LEVEL")
        permissions = cursor.fetchall()
        if permissions:
            column_names = [desc[0] for desc in cursor.description]
            permissions_list = [dict(zip(column_names, permission)) for permission in permissions]
            json_data = json.dumps(permissions_list, indent=4)
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
            "UPDATE NBF_CIA.PUBLIC.PERMISSION_LEVEL SET level = %s WHERE id = %s",
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
        cursor.execute("DELETE FROM NBF_CIA.PUBLIC.PERMISSION_LEVEL WHERE id = %s", (permission_id,))
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
            "INSERT INTO NBF_CIA.PUBLIC.ROLE_PERMISSION (ROLE_ID, MENU_ID, SUB_MENU_ID, PERMISSION_LEVEL) VALUES (%s, %s, %s, %s)",
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
        FROM NBF_CIA.PUBLIC.ROLE_PERMISSION rp 
        LEFT JOIN NBF_CIA.PUBLIC.ROLES r ON r.id = rp.role_id
        LEFT JOIN NBF_CIA.PUBLIC.MENUS m ON m.id = rp.menu_id 
        LEFT JOIN NBF_CIA.PUBLIC.SUB_MENUS sm ON sm.id = rp.sub_menu_id 
        LEFT JOIN NBF_CIA.PUBLIC.PERMISSION_LEVEL p ON p.id = rp.permission_level
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
        FROM NBF_CIA.PUBLIC.ROLE_PERMISSION rp 
        LEFT JOIN NBF_CIA.PUBLIC.ROLES r ON r.id = rp.role_id
        LEFT JOIN NBF_CIA.PUBLIC.MENUS m ON m.id = rp.menu_id 
        LEFT JOIN NBF_CIA.PUBLIC.SUB_MENUS sm ON sm.id = rp.sub_menu_id 
        LEFT JOIN NBF_CIA.PUBLIC.PERMISSION_LEVEL p ON p.id = rp.permission_level
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
            "UPDATE NBF_CIA.PUBLIC.ROLE_PERMISSION SET ROLE_ID = %s, MENU_ID = %s, SUB_MENU_ID = %s, PERMISSION_LEVEL = %s WHERE ID = %s",
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
        cursor.execute("DELETE FROM NBF_CIA.PUBLIC.ROLE_PERMISSION WHERE ID = %s", (role_permission_id,))
        conn.commit()
        return {"message": "Role permission deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()