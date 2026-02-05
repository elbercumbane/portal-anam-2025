-- Inserir ou atualizar hero_slide_4 (Valores)
INSERT INTO home_content (id, section_key, title, subtitle, image_url, order_index, is_active, metadata, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'hero_slide_4',
    'Nossos <span class=''highlight-letter-red''>Valores</span>',
    '<strong class=''highlight-letter-yellow''>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.<br><br><strong class=''highlight-letter-yellow''>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.<br><br><strong class=''highlight-letter-yellow''>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura.',
    '/assets/FOTO_UNSPLASH_4_VALORES.jpg',
    3,
    true,
    '{"buttonText": "Torne-se Parceiro", "buttonLink": "/parceiros", "buttonColor": "#4CAF50"}',
    NOW(),
    NOW()
)
ON CONFLICT (section_key) 
DO UPDATE SET 
    image_url = '/assets/FOTO_UNSPLASH_4_VALORES.jpg',
    title = 'Nossos <span class=''highlight-letter-red''>Valores</span>',
    subtitle = '<strong class=''highlight-letter-yellow''>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.<br><br><strong class=''highlight-letter-yellow''>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.<br><br><strong class=''highlight-letter-yellow''>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura.',
    order_index = 3,
    metadata = '{"buttonText": "Torne-se Parceiro", "buttonLink": "/parceiros", "buttonColor": "#4CAF50"}',
    updated_at = NOW();
