@echo off
:: World Best Insurer — Daily AI Agents
:: Run this daily via Windows Task Scheduler
:: Schedule: Every day at 9:00 AM

echo ==========================================
echo  World Best Insurer - Daily Agents
echo  %date% %time%
echo ==========================================
echo.

cd /d D:\worldbestinsurer

:: 1. Submit URLs to Google + Bing/Yandex for indexing
echo [1/3] Running Indexing Agent...
npx tsx scripts/seo/auto-index.ts
echo.

:: 2. Run SEO ranking agent (index + content)
echo [2/3] Running SEO Ranking Agent...
npx tsx scripts/seo/ranking-agent.ts --index
echo.

:: 3. Log completion
echo [3/3] Logging...
echo %date% %time% - Daily agents completed >> D:\worldbestinsurer\data\seo\agent-run-log.txt

echo.
echo ==========================================
echo  Done! Check data/seo/ for results.
echo ==========================================
