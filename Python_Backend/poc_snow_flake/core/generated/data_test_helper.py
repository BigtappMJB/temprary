from core.database import get_database_connection
import json

class DataTestHelper:
    @staticmethod
    def get_all_data_test():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM data_test")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_data_test(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["data_test_id", "data_name", "data_length", "sample_data", "created_by", "created_at", "updated_by", "updated_at"]
            placeholders = ["%(data_test_id)s", "%(data_name)s", "%(data_length)s", "%(sample_data)s", "%(created_by)s", "%(created_at)s", "%(updated_by)s", "%(updated_at)s"]
            
            query = f"INSERT INTO data_test ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_data_test(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["data_test_id = %(data_test_id)s", "data_name = %(data_name)s", "data_length = %(data_length)s", "sample_data = %(sample_data)s", "created_by = %(created_by)s", "created_at = %(created_at)s", "updated_by = %(updated_by)s", "updated_at = %(updated_at)s"]
            query = f"UPDATE data_test SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_data_test(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM data_test WHERE id = %(id)s"
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