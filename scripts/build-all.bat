@echo off
REM Script para compilar todos os componentes da plataforma WIRA
REM Compila backend, frontend e mobile-app

echo ========================================
echo Compilando Plataforma WIRA
echo ========================================
echo.

set exit_code=0

REM Compilar backend
echo.
echo Compilando backend...
cd /d "%~dp0..\backend"
if exist "package.json" (
    echo Instalando dependencias de producao...
    npm ci --only=production
    echo Compilando backend...
    npm run build
    if !errorlevel! neq 0 (
        set /a exit_code=!exit_code!+1
        echo [ERRO] Compilacao do backend falhou
    ) else (
        echo [SUCESSO] Backend compilado com sucesso
    )
) else (
    echo [AVISO] Nenhum projeto backend encontrado
)

REM Compilar frontend
echo.
echo Compilando frontend...
cd /d "%~dp0..\frontend"
if exist "package.json" (
    echo Instalando dependencias de producao...
    npm ci --only=production
    echo Compilando frontend...
    npm run build
    if !errorlevel! neq 0 (
        set /a exit_code=!exit_code!+1
        echo [ERRO] Compilacao do frontend falhou
    ) else (
        echo [SUCESSO] Frontend compilado com sucesso
    )
) else (
    echo [AVISO] Nenhum projeto frontend encontrado
)

REM Para mobile-app, apenas verificar dependencias
echo.
echo Verificando mobile-app...
cd /d "%~dp0..\mobile-app"
if exist "package.json" (
    echo Instalando dependencias do mobile-app...
    npm ci --only=production
    echo [SUCESSO] Dependencias do mobile-app instaladas
    echo Nota: Para builds nativas do mobile-app, use: expo build:android e expo build:ios
) else (
    echo [AVISO] Nenhum projeto mobile-app encontrado
)

echo.
echo ========================================
echo Resumo da Compilacao
echo ========================================
echo.

if %exit_code% equ 0 (
    echo [SUCESSO] Todos os componentes foram compilados com sucesso!
    echo Builds completas disponiveis em:
    echo - Backend: backend/dist/
    echo - Frontend: frontend/dist/ ou frontend/build/
    echo - Mobile: Executar 'expo build' para builds nativas
) else (
    echo [ERRO] %exit_code% componente(s) falharam na compilacao.
)

echo.
pause
exit /b %exit_code%