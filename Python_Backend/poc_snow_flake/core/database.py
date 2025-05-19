"""
MySQL Database Connection Management Module

This module provides functionality for managing MySQL database connections
using a connection pool for improved performance and resource management.
"""

import os
import time
import logging
from typing import Optional, Dict, Any, List, Union

import mysql.connector
from mysql.connector import Error, pooling
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('database')

# Global connection pool
connection_pool = None


def load_environment() -> None:
    """
    Load environment variables from the specified .env file.
    
    The environment file path can be specified using the ENV_FILE environment variable.
    If not specified, it defaults to 'environments/env.dev'.
    """
    env_file = os.getenv('ENV_FILE', 'environments/env.dev')
    load_dotenv(env_file)
    logger.debug(f"Loaded environment variables from {env_file}")


def initialize_connection_pool() -> None:
    """
    Initialize the MySQL database connection pool.
    
    This function creates a new connection pool if one doesn't exist,
    or validates an existing pool. If the pool initialization fails,
    the global connection_pool variable will be set to None.
    """
    global connection_pool
    
    # If pool exists and is not closed, validate it
    if connection_pool is not None:
        try:
            # Test if the pool is still valid by getting a connection
            test_conn = connection_pool.get_connection()
            test_conn.close()
            logger.debug("Existing connection pool is valid")
            return
        except Error as e:
            logger.warning(f"Existing connection pool is invalid: {e}")
            # Continue to recreate the pool
    
    try:
        # Load environment variables
        load_environment()
        
        # Get database connection parameters
        host = os.getenv('MYSQL_HOST')
        port = int(os.getenv('MYSQL_PORT', '3306'))
        database = os.getenv('MYSQL_DATABASE')
        user = os.getenv('MYSQL_USER')
        password = os.getenv('MYSQL_PASSWORD')
        
        # Validate required parameters
        if not all([host, database, user, password]):
            missing = []
            if not host: missing.append('MYSQL_HOST')
            if not database: missing.append('MYSQL_DATABASE')
            if not user: missing.append('MYSQL_USER')
            if not password: missing.append('MYSQL_PASSWORD')
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        
        logger.info(f"Attempting to connect to MySQL: {user}@{host}:{port}/{database}")
        
        # First, test if we can establish a single connection
        try:
            test_conn = mysql.connector.connect(
                host=host,
                port=port,
                database=database,
                user=user,
                password=password,
                connect_timeout=5
            )
            test_conn.close()
            logger.info("Test connection successful")
        except Error as test_err:
            logger.error(f"Test connection failed: {test_err}")
            # Re-raise with more descriptive message
            raise Error(f"Cannot connect to MySQL server at {host}:{port}. Error: {test_err}")
        
        # Connection pool configuration
        pool_config = {
            'pool_name': f'mysql_pool_{int(time.time())}',  # Unique pool name to avoid conflicts
            'pool_size': 5,  # Default pool size
            'pool_reset_session': True,
            'host': host,
            'port': port,
            'database': database,
            'user': user,
            'password': password,
            'connect_timeout': 10,  # Connection timeout in seconds
            'use_pure': True,  # Use pure Python implementation
            'autocommit': True,  # Auto-commit transactions
        }
        
        connection_pool = pooling.MySQLConnectionPool(**pool_config)
        logger.info("Database connection pool initialized successfully")
    except (Error, ValueError) as e:
        logger.error(f"Error initializing connection pool: {e}")
        # Don't raise here, let the application continue but with warnings
        connection_pool = None

