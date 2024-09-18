# Aplicação Next.js com OracleDB e Shadcn/UI

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Banco de dados Oracle

## Configuração

1. Clone o repositório  

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_CONNECT_STRING=seu_connect_string
```

Substitua `seu_usuario`, `sua_senha` e `seu_connect_string` com suas credenciais do Oracle DB. `seu_connect_string` segue o padrão `host:porta/serviço`.

## Executando a aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```
