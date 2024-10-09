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
    
    
    
@openai_bp.route('/getGeneratedPageDetails', methods=['GET'])
def get_generated_filepath():
    try:
        from core.openai.openai_helper import get_generated_page_details
        
        data = get_generated_page_details()
        
        return jsonify({"data":data}),200
        
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
    
    
    
    
    
    
    
    


    