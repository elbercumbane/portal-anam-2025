# Conectar pgAdmin 4 ao Backend (PostgreSQL)

O backend usa a base de dados **anam2025**. Use os mesmos dados no pgAdmin para ver e editar os dados (incluindo candidaturas de membros).

## Dados de conexão (igual ao application.properties)

| Campo        | Valor              |
|-------------|--------------------|
| **Host**    | `localhost`        |
| **Porta**   | `5432`             |
| **Base de dados** | `anam2025` |
| **Utilizador**   | `postgres`   |
| **Palavra-passe** | (a que está em `application.properties`: `spring.datasource.password`) |

No seu projeto está configurado: `spring.datasource.password=santos133` (altere no pgAdmin se mudar no properties).

## Passos no pgAdmin 4

1. Abra o **pgAdmin 4**.
2. No painel esquerdo, clique com o botão direito em **Servers** → **Register** → **Server...** (ou use um servidor já existente).
3. Aba **General**: nome, por exemplo `PostgreSQL Local`.
4. Aba **Connection**:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Maintenance database:** `postgres`
   - **Username:** `postgres`
   - **Password:** (a mesma do `application.properties`)
   - Opcional: marque **Save password**.
5. Clique em **Save**.

## Ver as tabelas de membros

1. Expanda: **Servers** → **PostgreSQL Local** → **Databases** → **anam2025** → **Schemas** → **public** → **Tables**.
2. Tabelas usadas pelo backend:
   - **member_applications** – candidaturas de membros
   - **application_dependents** – dependentes de cada candidatura

Para ver os registos: clique com o botão direito na tabela → **View/Edit Data** → **All Rows**.

## Resumo

- **Backend:** `http://localhost:8080/api` (Spring Boot).
- **Base de dados:** `anam2025` em `localhost:5432`, utilizador `postgres`.
- **Registos de membros:** feitos na página **Associar-se** do portal (ou via API `POST /api/member-applications`).
- **Visualizar no dashboard:** após login no dashboard, ir a **Área de Membros** → **Gestão de Membros**.
