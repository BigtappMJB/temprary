from core.database import get_database_connection
import json

class SampleTableHelper:
    @staticmethod
    def get_all_sample_table():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM sample_table")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_sample_table(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["sample_table_id", "name", "age", "created_by", "created_at", "updated_by", "updated_at"]
            placeholders = ["%(sample_table_id)s", "%(name)s", "%(age)s", "%(created_by)s", "%(created_at)s", "%(updated_by)s", "%(updated_at)s"]
            
            query = f"INSERT INTO sample_table ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_sample_table(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["sample_table_id = %(sample_table_id)s", "name = %(name)s", "age = %(age)s", "created_by = %(created_by)s", "created_at = %(created_at)s", "updated_by = %(updated_by)s", "updated_at = %(updated_at)s"]
            query = f"UPDATE sample_table SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_sample_table(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM sample_table WHERE id = %(id)s"
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