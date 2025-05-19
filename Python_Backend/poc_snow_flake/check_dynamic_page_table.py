import os
import mysql.connector
from dotenv import load_dotenv

def check_dynamic_page_table():
    try:
        # Load environment variables
        load_dotenv('environments/env.dev')
        
        # Get database connection parameters
        host = os.getenv('MYSQL_HOST')
        port = int(os.getenv('MYSQL_PORT', '3306'))
        database = os.getenv('MYSQL_DATABASE')
        user = os.getenv('MYSQL_USER')
        password = os.getenv('MYSQL_PASSWORD')
        
        # Create connection
        conn = mysql.connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            connect_timeout=10
        )
        
        # Check dynamic_page_creation table
        cursor = conn.cursor()
        cursor.execute("DESCRIBE dynamic_page_creation")
        columns = cursor.fetchall()
        print(f"Columns in dynamic_page_creation:")
        for col in columns:
            print(f"- {col[0]} ({col[1]})")
        
        # Check existing records
        cursor.execute("SELECT * FROM dynamic_page_creation")
        records = cursor.fetchall()
        print(f"\nFound {len(records)} records in dynamic_page_creation table")
        
        # Get column names
        cursor.execute("SHOW COLUMNS FROM dynamic_page_creation")
        column_names = [column[0] for column in cursor.fetchall()]
        print(f"Column names: {column_names}")
        
        # Print records
        for record in records:
            record_dict = {column_names[i]: record[i] for i in range(len(column_names))}
            print(f"Record: {record_dict}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dynamic_page_table()