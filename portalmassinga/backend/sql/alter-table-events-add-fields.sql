-- Migração: adicionar data início/fim, cancelamento e data fim para lógica "evento passado"
-- Execute na base anam2025 se a tabela events já existir.

-- Colunas para data início e fim (texto para exibição)
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date_start VARCHAR(100);
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date_end VARCHAR(100);
-- Data fim em DATE para verificar se evento já passou (permite editar só futuros)
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;

-- Cancelamento: em vez de apagar, marcar como cancelado e guardar mensagem
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cancelled_message TEXT;

-- Migrar event_date existente para event_date_start e event_date_end (mesmo dia)
UPDATE events SET event_date_start = event_date, event_date_end = event_date WHERE event_date_start IS NULL AND event_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_is_cancelled ON events(is_cancelled);
