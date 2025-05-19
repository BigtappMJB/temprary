"""
Safe version of the main application with additional error handling
to prevent server crashes.
"""

import os
import logging
import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("safe_app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('safe_main')

# Load environment variables
load_dotenv('environments/env.dev')

# Import blueprints
from core.safe_dynamic_page_controller import safe_dynamic_page_bp

# Create Flask app
app = Flask(__name__)
CORS(app)

# Register error handlers
@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {e}")
    logger.error(traceback.format_exc())
    return jsonify({
        "success": False,
        "error": "Internal server error",
        "message": str(e)
    }), 500

@app.errorhandler(404)
def handle_not_found(e):
    return jsonify({
        "success": False,
        "error": "Not found",
        "message": str(e)
    }), 404

@app.errorhandler(400)
def handle_bad_request(e):
    return jsonify({
        "success": False,
        "error": "Bad request",
        "message": str(e)
    }), 400

# Register blueprints
app.register_blueprint(safe_dynamic_page_bp, url_prefix='/safe-dynamic-page')

# Root route
@app.route('/')
def index():
    return jsonify({
        "success": True,
        "message": "Safe API server is running",
        "endpoints": [
            "/safe-dynamic-page/tables",
            "/safe-dynamic-page/table-metadata/<table_name>",
            "/safe-dynamic-page/create"
        ]
    })

# Health check route
@app.route('/health')
def health_check():
    return jsonify({
        "success": True,
        "status": "healthy"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # Use a different port
    logger.info(f"Starting safe server on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)