-- Criar database se não existir
SELECT 'CREATE DATABASE anam_portal'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'anam_portal')\gexec
