import os
from datetime import datetime, timedelta
import jwt
import snowflake.connector
import base64
import json
from flask import current_app
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# JWT configuration from environment variables
JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'default_secret_key')  # Replace 'default_secret_key' with a secure key
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXP_DELTA_SECONDS = int(os.getenv('JWT_EXP_DELTA_SECONDS', 3600))

def get_snowflake_connection():
    from mysql.connector import Error
    import mysql.connector
    from share.general_utils import mysql_config as conf
        # Establish a connection
    conn = mysql.connector.connect(
            host=conf.get('host'),
            user=conf.get('user'),
            password=conf.get('password'),
            database=conf.get('database')
        )
    return conn

def get_user_by_email(email):
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        query = """
        SELECT first_name, middle_name, last_name, email, mobile, role_id, password, is_default_password_changed, is_verified, last_login_datetime, otp
        FROM USERS
        WHERE email = %s
        """
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        if user:
            return {
                "first_name": user[0],
                "middle_name": user[1],
                "last_name": user[2],
                "email": user[3],
                "mobile": user[4],
                "role_id": user[5],
                "password": user[6],
                "is_default_password_changed": user[7],
                "is_verified": user[8],
                "last_login_datetime": user[9].strftime('%Y-%m-%d %H:%M:%S') if user[9] else None,
                "otp": user[10]
            }
        else:
            return None
    except Exception as e:
        current_app.logger.error(f"Error fetching user: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def update_last_login(email):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        current_app.logger.info(f"Updating last login datetime for email: {email} to {current_time}")

        cursor.execute(f"""
            UPDATE USERS
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
    # Compare the plain text passwords directly
    return db_password == req_password

def get_permissions_by_role(role_id):
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        query = """
        SELECT pl.LEVEL
        FROM ROLE_PERMISSION rp
        JOIN PERMISSION_LEVEL pl ON rp.PERMISSION_LEVEL = pl.ID
        WHERE rp.ROLE_ID = %s"""
        cursor.execute(query, (role_id,))
        permissions = cursor.fetchall()
        return [permission[0] for permission in permissions]
    except Exception as e:
        current_app.logger.error(f"Error fetching permissions for role_id {role_id}: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

# def get_permissions_by_email(email):
#     try:
#         conn = get_snowflake_connection()
#         cursor = conn.cursor()
#         select_query = """WITH MenuData AS (
#     SELECT 
#         r.NAME AS role_name,
#         pl.LEVEL AS permission_level,
#         m.NAME AS menu_name,
#         m.ID AS menu_id,
#         sm.ID AS submenu_id,
#         sm.NAME AS submenu_name,
#         sm.ROUTE AS submenu_path
#     FROM 
#         USERS u
#     JOIN 
#         ROLES r ON u.ROLE_ID = r.ID
#     JOIN 
#         ROLE_PERMISSION rp ON rp.ROLE_ID = r.ID
#     JOIN 
#         PERMISSION_LEVEL pl ON rp.PERMISSION_LEVEL = pl.ID
#     JOIN 
#         MENUS m ON rp.MENU_ID = m.ID
#     LEFT JOIN 
#         SUB_MENUS sm ON rp.SUB_MENU_ID = sm.ID
#     WHERE 
#         u.EMAIL = $ AND pl.ID != 16
#     ORDER BY 
#         m.ID  ASC  
# ),
# AggregatedData AS (
#     SELECT
#         role_name,
#         menu_name,
#         menu_id,
#         CONCAT(
#             '[', GROUP_CONCAT(
#                 JSON_OBJECT(
#                     'submenu_id', submenu_id,
#                     'submenu_name', submenu_name,
#                     'submenu_path', submenu_path,
#                     'permission_level', permission_level
#                 ) ORDER BY submenu_id ASC SEPARATOR ',' 
#             ), ']'
#         ) AS submenus
#     FROM
#         MenuData
#     GROUP BY
#         role_name, menu_name, menu_id
# )
# SELECT
#     JSON_OBJECT(
#         'menu_id', menu_id,
#         'menu_name', menu_name,
#         'role_name', role_name,
#         'submenus', submenus
#     ) AS menu_data
# FROM 
#     AggregatedData
# ORDER BY menu_id ASC;

#         """
#         cursor.execute(select_query, (email,))
#         permissions = cursor.fetchall()
#         return [json.loads(result[0]) for result in permissions]
#     except Exception as e:
#         current_app.logger.error(f"Error fetching permissions for email {email}: {e}")
#         return []
#     finally:
#         cursor.close()
#         conn.close()


def get_permissions_by_email(email):
    conn = None
    cursor = None
    permissions = []
    
    try:
        # Establish database connection
        conn =get_snowflake_connection()
        if conn.is_connected():
            cursor = conn.cursor()

            # SQL Query
            select_query = """
                SELECT
                    CONCAT(
                        '{\"menu_id\":', menu_id,
                        ',\"menu_name\":\"', menu_name,
                        '\",\"role_name\":\"', role_name,
                        '\",\"submenus\":[', 
                        GROUP_CONCAT(
                            CONCAT(
                                '{\"submenu_Id\":', submenu_Id,
                                ',\"submenu_name\":\"', submenu_name,
                                '\",\"submenu_path\":\"', submenu_path,
                                '\",\"permission_level\":\"', permission_level, '\"}'
                            ) SEPARATOR ','
                        ), 
                        ']}'
                    ) AS menu_data
                FROM
                    (
                        SELECT
                            r.NAME AS role_name,
                            pl.LEVEL AS permission_level,
                            m.NAME AS menu_name,
                            m.ID AS menu_id,
                            sm.ID AS submenu_Id,
                            sm.NAME AS submenu_name,
                            sm.ROUTE AS submenu_path
                        FROM
                            automationutil.USERS u
                        JOIN
                            automationutil.ROLES r ON u.ROLE_ID = r.ID
                        JOIN
                            automationutil.ROLE_PERMISSION rp ON rp.ROLE_ID = r.ID
                        JOIN
                            automationutil.PERMISSION_LEVEL pl ON rp.PERMISSION_LEVEL = pl.ID
                        JOIN
                            automationutil.MENUS m ON rp.MENU_ID = m.ID
                        LEFT JOIN
                            automationutil.SUB_MENUS sm ON rp.SUB_MENU_ID = sm.ID
                        WHERE
                            u.EMAIL = %s
                    ) AS MenuData
                GROUP BY
                    role_name, menu_name, menu_id
                ORDER BY
                    menu_id ASC;
            """

            # Execute the query
            cursor.execute(select_query, (email,))
            rows = cursor.fetchall()

            # Process the result set
            for row in rows:
                menu_data_json = row[0]
                menu_data = json.loads(menu_data_json)  # Parse JSON string
                
                permission = {
                    "menu_id": menu_data["menu_id"],
                    "menu_name": menu_data["menu_name"],
                    "role_name": menu_data["role_name"],
                    "submenus": menu_data["submenus"]
                }
                permissions.append(permission)

    except Error as e:
        print(f"Error fetching permissions for email: {email}: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    return permissions
def update_password(data, user_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE USERS SET password = %s WHERE id = %s",
            (data['password'], user_id)
        )
        conn.commit()
        return {"message": "User Password updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def create_jwt_token(user):
    payload = {
        'user_id': user['role_id'],  # Use appropriate user identifier
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
    return token

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
