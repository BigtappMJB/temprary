"""
Dynamic Blueprint Loader

This module automatically loads and registers all blueprints from the generated
controllers folder without needing to modify main.py.
"""

import os
import importlib
import importlib.util
import logging
from flask import Flask

logger = logging.getLogger('dynamic_blueprint_loader')

def register_dynamic_blueprints(app):
    """
    Scan the generated controllers directory and register all blueprints.
    
    Args:
        app: The Flask application instance
    
    Returns:
        int: Number of blueprints registered
    """
    generated_dir = os.path.join(os.path.dirname(__file__), 'generated')
    if not os.path.exists(generated_dir):
        logger.info(f"Generated directory not found: {generated_dir}")
        return 0
    
    count = 0
    for filename in os.listdir(generated_dir):
        if filename.endswith('_controller.py'):
            try:
                # Extract module name from filename
                module_name = filename[:-3]  # Remove .py
                table_name = module_name.replace('_controller', '')
                
                # Check if the blueprint is already registered
                blueprint_name = f"{table_name}_bp"
                if hasattr(app, 'blueprints') and f"core.generated.{module_name}.{blueprint_name}" in app.blueprints:
                    logger.info(f"Blueprint {blueprint_name} for table {table_name} already registered")
                    continue
                
                # Import the module
                module_path = os.path.join(generated_dir, filename)
                spec = importlib.util.spec_from_file_location(f"core.generated.{module_name}", module_path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                
                # Find the blueprint in the module
                for attr_name in dir(module):
                    if attr_name.endswith('_bp'):
                        blueprint = getattr(module, attr_name)
                        # Register the blueprint
                        app.register_blueprint(blueprint, url_prefix=f'/api/{table_name}')
                        logger.info(f"Registered blueprint {attr_name} for table {table_name}")
                        count += 1
                        break
            except Exception as e:
                logger.error(f"Error registering blueprint from {filename}: {e}")
    
    logger.info(f"Registered {count} dynamic blueprints")
    return count

def register_new_blueprint(app, table_name):
    """
    Register a newly created blueprint without restarting the server
    
    Args:
        app: The Flask application instance
        table_name: The name of the table
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Construct the module name and path
        module_name = f"{table_name}_controller"
        module_path = os.path.join(os.path.dirname(__file__), 'generated', f"{module_name}.py")
        
        # Check if the file exists
        if not os.path.exists(module_path):
            logger.error(f"Controller file not found: {module_path}")
            return False
        
        # Import the module
        spec = importlib.util.spec_from_file_location(f"core.generated.{module_name}", module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        # Find the blueprint in the module
        blueprint_found = False
        for attr_name in dir(module):
            if attr_name.endswith('_bp'):
                blueprint = getattr(module, attr_name)
                
                # Check if already registered
                if hasattr(app, 'blueprints') and blueprint.name in app.blueprints:
                    logger.info(f"Blueprint {attr_name} for table {table_name} already registered")
                    return True
                
                # Register the blueprint
                app.register_blueprint(blueprint, url_prefix=f'/api/{table_name}')
                logger.info(f"Dynamically registered blueprint {attr_name} for table {table_name}")
                blueprint_found = True
                break
        
        if not blueprint_found:
            logger.error(f"No blueprint found in module {module_name}")
            return False
        
        return True
        
    except Exception as e:
        logger.error(f"Error registering new blueprint for table {table_name}: {e}")
        return False