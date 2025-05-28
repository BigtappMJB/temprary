@echo off
echo Starting Table Schema Generator...
echo.
echo This will start both the React application and the Python service.
echo.
echo Starting Python service...
start cmd /k "node server/start_python_service.js"
echo.
echo Starting React application...
start cmd /k "npm run start-react"
echo.
echo Both services have been started. Please wait a moment for them to initialize.
echo.
echo Access the application at: http://localhost:8080
echo.