## 🧾 Visão Geral do Projeto ANAM (Backend + Frontend + BD)

O projeto ANAM é um **portal web** para a Associação de Naturais e Amigos de Massinga, com foco em:

- **Cadastro e gestão de membros**
- **Gestão de apoiantes, simpatizantes e candidaturas**
- **Gestão de conteúdo dinâmico da página inicial (`home_content`)**

### Estrutura Geral do Projeto

- **Frontend** (`portalmassinga/frontend`)
  - Framework: **Angular 18** (`@angular/core` ^18.2.0)
  - Linguagem: **TypeScript**
  - Responsável por:
    - Interfaces de utilizador (páginas, componentes)
    - Formulários de cadastro (membros, simpatizantes, apoiantes, etc.)
    - Comunicar com o backend via **HTTP/REST** usando **JSON**

- **Backend** (`portalmassinga/backend`)
  - Framework: **Spring Boot 3.2.5** (Java 17)
  - Módulos principais:
    - `controller` – controladores REST (ex.: `MembroController`)
    - `entity` – entidades JPA (ex.: `Membro`, `User`, `Apoiantes`, `Simpatizantes`, `HomeContent`, etc.)
    - `repository` – interfaces JPA (`MembroRepository`, `UserRepository`, …)
    - `service` – serviços de negócio (`SmsService`, etc.)
    - `config` – configurações web, encoding, etc. (`WebConfig`)
  - Tecnologias:
    - **Spring Web** – API REST
    - **Spring Data JPA / Hibernate** – mapeamento objeto‑relacional
    - **Spring Validation** – validação de DTOs
    - **SpringDoc / Swagger** – documentação da API

- **Base de Dados** (PostgreSQL em Docker)
  - Container principal: **`anam-postgres`**
  - Base de dados: **`anam`**
  - Tabelas principais:
    - `membros` – dados completos do membro da associação
    - `apoiantes`, `simpatizantes`
    - `member_applications`, `application_dependents`
    - `home_content` – conteúdo parametrizável da página inicial
  - Scripts em `backend/sql`:
    - `01-CRIAR-BASE-DADOS.sql` – cria/remover a BD `anam`
    - `02-SETUP-TABELAS-E-DADOS.sql` – cria tabelas e dados iniciais
    - `RECRIAR-BASE-DADOS-DOCKER.bat` – recria tudo via Docker

### Configuração de Conexão com a BD

