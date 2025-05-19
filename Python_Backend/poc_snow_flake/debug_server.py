import logging
import sys
import os

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("detailed_debug.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

# Import the Flask app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app

if __name__ == "__main__":
    # Run with debug mode enabled and detailed error reporting
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)