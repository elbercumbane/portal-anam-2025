-- Script para garantir UTF-8 em todas as tabelas
-- Execute este script se houver problemas com caracteres especiais

-- Verificar encoding do banco de dados
SELECT datname, pg_encoding_to_char(encoding) as encoding 
FROM pg_database 
WHERE datname = 'anam';

-- Verificar encoding do servidor
SHOW server_encoding;

-- Verificar encoding do cliente
SHOW client_encoding;

-- Configurar encoding UTF-8 para a sessão atual
SET client_encoding TO 'UTF8';

-- Verificar encoding das colunas de texto nas tabelas principais
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('membros', 'home_content', 'apoiantes', 'simpatizantes')
    AND data_type LIKE '%char%'
ORDER BY table_name, ordinal_position;

-- Nota: No PostgreSQL, o encoding é definido no nível do banco de dados
-- Todas as tabelas herdam o encoding do banco de dados
-- Se o banco está em UTF-8, todas as tabelas também estarão em UTF-8
