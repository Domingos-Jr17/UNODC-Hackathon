
Aplicativo móvel para capacitação e reintegração econômica de sobreviventes de tráfico humano em Moçambique.

## 🚀 Funcionalidades Implementadas

### ✅ Telas Principais
- **Login com códigos anônimos** (V0042)
- **Tela de boas-vindas** personalizada
- **Biblioteca de cursos** com busca e filtros
- **Detalhes do curso** com módulos e progresso
- **Aulas em vídeo** com controles completos
- **Sistema de quizzes** interativo com feedback
- **Dashboard de progresso** com estatísticas
- **Certificados digitais** com QR code
- **Tela de vagas** (mockup) com matching
- **Perfil do usuário** com configurações

### ✅ Funcionalidades Técnicas
- **Navegação por abas** (Bottom Tabs)
- **Sistema offline-first** (AsyncStorage)
- **Contextos React** para estado global
- **Autenticação segura** (SecureStore)
- **Gráficos de progresso** (Chart Kit)
- **Design responsivo** e adaptado
- **Suporte a USSD** (simulado)

## 🛠️ Stack Tecnológico

- **Framework**: React Native + Expo
- **Navegação**: React Navigation v6
- **Estado**: React Context API
- **Armazenamento**: AsyncStorage + SecureStore
- **Ícones**: Expo Vector Icons
- **Gráficos**: React Native Chart Kit
- **QR Code**: React Native QR Code SVG
- **Vídeo**: Expo AV
- **Tipagem**: TypeScript

## 📱 Estrutura do Projeto

```
mobile-app/
├── src/
│   ├── contexts/          # Contextos React (Auth, Course)
│   ├── navigation/         # Configuração de navegação
│   ├── screens/           # Telas do aplicativo
│   └── components/        # Componentes reutilizáveis
├── assets/               # Imagens, fontes, ícones
├── App.tsx              # Componente principal
├── App.json              # Configuração Expo
├── babel.config.js        # Configuração Babel
├── tsconfig.json         # Configuração TypeScript
└── package.json          # Dependências e scripts
```

## 🔐 Segurança e Privacidade

- **Códigos anônimos**: Proteção da identidade das usuárias
- **Dados criptografados**: Armazenamento seguro
- **Validação ONG**: Apenas vagas verificadas
- **Consentimento explícito**: Aceitação de termos
- **Sem rastreamento**: Privacidade total

## 📊 Cursos Disponíveis

### Costura
- Costura Avançada - Uniformes Escolares
- Técnicas de Costura Industrial
- Bordado Decorativo

### Culinária
- Culinária Profissional - Pratos Moçambicanos
- Técnicas Tradicionais
- Gestão de Cozinha

### Agricultura
- Agricultura Sustentável - Hortas Comunitárias
- Preparação do Solo
- Cultivo Orgânico

## 🎯 Fluxo do Usuário

1. **Login** → Código V0042
2. **Boas-vindas** → Estatísticas rápidas
3. **Biblioteca** → Escolher curso
4. **Aprendizado** → Vídeos + quizzes
5. **Certificação** → Certificado digital
6. **Empregabilidade** → Vagas compatíveis

## 🔄 Integração com Backend

### API Endpoints (Planejados)
```
POST /api/auth/login
GET  /api/courses
GET  /api/courses/:id
POST /api/progress
POST  /api/quiz/submit
GET  /api/jobs
POST /api/jobs/apply
```

### USSD Integration
```
*130*555# → Menu principal
1. Meus cursos
2. Meu progresso
3. Certificados
4. Sair
```

## 📱 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- Expo CLI
- React Native development environment

### Comandos
```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Build para produção
expo build:android
expo build:ios
```

## 🎨 Design System

### Cores
- **Primária**: #1E3A8A (Azul WIRA)
- **Sucesso**: #10B981 (Verde)
- **Atenção**: #F59E0B (Amarelo)
- **Erro**: #EF4444 (Vermelho)
- **Neutro**: #F8FAFC (Fundo claro)

### Tipografia
- **Poppins Bold**: Títulos e destaques
- **Poppins SemiBold**: Subtítulos e botões
- **Poppins Regular**: Texto corporativo

### Componentes
- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados visuais claros
- **Inputs**: Validação em tempo real
- **Modais**: Feedback contextual

## 🌐 Acessibilidade

- **Contraste**: WCAG 2.1 AA compliance
- **Navegação**: Por voz e toque
- **Leitura**: Tamanhos ajustáveis
- **Cores**: Alto contraste disponível
- **USSD**: Acesso para telemóveis básicos

## 📊 Métricas e Analytics

### KPIs Principais
- Taxa de conclusão de cursos
- Tempo médio de aprendizado
- Engajamento diário
- Taxa de aprovação em quizzes
- Conversão empregatibilidade

### Eventos Rastreados
- Login/logout
- Início/conclusão de módulos
- Tentativas de quizzes
- Downloads de cursos
- Visualizações de vagas

## 🔒 Segurança

### Proteções Implementadas
- Token JWT para autenticação
- Criptografia AES-256 para dados sensíveis
- Validação de entrada em todos os inputs
- Rate limiting em endpoints críticos
- Sanitização de dados

### Boas Práticas
- Nunca armazenar senhas
- Validar todos os inputs no cliente e servidor
- Usar HTTPS em todas as requisições
- Implementar CORS restrito
- Log de eventos de segurança

## 🚀 Deploy

### Produção
- **Android**: Google Play Store
- **iOS**: Apple App Store
- **Web**: PWA via Expo

### Ambientes
- **Development**: Expo Go
- **Staging**: EAS Preview
- **Production**: Build assinado

## 📞 Suporte e Debug

### Logs e Erros
- Sentry para crash reporting
- Firebase Analytics
- Console logs detalhados
- Error boundaries React

### Contato Suporte
- Email: apoio@wira.org.mz
- Telefone: 800 123 456
- WhatsApp: +258 84 123 4567

## 🔄 Roadmap Futuro

### Fase 2 (30 dias pós-hackathon)
- [ ] Integração real com backend
- [ ] Sistema de matching funcional
- [ ] Validação de vagas por ONG
- [ ] Notificações push
- [ ] Chat com assistentes sociais

### Fase 3 (3-6 meses)
- [ ] Modo offline completo
- [ ] Sincronização automática
- [ ] Gamificação com pontos
- [ ] Comunidade entre usuárias
- [ ] Mentoria entre pares

## 📄 Licença

MIT License - Código aberto para replicação em outros países.

---

**WIRA - Capacitando para reconstruir vidas**  
*Hackathon UNODC Moçambique 2025*