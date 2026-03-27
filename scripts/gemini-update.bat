@echo off
echo ==========================================
echo  World Best Insurer - Gemini CLI Updater
echo ==========================================
echo.

set COUNTRY=%1
set CATEGORY=%2

if "%COUNTRY%"=="" (
    echo Usage: gemini-update.bat [country] [category]
    echo.
    echo Countries: in us uk ae sg ca au de sa jp kr hk
    echo Categories: health term-life motor travel
    echo.
    echo Examples:
    echo   gemini-update.bat in health
    echo   gemini-update.bat us term-life
    echo   gemini-update.bat all all
    exit /b 1
)

cd /d D:\worldbestinsurer

if "%COUNTRY%"=="all" (
    echo Updating ALL countries...
    for %%c in (in us uk ae sg ca au de sa jp kr hk) do (
        for %%t in (health term-life motor travel) do (
            echo.
            echo --- Updating %%c/%%t ---
            gemini --yolo -p "Read the file src/data/%%c/%%t-insurance.json, research the latest insurance products for this country and category, update the JSON with any new products or changes you find, and write the updated file back. Follow the schema in GEMINI.md. Only use real products."
            timeout /t 10 /nobreak > nul
        )
    )
) else if "%CATEGORY%"=="all" (
    echo Updating %COUNTRY% - all categories...
    for %%t in (health term-life motor travel) do (
        echo.
        echo --- Updating %COUNTRY%/%%t ---
        gemini --yolo -p "Read the file src/data/%COUNTRY%/%%t-insurance.json, research the latest insurance products for this country and category, update the JSON with any new products or changes you find, and write the updated file back. Follow the schema in GEMINI.md. Only use real products."
        timeout /t 10 /nobreak > nul
    )
) else (
    echo Updating %COUNTRY%/%CATEGORY%...
    gemini --yolo -p "Read the file src/data/%COUNTRY%/%CATEGORY%-insurance.json, research the latest insurance products for this country and category, update the JSON with any new products or changes you find, and write the updated file back. Follow the schema in GEMINI.md. Only use real products."
)

echo.
echo --- Pushing to GitHub ---
git add -A
git commit -m "AI Agent: Update %COUNTRY% %CATEGORY% insurance data %date%"
git push

echo.
echo Done! Vercel will auto-deploy.
