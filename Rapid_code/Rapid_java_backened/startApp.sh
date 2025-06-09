##!/bin/bash
#
## Backend and Frontend Directories
#FRONTEND_DIR="C:/Users/MohammadJuned/git/Rapid_Code_Module/rapid-code-generator-frontend/rapid-frontend"
#BACKEND_DIR="C:/Users/MohammadJuned/git/Rapid_Code_Module/rapid-code-generator-Backened"
#
## Start Backend
#echo "Starting backend..."
#
#cd $BACKEND_DIR || exit 1  # Navigate to the backend directory, exit if it fails
#
#echo "Running Maven clean install..."
#./mvnw clean install -DskipTests || exit 1  # Run Maven clean install, exit on failure
#
#echo "Starting backend..."
#./mvnw spring-boot:run &  # Start the backend in the background
#
#sleep 10  # Wait for the backend to start
#
## Start Frontend
#echo "Starting frontend..."
#
#cd $FRONTEND_DIR || exit 1  # Navigate to the frontend directory, exit if it fails
#
#echo "Running npm install..."
#npm install || exit 1  # Run npm install, exit on failure
#
#echo "Installing @mui/system and react-scripts@latest..."
#npm install @mui/system || exit 1  # Install @mui/system, exit on failure
#npm install react-scripts@latest || exit 1  # Install react-scripts@latest, exit on failure
#
#echo "Starting React frontend..."
#npm start  # Start the React frontend
