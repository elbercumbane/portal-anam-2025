-- Tabela para inscrições em eventos (Inscrever-se em Eventos)
-- Uma linha por participante por evento.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_date VARCHAR(100),
    event_location VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    participant_type VARCHAR(50) NOT NULL,
    receive_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);
