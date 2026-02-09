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

🧾 Painel Web

- Visualização em cards

- Filtro por cidade

Estados visuais por status:

- novo

- em_atendimento

- finalizado

- Contadores de atendimentos novos (badges)

- Atualização de status em tempo real

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
