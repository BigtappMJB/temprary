import json
from datetime import datetime
from flask import current_app
import snowflake.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_snowflake_connection():
    conn = snowflake.connector.connect(
        user=os.getenv('SNOWFLAKE_USER'),
        password=os.getenv('SNOWFLAKE_PASSWORD'),
        account=os.getenv('SNOWFLAKE_ACCOUNT'),
        warehouse=os.getenv('SNOWFLAKE_WAREHOUSE'),
        database=os.getenv('SNOWFLAKE_DATABASE'),
        schema=os.getenv('SNOWFLAKE_SCHEMA')
    )
    return conn

# Helper methods for Project_Estimate (as previously provided)
def create_project_estimate(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO Project_Estimate (
                Phase_ID, Role_ID, Activity_Code_ID, Start_Date, Start_Time, End_Date, End_Time, No_of_Hours_Per_Day, Total_Hours, created_by, created_date, is_active
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s)
            """,
            (
                data['Phase_ID'], data['Role_ID'], data['Activity_Code_ID'],
                data['Start_Date'], data['Start_Time'], data['End_Date'], data['End_Time'],
                data['No_of_Hours_Per_Day'], data['Total_Hours'], data['created_by'], data.get('is_active', True)
            )
        )
        conn.commit()
        return {"message": "Project Estimate created successfully"}, 201
    except Exception as e:
        current_app.logger.error(f"Error occurred while creating Project Estimate: {e}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_project_estimate(estimate_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT * FROM Project_Estimate WHERE Estimate_ID = %s", (estimate_id,)
        )
        estimate = cursor.fetchone()
        if estimate:
            column_names = [desc[0] for desc in cursor.description]
            estimate_dict = dict(zip(column_names, estimate))
            return estimate_dict, 200
        else:
            return {"message": "Project Estimate not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_project_estimates():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM Project_Estimate ORDER BY Estimate_ID DESC")
        estimates = cursor.fetchall()
        if estimates:
            column_names = [desc[0] for desc in cursor.description]
            estimate_list = [dict(zip(column_names, estimate)) for estimate in estimates]
            return estimate_list, 200
        else:
            return {"message": "No Project Estimates found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def update_project_estimate(estimate_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE Project_Estimate SET
                Phase_ID = %s, Role_ID = %s, Activity_Code_ID = %s,
                Start_Date = %s, Start_Time = %s, End_Date = %s, End_Time = %s,
                No_of_Hours_Per_Day = %s, Total_Hours = %s, updated_by = %s, updated_date = CURRENT_TIMESTAMP, is_active = %s
            WHERE Estimate_ID = %s
            """,
            (
                data['Phase_ID'], data['Role_ID'], data['Activity_Code_ID'],
                data['Start_Date'], data['Start_Time'], data['End_Date'], data['End_Time'],
                data['No_of_Hours_Per_Day'], data['Total_Hours'], data['updated_by'], data.get('is_active', True), estimate_id
            )
        )
        conn.commit()
        return {"message": "Project Estimate updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_project_estimate(estimate_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Project_Estimate WHERE Estimate_ID = %s", (estimate_id,))
        conn.commit()
        return {"message": "Project Estimate deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# Helper methods for Project_Phases
def get_all_project_phases():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM Project_Phases ORDER BY Phase_ID DESC")
        phases = cursor.fetchall()
        if phases:
            column_names = [desc[0] for desc in cursor.description]
            phase_list = [dict(zip(column_names, phase)) for phase in phases]
            return phase_list, 200
        else:
            return {"message": "No Project Phases found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# Helper methods for Project_Role
def get_all_project_roles():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM Project_Role ORDER BY Role_ID DESC")
        roles = cursor.fetchall()
        if roles:
            column_names = [desc[0] for desc in cursor.description]
            role_list = [dict(zip(column_names, role)) for role in roles]
            return role_list, 200
        else:
            return {"message": "No Project Roles found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
# Helper methods for Project_Type
def get_all_project_types():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM NBF_CIA.PUBLIC.PROJECT_TYPE ORDER BY PROJECT_TYPE_ID DESC")
        project_types = cursor.fetchall()
        if project_types:
            column_names = [desc[0] for desc in cursor.description]
            project_type_list = [dict(zip(column_names, project_type)) for project_type in project_types]
            return project_type_list, 200
        else:
            return {"message": "No Project Types found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# Helper methods for Client_Info
def get_all_clients():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM NBF_CIA.PUBLIC.CLIENT_INFO ORDER BY CLIENT_CODE_ID DESC")
        clients = cursor.fetchall()
        if clients:
            column_names = [desc[0] for desc in cursor.description]
            client_list = [dict(zip(column_names, client)) for client in clients]
            return client_list, 200
        else:
            return {"message": "No Clients found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def create_project_detail(data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO NBF_CIA.PUBLIC.PROJECT_DETAILS (
                PROJECT_NAME, CLIENT_ID, PROJECT_TYPE_ID, CREATED_BY, IS_ACTIVE
            ) VALUES (%s, %s, %s, %s, %s)
            """,
            (
                data.get('PROJECT_NAME'),
                data.get('CLIENT_ID'),
                data.get('PROJECT_TYPE_ID'),
                data.get('CREATED_BY'),
                data.get('IS_ACTIVE', True)
            )
        )
        conn.commit()
        return {"message": "Project Detail created successfully"}, 201
    except Exception as e:
        current_app.logger.error(f"Error occurred while creating Project Detail: {e}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
def update_project_detail(project_id, data):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE NBF_CIA.PUBLIC.PROJECT_DETAILS SET
                PROJECT_NAME = %s, CLIENT_ID = %s, PROJECT_TYPE_ID = %s,
                UPDATED_BY = %s, UPDATED_DATE = CURRENT_TIMESTAMP, IS_ACTIVE = %s
            WHERE PROJECT_ID = %s
            """,
            (
                data.get('PROJECT_NAME'),
                data.get('CLIENT_ID'),
                data.get('PROJECT_TYPE_ID'),
                data.get('UPDATED_BY'),
                data.get('IS_ACTIVE', True),
                project_id
            )
        )
        conn.commit()
        return {"message": "Project Detail updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def delete_project_detail(project_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM NBF_CIA.PUBLIC.PROJECT_DETAILS WHERE PROJECT_ID = %s", (project_id,)
        )
        conn.commit()
        return {"message": "Project Detail deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
def get_all_project_details():
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM PROJECT_DETAILS ORDER BY PROJECT_ID DESC")
        details = cursor.fetchall()
        if details:
            column_names = [desc[0] for desc in cursor.description]
            detail_list = [dict(zip(column_names, detail)) for detail in details]
            return detail_list, 200
        else:
            return {"message": "No Project Details found"}, 404
    except Exception as e:
        current_app.logger.error(f"Error occurred while retrieving Project Details: {e}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
def get_project_detail(project_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM PROJECT_DETAILS WHERE PROJECT_ID = %s", (project_id,))
        project_detail = cursor.fetchone()
        if project_detail:
            column_names = [desc[0] for desc in cursor.description]
            project_detail_dict = dict(zip(column_names, project_detail))
            return project_detail_dict, 200
        else:
            return {"message": "Project Detail not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
