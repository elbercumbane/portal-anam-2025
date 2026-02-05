-- Script SQL para alterar a coluna image_url de VARCHAR(500) para TEXT
-- Isso permite armazenar imagens em base64 que podem ser muito grandes
-- Execute este script no pgAdmin4 ou via psql

-- Conectar à base de dados 'anam' antes de executar
-- \c anam

-- Alterar a coluna image_url de VARCHAR(500) para TEXT
ALTER TABLE home_content 
ALTER COLUMN image_url TYPE TEXT;

-- Verificar se a alteração foi aplicada
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'home_content' 
AND column_name = 'image_url';

-- Comentário atualizado
COMMENT ON COLUMN home_content.image_url IS 'URL da imagem ou imagem em base64 (TEXT para suportar imagens grandes)';
