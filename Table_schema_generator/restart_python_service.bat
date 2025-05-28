@echo off
echo Restarting Python service...
taskkill /f /im python.exe
timeout /t 2
start cmd /k "node server/start_python_service.js"
echo Python service restarted.
echo.
echo You can now test the service with:
echo test_python_service.bat
echo.