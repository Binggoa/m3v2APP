@echo off
if %cd%==%cd:~,3% echo goto end
cd..
set "bbbd=%cd%"
cd..
set "bd=%cd%"
cd..
set "bbd=%cd%"
if "%bbd%"=="%bd%" (echo %cd:~,1%) else call echo "%%bbbd%:%bd:%bbd%\%%"
:end
pause