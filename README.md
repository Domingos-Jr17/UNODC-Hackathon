# Plataforma WIRA

**WIRA (Women's Integrated Reintegration Academy)** é uma plataforma digital abrangente para capacitação profissional e reintegração econômica de vítimas de tráfico de pessoas em Moçambique.

## 📁 Estrutura do Projeto

```
mvp/
├── wira-platform/                    # Aplicação principal
│   ├── backend/                      # API backend (Node.js/TypeScript)
│   │   ├── src/                      # Código fonte
│   │   │   ├── controllers/          # Controladores de requisições
│   │   │   ├── models/              # Modelos de dados
│   │   │   ├── routes/              # Definições de rotas
│   │   │   ├── services/            # Lógica de negócios
│   │   │   ├── middleware/          # Middleware de segurança
│   │   │   ├── utils/               # Utilitários
│   │   │   ├── types/               # Tipos TypeScript
│   │   │   └── database/            # Configuração de banco de dados
│   │   ├── prisma/                   # Esquema e migrações do banco
│   │   ├── tests/                    # Testes automatizados
│   │   └── scripts/                  # Scripts de build e deploy
│   │
│   ├── frontend/                     # Dashboard web (React/Vite)
│   │   ├── src/                      # Código fonte
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── layouts/             # Layouts comuns
│   │   │   ├── hooks/               # Hooks personalizados
│   │   │   ├── contexts/            # Contextos React
│   │   │   ├── styles/              # Estilos e temas
│   │   │   └── utils/               # Utilitários
│   │   └── public/                   # Arquivos públicos
│   │
│   ├── mobile-app/                   # Aplicativo móvel (React Native)
│   │   ├── src/                      # Código fonte
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── screens/             # Telas do aplicativo
│   │   │   ├── navigation/          # Navegação entre telas
│   │   │   ├── hooks/               # Hooks personalizados
│   │   │   ├── utils/               # Utilitários
│   │   │   └── types/               # Tipos TypeScript
│   │   ├── assets/                   # Recursos visuais
│   │   └── tests/                    # Testes do mobile
│   │
│   ├── shared/                       # Recursos compartilhados
│   │   ├── types/                    # Tipos TypeScript compartilhados
│   │   └── utils/                    # Utilitários compartilhados
│   │
│   ├── docs/                         # Documentação do sistema
│   ├── tests/                        # Testes de integração e e2e
│   └── scripts/                      # Scripts de desenvolvimento
│
├── business/                         # Documentos de negócio
│   ├── reports/                      # Relatórios (executivo, técnico, etc.)
│   ├── proposals/                    # Propostas e apresentações
│   └── roadmap.md                    # Planejamento estratégico
│
├── docs/                             # Documentação geral
│   ├── technical/                    # Documentação técnica
│   │   ├── architecture.md           # Arquitetura do sistema
│   │   ├── api.md                    # Documentação da API
│   │   └── setup.md                  # Guia de configuração
│   └── user-guides/                  # Guias para usuários
│       ├── ngo-staff.md              # Guia para funcionários de ONGs
│       └── victims.md                # Guia para vítimas/beneficiárias
│
├── legal/                            # Documentos legais
│   └── privacy-policy.md             # Política de privacidade
│
├── .gitignore                        # Arquivos ignorados pelo Git
└── README.md                         # Este arquivo
```

## 🎯 Propósito da Plataforma

A WIRA oferece:

- **Cursos profissionalizantes** em costura, culinária e agricultura
- **Sistema anônimo** com códigos V#### para proteger a identidade das beneficiárias
- **Acesso via USSD** para celulares básicos
- **Dashboard para ONGs** para acompanhar o progresso das beneficiárias
- **Certificados digitais** com código QR para verificação
- **Sistema offline** para áreas com pouca conectividade

## 🛡️ Segurança e Privacidade

- **Anonimização por design**: Apenas códigos V#### são usados na interface
- **Dados sensíveis isolados**: Informações pessoais reais mantidas separadamente
- **Criptografia**: Dados protegidos em trânsito e em repouso
- **Conformidade**: Adesão às leis de proteção de dados (GDPR, LGPD)

## 🚀 Começando

### Pré-requisitos

- Node.js (v14 ou superior)
- npm (v8 ou superior)
- Git

### Configuração

1. Clone o repositório
2. Navegue até o diretório `wira-platform`
3. Execute os scripts de setup:
   ```bash
   cd wira-platform\scripts
   setup-dev-env.bat
   ```

### Executando os Serviços

Execute cada componente em terminais separados:

**Backend:**
```bash
cd wira-platform\backend
npm run dev
```

**Frontend:**
```bash
cd wira-platform\frontend
npm run dev
```

**Mobile:**
```bash
cd wira-platform\mobile-app
npm start
```

## 📚 Documentação

- **[Arquitetura do Sistema](docs/technical/architecture.md)** - Visão técnica detalhada
- **[Documentação da API](docs/technical/api.md)** - Endpoints e uso da API
- **[Guia de Setup](docs/technical/setup.md)** - Instruções detalhadas de configuração
- **[Guia para ONGs](docs/user-guides/ngo-staff.md)** - Instruções para funcionários de ONGs
- **[Guia para Beneficiárias](docs/user-guides/victims.md)** - Instruções para vítimas

## 🤝 Contribuindo

Este é um projeto de código aberto destinado a combater o tráfico humano e apoiar a reintegração econômica de vítimas. Contribuições são bem-vindas.

## 📄 Licença

Este projeto está licenciado conforme definido em [LICENSE](LICENSE).

---

**WIRA Platform** - Transformando vidas através da educação profissional e empoderamento econômico.
*Desenvolvido com ❤️ para vítimas de tráfico de pessoas em Moçambique*