Ficheiro: `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/anam?useUnicode=true&characterEncoding=UTF-8&stringtype=unspecified
spring.datasource.username=postgres
spring.datasource.password=admin123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

O container `anam-postgres` expõe a BD na porta **5432** com o utilizador `postgres` e senha `admin123`.

---

## 🌐 Fluxo de Cadastro de Novos Membros (Fim a Fim)

### 1. Frontend (Angular) – Formulário de Membro

No frontend existe um **formulário completo de cadastro de membro**, que recolhe:

- **Dados pessoais**: nome completo, pai, mãe, data de nascimento, estado civil, profissão, etc.
- **Contactos**: telemóvel, telefone opcional, email, morada (rua, bairro, cidade)
- **Cônjuge**: nome, data de nascimento, filiação dos pais
- **Trabalho**: local de trabalho, cargo, endereço e telefone do trabalho
- **Outras informações** e **aceitação de termos**

Ao submeter o formulário, o Angular envia um **pedido HTTP POST** para o backend:

- **Endpoint**: `POST /api/membros`
- **Body**: JSON compatível com `MembroDTO`

### 2. Backend (Spring Boot) – `MembroController`

Controlador principal: `com.anam.controller.MembroController`

Responsabilidades do endpoint `POST /api/membros`:

1. **Receber** o JSON (`MembroDTO`) e validar com `@Valid`
2. **Verificar se o email já existe** na tabela `membros`
3. **Converter DTO → Entity**:
   - Método `convertToEntity(MembroDTO dto)` preenche uma instância de `Membro` com todos os campos do DTO
4. **Persistir na BD**:
   - Usa `MembroRepository` (Spring Data JPA) para fazer `save(membro)`
5. **Enviar SMS opcional**:
   - Usa `SmsService` para enviar notificação ao membro sobre o cadastro pendente
6. **Responder ao frontend** com:
   - `201 CREATED` + objeto `Membro` salvo em caso de sucesso
   - `409 CONFLICT` se o email já estiver em uso
   - `400 BAD REQUEST` em caso de erro de validação ou exceção

### 3. Persistência na Base de Dados (JPA → PostgreSQL)

- A entidade `Membro` está anotada com `@Entity` e mapeada para a tabela `membros`.
- O Hibernate converte o `Membro` em `INSERT` SQL na BD `anam`.
- A estrutura da tabela `membros` é criada/atualizada pelos scripts SQL e/ou pelo Hibernate (`ddl-auto=update`).

Resumo do fluxo:

- **Angular (formulário) → POST /api/membros → `MembroController` → `MembroRepository` → tabela `membros` (PostgreSQL)**.

---

## 📄 Problema dos Membros Antigos em PDF

### Situação Atual

- A ANAM possui **muitos membros antigos**, cujos dados existem apenas em:
  - **Processos físicos** escaneados em **PDF**
  - Cada PDF pode conter **2 ou 3 membros** (formulários preenchidos à mão)
- Esses formulários em papel têm os **mesmos campos** do formulário digital:
  - Nome, filiação (pai/mãe), data de nascimento, estado civil
  - Dados do cônjuge, dependentes
  - Morada completa, contactos
  - Local de trabalho e profissão

O portal atual (Angular + Spring Boot + PostgreSQL) **já** tem:

- Formulário de cadastro digital completo e funcional (frontend)
- API de cadastro (`POST /api/membros`) (backend)
- Tabela `membros` preparada para armazenar todos estes dados (BD)

### Problema

Para cadastrar estes **membros antigos**, hoje seria necessário:

- Abrir cada PDF manualmente
- Ler os dados manuscritos
- Digitar **campo a campo** no formulário Angular

Isto é:

- **Lento**
- **Repetitivo**
- **Sujeito a erros humanos**
- Impraticável com **grande volume** de processos em papel

### Objetivo Desejado

Ter um fluxo onde:

1. O operador faz **upload de um PDF escaneado** diretamente no portal
2. O sistema:
   - Analisa o PDF
   - **Detecta automaticamente cada membro** (2 ou 3 por página, se for o caso)
   - **Extrai os dados** de cada membro:
     - Nome, filiação, data de nascimento, estado civil
     - Cônjuge, dependentes
     - Morada, contactos
     - Local de trabalho, profissão, etc.
   - **Devolve para o frontend** uma lista de objetos pré-preenchidos (`MembroDTO`)
3. O frontend:
   - Mostra esses dados já preenchidos no formulário
   - O operador apenas **revê, corrige o que for necessário e confirma**
4. Ao confirmar, o sistema usa o **mesmo endpoint atual** `POST /api/membros` para gravar na BD.

---

## 💡 Este Projeto Consegue Resolver Este Problema?

**Resposta curta:**  
**Sim, este projeto é uma base muito boa para resolver o problema, mas precisa de uma nova funcionalidade de extração automática de dados de PDFs (OCR + IA) integrada ao fluxo de cadastro.**

### O Que Já Existe que Ajuda

- **Modelo de dados pronto** (`MembroDTO` / `Membro`)
- **API de cadastro pronta** (`POST /api/membros`)
- **Base de dados preparada** (tabela `membros` com todos os campos)
- **Frontend com formulários e UX prontos** para cadastro e revisão

Ou seja: **o problema não é de armazenamento nem de API, é de entrada automática de dados a partir de PDFs.**

### O Que Precisa Ser Adicionado (Visão de Arquitetura)

#### 1. Novo fluxo no Frontend (Angular)

- Nova página/flow, por exemplo: **"Cadastro por PDF"**:
  - Componente com:
    - Upload de ficheiro: `input[type="file"]` aceitando `application/pdf`
    - Botão **“Extrair dados”**
  - Lógica:
    - Enviar o PDF para o backend num endpoint dedicado
    - Receber de volta uma **lista de `MembroDTO` sugeridos**
    - Preencher o formulário de cadastro com os dados extraídos
    - Permitir revisão/correção
    - Ao confirmar, chamar o endpoint **existente** `POST /api/membros`

#### 2. Novo endpoint no Backend (Spring Boot)

Exemplo de endpoint:

```text
POST /api/membros/upload-pdf
Content-Type: multipart/form-data
Body: arquivo PDF (MultipartFile)
Retorno: List<MembroDTO> (JSON)
```

- Implementação:
  - Controlador recebe o PDF (`MultipartFile`)
  - Chama um serviço `PdfExtractionService`
  - `PdfExtractionService`:
    - Envia o PDF para um motor de **OCR + IA** (local ou serviço cloud)
    - Segmenta o PDF em blocos, 1 por membro
    - Extrai texto dos campos conforme o layout do formulário da ANAM
    - Mapeia o texto para `MembroDTO` (tratando datas, telefones, etc.)
    - Devolve a lista de `MembroDTO` para o controlador

#### 3. Integração com OCR / IA

Para leitura de **manuscrito** em formulários escaneados, seriam usadas tecnologias como:

- Serviços cloud com **OCR para handwriting** (Azure, Google, AWS, etc.)
- Ou modelos de visão + LLM (por exemplo, APIs que recebem a imagem/PDF e devolvem JSON estruturado)

O backend Spring Boot atuaria como:

- **Orquestrador**:
  - Recebe PDF
  - Chama o serviço de OCR/IA
  - Converte o resultado "solto" em `MembroDTO`
  - Devolve para o frontend

---

## ✅ Consegue Resolver? Como Pode Resolver na Prática

**Sim**, o projeto consegue resolver o problema de forma bastante elegante, com os seguintes passos práticos:

1. **Adicionar um endpoint de upload de PDF no backend**  
   - `POST /api/membros/upload-pdf`  
   - Entrada: PDF (MultipartFile)  
   - Saída: `List<MembroDTO>` com os dados extraídos

2. **Implementar um serviço de extração de dados (`PdfExtractionService`)**
   - Enviar o PDF para um motor de OCR/IA
   - Dividir o conteúdo em 2/3 blocos (cada membro)
   - Mapear texto → `MembroDTO`

3. **Criar no frontend uma tela de “Cadastro por PDF”**
   - Upload do PDF
   - Chamar o endpoint `/api/membros/upload-pdf`
   - Exibir cada membro sugerido em formulários já preenchidos
   - Operador revê e confirma

4. **Reutilizar o fluxo de cadastro já existente**
   - Ao confirmar, enviar os `MembroDTO` revistos para `POST /api/membros`
   - O backend grava na tabela `membros` como hoje

### Benefícios

- **Redução enorme de trabalho manual** (o operador não digita tudo do zero)
- **Menos erros humanos** (só revisão, não digitação)  
- **Aproveitamento máximo da infraestrutura atual**:
  - Não muda o modelo de dados
  - Não muda a BD
  - Não quebra o fluxo atual – apenas adiciona uma forma mais inteligente de preencher o formulário

Em resumo: **o projeto ANAM, como está desenhado (Angular + Spring Boot + PostgreSQL), é totalmente capaz de suportar esta funcionalidade de leitura automática de PDFs**, bastando adicionar uma camada de OCR/IA e o fluxo de upload + pré-preenchimento descrito acima.

