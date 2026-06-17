-- =====================================================
-- SCRIPT 2: CRIAR TABELAS E INICIALIZAR DADOS
-- =====================================================
-- Este script cria todas as tabelas e popula dados iniciais
-- Execute conectado à base de dados 'anam'
--
-- Execute como: psql -U postgres -d anam -f 02-SETUP-TABELAS-E-DADOS.sql
-- =====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: home_content
-- =====================================================
CREATE TABLE IF NOT EXISTS home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    order_index INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_home_content_section_key ON home_content(section_key);
CREATE INDEX IF NOT EXISTS idx_home_content_is_active ON home_content(is_active);
CREATE INDEX IF NOT EXISTS idx_home_content_order_index ON home_content(order_index);

COMMENT ON TABLE home_content IS 'Armazena o conteúdo parametrizável da página inicial do portal';
COMMENT ON COLUMN home_content.image_url IS 'URL da imagem ou base64 (TEXT para suportar imagens grandes)';

-- =====================================================
-- TABELA: membros
-- =====================================================
CREATE TABLE IF NOT EXISTS membros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    foto TEXT,
    nome_completo VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    profissao VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    endereco TEXT,
    cidade VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Moçambique',
    numero_membro VARCHAR(50) UNIQUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Ativo',
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_membros_email ON membros(email);
CREATE INDEX IF NOT EXISTS idx_membros_numero_membro ON membros(numero_membro);
CREATE INDEX IF NOT EXISTS idx_membros_status ON membros(status);

-- =====================================================
-- TABELA: apoiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS apoiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contacto VARCHAR(20) NOT NULL,
    tipo_apoio VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    anonimato BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Pendente',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_apoiantes_email ON apoiantes(email);
CREATE INDEX IF NOT EXISTS idx_apoiantes_status ON apoiantes(status);

-- =====================================================
-- TABELA: simpatizantes
-- =====================================================
CREATE TABLE IF NOT EXISTS simpatizantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    consentimento BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Ativo',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_simpatizantes_email ON simpatizantes(email);
CREATE INDEX IF NOT EXISTS idx_simpatizantes_status ON simpatizantes(status);

-- =====================================================
-- TABELA: member_applications
-- =====================================================
CREATE TABLE IF NOT EXISTS member_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo TEXT,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    marital_status VARCHAR(50) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    mobile_phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Moçambique',
    application_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pendente',
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);

-- =====================================================
-- TABELA: application_dependents
-- =====================================================
CREATE TABLE IF NOT EXISTS application_dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES member_applications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_application_dependents_application_id ON application_dependents(application_id);

-- =====================================================
-- INICIALIZAR CONTEÚDO DA PÁGINA INICIAL
-- =====================================================

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

-- Seção Sobre ANAM
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

-- Missão
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

-- Visão
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

-- Valores
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

-- Configurações de Natal (opcional)
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

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
DO $$
DECLARE
    table_count INTEGER;
    content_count INTEGER;
BEGIN
    -- Contar tabelas criadas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('home_content', 'membros', 'apoiantes', 'simpatizantes', 'member_applications', 'application_dependents');
    
    -- Contar conteúdo inicial
    SELECT COUNT(*) INTO content_count
    FROM home_content;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SETUP COMPLETO COM SUCESSO!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tabelas criadas: %', table_count;
    RAISE NOTICE 'Conteúdo inicial inserido: % registros', content_count;
    RAISE NOTICE '========================================';
END $$;

-- Mostrar resumo das tabelas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = 'public' AND table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('home_content', 'membros', 'apoiantes', 'simpatizantes', 'member_applications', 'application_dependents')
ORDER BY table_name;
