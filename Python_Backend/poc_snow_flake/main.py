# main.py

from flask import Flask
from flask_cors import CORS

# Importing existing blueprints
from core.login_controller import login_bp
from core.users_controller import users_bp
from core.registration_controller import registration_bp
from core.role_controller import roles_bp
from core.cmd.cmd_controller import cmd_bp
from core.openai.openai_controller import  openai_bp
# Importing the new project_estimate blueprints
from core.project_estimate_controller import project_estimate_bp

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Registering existing blueprints
app.register_blueprint(login_bp)
app.register_blueprint(users_bp, url_prefix='/')
app.register_blueprint(registration_bp, url_prefix='/register')
app.register_blueprint(roles_bp, url_prefix='/role')
app.register_blueprint(cmd_bp, url_prefix='/cmd')
app.register_blueprint(openai_bp, url_prefix='/gpt')

# Registering the new project_estimate blueprints
app.register_blueprint(project_estimate_bp, url_prefix='/estimate')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)
