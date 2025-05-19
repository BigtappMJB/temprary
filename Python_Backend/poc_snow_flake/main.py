# main.py

from flask import Flask, jsonify
from flask_cors import CORS
import logging
import mysql.connector
import os
import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('app')

# Import database connection
from core.database import initialize_connection_pool

# Importing existing blueprints
from core.login_controller import login_bp
from core.users_controller import users_bp
from core.registration_controller import registration_bp
from core.role_controller import roles_bp
from core.cmd.cmd_controller import cmd_bp
from core.openai.openai_controller import openai_bp
# Importing the new project_estimate blueprints
from core.project_estimate_controller import project_estimate_bp
from core.dynamic_page_controller import dynamic_page_bp
from core.dynamic_crud_controller import dynamic_crud_bp
# Import menu controller
from core.menu_controller import menu_bp
# Import dynamic blueprint loader
from core.dynamic_blueprint_loader import register_dynamic_blueprints
# Initialize the database connection pool
try:
    logger.info("Initializing database connection pool...")
    initialize_connection_pool()
    logger.info("Database connection pool initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database connection pool: {e}")
    logger.warning("Application will continue, but database operations may fail")
    
    # Check if the MySQL server is reachable
    try:
        import socket
        from urllib.parse import urlparse
        
        # Get MySQL host and port from environment
        mysql_host = os.getenv('MYSQL_HOST')
        mysql_port = int(os.getenv('MYSQL_PORT', 3306))
        
        # Try to connect to the MySQL server
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((mysql_host, mysql_port))
        sock.close()
        
        if result == 0:
            logger.info(f"MySQL server at {mysql_host}:{mysql_port} is reachable, but connection failed. Check credentials.")
        else:
            logger.error(f"MySQL server at {mysql_host}:{mysql_port} is NOT reachable. Network issue or server is down.")
    except Exception as network_error:
        logger.error(f"Error checking MySQL server reachability: {network_error}")

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "*"],
        "methods": ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
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
app.register_blueprint(dynamic_page_bp, url_prefix='/dynamic-page')
app.register_blueprint(dynamic_crud_bp)

# Register menu blueprint
app.register_blueprint(menu_bp, url_prefix='/api')

# We don't need the after_request function since CORS is already configured above
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     return response

# Register all dynamic blueprints from the generated folder
logger.info("Registering dynamic blueprints...")
num_blueprints = register_dynamic_blueprints(app)
logger.info(f"Registered {num_blueprints} dynamic blueprints")

# Add error handlers
@app.errorhandler(mysql.connector.Error)
def handle_database_error(error):
    logger.error(f"Database error occurred: {error}")
    return jsonify({
        "success": False,
        "error": "A database error occurred. Please try again later.",
        "details": str(error) if app.debug else None
    }), 500

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint that also checks database connectivity"""
    health_status = {
        "status": "UP",
        "timestamp": datetime.datetime.now().isoformat(),
        "services": {
            "database": {
                "status": "UNKNOWN"
            }
        }
    }
    
    # Check database connection
    try:
        from core.database import get_database_connection, close_connection, get_connection_pool_status
        
        # Get connection pool status
        pool_status = get_connection_pool_status()
        health_status["services"]["database"]["pool"] = pool_status
        
        # Try to get a connection
        conn = get_database_connection(max_retries=1)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        close_connection(conn)
        
        health_status["services"]["database"]["status"] = "UP"
    except Exception as e:
        health_status["services"]["database"]["status"] = "DOWN"
        health_status["services"]["database"]["error"] = str(e)
        health_status["status"] = "PARTIAL"  # Application is up but database is down
    
    status_code = 200 if health_status["status"] == "UP" else 503
    return jsonify(health_status), status_code

if __name__ == "__main__":
    # Run with debug mode but disable the reloader
    # This prevents the server from restarting when new files are created
    # You'll need to manually restart the server when you make changes to your code
    app.run(debug=True, port=5000, use_reloader=False)

