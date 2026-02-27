# Scripts SQL e Migrações

## Ordem de execução recomendada

1. **create-database-anam2025.sql** – Base e tabelas principais
2. **alter-member-applications-add-nuit.sql** – Adiciona coluna NUIT
3. **create-table-quota-payments.sql** – Pagamentos de cotas (ou deixe Hibernate criar)
4. **create-table-users.sql** – Utilizadores para login (ou deixe Hibernate criar)

## Hibernate ddl-auto=update

Com `spring.jpa.hibernate.ddl-auto=update`, o Hibernate cria e atualiza as tabelas automaticamente ao iniciar a aplicação. Nesse caso, **não é obrigatório** executar os scripts SQL manualmente.

## Contas de administrador

As contas de administrador são **criadas automaticamente** na primeira execução:

| Email            | Senha    | Nome                   |
|------------------|----------|------------------------|
| admin@anam.co.mz | admin123 | Administrador Principal |
| admin2@anam.co.mz | admin123 | Administrador Secundário |

## Gestão de cotas

- A contagem das cotas começa **a partir da data de aprovação** na gestão de membros.
- A pesquisa por **nome, contacto e NUIT** está no backend e no frontend.
- O pagamento está associado ao **NUIT** do membro (via `member_application_id`).
