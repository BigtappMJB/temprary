from core.database import get_database_connection
import json

class EmployeeHelper:
    @staticmethod
    def get_all_employee():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM employee")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_employee(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["employee_id", "employee_name", "employee_age", "employee_salary", "created_by", "created_at", "updated_by", "updated_at"]
            placeholders = ["%(employee_id)s", "%(employee_name)s", "%(employee_age)s", "%(employee_salary)s", "%(created_by)s", "%(created_at)s", "%(updated_by)s", "%(updated_at)s"]
            
            query = f"INSERT INTO employee ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_employee(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["employee_id = %(employee_id)s", "employee_name = %(employee_name)s", "employee_age = %(employee_age)s", "employee_salary = %(employee_salary)s", "created_by = %(created_by)s", "created_at = %(created_at)s", "updated_by = %(updated_by)s", "updated_at = %(updated_at)s"]
            query = f"UPDATE employee SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_employee(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM employee WHERE id = %(id)s"
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