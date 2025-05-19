from flask import Blueprint, request, jsonify
from core.database import get_database_connection
import json

dynamic_crud_bp = Blueprint('dynamic_crud_controller', __name__)

def execute_query(query, params=None, fetch=True):
    """Execute a SQL query and return results"""
    try:
        conn = get_database_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or {})
        
        result = None
        if fetch:
            result = cursor.fetchall()
        else:
            conn.commit()
            result = {"affected_rows": cursor.rowcount}
            
        cursor.close()
        conn.close()
        return {"success": True, "data": result}, 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500

@dynamic_crud_bp.route('/api/<table_name>/list', methods=['GET'])
def list_records(table_name):
    """Get all records from a table"""
    query = f"SELECT * FROM {table_name}"
    return jsonify(*execute_query(query))

@dynamic_crud_bp.route('/api/<table_name>/create', methods=['POST'])
def create_record(table_name):
    """Create a new record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        # Build INSERT query
        columns = list(data.keys())
        placeholders = [f"%({col})s" for col in columns]
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
        
        return jsonify(*execute_query(query, data, fetch=False))
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_crud_bp.route('/api/<table_name>/update', methods=['PUT'])
def update_record(table_name):
    """Update an existing record"""
    try:
        data = request.get_json()
        if not data or 'id' not in data:
            return jsonify({"success": False, "error": "No data or ID provided"}), 400
            
        # Remove id from update data
        record_id = data.pop('id')
        
        # Build UPDATE query
        set_parts = [f"{col} = %({col})s" for col in data.keys()]
        query = f"UPDATE {table_name} SET {', '.join(set_parts)} WHERE id = %(id)s"
        
        # Add back id for parameter binding
        data['id'] = record_id
        
        return jsonify(*execute_query(query, data, fetch=False))
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dynamic_crud_bp.route('/api/<table_name>/delete', methods=['DELETE'])
def delete_record(table_name):
    """Delete a record"""
    try:
        record_id = request.args.get('id')
        if not record_id:
            return jsonify({"success": False, "error": "No ID provided"}), 400
            
        query = f"DELETE FROM {table_name} WHERE id = %(id)s"
        return jsonify(*execute_query(query, {'id': record_id}, fetch=False))
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
