import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from core.database import get_database_connection

def create_dynamic_pages_table():
    conn = get_database_connection()
    cursor = conn.cursor()
    
    try:
        # Create dynamic_pages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS dynamic_pages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                route_path VARCHAR(255) NOT NULL UNIQUE,
                table_name VARCHAR(255) NOT NULL,
                menu_id INT,
                submenu_id INT,
                permissions JSON NOT NULL,
                component_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (menu_id) REFERENCES menu(id),
                FOREIGN KEY (submenu_id) REFERENCES submenu(id)
            )
        """)
        conn.commit()
        print("Successfully created dynamic_pages table!")
        
    except Exception as e:
        print(f"Error creating dynamic_pages table: {str(e)}")
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_dynamic_pages_table()
