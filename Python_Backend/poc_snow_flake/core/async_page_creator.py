"""
Asynchronous Page Creator

This module handles dynamic page creation in a separate process to avoid
interrupting the main server.
"""

import os
import sys
import json
import time
import logging
import traceback
from multiprocessing import Process

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='async_page_creator.log'
)
logger = logging.getLogger('async_page_creator')

def create_page_files(data, status_file):
    """
    Create dynamic page files in a separate process
    
    Args:
        data: Dictionary with page creation data
        status_file: Path to the status file to write results
    """
    try:
        logger.info(f"Starting async page creation for table: {data.get('tableName')}")
        
        # Add the project root to the Python path
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.insert(0, project_root)
        
        # Import the necessary modules
        from core.code_generator import generate_code
        
        # Extract data
        table_name = data.get('tableName')
        page_details = {
            'pageName': data.get('pageName'),
            'routePath': data.get('routePath'),
            'moduleName': data.get('moduleName')
        }
        
        # Get columns data (this would normally come from the database)
        # For this example, we'll use some dummy data
        columns_data = data.get('columnsData', {})
        if not columns_data:
            # Create some dummy columns if none provided
            columns_data = {
                'id-1': {
                    'COLUMN_NAME': f'{table_name}_id',
                    'DATA_TYPE': 'int',
                    'inputType': 'number',
                    'validations': {'required': True}
                },
                'id-2': {
                    'COLUMN_NAME': 'name',
                    'DATA_TYPE': 'varchar(255)',
                    'inputType': 'text',
                    'validations': {'required': False, 'maxLength': 255}
                }
            }
        
        # Generate the code files
        logger.info(f"Generating code files for table: {table_name}")
        generated_files = generate_code(table_name, columns_data, page_details)
        
        # Write the result to the status file
        result = {
            'success': True,
            'message': 'Dynamic page created successfully',
            'data': {
                'tableName': table_name,
                'pageName': page_details['pageName'],
                'routePath': page_details['routePath'],
                'files': {
                    'helper': os.path.basename(generated_files['files']['helper']),
                    'controller': os.path.basename(generated_files['files']['controller'])
                },
                'endpoints': {
                    'list': f"/api/{table_name}/list",
                    'create': f"/api/{table_name}/create",
                    'update': f"/api/{table_name}/update",
                    'delete': f"/api/{table_name}/delete"
                }
            }
        }
        
        with open(status_file, 'w') as f:
            json.dump(result, f)
        
        logger.info(f"Async page creation completed successfully for table: {table_name}")
        
    except Exception as e:
        logger.error(f"Error in async page creation: {e}")
        logger.error(traceback.format_exc())
        
        # Write error to status file
        error_result = {
            'success': False,
            'error': str(e),
            'message': 'Failed to create dynamic page'
        }
        
        try:
            with open(status_file, 'w') as f:
                json.dump(error_result, f)
        except Exception as write_error:
            logger.error(f"Error writing to status file: {write_error}")

def start_async_page_creation(data):
    """
    Start the page creation process in a separate process
    
    Args:
        data: Dictionary with page creation data
        
    Returns:
        str: Path to the status file
    """
    try:
        # Create a unique status file
        table_name = data.get('tableName', 'unknown')
        timestamp = int(time.time())
        status_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'status')
        
        # Create status directory if it doesn't exist
        if not os.path.exists(status_dir):
            os.makedirs(status_dir)
        
        status_file = os.path.join(status_dir, f"{table_name}_{timestamp}.json")
        
        # Create initial status file
        with open(status_file, 'w') as f:
            json.dump({
                'status': 'processing',
                'message': 'Dynamic page creation in progress',
                'tableName': table_name,
                'timestamp': timestamp
            }, f)
        
        # Start the process
        process = Process(target=create_page_files, args=(data, status_file))
        process.daemon = True
        process.start()
        
        logger.info(f"Started async page creation process for table: {table_name}")
        
        return status_file
        
    except Exception as e:
        logger.error(f"Error starting async page creation: {e}")
        raise

def get_creation_status(status_file):
    """
    Get the status of a page creation process
    
    Args:
        status_file: Path to the status file
        
    Returns:
        dict: Status information
    """
    try:
        if not os.path.exists(status_file):
            return {
                'success': False,
                'error': 'Status file not found',
                'message': 'The page creation process may not have started'
            }
        
        with open(status_file, 'r') as f:
            status = json.load(f)
        
        return status
        
    except Exception as e:
        logger.error(f"Error getting creation status: {e}")
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to get page creation status'
        }