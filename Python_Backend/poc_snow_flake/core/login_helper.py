import snowflake.connector
import base64
from share.general_utils import snow_conf as conf


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


def get_user_by_id_or_email(user_identifier):
    try:
        # Establish the Snowflake connection
        conn = get_snowflake_connection()

        # Create a cursor object
        cursor = conn.cursor()

        # Prepare the SQL query
        query = """
        SELECT user_id, first_name, last_name, email, mobile, role, password
        FROM users
        WHERE user_id = %s OR email = %s
        """

        # Execute the query
        cursor.execute(query, (user_identifier, user_identifier))

        # Fetch one result
        user = cursor.fetchone()

        # Check if a user was found
        if user:
            # Convert the result to a dictionary for easier access
            return {
                "user_id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "email": user[3],
                "mobile": user[4],
                "role": user[5],
                "password": user[6]  # Assuming password is stored here, adjust as necessary
            }
        else:
            return None

    except Exception as e:
        print(f"Error fetching user: {e}")
        return None
    finally:
        cursor.close()
        conn.close()


def decrypt_password(encoded_password):
    decoded_bytes = base64.b64decode(encoded_password)
    return decoded_bytes.decode('utf-8')


def check_password_hash(db_password, req_password):
    decoded_db = base64.b64decode(db_password)
    decoded_req = base64.b64decode(req_password)
    return decoded_db == decoded_req


def get_permissions_by_role(role):
    try:
        # Establish the Snowflake connection
        conn = get_snowflake_connection()

        # Create a cursor object
        cursor = conn.cursor()

        # Prepare the SQL query to fetch menu and submenu permissions
        query = """
        SELECT m.id, m.name, s.id, s.name, p.level
        FROM role_permission rp
        JOIN menus m ON rp.menu_id = m.id
        JOIN sub_menus s ON rp.sub_menu_id = s.id
        JOIN permission_level p ON rp.permission_level = p.id
        WHERE rp.role_id = %s;
        """

        # Execute the query
        cursor.execute(query, (role,))

        # Fetch all results
        results = cursor.fetchall()

        permissions = {}
        for menu_id, menu_name, submenu_id, submenu_name, permission_level in results:
            if menu_id not in permissions:
                permissions[menu_id] = {"menu_name": menu_name, "submenus": []}
            permissions[menu_id]["submenus"].append(
                {"submenu_id": submenu_id, "submenu_name": submenu_name, "permission_level": permission_level})

        # Convert the dictionary to the list format
        permissions_list = [{"menu_id": menu_id, "menu_name": data["menu_name"], "submenus": data["submenus"]} for
                            menu_id, data in permissions.items()]

        # `permissions_list` will be in the desired format

        return permissions_list

    except Exception as e:
        print(f"Error fetching permissions: {e}")
        return []
    finally:
        cursor.close()
        conn.close()


def update_password(data, user_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE users SET password = %s WHERE id = %s",
            (data['password'], user_id)
        )

        conn.commit()
        return {"message": "User Password updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
