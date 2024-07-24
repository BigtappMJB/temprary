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
        SELECT first_name, middle_name, last_name, email, mobile, role_id, password, is_default_password_changed, is_verified, last_login_datetime, otp
        FROM NBF_CIA.PUBLIC.USERS
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


def get_permissions_by_role(role_id):
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        query = """
        SELECT p.permission_level
        FROM NBF_CIA.PUBLIC.ROLE_PERMISSION rp
        JOIN NBF_CIA.PUBLIC.PERMISSIONS p ON rp.permission_id = p.id
        WHERE rp.role_id = %s
        """
        cursor.execute(query, (role_id,))
        permissions = cursor.fetchall()
        return [permission[0] for permission in permissions]
    except Exception as e:
        current_app.logger.error(f"Error fetching permissions for role_id {role_id}: {e}")
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
