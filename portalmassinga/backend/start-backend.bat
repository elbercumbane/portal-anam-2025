@echo off
setlocal

REM Inicia o backend Spring Boot usando o Maven Wrapper (Windows)
REM Importante: nao abrir/rodar o .mvn\wrapper\maven-wrapper.jar diretamente.

cd /d "%~dp0"

if not exist "mvnw.cmd" (
  echo ERRO: mvnw.cmd nao encontrado nesta pasta: %cd%
  echo Abra o terminal dentro da pasta backend e execute: mvnw.cmd spring-boot:run
  pause
  exit /b 1
)

call mvnw.cmd spring-boot:run

