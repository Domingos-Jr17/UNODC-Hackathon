@echo off
REM Script para executar todos os testes da plataforma WIRA
REM Executa testes para backend, frontend e mobile-app

echo ========================================
echo Executando Testes da Plataforma WIRA
echo ========================================
echo.

set exit_code=0

REM Testar backend
echo.
echo Executando testes do backend...
cd /d "%~dp0..\backend"
if exist "package.json" (
    echo Rodando testes do backend...
    npm test
    if !errorlevel! neq 0 (
        set /a exit_code=!exit_code!+1
        echo [ERRO] Testes do backend falharam
    ) else (
        echo [SUCESSO] Testes do backend concluidos
    )
) else (
    echo [AVISO] Nenhum projeto backend encontrado
)

REM Testar frontend
echo.
echo Executando testes do frontend...
cd /d "%~dp0..\frontend"
if exist "package.json" (
    echo Rodando testes do frontend...
    npm test
    if !errorlevel! neq 0 (
        set /a exit_code=!exit_code!+1
        echo [ERRO] Testes do frontend falharam
    ) else (
        echo [SUCESSO] Testes do frontend concluidos
    )
) else (
    echo [AVISO] Nenhum projeto frontend encontrado
)

REM Testar mobile-app
echo.
echo Executando testes do mobile-app...
cd /d "%~dp0..\mobile-app"
if exist "package.json" (
    echo Rodando testes do mobile-app...
    npm test
    if !errorlevel! neq 0 (
        set /a exit_code=!exit_code!+1
        echo [ERRO] Testes do mobile-app falharam
    ) else (
        echo [SUCESSO] Testes do mobile-app concluidos
    )
) else (
    echo [AVISO] Nenhum projeto mobile-app encontrado
)

echo.
echo ========================================
echo Resumo da Execucao de Testes
echo ========================================
echo.

if %exit_code% equ 0 (
    echo [SUCESSO] Todos os testes passaram!
) else (
    echo [ERRO] %exit_code% componente(s) falharam nos testes.
)

echo.
pause
exit /b %exit_code%