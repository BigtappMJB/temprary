# import snowflake.connector

# import json
# from flask import jsonify
# from share.general_utils import snow_conf as conf


# def set_connections_get(query):
#     conn = None
#     cursor = None
#     try:
#         conn = snowflake.connector.connect(
#             user=conf.get('user'),
#             password=conf.get('password'),
#             account=conf.get('account'),
#             warehouse=conf.get('warehouse'),
#             database=conf.get('database'),
#             schema=conf.get('schema')
#         )
#         print("Snowflake Connected Successfully")
#         cursor = conn.cursor()
#         cursor.execute(query)
#         rows = cursor.fetchall()

#         # Get column names
#         column_names = [description[0] for description in cursor.description]

#         # Convert rows to a list of dictionaries
#         data = [dict(zip(column_names, row)) for row in rows]

#         json_data = json.dumps(data, indent=4)
#         return json_data
#     except snowflake.connector.Error as error:
#         print(error)
#     except Exception as e:
#         print(e)
#     finally:
#         if cursor:
#             cursor.close()
#         if conn:
#             conn.close()


# def set_connections_post(query):
#     conn = None
#     cursor = None
#     try:
#         conn = snowflake.connector.connect(
#             user=conf.get('user'),
#             password=conf.get('password'),
#             account=conf.get('account'),
#             warehouse=conf.get('warehouse'),
#             database=conf.get('database'),
#             schema=conf.get('schema')
#         )
#         print("Snowflake Connected Successfully")
#         cursor = conn.cursor()
#         cursor.execute(query)
#         result = cursor.fetchone()

#         return jsonify(result), 200
#     except snowflake.connector.Error as error:
#         print(error)
#         return error, 400
#     except Exception as e:
#         print(e)
#         return json.dumps(e, indent=4), 400
#     finally:
#         if cursor:
#             cursor.close()
#         if conn:
#             conn.close()


data_type = {
    1: "ARRAY",
    2: "BIGINT",
    3: "BINARY",
    4: "BOOLEAN",
    5: "CHAR",
    6: "DATE",
    7: "DATETIME",
    8: "DECIMAL",
    9: "DOUBLE",
    10: "DOUBLE PRECISION",
    11: "FLOAT",
    12: "FLOAT4",
    13: "FLOAT8",
    14: "GEOGRAPHY",
    15: "INT",
    16: "INTEGER",
    17: "NUMBER",
    18: "NUMERIC",
    19: "OBJECT",
    20: "REAL",
    21: "SMALLINT",
    22: "STRING",
    23: "TEXT",
    24: "TIME",
    25: "TIMESTAMP",
    26: "TIMESTAMP_LTZ",
    27: "TIMESTAMP_NTZ",
    28: "TIMESTAMP_TZ",
    29: "VARBINARY",
    30: "VARIANT",
    31: "VARCHAR"
}




def set_connections_get(query):
    try:
        from mysql.connector import Error
        import mysql.connector
        from share.general_utils import mysql_config as conf
        import json
        # Establish a connection
        conn = mysql.connector.connect(
            host=conf.get('host'),
            user=conf.get('user'),
            password=conf.get('password'),
            database=conf.get('database')
        )
        
        if conn.is_connected():
            print("Connected to MySQL database")
        
        # Create a cursor object
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute(query)
        
        # Fetch all the results
        rows = cursor.fetchall()
        
        # Get column names from cursor description
        column_names = [description[0] for description in cursor.description]
        
        # Convert rows to a list of dictionaries
        data = [dict(zip(column_names, row)) for row in rows]
        
        # Convert list of dictionaries to JSON format
        json_data = json.dumps(data, indent=4)
        
        return json_data

    except Error as e:
        print(f"Error: {e}")
        return None  # Return None or handle the error as needed

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("MySQL connection is closed")


def set_connections_post(query):


    try:
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
        
        if conn.is_connected():
            print("Connected to MySQL database")

        # Create a cursor object
        cursor = conn.cursor()

        # Execute a query
        cursor.execute(query)

        # Fetch all the results
        results = cursor.fetchall()

        for row in results:
            print(row)

    except Error as e:
        print(f"Error: {e}")

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("MySQL connection is closed")