echo off
cls
echo -- BACKUP DATABASE --
set DATABASENAME=CFC_test
set SERVERNAME=VMI302052\SQLEXPRESS
echo Backuping %DATABASENAME% on %SERVERNAME%

:: filename format Name-Date (eg MyDatabase-2009.5.19.bak)
set DATESTAMP=%DATE:~-4%.%DATE:~7,2%.%DATE:~4,2%
set BACKUPFILENAME=%CD%\%DATABASENAME%-%DATESTAMP%.bak

sqlcmd -E -S %SERVERNAME% -d master -Q "BACKUP DATABASE [%DATABASENAME%] TO DISK = N'%BACKUPFILENAME%' WITH INIT , NOUNLOAD , NAME = N'%DATABASENAME% backup', NOSKIP , STATS = 10, NOFORMAT"
