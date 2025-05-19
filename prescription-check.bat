@echo off
REM prescription-check.bat
cd D:\web\sdp
IF NOT EXIST logs mkdir logs
node scripts\checkExpiredPrescriptions.js >> logs\expiry.log 2>&1