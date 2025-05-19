"""
Application Configuration Module

This module provides configuration settings for the application,
supporting different environments (development, testing, production).
"""

import os
from dotenv import load_dotenv

# Base configuration class
class Config:
    """Base configuration class with common settings."""
    
    # Load environment variables
    ENV_FILE = os.getenv('ENV_FILE', 'environments/env.dev')
    load_dotenv(ENV_FILE)
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    DEBUG = False
    TESTING = False
    
    # Database settings
    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', '3306'))
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000', '*']
    
    # Logging settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

# Development configuration
class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True
    ENV = 'development'

# Testing configuration
class TestingConfig(Config):
    """Testing environment configuration."""
    TESTING = True
    DEBUG = True
    ENV = 'testing'
    
    # Use a test database
    MYSQL_DATABASE = os.getenv('TEST_MYSQL_DATABASE', 'test_database')

# Production configuration
class ProductionConfig(Config):
    """Production environment configuration."""
    ENV = 'production'
    
    # In production, ensure a strong secret key is set
    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable is not set")

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """
    Get the appropriate configuration based on the environment.
    
    Returns:
        Config: The configuration class for the current environment
    """
    env = os.getenv('FLASK_ENV', 'default')
    return config.get(env, config['default'])