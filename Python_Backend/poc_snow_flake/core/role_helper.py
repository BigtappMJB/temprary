# role_helper.py

import snowflake.connector
from share.general_utils import snow_conf as conf

def get_snowflake_connection():
    conn = snowflake.connector.connect(
        user=conf['user'],
        password=conf['password'],
        account=conf['account'],
        warehouse=conf['warehouse'],
        database=conf['database'],
        schema=conf['schema'],
        role=conf['role']
    )
    return conn

class RoleHelper:
    def __init__(self):
        self.conn = get_snowflake_connection()
        self.cursor = self.conn.cursor()

    def create_role(self, name, description):
        self.cursor.execute("INSERT INTO NBF_CIA.PUBLIC.ROLES (NAME, DESCRIPTION) VALUES (%s, %s)", (name, description))
        self.conn.commit()
        self.cursor.execute("SELECT MAX(ID) FROM NBF_CIA.PUBLIC.ROLES")
        role_id = self.cursor.fetchone()[0]
        return role_id

    def get_roles(self):
        self.cursor.execute("SELECT ID, NAME, DESCRIPTION FROM NBF_CIA.PUBLIC.ROLES")
        roles = self.cursor.fetchall()
        return [{"id": role[0], "name": role[1], "description": role[2]} for role in roles]

    def get_role(self, role_id):
        self.cursor.execute("SELECT ID, NAME, DESCRIPTION FROM NBF_CIA.PUBLIC.ROLES WHERE ID = %s", (role_id,))
        role = self.cursor.fetchone()
        if not role:
            return None
        return {"id": role[0], "name": role[1], "description": role[2]}

    def update_role(self, role_id, name, description):
        self.cursor.execute("UPDATE NBF_CIA.PUBLIC.ROLES SET NAME = %s, DESCRIPTION = %s WHERE ID = %s", (name, description, role_id))
        self.conn.commit()
        return self.cursor.rowcount

    def delete_role(self, role_id):
        try:
            # Check if role is used in USERS table
            self.cursor.execute("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.USERS WHERE ROLE_ID = %s", (role_id,))
            user_count = self.cursor.fetchone()[0]
            print(f"User count for role_id {role_id}: {user_count}")  # Debug log
            if user_count > 0:
                print("Role is assigned to users and cannot be deleted")  # Debug log
                return {"error": "Role is assigned to users and cannot be deleted"}, 400

            # Check if role is used in ROLE_PERMISSION table
            self.cursor.execute("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.ROLE_PERMISSION WHERE ROLE_ID = %s", (role_id,))
            role_permission_count = self.cursor.fetchone()[0]
            print(f"Role permission count for role_id {role_id}: {role_permission_count}")  # Debug log
            if role_permission_count > 0:
                print("Role is used in role permissions and cannot be deleted")  # Debug log
                return {"error": "Role is used in role permissions and cannot be deleted"}, 400

            # Proceed with deletion if no references found
            self.cursor.execute("DELETE FROM NBF_CIA.PUBLIC.ROLES WHERE ID = %s", (role_id,))
            self.conn.commit()
            print(f"Role {role_id} deleted successfully")  # Debug log
            return {"message": "Role deleted successfully"}, 200
        except Exception as e:
            self.conn.rollback()
            print(f"Error deleting role: {e}")  # Debug log
            return {"error": str(e)}, 500

    def get_all_permissions(self):
        self.cursor.execute("SELECT ID, LEVEL FROM NBF_CIA.PUBLIC.PERMISSION_LEVEL")
        permissions = self.cursor.fetchall()
        return [{"id": permission[0], "level": permission[1]} for permission in permissions]