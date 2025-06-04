from core.database import get_database_connection
import json

class DatafeildHelper:
    @staticmethod
    def get_all_datafeild():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM datafeild")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_datafeild(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["id", "dataName", "dataStructure", "dataType", "created_at", "updated_at", "created_by", "updated_by", "is_delete"]
            placeholders = ["%(id)s", "%(dataName)s", "%(dataStructure)s", "%(dataType)s", "%(created_at)s", "%(updated_at)s", "%(created_by)s", "%(updated_by)s", "%(is_delete)s"]
            
            query = f"INSERT INTO datafeild ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_datafeild(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["id = %(id)s", "dataName = %(dataName)s", "dataStructure = %(dataStructure)s", "dataType = %(dataType)s", "created_at = %(created_at)s", "updated_at = %(updated_at)s", "created_by = %(created_by)s", "updated_by = %(updated_by)s", "is_delete = %(is_delete)s"]
            query = f"UPDATE datafeild SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_datafeild(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM datafeild WHERE id = %(id)s"
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