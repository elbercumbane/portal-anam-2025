-- Membros de demonstração para apresentação (Pagar Cotas)
-- Executar após run-all-scripts-mae.sql
--
-- NUIT 400111222 — Ana Machel Demo — cotas EM DIA
-- NUIT 400333444 — Carlos Cumbane Demo — cotas COM DÍVIDAS

-- Remover dados demo anteriores (re-executável)
DELETE FROM quota_payments WHERE member_application_id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'a2222222-2222-2222-2222-222222222222'::uuid
);
DELETE FROM member_applications WHERE id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'a2222222-2222-2222-2222-222222222222'::uuid
);

-- Membro 1: em dia (aprovado Jan/2025, todos os meses pagos até Jun/2025)
INSERT INTO member_applications (
    id, full_name, father_name, mother_name, birth_date, marital_status, profession,
    mobile_phone, email, street, neighborhood, city, accepts_terms, status,
    approved_at, nuit, created_at
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Ana Machel Demo', 'João Machel', 'Maria Machel', '1990-05-15', 'Solteiro', 'Engenheira',
    '841234567', 'ana.demo@anam.co.mz', 'Av. Julius Nyerere', 'Sommerschield', 'Maputo',
    true, 'Approved', '2025-01-01 08:00:00', '400111222', '2024-12-01 10:00:00'
);

-- Membro 2: com dívidas (aprovado Jan/2025, só Jan e Fev pagos)
INSERT INTO member_applications (
    id, full_name, father_name, mother_name, birth_date, marital_status, profession,
    mobile_phone, email, street, neighborhood, city, accepts_terms, status,
    approved_at, nuit, created_at
) VALUES (
    'a2222222-2222-2222-2222-222222222222',
    'Carlos Cumbane Demo', 'Pedro Cumbane', 'Rosa Cumbane', '1988-08-20', 'Casado', 'Professor',
    '871234567', 'carlos.demo@anam.co.mz', 'Rua da Resistência', 'Central', 'Massinga',
    true, 'Approved', '2025-01-01 08:00:00', '400333444', '2024-12-01 10:00:00'
);

-- Pagamentos Ana (Jan–Jun 2025 = em dia)
INSERT INTO quota_payments (member_application_id, year, month, amount, payment_date, payment_method, reference, status)
SELECT 'a1111111-1111-1111-1111-111111111111', 2025, m, 1200, ('2025-' || LPAD(m::text, 2, '0') || '-05')::date, 'M-Pesa', 'PAY-DEMO-ANA-' || m, 'Paid'
FROM generate_series(1, 6) AS m;

-- Pagamentos Carlos (só Jan e Fev — Mar a Jun em falta)
INSERT INTO quota_payments (member_application_id, year, month, amount, payment_date, payment_method, reference, status) VALUES
    ('a2222222-2222-2222-2222-222222222222', 2025, 1, 1200, '2025-01-10', 'M-Pesa', 'PAY-DEMO-CAR-1', 'Paid'),
    ('a2222222-2222-2222-2222-222222222222', 2025, 2, 1200, '2025-02-10', 'Emola', 'PAY-DEMO-CAR-2', 'Paid');
