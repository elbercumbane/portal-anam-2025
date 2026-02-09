-- Tabela de eventos (eventos disponíveis para inscrição)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date VARCHAR(100),
    event_date_start VARCHAR(100),
    event_date_end VARCHAR(100),
    end_date DATE,
    location VARCHAR(255),
    time_slot VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    level_access VARCHAR(50),
    is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_at TIMESTAMP,
    cancelled_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT INTO events (id, title, event_date, event_date_start, event_date_end, location, time_slot, description, image_url, level_access, created_at, updated_at)
VALUES
  ('1', 'Workshop de Agricultura Sustentável', '15 de Janeiro, 2024', '15 de Janeiro, 2024', '15 de Janeiro, 2024', 'Centro Comunitário de Massinga', '09:00 - 16:00', 'Aprenda técnicas modernas de agricultura sustentável.', '/assets/mercado-maputo.jpg', 'publico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'Feira de Produtos Locais', '22 de Março, 2024', '22 de Março, 2024', '22 de Março, 2024', 'Praça Central de Massinga', '08:00 - 18:00', 'Exposição e venda de produtos artesanais e agrícolas da região.', '/assets/mercado-maputo.jpg', 'publico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('3', 'Conferência de Desenvolvimento Comunitário', '29 de Março, 2024', '29 de Março, 2024', '29 de Março, 2024', 'Auditório Municipal', '14:00 - 18:00', 'Discussão sobre estratégias de desenvolvimento sustentável.', '/assets/desenvolvimento-comunitario.jpg', 'membros', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('4', 'Seminário de Capacitação Empresarial', '5 de Abril, 2024', '5 de Abril, 2024', '5 de Abril, 2024', 'Centro de Formação Profissional', '09:00 - 16:00', 'Capacitação em gestão empresarial e marketing digital.', '/assets/slider/slide1.jpg', 'simpatizantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_is_cancelled ON events(is_cancelled);
