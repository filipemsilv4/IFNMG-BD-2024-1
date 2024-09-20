# AvatarSucks

AvatarSucks é um projeto acadêmico desenvolvido para a disciplina de Banco de Dados do curso de Bacharelado em Ciência da Computação do Instituto Federal do Norte de Minas Gerais (IFNMG). O projeto implementa um sistema de gerenciamento de dados baseado no universo do filme Avatar, focando na exploração de recursos em Pandora.

## Contexto do Projeto

Este projeto é a terceira e última etapa de um trabalho que incluiu:

1. Modelagem Conceitual (MER)
2. Projeto Lógico Normalizado
3. Implementação do Projeto de BD e sistema de acesso (atual etapa)

O sistema AvatarSucks permite a manipulação de dados relacionados a colônias, containers, humanos, equipamentos de pesquisa, jazidas e maquinários em Pandora.

## Tecnologias Utilizadas

### Linguagens de Programação

- TypeScript ^5

### Frameworks e Bibliotecas

- Next.js 14.2.12
- React ^18
- React DOM ^18
- Zod ^3.23.8
- Shadcn/ui (via componentes do Radix UI)
- Tailwind CSS ^3.4.1
- React Hook Form ^7.53.0
- Cytoscape.js ^3.30.2
- Lucide React ^0.441.0

### Banco de Dados

- Oracle (via oracledb ^6.6.0)

### Ferramentas de Desenvolvimento

- Node.js v20.15.1
- npm (versão correspondente ao Node.js v20.15.1)
- VS Code 1.93.1 (Universal) para Darwin arm64
- Git 2.39.3 (Apple Git-146)

### Outras Dependências Relevantes

- @hookform/resolvers ^3.9.0
- @tanstack/react-table ^8.20.5
- class-variance-authority ^0.7.0
- clsx ^2.1.1
- next-connect ^1.0.0
- oci-common ^2.94.0
- oci-objectstorage ^2.94.0
- oci-secrets ^2.94.0

## Configuração do Ambiente

1. Certifique-se de ter o Node.js v20.15.1 ou superior instalado.
2. Clone o repositório:

   ```bash
   git clone https://github.com/filipemsilv4/IFNMG-BD-2024-1.git
   ```

3. Entre no diretório do projeto:

   ```bash
   cd IFNMG-BD-2024-1 && cd avatar-sucks
   ```

4. Instale as dependências:

   ```bash
   npm install
   ```

5. Configure as variáveis de ambiente:  
   Crie um arquivo `.env.local` com o seguinte conteúdo:

   ```txt
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_CONNECT_STRING=seu_connect_string
   ```

    Substitua `seu_usuario`, `sua_senha` e `seu_connect_string` com suas credenciais do Oracle DB. `seu_connect_string` segue o padrão `host:porta/serviço`.

## Como Executar o Projeto

1. Após configurar o ambiente e as variáveis de ambiente, execute o projeto em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

2. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Funcionalidades Implementadas

1. Gerenciamento (inserir, atualizar, listar e remover) de uma relação específica via interface gráfica intuitiva.
2. Manipulação de dados de uma Generalização/Especialização do modelo ER.
3. Relatório com dados sobre colônias, containers, humanos, equipamentos de pesquisa, jazidas e maquinários.

## Autores

- Paulo Filipe Moreira (@filipemsilv4 no GitHub)
- Bruno Vinícius (@vrunobinicius no Github)
