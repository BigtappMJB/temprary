import os
from jinja2 import Template

class CodeGenerator:
    def __init__(self, table_name, columns_data, page_details):
        self.table_name = table_name
        self.columns_data = columns_data
        self.page_details = page_details
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
    def generate_helper_class(self):
        template = '''from core.database import get_database_connection
import json

class {{ class_name }}Helper:
    @staticmethod
    def get_all_{{ table_name }}():
        try:
            conn = get_database_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM {{ table_name }}")
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def create_{{ table_name }}(data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            columns = [{% for col_id, col in columns_data.items() %}"{{ col.COLUMN_NAME }}"{% if not loop.last %}, {% endif %}{% endfor %}]
            placeholders = [{% for col_id, col in columns_data.items() %}"%({{ col.COLUMN_NAME }})s"{% if not loop.last %}, {% endif %}{% endfor %}]
            
            query = f"INSERT INTO {{ table_name }} ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, data)
            conn.commit()
            
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return {"success": True, "data": {"id": new_id}}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def update_{{ table_name }}(id, data):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            set_parts = [{% for col_id, col in columns_data.items() %}"{{ col.COLUMN_NAME }} = %({{ col.COLUMN_NAME }})s"{% if not loop.last %}, {% endif %}{% endfor %}]
            query = f"UPDATE {{ table_name }} SET {', '.join(set_parts)} WHERE id = %(id)s"
            
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
    def delete_{{ table_name }}(id):
        try:
            conn = get_database_connection()
            cursor = conn.cursor()
            
            query = "DELETE FROM {{ table_name }} WHERE id = %(id)s"
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
'''
        
        # Create helper class
        class_name = "".join(word.capitalize() for word in self.table_name.split('_'))
        t = Template(template)
        content = t.render(
            class_name=class_name,
            table_name=self.table_name,
            columns_data=self.columns_data
        )
        
        # Write to file
        helper_dir = os.path.join(self.base_dir, 'core', 'generated')
        os.makedirs(helper_dir, exist_ok=True)
        
        file_path = os.path.join(helper_dir, f'{self.table_name}_helper.py')
        with open(file_path, 'w') as f:
            f.write(content)
            
        return file_path

    def generate_controller_class(self):
        template = '''from flask import Blueprint, request, jsonify
from core.generated.{{ table_name }}_helper import {{ class_name }}Helper

{{ table_name }}_bp = Blueprint('{{ table_name }}_controller', __name__)

@{{ table_name }}_bp.route('/list', methods=['GET'])
def get_all_{{ table_name }}():
    """Get all {{ table_name }} records"""
    result, status_code = {{ class_name }}Helper.get_all_{{ table_name }}()
    return jsonify(result), status_code

@{{ table_name }}_bp.route('/create', methods=['POST'])
def create_{{ table_name }}():
    """Create a new {{ table_name }} record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = {{ class_name }}Helper.create_{{ table_name }}(data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@{{ table_name }}_bp.route('/update/<int:id>', methods=['PUT'])
def update_{{ table_name }}(id):
    """Update a {{ table_name }} record"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        result, status_code = {{ class_name }}Helper.update_{{ table_name }}(id, data)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@{{ table_name }}_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_{{ table_name }}(id):
    """Delete a {{ table_name }} record"""
    try:
        result, status_code = {{ class_name }}Helper.delete_{{ table_name }}(id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
'''
        
        # Create controller class
        class_name = "".join(word.capitalize() for word in self.table_name.split('_'))
        t = Template(template)
        content = t.render(
            class_name=class_name,
            table_name=self.table_name
        )
        
        # Write to file
        controller_dir = os.path.join(self.base_dir, 'core', 'generated')
        os.makedirs(controller_dir, exist_ok=True)
        
        file_path = os.path.join(controller_dir, f'{self.table_name}_controller.py')
        with open(file_path, 'w') as f:
            f.write(content)
            
        return file_path

    def generate_main_import(self):
        """Generate import and blueprint registration code for main.py"""
        class_name = "".join(word.capitalize() for word in self.table_name.split('_'))
        
        import_statement = f"from core.generated.{self.table_name}_controller import {self.table_name}_bp"
        register_statement = f"app.register_blueprint({self.table_name}_bp, url_prefix='/api/{self.table_name}')"
        
        return {
            "import": import_statement,
            "register": register_statement
        }

def generate_code(table_name, columns_data, page_details):
    """Main function to generate all necessary code files"""
    print(f"Generating code for table: {table_name}")
    print(f"Page details: {page_details}")
    print(f"Columns data: {columns_data}")
    
    generator = CodeGenerator(table_name, columns_data, page_details)
    
    # Generate helper and controller files
    helper_file = generator.generate_helper_class()
    controller_file = generator.generate_controller_class()
    
    # Generate main.py modifications
    main_code = generator.generate_main_import()
    
    return {
        "files": {
            "helper": helper_file,
            "controller": controller_file
        },
        "main_py": main_code
    }
