-- Tabela de utilizadores (login)
-- Admin: acessa dashboard
-- Membro: acessa área de membros (vinculado a member_application_id)
-- Um admin pode também ter member_application_id para acessar sua área de membro

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'membro',  -- 'admin' | 'membro'
    member_application_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_member
        FOREIGN KEY (member_application_id) REFERENCES member_applications(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_member ON users(member_application_id) WHERE member_application_id IS NOT NULL;

COMMENT ON TABLE users IS 'Utilizadores do sistema: administradores e membros';
COMMENT ON COLUMN users.role IS 'admin: dashboard | membro: área de membros';
COMMENT ON COLUMN users.member_application_id IS 'Se preenchido, vincula à candidatura aprovada (para membros ou admin que também é membro)';
