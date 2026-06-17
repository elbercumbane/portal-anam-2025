-- Tabela de pagamentos de cotas
-- Cada registo = pagamento de cota mensal de um membro
-- A contagem das cotas começa a partir da data de aprovação (approved_at) na gestão de membros

CREATE TABLE IF NOT EXISTS quota_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_application_id UUID NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Paid',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_quota_member
        FOREIGN KEY (member_application_id) REFERENCES member_applications(id) ON DELETE CASCADE,
    CONSTRAINT chk_month_range CHECK (month >= 1 AND month <= 12)
);

CREATE INDEX IF NOT EXISTS idx_quota_payments_member ON quota_payments(member_application_id);
CREATE INDEX IF NOT EXISTS idx_quota_payments_year_month ON quota_payments(year, month);

COMMENT ON TABLE quota_payments IS 'Pagamentos de cotas mensais dos membros. Vinculado ao member_applications via NUIT.';
COMMENT ON COLUMN quota_payments.member_application_id IS 'ID da candidatura aprovada (membro)';
COMMENT ON COLUMN quota_payments.amount IS 'Valor pago em MZN';
COMMENT ON COLUMN quota_payments.payment_method IS 'M-Pesa, Emola, Transferência, Dinheiro, Visa, etc.';
