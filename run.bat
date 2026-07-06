@echo off
title SkillForge Startup
echo ====================================================
echo   🤖 Starting SkillForge technical hiring platform  
echo ====================================================
echo.

echo 📡 Starting SkillForge API server...
start "SkillForge API" cmd /k "cd server && npm run dev"

echo 💻 Starting SkillForge Vite Dev Server...
start "SkillForge Web" cmd /k "cd client && npm run dev"

echo.
echo ====================================================
echo   ✅ Both systems launched!
echo   📡 API: http://localhost:5000
echo   💻 Client: http://localhost:5173
echo ====================================================
echo.
pause
