@echo off
echo Building and running Rapid Code Backend...
call mvn clean install
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)
echo Build successful! Starting application...
call mvn spring-boot:run