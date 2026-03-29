@echo off
:: World Best Insurer — Daily Auto Indexer
:: Runs every day via Windows Task Scheduler
:: Submits 200 URLs to Google Indexing API + IndexNow (Bing/Yandex)

cd /d D:\worldbestinsurer

echo [%date% %time%] Running daily indexer... >> data\seo\index-runner.log

:: Run Google Indexing API (requires service account key)
if exist service-account.json (
    echo [%date% %time%] Submitting 200 URLs via Google Indexing API... >> data\seo\index-runner.log
    call npx tsx scripts/seo/indexing.ts submit --key ./service-account.json --limit 200 >> data\seo\index-runner.log 2>&1
) else (
    echo [%date% %time%] No service-account.json found. Skipping Google API. >> data\seo\index-runner.log
)

:: Run IndexNow for Bing/Yandex (unlimited, no key needed)
echo [%date% %time%] Running IndexNow submission... >> data\seo\index-runner.log
call npx tsx scripts/seo/auto-index.ts --all >> data\seo\index-runner.log 2>&1

echo [%date% %time%] Done. >> data\seo\index-runner.log
echo.
echo Daily indexing complete. Check data\seo\index-runner.log for details.
