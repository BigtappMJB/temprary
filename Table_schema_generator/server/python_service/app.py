from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from jinja2 import Environment, FileSystemLoader
import re

app = Flask(__name__)
CORS(app)

# Set up Jinja2 environment
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
env = Environment(
    loader=FileSystemLoader(template_dir),
    variable_start_string='${',
    variable_end_string='}',
    block_start_string='$%',
    block_end_string='%$',
    comment_start_string='$#',
    comment_end_string='#$'
)

# Path to save generated components
COMPONENTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                             'src', 'components', 'generated')

# Ensure the components directory exists
os.makedirs(COMPONENTS_DIR, exist_ok=True)

def camel_case(s):
    """Convert snake_case to camelCase"""
    s = re.sub(r'[^a-zA-Z0-9_]', '', s.lower())
    parts = s.split('_')
    return parts[0] + ''.join(part.title() for part in parts[1:])

def pascal_case(s):
    """Convert snake_case to PascalCase"""
    s = re.sub(r'[^a-zA-Z0-9_]', '', s.lower())
    parts = s.split('_')
    return ''.join(part.title() for part in parts)

def get_default_value(field):
    """Get default value based on field type"""
    field_type = field.get('type', '').upper()
    
    if field.get('primaryKey'):
        return 'null'  # Primary keys are typically auto-generated
    elif any(t in field_type for t in ['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE']):
        return 'null'
    elif any(t in field_type for t in ['BOOLEAN', 'BIT']):
        return 'false'
    elif any(t in field_type for t in ['DATE', 'DATETIME', 'TIMESTAMP']):
        return 'null'
    else:
        return "''"  # Default for strings and other types

def get_input_type(field):
    """Get appropriate input type for field"""
    field_type = field.get('type', '').upper()
    
    if any(t in field_type for t in ['INT', 'BIGINT', 'SMALLINT', 'TINYINT']):
        return 'number'
    elif any(t in field_type for t in ['DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE']):
        return 'number'
    elif any(t in field_type for t in ['BOOLEAN', 'BIT']):
        return 'checkbox'
    elif any(t in field_type for t in ['DATE']):
        return 'date'
    elif any(t in field_type for t in ['DATETIME', 'TIMESTAMP']):
        return 'datetime-local'
    elif 'TEXT' in field_type:
        return 'textarea'
    else:
        return 'text'  # Default for strings and other types

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'ok',
        'message': 'Python template service is running'
    })

@app.route('/test', methods=['GET'])
def test():
    try:
        # Try to render a simple template string
        from jinja2 import Template
        template = Template('Hello {{ name }}!')
        result = template.render(name='World')
        return jsonify({
            'success': True,
            'message': 'Template test successful',
            'result': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/generate', methods=['POST'])
def generate_component():
    try:
        data = request.json
        
        # Extract data from request
        table_name = data.get('tableName', '')
        component_name = data.get('componentName', pascal_case(table_name) + 'Table')
        page_title = data.get('pageTitle', pascal_case(table_name) + ' Management')
        selected_fields = data.get('selectedFields', [])
        component_options = data.get('componentOptions', {})
        
        # Ensure component_options has all required keys
        default_options = {
            'pagination': False,
            'sorting': False,
            'search': False,
            'refresh': False,
            'filtering': False,
            'crud': True
        }
        
        for key, value in default_options.items():
            if key not in component_options:
                component_options[key] = value
        
        # Filter fields that are selected for display
        display_fields = [field for field in selected_fields if field.get('selected', True)]
        
        # Sort fields by order if available
        display_fields.sort(key=lambda x: x.get('order', 0))
        
        # Find primary key field
        primary_key_field = next((field for field in selected_fields if field.get('primaryKey')), None)
        primary_key_name = primary_key_field.get('name') if primary_key_field else 'id'
        
        # Prepare template context
        context = {
            'component_name': component_name,
            'page_title': page_title,
            'table_name': table_name,
            'fields': display_fields,
            'all_fields': selected_fields,
            'primary_key': primary_key_name,
            'options': component_options,
            'camel_case': camel_case,
            'pascal_case': pascal_case,
            'get_default_value': get_default_value,
            'get_input_type': get_input_type
        }
        
        # Render the template
        print("Attempting to render template...")
        try:
            template = env.get_template('react_component.jsx.jinja2')
            print("Template loaded successfully")
            component_code = template.render(**context)
            print("Template rendered successfully")
        except Exception as e:
            print(f"Error rendering template: {str(e)}")
            import traceback
            print(traceback.format_exc())
            raise
        
        # Save the component to a file
        file_path = os.path.join(COMPONENTS_DIR, f"{component_name}.jsx")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(component_code)
        
        # Return success response
        return jsonify({
            'success': True,
            'message': f'Component {component_name} generated successfully',
            'filePath': file_path,
            'componentCode': component_code
        })
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return jsonify({
            'success': False,
            'message': str(e),
            'details': error_details
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)