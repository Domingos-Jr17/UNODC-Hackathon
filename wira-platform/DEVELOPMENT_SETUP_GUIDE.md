# 🚀 Guia de Configuração do Ambiente de Desenvolvimento WIRA

## 📋 Visão Geral

Este guia irá ajudá-lo a configurar e iniciar todos os componentes da plataforma WIRA em modo de desenvolvimento:
- **Backend API** (Node.js + TypeScript + Prisma + SQLite)
- **Frontend Web** (React + Vite + Material-UI)
- **Aplicativo Móvel** (React Native + Expo)

---

## 🔧 Passo 1: Verificar Pré-requisitos

### Node.js e npm
```bash
# Verificar versões instaladas
node --version  # Deve ser >= 14.0.0
npm --version   # Deve ser >= 8.0.0
```

### Git (opcional, para controle de versão)
```bash
git --version
```

---

## 🗄️ Passo 2: Configurar Backend

### 2.1 Instalar Dependências
```bash
cd wira-platform/backend
npm install
```

### 2.2 Inicializar Banco de Dados
```bash
# Executar migrações e criar dados iniciais
npm run migrate

# Popular banco com dados de demonstração
npm run seed
```

### 2.3 Iniciar Servidor Backend
```bash
# Modo desenvolvimento com hot reload
npm run dev

# Alternativamente:
npm run dev:watch
```

O servidor backend irá iniciar em: **http://localhost:3000**

### 2.4 Verificar Backend
```bash
# Health check
curl http://localhost:3000/health

# Documentação da API
curl http://localhost:3000/api
```

---

## 🖥️ Passo 3: Configurar Frontend Web

### 3.1 Instalar Dependências
```bash
cd wira-platform/frontend
npm install
```

### 3.2 Iniciar Servidor Frontend
```bash
npm run dev
```

O frontend web irá iniciar em: **http://localhost:5173**

### 3.3 Acesso ao Dashboard ONG
- URL: http://localhost:5173
- Login Demo:
  - Email: `demo@ong.org`
  - Senha: `demo123`

---

## 📱 Passo 4: Configurar Aplicativo Móvel

### 4.1 Instalar Dependências
```bash
cd wira-platform/mobile-app
npm install
```

### 4.2 Iniciar Expo Development Server
```bash
npm start
```

### 4.3 Acessar Aplicativo
- **Web**: Abra o navegador no endereço fornecido pelo Expo
- **Android**: Use o app Expo Go e escaneie o QR code
- **iOS**: Use o app Expo Go e escaneie o QR code

### 4.4 Códigos de Acesso Demo
- **V0042**: Maria Silva (Costura - 37% completo)
- **V0038**: Ana Joaquim (Culinária - Novo)
- **V0031**: João Mandlate (Agricultura - 15% completo)

---

## 🧪 Passo 5: Verificar Conectividade

### 5.1 Testar API Endpoints
```bash
# Verificar status da API
curl http://localhost:3000/health

# Testar autenticação
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"anonymousCode": "V0042"}'

# Listar cursos
curl http://localhost:3000/api/courses

# Verificar progresso
curl http://localhost:3000/api/progress/user/V0042/course/costura-001
```

### 5.2 Testar USSD
```bash
# Testar endpoint USSD
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042"}'
```

---

## 🛠️ Estrutura dos Serviços

### Backend (Porta 3000)
- **API RESTful**: Endpoints para todas as operações
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: JWT com códigos anônimos
- **Segurança**: Rate limiting, criptografia, auditoria

### Frontend Web (Porta 5173)
- **Dashboard para ONGs**: Gestão de usuários e progresso
- **Relatórios**: Estatísticas e exportação
- **Ativação**: Cadastro de novos usuários

### Aplicativo Móvel (Porta Expo)
- **Acesso Anônimo**: Login com códigos V####
- **Cursos**: Acesso a materiais e progresso
- **Quiz**: Avaliações com feedback imediato
- **Certificados**: Geração e compartilhamento

---

## 🔍 Verificação Final

### Checklist de Funcionalidades
- [ ] Backend API respondendo em localhost:3000
- [ ] Frontend web carregando em localhost:5173
- [ ] App Expo rodando e acessível
- [ ] Banco de dados inicializado com dados demo
- [ ] Login anônimo funcionando (códigos V0042, V0038, V0031)
- [ ] USSD respondendo ao endpoint de teste
- [ ] Logs sem erros críticos

### URLs Importantes
- **API Health**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api
- **Frontend Web**: http://localhost:5173
- **Expo Dev Tools**: http://localhost:19002 (geralmente)

---

## 🚨 Solução de Problemas

### Portas Ocupadas
```bash
# Verificar portas em uso
netstat -tlnp | grep :3000
netstat -tlnp | grep :5173

# Matar processos
sudo kill -9 <PID>
```

### Problemas com Banco de Dados
```bash
# Recriar banco de dados
cd wira-platform/backend
rm -f data/wira.db
npm run migrate
npm run seed
```

### Dependências com Problemas
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Próximos Passos

1. **Executar testes automatizados**: `npm test` (em cada diretório)
2. **Validar fluxos críticos**: Login, cursos, certificados
3. **Testar funcionalidade USSD**: Simulação completa
4. **Verificar segurança**: Rate limiting, criptografia
5. **Testar performance**: Tempo de resposta, carga

---

## 🎯 Cenários de Teste Prioritários

### 1. Autenticação e Acesso
- Login com códigos anônimos
- Validação de tokens JWT
- Rate limiting em tentativas de login

### 2. Sistema de Cursos
- Listagem de cursos disponíveis
- Progresso individual por módulo
- Quiz com feedback imediato

### 3. Certificados
- Geração automática
- Verificação via QR code
- Compartilhamento digital

### 4. USSD
- Navegação completa dos menus
- Acesso via telefones básicos
- Timeout de sessões

### 5. Dashboard ONG
- Ativação de novos usuários
- Monitoramento de progresso
- Relatórios e estatísticas

---

**Ambiente configurado com sucesso!** 🎉

Agora você está pronto para começar os testes da plataforma WIRA em modo de desenvolvimento.