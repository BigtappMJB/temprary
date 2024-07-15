import json
from flask import jsonify
import snowflake.connector
from share.general_utils import snow_conf as conf

from share.snow_flake_conf import set_connections_get, set_connections_post, data_type


def create_table(params):
    query_part = [f"CREATE TABLE IF NOT EXISTS {params['table_name']} ("]

    for column in params['columns']:
        if column['column_name']:
            query_part.append(f"{column['column_name']}")
        if column['data_type']:
            query_part.append(f"{column['data_type']}")
        if bool(column['auto_increment']):
            query_part.append(f"AUTOINCREMENT")
        if column['primary_key']:
            query_part.append(f"PRIMARY KEY")
        if column['default']:
            query_part.append(f"DEFAULT {column['default']}")
        if column['nullable']:
            query_part.append(f" NOT NULL")
        query_part.append(",")
    query_part.pop()
    query_part.append(");")

    create_table_query = " ".join(query_part)
    print(create_table_query)

    # Calling the connections
    return set_connections_post(create_table_query)


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


def create_user(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (user_id, first_name, last_name, email, mobile, role) VALUES (%s, %s, %s, %s, %s, %s)",
            (data['userId'], data['firstName'], data['lastName'], data['email'], data['mobile'], data['role'])
        )
        conn.commit()
        return {"message": "User created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def get_user(user_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON r.id = u.role WHERE u.id = %s ORDER BY u.id DESC",
            (user_id,))
        user = cursor.fetchone()
        if user:
            column_names = [description[0] for description in cursor.description]
            data = [dict(zip(column_names, user))]
            json_data = json.dumps(data, indent=4)
            return json_data, 200
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
            "SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON r.id = u.role ORDER BY u.id DESC")
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
        print(data['role'])
        cursor.execute(
            "UPDATE users SET user_id = %s, first_name = %s, last_name = %s, mobile = %s, email = %s, role = %s WHERE id = %s",
            (data['userId'], data['firstName'], data['lastName'], data['mobile'], data['email'], data['role'], user_id)
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
    finally:
        cursor.close()
        conn.close()


def create_role(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO roles (name, description) VALUES (%s, %s)",
            (data['name'], data['description'])
        )
        conn.commit()
        return {"message": "Role created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def get_role(role_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM roles WHERE id = %s", (role_id,))
        role = cursor.fetchone()
        if role:
            column_names = [description[0] for description in cursor.description]
            data = [dict(zip(column_names, role))]
            json_data = json.dumps(data, indent=4)
            return json_data, 200
        else:
            return {"message": "Role not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def get_all_roles():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM roles")
        roles = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        data = [dict(zip(column_names, row)) for row in roles]
        json_data = json.dumps(data, indent=4)
        return json_data, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def update_role(role_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE roles SET name = %s, description = %s WHERE id = %s",
            (data['name'], data['description'], role_id)
        )
        conn.commit()
        return {"message": "Role updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def delete_role(role_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM roles WHERE id = %s", (role_id,))
        conn.commit()
        return {"message": "Role deleted successfully"}, 200
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
            json_data = json.dumps(menu_dict, indent=4)
            return json_data, 200
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
            json_data = json.dumps(menus_list, indent=4)
            return json_data, 200
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
        cursor.execute(
            "INSERT INTO sub_menus (menu_id, name, description) VALUES (%s, %s, %s)",
            (data['menu_id'], data['name'], data['description'])
        )
        conn.commit()
        return {"message": "SubMenu created successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def get_sub_menu(sub_menu_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT sm.*, m.name as menu_name FROM sub_menus sm LEFT JOIN menus m ON m.id = sm.id  WHERE sm.id = %s",
            (sub_menu_id,))
        sub_menu = cursor.fetchone()
        if sub_menu:
            column_names = [desc[0] for desc in cursor.description]
            sub_menu_dict = dict(zip(column_names, sub_menu))
            json_data = json.dumps(sub_menu_dict, indent=4)
            return json_data, 200
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
        cursor.execute("SELECT sm.*, m.name as menu_name FROM sub_menus sm LEFT JOIN menus m ON m.id = sm.id ")
        sub_menus = cursor.fetchall()
        if sub_menus:
            column_names = [desc[0] for desc in cursor.description]
            sub_menus_list = [dict(zip(column_names, sub_menu)) for sub_menu in sub_menus]
            json_data = json.dumps(sub_menus_list, indent=4)
            return json_data, 200
        else:
            return {"message": "No sub_menus found"}, 404
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
            "UPDATE sub_menus SET menu_id = %s, name = %s, description = %s WHERE id = %s",
            (data['menu_id'], data['name'], data['description'], sub_menu_id)
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
        cursor.execute("SELECT * FROM permission_level")
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
            return "Role permission not found", 404
        elif role_permission:
            column_names = [desc[0] for desc in cursor.description]
            print(column_names)
            role_permission_dict = dict(zip(column_names, role_permission))
            print(role_permission_dict)
            json_data = json.dumps(role_permission_dict, indent=4)
            print(json_data)
            return json_data, 200
        else:
            return {"message": "Role permission not found"}, 404
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
            json_data = json.dumps(role_permissions_list, indent=4)
            return json_data, 200
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
