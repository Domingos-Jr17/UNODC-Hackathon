# WIRA Platform - UNODC Hackathon

## 🎯 Projeto

A **WIRA** (Women's Integrated Reintegration Academy) é uma plataforma digital abrangente para capacitação profissional e reintegração econômica de vítimas de tráfico de pessoas em Moçambique. Desenvolvido para o Hackathon da UNODC, esta solução oferece educação, certificação e oportunidades de emprego de forma segura e anônima.

## 🏗️ Arquitetura

A plataforma consiste em três componentes principais:

### 📱 Aplicativo Móvel (React Native/Expo)
- **Acesso Anônimo**: Códigos únicos por vítima (ex: V0042)
- **Cursos Profissionais**: Costura, Culinária, Agricultura
- **Progresso Individual**: Tracking detalhado por módulo
- **Certificados**: Reconhecimento Ministério do Trabalho
- **Modo Offline**: Funcionalidade completa sem internet

### 🖥️ Dashboard para ONGs (Next.js)
- **Gestão de Vítimas**: CRUD completo com anonimização
- **Sistema de Cursos**: Criação e gestão de módulos
- **Relatórios**: Exportação PDF e Excel
- **Monitoramento**: Estatísticas em tempo real
- **Certificados**: Geração automática de certificados

### 🔧 Backend API (Node.js/Express)
- **API RESTful**: Endpoints completos para todas as operações
- **Autenticação**: JWT com códigos de acesso
- **Banco de Dados**: PostgreSQL com relacionamentos
- **Cache**: Redis para performance
- **Segurança**: Rate limiting, PII masking, auditoria

## 🚀 Funcionalidades Principais

### 🔐 Segurança e Privacidade
- **Códigos Anônimos**: Cada vítima recebe um código único (V####)
- **PII Masking**: Dados sensíveis mascarados em logs
- **Rate Limiting**: 100 requisições por minuto
- **Criptografia**: AES-256 para dados sensíveis
- **Auditoria**: Complete activity tracking

### 📚 Sistema Educacional
- **Cursos Modularizados**: 6-8 módulos por curso
- **Progresso Detalhado**: Tracking por aula e quiz
- **Materiais Offline**: Download para estudo sem internet
- **Avaliações**: Quizzes com certificação automática
- **Instrutores Qualificados**: Professores certificados

### 🏆 Certificação Profissional
- **Reconhecimento Oficial**: Ministério do Trabalho de Moçambique
- **QR Code**: Verificação automática de autenticidade
- **Validade**: 2 anos com renovação online
- **Portfolio**: Trabalhos práticos avaliados

### 💼 Empregabilidade
- **Banco de Oportunidades**: Vagas exclusivas para formadas
- **Matching Inteligente**: Alinhamento com perfil profissional
- **Preparação**: Workshop de entrevista e currículo
- **Networking**: Comunidade de ex-alunas

## 🛠️ Tecnologias

### Frontend Mobile
- **React Native** com **Expo**
- **TypeScript** para type safety
- **React Navigation** para navegação
- **AsyncStorage** para dados offline
- **React Query** para gerenciamento de estado

### Frontend Web
- **Next.js 14** com App Router
- **TypeScript** strict mode
- **Tailwind CSS** para styling
- **Headless UI** para componentes
- **Recharts** para visualização de dados

### Backend
- **Node.js** com **Express**
- **PostgreSQL** banco de dados
- **Redis** para cache e sessões
- **JWT** para autenticação
- **Joi** para validação

### Infraestrutura
- **Docker** para containerização
- **PM2** para process management
- **Nginx** para reverse proxy
- **SSL/TLS** para segurança
- **Health Checks** para monitoramento

## 📱 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm 8+
- PostgreSQL 13+
- Redis 6+

### Aplicativo Móvel
```bash
cd mobile-app
npm install
npm start  # Expo development server
```

### Dashboard ONG
```bash
cd dashboard
npm install
npm run dev  # Next.js development server
```

### Backend API
```bash
cd backend
npm install
npm run dev  # Nodemon development server
```

## 🎮 Demo Hackathon

### Códigos de Acesso Demo
- **V0042**: Maria Silva (Costura - 37.5% completo)
- **V0038**: Ana Santos (Culinária - Novo aluno)
- **V0031**: João Machel (Agricultura - Em progresso)

### Acesso ONG Demo
- **Email**: demo@ong.org
- **Senha**: demo123

### Funcionalidades Demo
1. **Login Anônimo**: Usar códigos V0042, V0038, V0031
2. **Progresso Real**: Dados simulados realísticos
3. **Cursos Completos**: 3 cursos profissionais
4. **Certificados**: Geração automática
5. **Dashboard**: Estatísticas em tempo real

## 📊 Estrutura de Dados

### Usuários (Vítimas)
```sql
- id (UUID)
- accessCode (V####)
- enrolledAt (timestamp)
- lastLoginAt (timestamp)
- isActive (boolean)
- scopeId (FK para Organizations)
```

### Cursos
```sql
- id (UUID)
- title (string)
- description (text)
- duration (hours)
- modulesCount (integer)
- certificateTemplate (text)
```

### Progresso
```sql
- userId (FK)
- courseId (FK)
- moduleId (FK)
- completedAt (timestamp)
- score (decimal)
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/wira
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🧪 Testes

### Testes Unitários
```bash
npm test
npm run test:watch
```

### Testes de Integração
```bash
npm run test:integration
```

### Coverage
```bash
npm run test:coverage
```

## 📈 Monitoramento

### Health Checks
- **API**: `GET /health`
- **Database**: Verificação de conexão
- **Redis**: Ping e status
- **Memory**: Monitoramento de uso

### Métricas
- **Response Time**: Tempo médio de resposta
- **Error Rate**: Taxa de erros
- **Active Users**: Usuários ativos
- **Course Completion**: Taxa de conclusão

## 🔒 Segurança

### Implementado
- ✅ Rate limiting (100 req/min)
- ✅ Input validation (Joi)
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ PII masking
- ✅ Audit logging

### TODO
- 🔄 2FA para organizações
- 🔄 Encrypted storage
- 🔄 Biometric authentication
- 🔄 IP whitelisting

## 🚀 Deploy

### Produção
```bash
# Build
npm run build

# Start services
docker-compose up -d

# Health check
curl http://localhost:3000/health
```

### Ambientes
- **Development**: `http://localhost:3000`
- **Staging**: `https://staging.wira-platform.org`
- **Production**: `https://wira-platform.org`

## 📞 Suporte

### Contato
- **Email**: support@wira-platform.org
- **Phone**: +258 84 123 4567
- **WhatsApp**: +258 84 123 4567

### Documentação
- **API Docs**: `https://docs.wira-platform.org`
- **User Guide**: `https://guide.wira-platform.org`
- **Admin Manual**: `https://admin.wira-platform.org`

## 🏆 Reconhecimento

### Partners
- **UNODC**: United Nations Office on Drugs and Crime
- **Ministério do Trabalho**: República de Moçambique
- **ONGs Parceiras**: Rede de apoio às vítimas

### Certificações
- **ISO 27001**: Segurança da informação
- **GDPR Compliant**: Proteção de dados
- **WCAG 2.1**: Acessibilidade web

## 📈 Roadmap

### V1.0 (Hackathon)
- ✅ Login anônimo com códigos
- ✅ Sistema básico de cursos
- ✅ Dashboard para ONGs
- ✅ Certificados digitais

### V1.1 (3 meses)
- 🔄 Integração com pagamento M-Pesa
- 🔄 Sistema de mentorias
-  Comunidade online
- 🔄 App iOS nativo

### V2.0 (6 meses)
- 🔄 IA para recomendação de cursos
- 🔄 Marketplace de serviços
- 🔄 Integração com empregadores
- 🔄 Analytics avançado

---

## 👥 Team

- **Product Manager**: [Nome]
- **Backend Developer**: [Nome]
- **Frontend Developer**: [Nome]
- **Mobile Developer**: [Nome]
- **UI/UX Designer**: [Nome]

---

**WIRA Platform** - Transformando vidas através da educação profissional e empoderamento econômico.

*Developed with ❤️ for UNODC Hackathon Mozambique*
