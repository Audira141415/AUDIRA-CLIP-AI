@echo off
cd /d "%~dp0"
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Installing requirements...
venv\Scripts\python.exe -m pip install -r requirements.txt
echo Starting AI Engine...
venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8000
pause
