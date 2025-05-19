import os
import mysql.connector
from dotenv import load_dotenv

def test_connection():
    try:
        # Load environment variables
        load_dotenv('environments/env.dev')
        
        # Get database connection parameters
        host = os.getenv('MYSQL_HOST')
        port = int(os.getenv('MYSQL_PORT', '3306'))
        database = os.getenv('MYSQL_DATABASE')
        user = os.getenv('MYSQL_USER')
        password = os.getenv('MYSQL_PASSWORD')
        
        print(f"Attempting to connect to MySQL: {user}@{host}:{port}/{database}")
        
        # Create connection
        conn = mysql.connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            connect_timeout=10
        )
        
        # Test the connection
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"Connected successfully! Found {len(tables)} tables:")
        for table in tables:
            print(f"- {table[0]}")
            
            # If this is the sample_table, show its structure
            if table[0] == 'sample_table':
                cursor.execute(f"DESCRIBE {table[0]}")
                columns = cursor.fetchall()
                print(f"  Columns in {table[0]}:")
                for col in columns:
                    print(f"  - {col[0]} ({col[1]})")
        
        cursor.close()
        conn.close()
        print("Connection closed successfully")
        
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    test_connection()