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

class CMDHelper:
    def __init__(self):
        self.conn = get_snowflake_connection()
        self.cursor = self.conn.cursor()

    def create_cmd(self,target, sub_target,incorporation_city,sector_classification):
        self.cursor.execute("INSERT INTO CMD (TARGET, SUBTARGET,INCORPORATECITY,SECTORCLASSIFICATION) VALUES (%s, %s,%s,%s)", (target, sub_target,incorporation_city,sector_classification))
        self.conn.commit()
        self.cursor.execute("SELECT LAST_INSERT_ID()")
        cmd_id = self.cursor.fetchone()[0]
        return cmd_id

    def get_cmd(self):
        self.cursor.execute("SELECT ID, TARGET, SUBTARGET,INCORPORATECITY,SECTORCLASSIFICATION FROM CMD")
        roles = self.cursor.fetchall()
        return [{"id": role[0], "target": role[1], "sub_target": role[2],"incorporation_city": role[3],"sector_classification": role[4]} for role in roles]

    def get_cmd_id(self, cmd_id):
        self.cursor.execute("SELECT ID,TARGET, SUBTARGET,INCORPORATECITY,SECTORCLASSIFICATION FROM CMD WHERE ID = %s", (cmd_id,))
        role = self.cursor.fetchone()
        if not role:
            return None
        return {"id": role[0], "target": role[1], "sub_target": role[2],"incorporation_city": role[3],"sector_classification": role[4]}

    def update_cmd(self, cmd_id,target, sub_target,incorporation_city,sector_classification):
        self.cursor.execute("UPDATE CMD SET TARGET = %s, SUBTARGET= %s,INCORPORATECITY = %s,SECTORCLASSIFICATION = %s WHERE ID = %s ", (target, sub_target,incorporation_city,sector_classification,cmd_id))
        self.conn.commit()
        return self.cursor.rowcount

    def delete_cmd(self, cmd_id):
        try:
            # Proceed with deletion if no references found
            self.cursor.execute("DELETE FROM CMD WHERE ID = %s", (cmd_id,))
            self.conn.commit()
            print(f"CMD {cmd_id} deleted successfully")  # Debug log
            return {"message": "CMD deleted successfully"}, 200
        except Exception as e:
            self.conn.rollback()
            print(f"Error deleting CMD: {e}")  # Debug log
            return {"error": str(e)}, 500

    def __init__(self):
        self.conn = get_snowflake_connection()
        self.cursor = self.conn.cursor()

    def create_cad(self, country_of_residence, target, incorporation_city, sector_classification, emirates_id,
                   created_by='system'):
        self.cursor.execute(
            "INSERT INTO CAD (Country_of_Residence, Target, Incorporation_City, SECTOR_CLASSIFICATION, Emirates_ID, CREATED_BY) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (country_of_residence, target, incorporation_city, sector_classification, emirates_id, created_by)
        )
        self.conn.commit()
        self.cursor.execute("SELECT LAST_INSERT_ID()")
        cad_id = self.cursor.fetchone()[0]
        return cad_id

    def get_cad(self):
        self.cursor.execute(
            "SELECT ID, Country_of_Residence, Target, Incorporation_City, SECTOR_CLASSIFICATION, Emirates_ID, CREATED_BY, CREATED_DATE, UPDATED_BY, UPDATED_DATE, IS_ACTIVE FROM CAD")
        cad_records = self.cursor.fetchall()
        return [
            {
                "id": record[0],
                "country_of_residence": record[1],
                "target": record[2],
                "incorporation_city": record[3],
                "sector_classification": record[4],
                "emirates_id": record[5],
                "created_by": record[6],
                "created_date": record[7],
                "updated_by": record[8],
                "updated_date": record[9],
                "is_active": record[10]
            }
            for record in cad_records
        ]

    def get_cad_id(self, cad_id):
        self.cursor.execute(
            "SELECT ID, Country_of_Residence, Target, Incorporation_City, SECTOR_CLASSIFICATION, Emirates_ID, CREATED_BY, CREATED_DATE, UPDATED_BY, UPDATED_DATE, IS_ACTIVE FROM CAD WHERE ID = %s",
            (cad_id,))
        record = self.cursor.fetchone()
        if not record:
            return None
        return {
            "id": record[0],
            "country_of_residence": record[1],
            "target": record[2],
            "incorporation_city": record[3],
            "sector_classification": record[4],
            "emirates_id": record[5],
            "created_by": record[6],
            "created_date": record[7],
            "updated_by": record[8],
            "updated_date": record[9],
            "is_active": record[10]
        }

    def update_cad(self, cad_id, country_of_residence, target, incorporation_city, sector_classification, emirates_id,
                   updated_by='system'):
        self.cursor.execute(
            "UPDATE CAD SET Country_of_Residence = %s, Target = %s, Incorporation_City = %s, SECTOR_CLASSIFICATION = %s, Emirates_ID = %s, UPDATED_BY = %s, UPDATED_DATE = CURRENT_TIMESTAMP() WHERE ID = %s",
            (country_of_residence, target, incorporation_city, sector_classification, emirates_id, updated_by, cad_id)
        )
        self.conn.commit()
        return self.cursor.rowcount

    def delete_cad(self, cad_id):
        try:
            # Proceed with deletion if no references found
            self.cursor.execute("DELETE FROM CAD WHERE ID = %s", (cad_id,))
            self.conn.commit()
            print(f"CAD {cad_id} deleted successfully")  # Debug log
            return {"message": "CAD deleted successfully"}, 200
        except Exception as e:
            self.conn.rollback()
            print(f"Error deleting CAD: {e}")  # Debug log
            return {"error": str(e)}, 500