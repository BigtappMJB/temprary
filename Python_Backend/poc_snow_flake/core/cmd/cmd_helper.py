# cmd_helper.py

import logging
from core.database import get_database_connection, close_connection

# Configure logging
logger = logging.getLogger('cmd_helper')

class CMDHelper:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self._connect()
        
    def _connect(self):
        """Establish a database connection"""
        try:
            if self.conn is None or not self.conn.is_connected():
                self.conn = get_database_connection()
                self.cursor = self.conn.cursor()
                logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Error connecting to database: {e}")
            raise
            
    def _ensure_connection(self):
        """Ensure the database connection is active"""
        try:
            if self.conn is None or not self.conn.is_connected():
                logger.warning("Database connection lost, reconnecting...")
                self._connect()
        except Exception as e:
            logger.error(f"Error reconnecting to database: {e}")
            raise

    def create_cmd(self, target, sub_target, incorporation_city, sector_classification):
        try:
            self._ensure_connection()
            self.cursor.execute(
                "INSERT INTO CMD (TARGET, SUBTARGET, INCORPORATECITY, SECTORCLASSIFICATION) VALUES (%s, %s, %s, %s)", 
                (target, sub_target, incorporation_city, sector_classification)
            )
            self.conn.commit()
            self.cursor.execute("SELECT LAST_INSERT_ID()")
            cmd_id = self.cursor.fetchone()[0]
            return cmd_id
        except Exception as e:
            logger.error(f"Error creating CMD: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def get_cmd(self):
        try:
            self._ensure_connection()
            self.cursor.execute("SELECT ID, TARGET, SUBTARGET, INCORPORATECITY, SECTORCLASSIFICATION FROM CMD")
            roles = self.cursor.fetchall()
            return [{"id": role[0], "target": role[1], "sub_target": role[2], "incorporation_city": role[3], "sector_classification": role[4]} for role in roles]
        except Exception as e:
            logger.error(f"Error getting CMD list: {e}")
            raise

    def get_cmd_id(self, cmd_id):
        try:
            self._ensure_connection()
            self.cursor.execute("SELECT ID, TARGET, SUBTARGET, INCORPORATECITY, SECTORCLASSIFICATION FROM CMD WHERE ID = %s", (cmd_id,))
            role = self.cursor.fetchone()
            if not role:
                return None
            return {"id": role[0], "target": role[1], "sub_target": role[2], "incorporation_city": role[3], "sector_classification": role[4]}
        except Exception as e:
            logger.error(f"Error getting CMD by ID {cmd_id}: {e}")
            raise

    def update_cmd(self, cmd_id, target, sub_target, incorporation_city, sector_classification):
        try:
            self._ensure_connection()
            self.cursor.execute(
                "UPDATE CMD SET TARGET = %s, SUBTARGET = %s, INCORPORATECITY = %s, SECTORCLASSIFICATION = %s WHERE ID = %s", 
                (target, sub_target, incorporation_city, sector_classification, cmd_id)
            )
            self.conn.commit()
            return self.cursor.rowcount
        except Exception as e:
            logger.error(f"Error updating CMD {cmd_id}: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def delete_cmd(self, cmd_id):
        try:
            self._ensure_connection()
            self.cursor.execute("DELETE FROM CMD WHERE ID = %s", (cmd_id,))
            self.conn.commit()
            logger.info(f"CMD {cmd_id} deleted successfully")
            return {"message": "CMD deleted successfully"}, 200
        except Exception as e:
            logger.error(f"Error deleting CMD {cmd_id}: {e}")
            if self.conn:
                self.conn.rollback()
            return {"error": str(e)}, 500

    def create_cad(self, country_of_residence, target, incorporation_city, sector_classification, emirates_id,
                   created_by='system'):
        try:
            self._ensure_connection()
            self.cursor.execute(
                "INSERT INTO CAD (Country_of_Residence, Target, Incorporation_City, SECTOR_CLASSIFICATION, Emirates_ID, CREATED_BY) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (country_of_residence, target, incorporation_city, sector_classification, emirates_id, created_by)
            )
            self.conn.commit()
            self.cursor.execute("SELECT LAST_INSERT_ID()")
            cad_id = self.cursor.fetchone()[0]
            return cad_id
        except Exception as e:
            logger.error(f"Error creating CAD: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def get_cad(self):
        try:
            self._ensure_connection()
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
        except Exception as e:
            logger.error(f"Error getting CAD list: {e}")
            raise

    def get_cad_id(self, cad_id):
        try:
            self._ensure_connection()
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
        except Exception as e:
            logger.error(f"Error getting CAD by ID {cad_id}: {e}")
            raise

    def update_cad(self, cad_id, country_of_residence, target, incorporation_city, sector_classification, emirates_id,
                   updated_by='system'):
        try:
            self._ensure_connection()
            self.cursor.execute(
                "UPDATE CAD SET Country_of_Residence = %s, Target = %s, Incorporation_City = %s, SECTOR_CLASSIFICATION = %s, Emirates_ID = %s, UPDATED_BY = %s, UPDATED_DATE = CURRENT_TIMESTAMP() WHERE ID = %s",
                (country_of_residence, target, incorporation_city, sector_classification, emirates_id, updated_by, cad_id)
            )
            self.conn.commit()
            return self.cursor.rowcount
        except Exception as e:
            logger.error(f"Error updating CAD {cad_id}: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def delete_cad(self, cad_id):
        try:
            self._ensure_connection()
            self.cursor.execute("DELETE FROM CAD WHERE ID = %s", (cad_id,))
            self.conn.commit()
            logger.info(f"CAD {cad_id} deleted successfully")
            return {"message": "CAD deleted successfully"}, 200
        except Exception as e:
            logger.error(f"Error deleting CAD {cad_id}: {e}")
            if self.conn:
                self.conn.rollback()
            return {"error": str(e)}, 500
            
    def __del__(self):
        """Clean up database resources when the object is destroyed"""
        if hasattr(self, 'cursor') and self.cursor:
            self.cursor.close()
        if hasattr(self, 'conn') and self.conn:
            close_connection(self.conn)