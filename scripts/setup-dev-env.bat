@echo off
REM Script de Setup de Ambiente de Desenvolvimento para Plataforma WIRA
REM Este script configura todos os componentes necessários para desenvolvimento local

echo ========================================
echo Setup de Ambiente de Desenvolvimento WIRA
echo ========================================
echo.

REM Verificar se Node.js está instalado
echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado. Por favor instale Node.js antes de continuar.
    pause
    exit /b 1
)

REM Verificar se npm está instalado
echo Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ERRO: npm nao esta instalado. Por favor instale Node.js (que inclui npm) antes de continuar.
    pause
    exit /b 1
)

REM Navegar para o diretorio do backend e instalar dependencias
echo.
echo Instalando dependencias do backend...
cd /d "%~dp0..\wira-platform\backend"
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do backend
    pause
    exit /b 1
)

REM Navegar para o diretorio do frontend e instalar dependencias
echo.
echo Instalando dependencias do frontend...
cd /d "%~dp0..\wira-platform\frontend"
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do frontend
    pause
    exit /b 1
)

REM Navegar para o diretorio do mobile-app e instalar dependencias
echo.
echo Instalando dependencias do mobile-app...
cd /d "%~dp0..\wira-platform\mobile-app"
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do mobile-app
    pause
    exit /b 1
)

REM Voltar ao diretorio do backend e rodar migracoes
echo.
echo Rodando migracoes do banco de dados...
cd /d "%~dp0..\wira-platform\backend"
npm run migrate
if %errorlevel% neq 0 (
    echo AVISO: Falha ao rodar migracoes do banco de dados
)

REM Copiar arquivo .env.example se .env nao existir
if not exist ".env" (
    echo Copiando .env.example para .env...
    copy .env.example .env
)

echo.
echo Setup concluido com sucesso!
echo.
echo Para iniciar os servidores, execute os seguintes comandos em terminais separados:
echo.
echo Backend: cd wira-platform\backend && npm run dev
echo Frontend: cd wira-platform\frontend && npm run dev
echo Mobile: cd wira-platform\mobile-app && npm start
echo.
pause