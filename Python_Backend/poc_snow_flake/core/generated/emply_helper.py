from core.database import get_database_connection
import json

class EmplyHelper:
    @staticmethod
    def get_all_emply():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM emply")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_emply(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["emply_id", "emply_name", "created_by", "created_at", "updated_by", "updated_at"]
            placeholders = ["%(emply_id)s", "%(emply_name)s", "%(created_by)s", "%(created_at)s", "%(updated_by)s", "%(updated_at)s"]
            
            query = f"INSERT INTO emply ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_emply(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["emply_id = %(emply_id)s", "emply_name = %(emply_name)s", "created_by = %(created_by)s", "created_at = %(created_at)s", "updated_by = %(updated_by)s", "updated_at = %(updated_at)s"]
            query = f"UPDATE emply SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_emply(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM emply WHERE id = %(id)s"
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