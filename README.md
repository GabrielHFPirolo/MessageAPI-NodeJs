## MessageAtendimentoAPI

Protótipo de sistema para organização e acompanhamento de atendimentos recebidos via WhatsApp, com foco em automação, clareza e controle humano.

## Sobre o Projeto

O MessageAtendimentoAPI é um projeto experimental que explora como automações, APIs e interfaces simples podem melhorar o fluxo de atendimento em escritórios jurídicos e ambientes administrativos semelhantes.

O objetivo não é substituir pessoas por IA, mas reduzir tarefas repetitivas, padronizar informações e oferecer uma base sólida para futuras integrações inteligentes.

🚩 Motivação

Em muitos cenários de atendimento:

- informações chegam desorganizadas

- dados importantes se perdem

- a recepção faz triagem manual

- o histórico não fica centralizado

Este projeto nasce da tentativa de resolver esse problema com:

- automação

- estruturas claras

- decisões técnicas simples e sustentáveis

🧠 Ideia Central

Transformar mensagens recebidas via WhatsApp em registros estruturados, exibidos em um painel visual simples, permitindo que a recepção:

- veja rapidamente quem entrou em contato

- filtre atendimentos por cidade

- acompanhe o status do atendimento

- interaja diretamente com o cliente pelo WhatsApp

Tudo isso mantendo controle humano em cada etapa.

## 🧾 Painel Web

- Visualização em cards  
- Filtro por cidade  

Estados visuais por status:

- novo  
- em_atendimento  
- finalizado  

- Contadores de atendimentos novos (badges)  
- Atualização de status em tempo real  

---

### 🔎 Pesquisa Dinâmica de Atendimentos

O painel agora conta com um campo de pesquisa inteligente que permite localizar atendimentos em tempo real por:

- Nome  
- CPF  
- Telefone  

**Como funciona**

- O usuário digita no campo de busca.
- O frontend aplica um pequeno debounce para evitar requisições excessivas.
- A busca é enviada ao backend via query parameter `?search=`.
- O backend filtra os registros no banco (Supabase/PostgreSQL) utilizando critérios parciais (`ILIKE`), permitindo correspondências aproximadas.
- O resultado é retornado já filtrado e renderizado dinamicamente.

Essa funcionalidade melhora significativamente a velocidade da triagem e reduz o tempo de localização de registros antigos ou em andamento.

---

### 📝 Anotações Internas por Atendimento

Foi adicionada uma funcionalidade de **notas internas vinculadas individualmente a cada atendimento**, permitindo registrar observações internas que não ficam visíveis ao cliente.

Cada card possui agora um botão **"Notas"**, que abre um modal dedicado contendo:

- Lista de notas vinculadas ao atendimento  
- Data e horário de criação  
- Campo para criação de nova anotação  
- Persistência em banco  

**Estrutura Técnica**

- As notas são armazenadas na tabela `NotasInternas` no Supabase.
- Cada nota possui vínculo com o atendimento através do campo `atendimento_id`.
- A listagem é carregada via rota dedicada:

GET /atendimento/:id/notas


- A criação de notas é feita via:

POST /atendimento/:id/notas


- As notas são ordenadas por `created_at` (mais recentes primeiro).

---

### 📊 Painel Administrativo

O sistema conta agora com um Painel Administrativo acessível apenas para usuários com role: admin.
O acesso é realizado através do botão "Painel Admin" exibido no header da aplicação principal (visível somente para administradores).

**Funcionalidades**

O painel exibe métricas de produtividade baseadas nos atendimentos registrados:

- Quantidade de atendimentos iniciados por usuário
- Quantidade de atendimentos finalizados por usuário
- Atendimentos em andamento por usuário
- Tempo médio de conclusão dos atendimentos

**Como funciona**

Os dados são processados no backend através da rota protegida:

`GET /admin/atividade`

Essa rota realiza:

- Consulta à tabela Atendimentos
- Relacionamento (FK) com a tabela de Users
- Agregação de dados por username
- Cálculo de tempo médio entre iniciado_em e concluido_em

O acesso é protegido via JWT e middleware de verificação de perfil administrador.

Usuários não administradores não possuem acesso à rota nem ao botão de navegação.


## 🛠️ Stack Utilizada
**Backend**

- Node.js

- Express

- Supabase (PostgreSQL)

- Docker

**Frontend**

- HTML

- CSS

- JavaScript (Vanilla)

- Automação/n8n

- Integração com WhatsApp

## 🔐 Autenticação e Login (JWT + Supabase)

O sistema utiliza Supabase Auth em conjunto com JWT para garantir autenticação segura e controle de acesso às rotas da aplicação.

**Funcionamento geral**

1 - O usuário realiza login informando usuário e senha.

2 - O backend converte o usuário em um email interno (usuario@internal.local) e autentica via Supabase Auth.

3 - Após autenticação bem-sucedida:

- O sistema valida se o usuário existe na tabela interna users.

- É verificado o papel (role) do usuário para controle de permissões.

4 - Um JWT próprio é gerado pelo backend contendo:

- id

- username

- role

5 - O token é retornado ao frontend e armazenado no localStorage.

**Uso do token**

Todas as rotas protegidas exigem o envio do token via header:

- Authorization: Bearer <token>


O backend valida o token em um middleware antes de permitir o acesso.

Tokens inválidos ou expirados resultam em HTTP 401 (Unauthorized).

**Segurança**

- A chave Service Role do Supabase é utilizada apenas no backend.

- O frontend nunca possui acesso direto às credenciais do Supabase.

- A tabela interna de usuários utiliza RLS (Row Level Security) para reforçar a proteção dos dados.

Essa abordagem separa claramente autenticação (Supabase) de autorização (JWT + roles), garantindo flexibilidade, segurança e escalabilidade para o sistema.

## 📌 Criando um Atendimento via API (Postman)

Para cadastrar um novo atendimento manualmente via API, siga os passos abaixo utilizando o Postman ou ferramenta similar.

🔹 **Endpoint**

`POST /atendimento`

Exemplo:

https://seu-dominio/atendimento

🔹 **Autenticação**

A rota exige autenticação via Bearer Token.

**No Postman:**

- Vá em Authorization
- Selecione tipo: Bearer Token
- Insira o token JWT obtido no login ou manualmente no Header:

`Authorization: Bearer SEU_TOKEN_AQUI`

🔹 **Headers obrigatórios**

Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI

🔹 **Body (JSON)**

Selecione Body → raw → JSON e envie:

{
  "nome": "João da Silva",
  "cpf": "12345678901",
  "cidade": "Cidade",
  "desejo": "Desejo atendimento especializado",
  "telefone": "43999999999"
}

## 👤 Criando um Usuário para Acesso ao Sistema

O sistema utiliza autenticação do Supabase (auth.users), mas o login é realizado via username + senha.

Internamente, o sistema converte o username em um email no formato:

`username@internal.local`

🔹 **Passo 1** — Criar usuário no Supabase (auth.users)

- Acesse o painel do Supabase
- Vá em Authentication → Users
- Clique em Add User
Preencha:

`Email: username@internal.local
Password:	senha desejada`

🔹 **Passo 2** — Inserir na tabela pública users

Após criar no auth.users, copie o UUID gerado.

Execute:

`insert into public.users (id, username, role)
values (
  'UUID_GERADO_PELO_SUPABASE',
  'gabriel',
  'admin'
);`

*⚠️ O id deve ser exatamente o mesmo de auth.users.*

## 🗂 Estrutura do Banco de Dados

A modelagem completa das tabelas pode ser consultada em:

➡️ [`docs/schemas.md`](docs/schemas.md)
