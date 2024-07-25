import hashlib
import random
import string
from datetime import datetime
from flask import jsonify, current_app
from share.general_utils import snow_conf as conf
import snowflake.connector

def get_snowflake_connection():
    conn = snowflake.connector.connect(
        user=conf['user'],
        password=conf['password'],
        account=conf['account'],
        warehouse=conf['warehouse'],
        database=conf['database'],
        schema=conf['schema'],
        role=conf['role']
    )
    return conn

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def generate_default_password(length=8):
    if length < 8:  # Ensure length is at least 8 characters
        raise ValueError("Password length must be at least 8 characters")

    characters = string.ascii_letters + string.digits + "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"
    while True:
        password = [
            random.choice(string.ascii_lowercase),  # Ensure at least one lowercase letter
            random.choice(string.ascii_uppercase),  # Ensure at least one uppercase letter
            random.choice(string.digits),  # Ensure at least one digit
            random.choice("!@#$%^&*()-_=+[]{}|;:,.<>?/~`")  # Ensure at least one symbol
        ]
        # Add remaining characters to meet the required length
        password += random.choices(characters, k=length - 4)
        random.shuffle(password)
        password = ''.join(password)

        if (any(c.islower() for c in password)
                and any(c.isupper() for c in password)
                and any(c.isdigit() for c in password)
                and any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?/~`" for c in password)):
            return password

def insert_user(email, first_name, middle_name, last_name, mobile, role_id, otp, created_date):
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        query = """
        INSERT INTO NBF_CIA.PUBLIC.USERS (EMAIL, FIRST_NAME, MIDDLE_NAME, LAST_NAME, MOBILE, ROLE_ID, PASSWORD, CREATED_DATE)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (email, first_name, middle_name, last_name, mobile, role_id, otp, created_date))
        conn.commit()
    except Exception as e:
        current_app.logger.error(f"Error inserting user: {e}")
    finally:
        cursor.close()
        conn.close()
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
                "role": user[5],
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





def update_user_password_and_verify(email, password):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            UPDATE NBF_CIA.PUBLIC.USERS
            SET PASSWORD = '{password}', IS_VERIFIED = TRUE, UPDATED_DATE = '{datetime.now()}', UPDATED_BY = 'system'
            WHERE EMAIL = '{email}'
        """)
        conn.commit()
        current_app.logger.info(f"Password and verification status for user {email} updated in database.")
    except Exception as e:
        current_app.logger.error(f"Error updating password and verification status for user {email}: {e}")
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Password updated and user verified successfully"}), 200

def update_user_password(email, password):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            UPDATE NBF_CIA.PUBLIC.USERS
            SET PASSWORD = '{password}', IS_DEFAULT_PASSWORD_CHANGED = TRUE, UPDATED_DATE = '{datetime.now()}', UPDATED_BY = 'system'
            WHERE EMAIL = '{email}'
        """)
        conn.commit()
        current_app.logger.info(f"Password for user {email} updated in database.")
    except Exception as e:
        current_app.logger.error(f"Error updating password for user {email}: {e}")
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Password updated successfully"}), 200

def update_user_otp(email, otp):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            UPDATE NBF_CIA.PUBLIC.USERS
            SET OTP = '{otp}', UPDATED_DATE = '{datetime.now()}', UPDATED_BY = 'system'
            WHERE EMAIL = '{email}'
        """)
        conn.commit()
        current_app.logger.info(f"OTP for user {email} updated in database.")
    except Exception as e:
        current_app.logger.error(f"Error updating OTP for user {email}: {e}")
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "OTP updated successfully"}), 200
