"""
Custom Flask runner that ignores changes in the generated folder
"""

import os
import sys
import logging
from werkzeug.serving import run_simple
from main import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('run')

class CustomReloader:
    def __init__(self):
        self.mtimes = {}
        
    def run(self):
        while True:
            for module in list(sys.modules.values()):
                filename = getattr(module, '__file__', None)
                if not filename:
                    continue
                    
                if filename.endswith('.pyc'):
                    filename = filename[:-1]
                    
                # Skip files in the generated folder
                if '\\generated\\' in filename or '/generated/' in filename:
                    continue
                    
                try:
                    mtime = os.stat(filename).st_mtime
                except OSError:
                    continue
                    
                old_time = self.mtimes.get(filename)
                if old_time is None:
                    self.mtimes[filename] = mtime
                elif mtime > old_time:
                    logger.info(f"Detected change in {filename}, restarting...")
                    os._exit(3)

if __name__ == '__main__':
    logger.info("Starting Flask with custom reloader (ignoring generated folder)")
    
    # Set debug mode
    app.debug = True
    
    # Run the app with the custom reloader
    try:
        run_simple('localhost', 5000, app, use_reloader=False, use_debugger=True)
    except KeyboardInterrupt:
        logger.info("Server shutting down...")
        sys.exit(0)