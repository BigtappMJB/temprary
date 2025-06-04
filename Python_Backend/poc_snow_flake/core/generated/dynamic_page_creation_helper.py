from core.database import get_database_connection
import json

class DynamicPageCreationHelper:
    @staticmethod
    def get_all_dynamic_page_creation():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM dynamic_page_creation")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_dynamic_page_creation(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["dynamic_page_id", "tableName", "pageName", "file_path", "routePath"]
            placeholders = ["%(dynamic_page_id)s", "%(tableName)s", "%(pageName)s", "%(file_path)s", "%(routePath)s"]
            
            query = f"INSERT INTO dynamic_page_creation ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_dynamic_page_creation(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["dynamic_page_id = %(dynamic_page_id)s", "tableName = %(tableName)s", "pageName = %(pageName)s", "file_path = %(file_path)s", "routePath = %(routePath)s"]
            query = f"UPDATE dynamic_page_creation SET {', '.join(set_parts)} WHERE id = %(id)s"
            
            data['id'] = id
            cursor.execute(query, data)
            conn.commit()
            
            affected_rows = cursor.rowcount
            cursor.close()
            conn.close()
            
            if affected_rows == 0:
                return {"success": False, "error": "Record not found"}, 404
                
            return {"success": True, "data": {"id": id}}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def delete_dynamic_page_creation(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM dynamic_page_creation WHERE id = %(id)s"
            cursor.execute(query, {'id': id})
            conn.commit()
            
            affected_rows = cursor.rowcount
            cursor.close()
            conn.close()
            
            if affected_rows == 0:
                return {"success": False, "error": "Record not found"}, 404
                
            return {"success": True, "data": {"id": id}}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500