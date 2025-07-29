# Lei em Mãos - Sistema de Notícias Políticas

Sistema de notícias políticas do Brasil com funcionalidades para usuários, notícias, comentários e solicitações.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: MongoDB
- **Validação**: Zod

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd LeiEmMaosTeste
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
   
   O arquivo `.env` já está configurado para MongoDB local:
   ```
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=leiemmaos
   PORT=5000
   NODE_ENV=development
   ```

   Para usar MongoDB Atlas, altere a `MONGODB_URI` para sua string de conexão.

4. **Inicie o MongoDB**
   
   Se estiver usando MongoDB local:
   ```bash
   mongod
   ```

5. **Popule o banco de dados**
```bash
npm run seed
```

6. **Inicie a aplicação**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 📊 Dados de Teste

Após executar o seed, você terá:

### Usuários:
- **Admin**: admin@leiemmaos.com / admin123
- **Político**: politico@sp.gov.br / politico123

### Dados:
- Estados brasileiros
- Municípios de exemplo (SP)
- Notícias de exemplo
- Estrutura completa do banco

## 🗂️ Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   └── hooks/          # Hooks customizados
├── server/                 # Backend Express
│   ├── db.ts              # Configuração MongoDB
│   ├── storage.ts         # Operações de banco
│   ├── routes.ts          # Rotas da API
│   ├── seed.ts            # Dados iniciais
│   └── index.ts           # Servidor principal
├── shared/                 # Código compartilhado
│   └── schema.ts          # Schemas e tipos
└── package.json
```

## 🔌 API Endpoints

### Notícias
- `GET /api/news` - Listar notícias
- `GET /api/news/:id` - Obter notícia específica
- `POST /api/news` - Criar notícia
- `PUT /api/news/:id` - Atualizar notícia
- `DELETE /api/news/:id` - Deletar notícia

### Comentários
- `GET /api/news/:newsId/comments` - Comentários de uma notícia
- `POST /api/news/:newsId/comments` - Criar comentário
- `PUT /api/comments/:id/approve` - Aprovar comentário
- `DELETE /api/comments/:id` - Deletar comentário

### Solicitações
- `GET /api/requests` - Listar solicitações
- `POST /api/requests` - Criar solicitação
- `PUT /api/requests/:id/status` - Atualizar status

### Localização
- `GET /api/states` - Listar estados
- `GET /api/states/:id/municipalities` - Municípios por estado

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run seed` - Popula banco de dados
- `npm run check` - Verificação de tipos TypeScript

## 🔒 Segurança

⚠️ **Importante**: Em produção, certifique-se de:
- Usar senhas hash para usuários
- Configurar variáveis de ambiente seguras
- Implementar autenticação JWT
- Validar todas as entradas
- Usar HTTPS

## 📝 Funcionalidades

- ✅ Sistema de notícias com categorias
- ✅ Comentários com moderação
- ✅ Solicitações para políticos
- ✅ Filtros por localização
- ✅ Painel administrativo
- ✅ API RESTful completa
- ✅ Validação de dados
- ✅ Banco de dados MongoDB

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request