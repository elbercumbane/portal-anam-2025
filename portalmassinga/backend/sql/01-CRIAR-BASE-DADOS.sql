-- =====================================================
-- SCRIPT 1: CRIAR/REMOVER BASE DE DADOS ANAM
-- =====================================================
-- Este script remove a base de dados existente (se houver)
-- e cria uma nova base de dados ANAM com encoding UTF-8
--
-- Execute como: psql -U postgres -f 01-CRIAR-BASE-DADOS.sql
-- =====================================================

-- Remover base de dados existente (se houver)
-- Nota: DROP DATABASE não pode ser executado dentro de um bloco DO
-- Primeiro, terminar todas as conexões ativas
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'anam' AND pid <> pg_backend_pid();

-- Remover a base de dados (se existir)
DROP DATABASE IF EXISTS anam;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_database WHERE datname = 'anam') THEN
        RAISE NOTICE '✅ Base de dados ANAM removida com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Base de dados ANAM não existe. Prosseguindo com criação...';
    END IF;
END
$$;

-- Criar nova base de dados ANAM
-- Usar template0 para evitar problemas de collation
CREATE DATABASE anam
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Base de dados ANAM criada com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Próximo passo: Execute 02-SETUP-TABELAS.sql conectado à base anam';
    RAISE NOTICE '========================================';
END $$;
