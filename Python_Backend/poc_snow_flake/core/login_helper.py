from datetime import datetime

import snowflake.connector
import base64

from flask import current_app

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


def get_user_by_email(email):
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        query = """
        SELECT first_name, last_name, email, mobile, role, password, is_default_password_changed, is_verified, last_login_datetime
        FROM NBF_CIA.PUBLIC.USERS
        WHERE email = %s
        """
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        if user:
            return {
                "first_name": user[0],
                "last_name": user[1],
                "email": user[2],
                "mobile": user[3],
                "role": user[4],
                "password": user[5],
                "is_default_password_changed": user[6],
                "is_verified": user[7],
                "last_login_datetime": user[8].strftime('%Y-%m-%d %H:%M:%S') if user[8] else None
            }
        else:
            return None
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None
    finally:
        cursor.close()
        conn.close()


def update_last_login(email):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        # Ensure the datetime format is correct
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        current_app.logger.info(f"Updating last login datetime for email: {email} to {current_time}")

        cursor.execute(f"""
            UPDATE NBF_CIA.PUBLIC.USERS
            SET LAST_LOGIN_DATETIME = '{current_time}'
            WHERE EMAIL = '{email}'
        """)
        conn.commit()
        current_app.logger.info(f"Last login datetime updated for email: {email}")
    except Exception as e:
        current_app.logger.error(f"Error updating last login datetime for email {email}: {e}")
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
