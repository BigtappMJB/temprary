# import os
# import subprocess

from flask import Flask
from flask_cors import CORS

from core.login_controller import login_bp
from core.users_controller import users_bp
from core.registration_controller import registration_bp
from core.role_controller import roles_bp
app = Flask(__name__)
CORS(app)


app.register_blueprint(login_bp)
app.register_blueprint(users_bp, url_prefix='/master')
app.register_blueprint(registration_bp, url_prefix='/register')
app.register_blueprint(roles_bp, url_prefix='/role')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
