@echo off
echo Testing code generation API...

curl -X POST http://localhost:8080/api/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"projectName\":\"StudentManagement\",\"packageName\":\"com.example.student\",\"modules\":[{\"type\":\"entity\",\"name\":\"Student\",\"fields\":[{\"name\":\"id\",\"type\":\"Long\"},{\"name\":\"name\",\"type\":\"String\"},{\"name\":\"email\",\"type\":\"String\"}]},{\"type\":\"controller\",\"name\":\"StudentController\"}]}"

echo.
echo Test completed.