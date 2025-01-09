from flask import Blueprint, request, jsonify, make_response

from core.user_helper import *
from core.login_helper import *

openai_bp = Blueprint('openai_controller', __name__)







@openai_bp.route('/generateCode', methods=['POST'])
def generateCode():
    try:
        from core.openai.openai_helper import generate_react_code,handle_file_operations,store_details,check_if_value_exists
        import os
        data = request.json
        isExists,message = check_if_value_exists(data.get("pageDetails", {}))
        if isExists:
            return jsonify({"message":message}),409
        react_code = generate_react_code(data)
        print(react_code)
        if react_code:
            folder_path = os.path.join("D:\React Project\Rapid_Development_Application","deTapp_React_Product","src","views","generatedPages",data.get("pageDetails", {}).get("pageName", '').replace(' ', '_'))
            file_name =f'{data.get("pageDetails", {}).get("pageName", '')}.jsx'.replace(' ', '_')
            file_created =  handle_file_operations(code_content=react_code,file_name=file_name,folder_path=folder_path)
            if file_created:
                status,error = store_details(data,folder_path,file_name)
                if status:
                    return jsonify({"message":"React page generated successfully"}),200
                else:
                    return jsonify(error),500
                    
            else:
                return jsonify({"message":"React page generation failed"}),500
        else:
             return jsonify({"message":"React Code generation failed"}),500
    except Exception as e:
        return jsonify({"error":str(e)}),500


def create_directory_structure():
    """Create directory structure for the Express.js project."""
    dirs = ["models", "controllers", "routes"]
    for directory in dirs:
        if not os.path.exists(directory):
            os.makedirs(directory)

def extract_and_save(content, filename):
    """Extract specific content and save it to a file."""
    with open(filename, "w") as file:
        file.write(content)
    
@openai_bp.route('/generateExpressCode', methods=['POST'])
def generate_express_code():
    try:
        from core.openai.openai_helper import get_table_desc,express_generation_prompt,handle_file_operations,store_details,format_table_schema,generate_express_code
        import os
        data = request.json
        table_name = data.get("tableName")
        
        # isExists,message = check_if_value_exists(data.get("pageDetails", {}))
        # if isExists:
        #     return jsonify({"message":message}),409
        status,table_schema = get_table_desc(table_name)
        primary_key_column = [col for col in table_schema if col.get('COLUMN_KEY') == 'PRI'][0].get("COLUMN_NAME")
        if status:
            formatted_table_schema = format_table_schema(table_schema)
            prompt = express_generation_prompt(table_name,formatted_table_schema,primary_key_column)
            status,express_code = generate_express_code(prompt=prompt)
        if express_code:
            folder_path =  os.getcwd()
            print(folder_path)
            file_name =f'{table_name}.js'.replace(' ', '_')
            file_created =  handle_file_operations(code_content=express_code,file_name=file_name,folder_path=folder_path)
            if file_created:
                status,error = store_details(data,folder_path,file_name)
                if status:
                    return jsonify({"message":"Express API generated successfully"}),200
                else:
                    return jsonify(error),500
                    
            else:
                return jsonify({"message":"Express API  generation failed"}),500
        else:
             return jsonify({"message":"Express API  generation failed"}),500
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
@openai_bp.route('/getGeneratedPageDetails', methods=['GET'])
def get_generated_filepath():
    try:
        from core.openai.openai_helper import get_generated_page_details
        
        data = get_generated_page_details()
        
        return jsonify({"data":data}),200
        
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
    
    
    
    
    
    
    
    


    