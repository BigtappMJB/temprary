from core.database import get_database_connection
import json

class SubMenusHelper:
    @staticmethod
    def get_all_sub_menus():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM sub_menus")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_sub_menus(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = ["ID", "MENU_ID", "NAME", "DESCRIPTION", "ROUTE", "CREATED_BY", "CREATED_DATE", "UPDATED_BY", "UPDATED_DATE", "IS_ACTIVE", "DELETED_BY", "DELETED_DATE"]
            placeholders = ["%(ID)s", "%(MENU_ID)s", "%(NAME)s", "%(DESCRIPTION)s", "%(ROUTE)s", "%(CREATED_BY)s", "%(CREATED_DATE)s", "%(UPDATED_BY)s", "%(UPDATED_DATE)s", "%(IS_ACTIVE)s", "%(DELETED_BY)s", "%(DELETED_DATE)s"]
            
            query = f"INSERT INTO sub_menus ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_sub_menus(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = ["ID = %(ID)s", "MENU_ID = %(MENU_ID)s", "NAME = %(NAME)s", "DESCRIPTION = %(DESCRIPTION)s", "ROUTE = %(ROUTE)s", "CREATED_BY = %(CREATED_BY)s", "CREATED_DATE = %(CREATED_DATE)s", "UPDATED_BY = %(UPDATED_BY)s", "UPDATED_DATE = %(UPDATED_DATE)s", "IS_ACTIVE = %(IS_ACTIVE)s", "DELETED_BY = %(DELETED_BY)s", "DELETED_DATE = %(DELETED_DATE)s"]
            query = f"UPDATE sub_menus SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_sub_menus(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM sub_menus WHERE id = %(id)s"
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