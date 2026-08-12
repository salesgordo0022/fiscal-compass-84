# Remix of Remix of Contabil Hub (29)

Você é uma IA especialista em arquitetura de sistemas web, UX/UI e front-end.
Sua tarefa é PROJETAR E CONSTRUIR a estrutura completa de um SISTEMA DE CONTROLE CONTÁBIL,
seguindo rigorosamente as instruções abaixo, de forma CLARA, COERENTE e PASSO A PASSO.

==================================================
1. OBJETIVO DO SISTEMA
==================================================
Criar um sistema web de Controle Contábil com:
- Login e senha
- Controle total de usuários pelo ADMIN
- Sem cadastro público (somente login)
- Dados MOCKADOS (sem integração com banco de dados)
- Interface inspirada nas imagens fornecidas
- Layout organizado, profissional e contábil
- Sistema de cores: PRETO, BRANCO e CINZA

==================================================
2. REGRAS DE AUTENTICAÇÃO
==================================================
- NÃO EXISTE TELA DE CADASTRO
- Apenas LOGIN com e-mail e senha
- Usuários são criados SOMENTE pelo ADMIN
- Fluxo:
  1. Usuário acessa /login
  2. Informa e-mail e senha
  3. Sistema valida com dados mockados
  4. Se válido, redireciona para o DASHBOARD
  5. Se inválido, exibe mensagem de erro

- Perfis:
  - ADMIN
  - USUÁRIO

- O ADMIN pode:
  - Criar usuários (mockado)
  - Definir e-mail, senha e perfil
  - Visualizar todos os dados

==================================================
3. ESTRUTURA DE MENUS (CONFORME PRIMEIRA IMAGEM)
==================================================
Menu lateral fixo com as opções:

1. Dashboard (Página Inicial)
2. Planilha Geral
3. Carnê Leão
4. Controle de Holding
5. ECD e ECF 2025
6. Lucro Real
7. Lucro Presumido
8. Terceiro Setor

- Menu em tons de cinza
- Ícones simples
- Destaque visual no menu ativo

==================================================
4. PADRÃO VISUAL DAS PÁGINAS (TOPO)
==================================================
TODAS as páginas devem seguir este padrão:

- Uma BARRA PRETA NO TOPO
- Texto em branco
- Nome do menu atual em destaque
  Exemplo:
  "CONTÁBIL"
  "CONTROLE DE HOLDING"
  "LUCRO REAL"

- Essa barra deve ser reutilizável como componente

==================================================
5. DESCRIÇÃO DO MENU (ABAIXO DO TOPO)
==================================================
Logo abaixo da barra preta:

- Uma LINHA VERTICAL à esquerda (estilo destaque visual)
- Ao lado da linha, um BLOCO DE TEXTO explicando:
  - Para que serve aquela área
  - O que o usuário controla ali

Exemplo (Controle de Holding):
"Página dedicada ao controle de Holding: estrutura societária,
participações, gestão patrimonial e governança corporativa."

Esse padrão deve ser aplicado em TODOS os menus.

==================================================
6. DASHBOARD (PÁGINA INICIAL)
==================================================
O Dashboard deve conter:

6.1 GRÁFICOS (CONFORME IMAGENS)
--------------------------------
- Gráfico circular (donut):
  - Total de atividades
  - Status:
    - Finalizado
    - Em andamento
    - Não começou

- Gráfico de barras:
  - Comparação por área
  - Exemplo:
    - Contábil
    - Empresas cadastradas no domínio honorário
  - Status:
    - Finalizado
    - Em andamento
    - Em espera
    - Não começou
    - Cancelados

- Dados mockados fixos

6.2 TABELA DE ATIVIDADES (IMAGENS 4 E 5)
--------------------------------
Criar uma tabela com colunas:

- Atividade
- Responsável
- Progresso
- Status
- Departamento
- Data inicial
- Data final
- Prazo
- Prioridade
- Cliente
- Criado em
- Criado por
- Quantidade
- Última edição por

- Status com badges (cores neutras)
- Dados mockados
- Filtro visual (sem lógica complexa)

==================================================
7. PÁGINA DE LISTAS / ORGANIZAÇÃO (IMAGEM 6)
==================================================
Criar páginas com listas organizadas por categorias, como:

- Empresas que não enviaram despesas
- Empresas com pendências
- Empresas do simples
- Verificações específicas

- Visual simples
- Estrutura em lista
- Sem banco de dados

==================================================
8. DADOS MOCKADOS (OBRIGATÓRIO)
==================================================
- Criar arquivos ou objetos mockados para:
  - Usuários
  - Atividades
  - Status
  - Gráficos
  - Listas

- Estrutura clara para futura integração com backend
- Separar mock por responsabilidade (auth, dashboard, tabelas)

==================================================
9. TECNOLOGIA (SUGESTÃO)
==================================================
Sugestão (não obrigatória):
- React + Vite
- Componentização clara
- Sem backend
- Autenticação simulada via estado/localStorage

==================================================
10. ORGANIZAÇÃO DO PROJETO
==================================================
Organizar o projeto com:
- components/
- pages/
- layouts/
- mocks/
- styles/

Criar componentes reutilizáveis para:
- Barra de topo
- Menu lateral
- Cards
- Gráficos
- Tabelas

==================================================
11. FOCO FINAL
==================================================
- Código limpo
- Layout profissional
- Visual contábil
- Fácil evolução futura
- Clareza na construção
- Sem excesso de cores
- Preto, branco e cinza como padrão

Construa tudo passo a passo, explicando cada parte da estrutura,
pensando como um sistema real que futuramente será integrado
a um banco de dados e backend.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fiscal-compass-84.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1c8c9fb9-75e7-46bd-b260-a070f6697997).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
