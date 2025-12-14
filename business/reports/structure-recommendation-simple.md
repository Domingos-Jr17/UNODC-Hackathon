# Recomendação de Estrutura de Projeto WIRA - Versão Simplificada

## Estrutura Proposta (Sem Docker/Containers)

```
mvp/
├── wira-platform/                    # Diretório principal da aplicação
│   ├── backend/                      # Servidor backend
│   │   ├── src/                      # Código fonte
│   │   │   ├── controllers/          # Controladores de requisições
│   │   │   ├── models/              # Modelos de dados
│   │   │   ├── routes/              # Definições de rotas
│   │   │   ├── services/            # Lógica de negócios
│   │   │   ├── middleware/          # Middleware de segurança e autenticação
│   │   │   ├── utils/               # Utilitários
│   │   │   ├── types/               # Tipos TypeScript
│   │   │   ├── database/            # Configuração de banco de dados
│   │   │   └── index.ts             # Ponto de entrada
│   │   ├── tests/                    # Testes
│   │   │   ├── unit/                # Testes unitários
│   │   │   └── integration/         # Testes de integração
│   │   ├── prisma/                   # Esquema e migrações do banco de dados
│   │   ├── scripts/                  # Scripts de build e setup
│   │   ├── data/                     # Dados iniciais e seeds
│   │   ├── logs/                     # Arquivos de log
│   │   ├── .env.example             # Variáveis de ambiente de exemplo
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── frontend/                     # Frontend web (Next.js/Vite)
│   │   ├── src/                      # Código fonte
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── layouts/             # Layouts comuns
│   │   │   ├── hooks/               # Hooks personalizados
│   │   │   ├── contexts/            # Contextos React
│   │   │   ├── styles/              # Estilos e temas
│   │   │   └── utils/               # Utilitários
│   │   ├── public/                   # Arquivos públicos
│   │   ├── tests/                    # Testes do frontend
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── mobile-app/                   # Aplicativo móvel (React Native/Expo)
│   │   ├── src/                      # Código fonte
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── screens/             # Telas do aplicativo
│   │   │   ├── navigation/          # Navegação entre telas
│   │   │   ├── hooks/               # Hooks personalizados
│   │   │   ├── utils/               # Utilitários
│   │   │   └── types/               # Tipos TypeScript
│   │   ├── assets/                   # Recursos visuais
│   │   ├── tests/                    # Testes do mobile
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── app.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                       # Recursos compartilhados (opcional)
│   │   ├── types/                    # Tipos TypeScript compartilhados
│   │   └── utils/                    # Utilitários compartilhados
│   │
│   ├── docs/                         # Documentação
│   │   ├── technical/                # Documentação técnica
│   │   │   ├── architecture.md       # Arquitetura do sistema
│   │   │   ├── api.md                # Documentação da API
│   │   │   └── setup.md              # Guia de configuração
│   │   └── user-guides/              # Guias para usuários
│   │       ├── ngo-staff.md         # Guia para funcionários de ONGs
│   │       └── victims.md           # Guia para vítimas (simplificado)
│   │
│   ├── scripts/                      # Scripts de desenvolvimento
│   │   ├── setup-dev-env.sh         # Setup de ambiente de desenvolvimento
│   │   ├── run-tests.sh             # Executar testes
│   │   └── build-all.sh             # Build de todos os componentes
│   │
│   ├── README.md                    # Documentação principal
│   └── package.json                 # Scripts de nível superior (opcional)
│
├── business/                        # Documentos de negócio
│   ├── reports/                     # Relatórios
│   │   ├── executive.md             # Relatório executivo
│   │   ├── technical.md             # Relatório técnico detalhado
│   │   └── progress.md              # Relatórios de progresso
│   ├── roadmap.md                   # Planejamento estratégico
│   ├── proposals/                   # Propostas
│   │   └── hackathon.md            # Documentos do hackathon
│   └── backlog.md                   # Backlog do projeto
│
├── legal/                           # Documentos legais (opcional, mas importante)
│   └── privacy-policy.md            # Política de privacidade
│
├── .gitignore                      # Arquivos ignorados pelo Git
└── CHANGELOG.md                    # Histórico de
├── .gitignore                      # Arquivos ignorados pelo Git
├── LICENSE                         # Licença do projeto
├── CODE_OF_CONDUCT.md              # Código de conduta
└── CONTRIBUTING.md                 # Guia de contribuição
```

## Benefícios da Estrutura Simplificada

### 1. **Foco no Desenvolvimento Atual**

- Nenhuma dependência de Docker ou ferramentas avançadas
- Estrutura baseada em tecnologias que você já está usando
- Fácil de implementar imediatamente

### 2. **Organização Clara**

- Cada componente tem sua própria pasta bem definida
- Separação clara entre código, testes e documentação
- Facilita o desenvolvimento paralelo

### 3. **Escalabilidade Futura**

- Estrutura pronta para adicionar Docker quando necessário
- Preparada para CI/CD quando apropriado
- Fácil de converter para estrutura mais complexa posteriormente

## Migração Gradual Sugerida

### Passo 1: Organização Imediata

1. Mova os documentos de negócio para `/business/`
2. Crie `/docs/technical/` e mova documentação técnica
3. Reorganize `/wira-platform/` com as pastas de componentes

### Passo 2: Melhorias de Código

1. Organize o código fonte em subpastas dentro de `src/`
2. Crie pastas de testes para cada componente
3. Adicione scripts para facilitar o desenvolvimento

### Passo 3: Documentação

1. Atualize os READMEs de cada componente
2. Adicione guias de setup para novos desenvolvedores
3. Documente os endpoints e fluxos principais

## Considerações Especiais para o WIRA

### 1. **Segurança e Privacidade (Prioritário)**

- Documentação clara sobre como dados sensíveis são tratados
- Diretrizes de segurança para desenvolvedores
- Procedimentos para proteção de identidade das vítimas

### 2. **Acessibilidade**

- Documentação acessível e clara
- Códigos bem comentados
- Processos de desenvolvimento padronizados

### 3. **Manutenibilidade**

- Estrutura clara para que novos desenvolvedores possam contribuir facilmente
- Separação de responsabilidades bem definida
- Testes organizados por tipo e componente

Esta estrutura simplificada mantém todos os benefícios de uma organização profissional enquanto se mantém acessível e prática para o estágio atual do projeto. Ela pode crescer naturalmente para incluir Docker e outras ferramentas avançadas conforme o projeto evolui.
