from flask import Blueprint, request, jsonify, make_response

from core.user_helper import *
from core.login_helper import *

openai_bp = Blueprint('openai_controller', __name__)







@openai_bp.route('/generateCode', methods=['POST'])
def generateCode():
    try:
        from core.openai.openai_helper import generate_react_code,handle_file_operations,store_details
        import os
        data = request.json
       
        react_code = generate_react_code(data)
        folder_path = os.path.join("D:\React Project\Rapid_Development_Application","deTapp_React_Product","src","views","generatedPages",data.get("pageDetails", {}).get("pageName", ''))
        file_name =f'{data.get("pageDetails", {}).get("pageName", '')}.jsx'
        file_created =  handle_file_operations(code_content=react_code,file_name=file_name,folder_path=folder_path)
        print(file_created)
        if file_created:
            status,error = store_details(data,folder_path,file_name)
            if status:
                return jsonify({"message":"React page generated successfully"}),200
            else:
                return jsonify(error),500
                
        else:
            return jsonify({"message":"React page generation failed"}),500
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
    
    
    
    
    
    
    
    
    


    