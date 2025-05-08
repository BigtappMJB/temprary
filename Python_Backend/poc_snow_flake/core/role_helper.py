# role_helper.py

# import snowflake.connector - removed as we're using MySQL
from share.general_utils import snow_conf as conf

def get_snowflake_connection():
    from mysql.connector import Error
    import mysql.connector
    from share.general_utils import mysql_config as conf
        # Establish a connection
    conn = mysql.connector.connect(
            host=conf.get('host'),
            user=conf.get('user'),
            password=conf.get('password'),
            database=conf.get('database')
        )
    return conn

class RoleHelper:
    def __init__(self):
        self.conn = get_snowflake_connection()
        self.cursor = self.conn.cursor()

    def create_role(self, name, description):
        self.cursor.execute("INSERT INTO roles (name, description) VALUES (%s, %s)", (name, description))
        self.conn.commit()
        self.cursor.execute("SELECT MAX(id) FROM roles")
        role_id = self.cursor.fetchone()[0]
        return role_id

    def get_roles(self):
        self.cursor.execute("SELECT id, name, description FROM roles")
        roles = self.cursor.fetchall()
        return [{"id": role[0], "name": role[1], "description": role[2]} for role in roles]

    def get_role(self, role_id):
        self.cursor.execute("SELECT id, name, description FROM roles WHERE id = %s", (role_id,))
        role = self.cursor.fetchone()
        if not role:
            return None
        return {"id": role[0], "name": role[1], "description": role[2]}

    def update_role(self, role_id, name, description):
        self.cursor.execute("UPDATE roles SET name = %s, description = %s WHERE id = %s", (name, description, role_id))
        self.conn.commit()
        return self.cursor.rowcount

    def delete_role(self, role_id):
        try:
            # Check if role is used in USERS table
            self.cursor.execute("SELECT COUNT(*) FROM users WHERE role_id = %s", (role_id,))
            user_count = self.cursor.fetchone()[0]
            print(f"User count for role_id {role_id}: {user_count}")  # Debug log
            if user_count > 0:
                print("Role is assigned to users and cannot be deleted")  # Debug log
                return {"error": "Role is assigned to users and cannot be deleted"}, 400

            # Check if role is used in ROLE_PERMISSION table
            self.cursor.execute("SELECT COUNT(*) FROM role_permission WHERE role_id = %s", (role_id,))
            role_permission_count = self.cursor.fetchone()[0]
            print(f"Role permission count for role_id {role_id}: {role_permission_count}")  # Debug log
            if role_permission_count > 0:
                print("Role is used in role permissions and cannot be deleted")  # Debug log
                return {"error": "Role is used in role permissions and cannot be deleted"}, 400

            # Proceed with deletion if no references found
            self.cursor.execute("DELETE FROM roles WHERE id = %s", (role_id,))
            self.conn.commit()
            print(f"Role {role_id} deleted successfully")  # Debug log
            return {"message": "Role deleted successfully"}, 200
        except Exception as e:
            self.conn.rollback()
            print(f"Error deleting role: {e}")  # Debug log
            return {"error": str(e)}, 500

    def get_all_permissions(self):
        self.cursor.execute("SELECT id, level FROM permission_level")
        permissions = self.cursor.fetchall()
        return [{"id": permission[0], "level": permission[1]} for permission in permissions]