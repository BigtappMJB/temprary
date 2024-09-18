# main.py

from flask import Flask
from flask_cors import CORS

# Importing existing blueprints
from core.login_controller import login_bp
from core.users_controller import users_bp
from core.registration_controller import registration_bp
from core.role_controller import roles_bp
from core.cmd.cmd_controller import cmd_bp

# Importing the new project_estimate blueprints
from core.project_estimate_controller import project_estimate_bp

app = Flask(__name__)
CORS(app)

# Registering existing blueprints
app.register_blueprint(login_bp)
app.register_blueprint(users_bp, url_prefix='/')
app.register_blueprint(registration_bp, url_prefix='/register')
app.register_blueprint(roles_bp, url_prefix='/role')
app.register_blueprint(cmd_bp, url_prefix='/cmd')

# Registering the new project_estimate blueprints
app.register_blueprint(project_estimate_bp, url_prefix='/estimate')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