def get_database_connection(max_retries: int = 3, retry_delay: int = 1) -> mysql.connector.MySQLConnection:
    """
    Gets a database connection from the pool with retry logic.
    
    This function attempts to get a connection from the pool. If the pool is not
    initialized or if getting a connection fails, it will retry according to the
    specified parameters. If all retries fail, it will raise an exception.
    
    Args:
        max_retries: Maximum number of connection attempts (default: 3)
        retry_delay: Delay between retries in seconds (default: 1)
        
    Returns:
        mysql.connector.MySQLConnection: A valid MySQL connection object
        
    Raises:
        mysql.connector.Error: If a connection cannot be established after all retries
    """
    global connection_pool
    
    # Initialize the connection pool if it doesn't exist
    if connection_pool is None:
        initialize_connection_pool()
        
    # If pool initialization failed, try direct connection
    if connection_pool is None:
        logger.warning("Connection pool initialization failed, attempting direct connection")
        try:
            # Load environment variables
            load_environment()
            
            # Get connection parameters
            host = os.getenv('MYSQL_HOST')
            port = int(os.getenv('MYSQL_PORT', '3306'))
            database = os.getenv('MYSQL_DATABASE')
            user = os.getenv('MYSQL_USER')
            password = os.getenv('MYSQL_PASSWORD')
            
            # Validate required parameters
            if not all([host, database, user, password]):
                missing = []
                if not host: missing.append('MYSQL_HOST')
                if not database: missing.append('MYSQL_DATABASE')
                if not user: missing.append('MYSQL_USER')
                if not password: missing.append('MYSQL_PASSWORD')
                raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
            
            logger.info(f"Attempting direct connection to MySQL: {user}@{host}:{port}/{database}")
            
            # Create direct connection
            connection = mysql.connector.connect(
                host=host,
                port=port,
                database=database,
                user=user,
                password=password,
                connect_timeout=10
            )
            
            # Test the connection
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            
            logger.info("Direct connection successful")
            return connection
        except (Error, ValueError) as e:
            logger.error(f"Direct connection failed: {e}")
            raise Error(f"Cannot connect to MySQL server. Please check your database configuration and ensure the server is running. Error: {e}")
    
    # Try to get a connection from the pool with retries
    retries = 0
    last_error = None
    
    while retries < max_retries:
        try:
            # Get connection from pool
            connection = connection_pool.get_connection()
            
            # Test the connection with a simple query
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            
            return connection
        except Error as e:
            last_error = e
            logger.warning(f"Connection attempt {retries + 1} failed: {e}")
            retries += 1
            
            # If this is not the last retry, wait before trying again
            if retries < max_retries:
                time.sleep(retry_delay)
                
                # Handle specific error conditions
                error_str = str(e).lower()
                if "pool is closed" in error_str or "not available" in error_str:
                    logger.info("Pool is closed or not available, reinitializing connection pool")
                    connection_pool = None
                    initialize_connection_pool()
                elif "pool exhausted" in error_str:
                    logger.info("Connection pool exhausted, attempting to create a direct connection")
                    # Try to create a direct connection instead of using the pool
                    try:
                        # Load environment variables
                        load_environment()
                        
                        # Get connection parameters
                        host = os.getenv('MYSQL_HOST')
                        port = int(os.getenv('MYSQL_PORT', '3306'))
                        database = os.getenv('MYSQL_DATABASE')
                        user = os.getenv('MYSQL_USER')
                        password = os.getenv('MYSQL_PASSWORD')
                        
                        # Create direct connection
                        direct_conn = mysql.connector.connect(
                            host=host,
                            port=port,
                            database=database,
                            user=user,
                            password=password,
                            connect_timeout=10
                        )
                        
                        logger.info("Direct connection successful, returning it instead of pool connection")
                        return direct_conn
                    except Error as direct_err:
                        logger.error(f"Direct connection failed: {direct_err}")
                        # Continue with retry logic
                    
                    # Reinitialize the pool for future connections
                    logger.info("Reinitializing connection pool with larger size")
                    connection_pool = None
                    initialize_connection_pool()
    
    # If we've exhausted all retries, log and raise the last error
    logger.error(f"Failed to connect to database after {max_retries} attempts. Last error: {last_error}")
    raise Error(f"Database connection failed after {max_retries} attempts. The database server may be down or unreachable. Please check your network connection and database server status. Error: {last_error}")


def close_connection(connection: Optional[mysql.connector.MySQLConnection]) -> None:
    """
    Safely close a database connection and return it to the pool.
    
    This function handles the safe closing of a database connection,
    catching and logging any errors that might occur during the process.
    
    Args:
        connection: The MySQL connection to close
    """
    if connection:
        try:
            connection.close()
            logger.debug("Database connection closed successfully")
        except Error as e:
            logger.warning(f"Error closing database connection: {e}")


def get_connection_pool_status() -> Dict[str, Any]:
    """
    Get the status of the connection pool.
    
    This function retrieves information about the current state of the
    connection pool, including whether it exists, its name, size,
    and the number of available connections.
    
    Returns:
        Dict[str, Any]: A dictionary containing status information about the connection pool
    """
    global connection_pool
    
    status = {
        "exists": connection_pool is not None,
        "pool_name": None,
        "pool_size": None,
        "available_connections": None,
        "is_valid": False
    }
    
    if connection_pool:
        try:
            # Test if the pool is valid
            test_conn = connection_pool.get_connection()
            test_conn.close()
            status["is_valid"] = True
        except Exception as e:
            status["error"] = str(e)
        
        # Get pool information
        status["pool_name"] = getattr(connection_pool, "_pool_name", "unknown")
        status["pool_size"] = getattr(connection_pool, "_pool_size", 0)
        
        # Estimate available connections
        try:
            # Try to get all available connections
            connections: List[mysql.connector.MySQLConnection] = []
            for _ in range(status["pool_size"]):
                try:
                    connections.append(connection_pool.get_connection())
                except Exception:
                    break
            
            status["available_connections"] = len(connections)
            
            # Return all connections to the pool
            for conn in connections:
                conn.close()
        except Exception as e:
            logger.warning(f"Error estimating available connections: {e}")
            status["available_connections"] = "unknown"
    
    return status


def create_direct_connection() -> mysql.connector.MySQLConnection:
    """
    Create a direct connection to the MySQL database without using the connection pool.
    
    This function is useful when the connection pool is not available or when
    a dedicated connection is needed for specific operations.
    
    Returns:
        mysql.connector.MySQLConnection: A direct MySQL connection
        
    Raises:
        mysql.connector.Error: If the connection cannot be established
        ValueError: If required environment variables are missing
    """
    # Load environment variables
    load_environment()
    
    # Get connection parameters
    host = os.getenv('MYSQL_HOST')
    port = int(os.getenv('MYSQL_PORT', '3306'))
    database = os.getenv('MYSQL_DATABASE')
    user = os.getenv('MYSQL_USER')
    password = os.getenv('MYSQL_PASSWORD')
    
    # Validate required parameters
    if not all([host, database, user, password]):
        missing = []
        if not host: missing.append('MYSQL_HOST')
        if not database: missing.append('MYSQL_DATABASE')
        if not user: missing.append('MYSQL_USER')
        if not password: missing.append('MYSQL_PASSWORD')
        raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
    
    logger.info(f"Creating direct connection to MySQL: {user}@{host}:{port}/{database}")
    
    try:
        # Create connection
        connection = mysql.connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            connect_timeout=10
        )
        
        # Test the connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        
        logger.info("Direct connection created successfully")
        return connection
    except Error as e:
        logger.error(f"Failed to create direct connection: {e}")
        raise Error(f"Cannot connect to MySQL server at {host}:{port}. Error: {e}")


