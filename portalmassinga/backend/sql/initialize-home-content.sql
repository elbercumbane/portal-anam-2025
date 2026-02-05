-- Script SQL para inicializar todo o conteúdo atual da página inicial
-- Este script salva todos os conteúdos atuais (textos, imagens, vídeos) organizados por seção
-- Execute este script para popular a tabela home_content com o conteúdo padrão

-- Limpar conteúdo existente (opcional - descomente se quiser resetar)
-- DELETE FROM home_content;

-- ============================================
-- SLIDES DO HERO (4 slides)
-- ============================================

-- Slide 1: Bem-vindo
INSERT INTO home_content (section_key, title, subtitle, image_url, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'hero_slide_1',
    'Bem-vindo à <span class=''highlight-letter-yellow''>Associação</span> de Naturais e Amigos de Massinga',
    'Unindo pessoas, fortalecendo comunidades, construindo o futuro de Massinga.',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    0,
    true,
    '{"buttonText": "Torne-se Membro", "buttonLink": "/associar", "buttonColor": "#FFD700"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image_url = EXCLUDED.image_url,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- Slide 2: Missão
INSERT INTO home_content (section_key, title, subtitle, image_url, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'hero_slide_2',
    'Nossa <span class=''highlight-letter-red''>Missão</span>',
    'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    1,
    true,
    '{"buttonText": "Torne-se Simpatizante", "buttonLink": "/associar", "buttonColor": "#EF4444"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image_url = EXCLUDED.image_url,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- Slide 3: Visão
INSERT INTO home_content (section_key, title, subtitle, image_url, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'hero_slide_3',
    'Nossa <span class=''highlight-letter-yellow''>Visão</span>',
    'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    2,
    true,
    '{"buttonText": "Torne-se Apoiante", "buttonLink": "/associar", "buttonColor": "#60A5FA"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image_url = EXCLUDED.image_url,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- Slide 4: Valores
INSERT INTO home_content (section_key, title, subtitle, image_url, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'hero_slide_4',
    'Nossos <span class=''highlight-letter-red''>Valores</span>',
    '<strong class=''highlight-letter-yellow''>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.<br><br><strong class=''highlight-letter-yellow''>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.<br><br><strong class=''highlight-letter-yellow''>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    3,
    true,
    '{"buttonText": "Torne-se Parceiro", "buttonLink": "/parceiros", "buttonColor": "#4CAF50"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image_url = EXCLUDED.image_url,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- SEÇÃO SOBRE ANAM
-- ============================================
INSERT INTO home_content (section_key, title, content, order_index, is_active, created_at, updated_at)
VALUES (
    'sobre_anam',
    'Sobre a ANAM',
    'Promovemos o desenvolvimento sustentável e o bem-estar socioeconómico das comunidades do Distrito de Massinga.',
    10,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- MISSÃO
-- ============================================
INSERT INTO home_content (section_key, title, content, order_index, is_active, created_at, updated_at)
VALUES (
    'missao',
    'Missão',
    'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.',
    11,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- VISÃO
-- ============================================
INSERT INTO home_content (section_key, title, content, order_index, is_active, created_at, updated_at)
VALUES (
    'visao',
    'Visão',
    'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.',
    12,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- NOSSOS VALORES
-- ============================================
INSERT INTO home_content (section_key, title, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'valores',
    'Nossos Valores',
    13,
    true,
    '{"valores": [
        {
            "titulo": "Desenvolvimento de Competências",
            "descricao": "Acesse uma força de trabalho qualificada, identifique programas de capacitação e gerencie necessidades de capital humano."
        },
        {
            "titulo": "Networking Empresarial",
            "descricao": "Conecte-se com profissionais de alto nível, tomadores de decisão e agentes-chave em múltiplos setores."
        },
        {
            "titulo": "Oportunidades em Tempo Real",
            "descricao": "Participe de projetos nos setores de mineração, energia, agricultura e infraestrutura com dados transparentes e em tempo real."
        }
    ]}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    title = EXCLUDED.title,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- CONFIGURAÇÕES DE NATAL (opcional)
-- ============================================
INSERT INTO home_content (section_key, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    'christmas_config',
    0,
    true,
    '{"enableSnow": true, "enableSanta": true, "christmasMessage": "Feliz Natal e Próspero 2025 🎄"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (section_key) DO UPDATE SET
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar conteúdo inserido
SELECT section_key, title, order_index, is_active, created_at 
FROM home_content 
ORDER BY order_index ASC;
