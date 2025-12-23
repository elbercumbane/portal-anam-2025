-- Script SQL para criar o banco de dados manualmente
-- Execute este script no PostgreSQL usando psql ou pgAdmin

-- Criar database se não existir
SELECT 'CREATE DATABASE anam_portal'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'anam_portal')\gexec

-- Conectar ao database criado
\c anam_portal

-- Executar schema (o conteúdo do schema.sql será executado aqui)
-- Por favor, execute o arquivo schema.sql após criar o database

