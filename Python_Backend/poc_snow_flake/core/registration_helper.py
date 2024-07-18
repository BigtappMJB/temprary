import hashlib
import random
import string
from flask import jsonify
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

def generate_default_password(length=6):
    while True:
        characters = string.ascii_letters + string.digits + "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"
        password = ''.join(random.choice(characters) for _ in range(length))
        if (any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?/~`" for c in password)):
            return password

def insert_user(email, first_name, last_name, mobile, role, otp):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        INSERT INTO NBF_CIA.PUBLIC.USERS (EMAIL, FIRST_NAME, LAST_NAME, MOBILE, ROLE, PASSWORD, IS_VERIFIED)
        VALUES ('{email}', '{first_name}', '{last_name}', '{mobile}', {role}, '{otp}', 'N')
    """)
    conn.commit()
    cursor.close()
    conn.close()

def get_user_by_email(email):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM NBF_CIA.PUBLIC.USERS WHERE EMAIL = '{email}'")
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def update_user_password_and_verify(email, password):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        UPDATE NBF_CIA.PUBLIC.USERS
        SET PASSWORD = '{password}', IS_VERIFIED = 'Y'
        WHERE EMAIL = '{email}'
    """)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Password updated and user verified successfully"}), 200

def update_user_password(email, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        UPDATE NBF_CIA.PUBLIC.USERS
        SET PASSWORD = '{hashed_password}'
        WHERE EMAIL = '{email}'
    """)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Password updated successfully"}), 200

def update_user_otp(email, otp):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        UPDATE NBF_CIA.PUBLIC.USERS
        SET PASSWORD = '{otp}'
        WHERE EMAIL = '{email}'
    """)
    conn.commit()
    cursor.close()
    conn.close()
