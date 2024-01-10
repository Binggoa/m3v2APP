@echo off & title 获取上级目录名 By 依梦琴瑶
 
set BatDir=%~dp0
 
for %%a in ("%BatDir:~,-1%") do set DirName=%%~nxa
 
echo NowFilesName:%DirName%
pause