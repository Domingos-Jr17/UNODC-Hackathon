# Guia de Configuração da Plataforma WIRA

## Pré-requisitos

Antes de configurar a plataforma WIRA, você precisará ter instalado:

### Backend
- Node.js (versão 14 ou superior)
- npm (versão 8 ou superior)
- SQLite (ou PostgreSQL para produção)
- Git

### Frontend
- Node.js (versão 14 ou superior)
- npm (versão 8 ou superior)

### Mobile
- Node.js (versão 14 ou superior)
- npm (versão 8 ou superior)
- Expo CLI (opcional)
- Android Studio ou Xcode (para emuladores nativos)

## Configuração do Ambiente de Desenvolvimento

### 1. Clone o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd mvp/wira-platform
```

### 2. Configuração do Backend

Navegue até o diretório do backend:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./wira.db"  # Para SQLite local em desenvolvimento
JWT_SECRET=sua_chave_secreta_jwt_aqui
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Execute as migrações do banco de dados:
```bash
npm run migrate
```

Popule o banco com dados de exemplo:
```bash
npm run seed
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O servidor backend estará disponível em `http://localhost:3000`

### 3. Configuração do Frontend

Em um novo terminal, navegue até o diretório do frontend:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 4. Configuração do Mobile

Em um novo terminal, navegue até o diretório do mobile:
```bash
cd mobile-app
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor Expo:
```bash
npm start
```

Siga as instruções no terminal para acessar o aplicativo via:
- Expo Go app no seu dispositivo móvel (escaneando o QR code)
- Emulador Android ou iOS
- Web browser (limitado)

## Estrutura de Pastas

### Backend
```
backend/
├── src/
│   ├── controllers/     # Controladores de requisições
│   ├── models/          # Modelos de dados (Prisma)
│   ├── routes/          # Definições de rotas
│   ├── services/        # Lógica de negócios
│   ├── middleware/      # Middleware de segurança
│   ├── utils/           # Utilitários
│   ├── types/           # Definições de tipos TypeScript
│   └── database/        # Configuração de banco de dados
├── prisma/              # Esquema e migrações do banco de dados
├── tests/               # Testes automatizados
└── scripts/             # Scripts de build e deploy
```

### Frontend
```
frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── layouts/         # Layouts comuns
│   ├── hooks/           # Hooks personalizados
│   ├── contexts/        # Contextos React
│   └── utils/           # Utilitários
├── public/              # Arquivos públicos
└── tests/               # Testes do frontend
```

### Mobile
```
mobile-app/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── screens/         # Telas do aplicativo
│   ├── navigation/      # Navegação entre telas
│   ├── hooks/           # Hooks personalizados
│   └── utils/           # Utilitários
├── assets/              # Recursos visuais
└── tests/               # Testes do mobile
```

## Variáveis de Ambiente

### Backend (.env)
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development, production)
- `DATABASE_URL`: String de conexão com o banco de dados
- `JWT_SECRET`: Chave secreta para tokens JWT
- `CORS_ORIGIN`: Origens permitidas para CORS
- `RATE_LIMIT_WINDOW_MS`: Janela de tempo para limitação de requisições
- `RATE_LIMIT_MAX_REQUESTS`: Número máximo de requisições por janela
- `SMS_API_KEY`: Chave de API para serviço SMS (quando implementado)
- `SMS_USERNAME`: Nome de usuário para serviço SMS (quando implementado)
- `SMS_SENDER`: Nome do remetente SMS (quando implementado)

## Scripts Disponíveis

### Backend
- `npm run dev`: Inicia servidor de desenvolvimento com hot reload
- `npm run build`: Compila o código TypeScript para JavaScript
- `npm run start`: Inicia servidor em modo produção
- `npm run migrate`: Executa migrações do banco de dados
- `npm run seed`: Popula banco com dados de exemplo
- `npm run test`: Executa testes unitários
- `npm run test:watch`: Executa testes em modo watch

### Frontend
- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run lint`: Verifica código com ESLint
- `npm run preview`: Pré-visualiza build de produção localmente

### Mobile
- `npm start`: Inicia servidor Expo
- `npm run android`: Executa aplicativo no emulador Android
- `npm run ios`: Executa aplicativo no emulador iOS (Mac apenas)
- `npm run web`: Executa aplicativo no navegador

## Testando a Configuração

1. Com todos os servidores rodando, acesse o frontend em `http://localhost:5173`
2. Faça login com os códigos de demonstração: V0042, V0038, V0031
3. Teste as funcionalidades de acesso aos cursos
4. Verifique que o backend está respondendo em `http://localhost:3000/health`
5. No mobile, use o Expo Go para escanear o QR code e testar o aplicativo

## Solução de Problemas

### Porta Ocupada
Se a porta 3000 ou 5173 estiver ocupada, o sistema detectará automaticamente e usará outra porta disponível.

### Erros de Banco de Dados
Verifique se o arquivo `.env` está configurado corretamente e se o banco de dados está acessível.

### Problemas com Expo
Certifique-se de que o Expo CLI está instalado e que seu dispositivo está na mesma rede que o servidor de desenvolvimento.

## Configuração para Produção

Para ambiente de produção:

1. Configure variáveis de ambiente apropriadas
2. Use PostgreSQL em vez de SQLite
3. Configure Redis para sessões e cache
4. Implemente autenticação de 2 fatores
5. Configure HTTPS com certificados SSL válidos
6. Implemente monitoramento e logging adequados

## Segurança

- Mantenha a `JWT_SECRET` em segredo
- Nunca commite arquivos `.env` para o repositório
- Use chaves diferentes para ambientes de desenvolvimento e produção
- Implemente firewall para restringir acesso ao servidor
- Mantenha todas as dependências atualizadas

## Próximos Passos

Depois de configurar o ambiente:

1. Explore os diferentes componentes da aplicação
2. Teste os fluxos principais: login, acesso a cursos, acompanhamento de progresso
3. Familiarize-se com as APIs e sua documentação
4. Consulte os guias de usuário para entender melhor as funcionalidades
5. Implemente novas funcionalidades seguindo os padrões estabelecidos