@echo off
echo Running command 1
start java -jar target\DBCaseWeb-0.0.1-SNAPSHOT.war
timeout /t 10 /nobreak >nul

echo Running command 2
timeout 5
start http://localhost:8080
