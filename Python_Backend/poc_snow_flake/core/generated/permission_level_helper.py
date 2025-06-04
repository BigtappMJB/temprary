from core.database import get_database_connection
import json

class PermissionLevelHelper:
    @staticmethod
    def get_all_permission_level():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM permission_level")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_permission_level(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["ID", "LEVEL", "CREATED_BY", "CREATED_DATE", "UPDATED_BY", "UPDATED_DATE", "IS_ACTIVE", "DELETED_BY", "DELETED_DATE"]
            placeholders = ["%(ID)s", "%(LEVEL)s", "%(CREATED_BY)s", "%(CREATED_DATE)s", "%(UPDATED_BY)s", "%(UPDATED_DATE)s", "%(IS_ACTIVE)s", "%(DELETED_BY)s", "%(DELETED_DATE)s"]
            
            query = f"INSERT INTO permission_level ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_permission_level(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["ID = %(ID)s", "LEVEL = %(LEVEL)s", "CREATED_BY = %(CREATED_BY)s", "CREATED_DATE = %(CREATED_DATE)s", "UPDATED_BY = %(UPDATED_BY)s", "UPDATED_DATE = %(UPDATED_DATE)s", "IS_ACTIVE = %(IS_ACTIVE)s", "DELETED_BY = %(DELETED_BY)s", "DELETED_DATE = %(DELETED_DATE)s"]
            query = f"UPDATE permission_level SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_permission_level(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM permission_level WHERE id = %(id)s"
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