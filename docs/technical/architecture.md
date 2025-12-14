# Arquitetura da Plataforma WIRA

## Visão Geral

A plataforma WIRA (Women's Integrated Reintegration Academy) é um sistema de código aberto desenvolvido para apoiar a capacitação profissional e reintegração econômica de vítimas de tráfico humano em Moçambique. A arquitetura foi projetada para priorizar a privacidade, segurança e acessibilidade das beneficiárias.

## Componentes do Sistema

### 1. Backend (API)
- **Tecnologia**: Node.js com TypeScript e Express
- **ORM**: Prisma com banco de dados SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: Tokens JWT com códigos anônimos (V####)
- **Segurança**: Helmet.js, express-rate-limit, CORS, sanitização de entrada
- **Funções**: Gerenciamento de usuários, cursos, progresso e certificados

### 2. Frontend Web (Dashboard ONG)
- **Tecnologia**: React com TypeScript e Vite
- **Estilo**: Tailwind CSS com componentes acessíveis
- **Navegação**: React Router
- **Funções**: Gestão de beneficiárias, monitoramento de progresso, relatórios

### 3. Aplicativo Móvel
- **Tecnologia**: React Native com Expo
- **Navegação**: React Navigation
- **Armazenamento Offline**: AsyncStorage
- **Funções**: Acesso a cursos, progresso individual, quizzes, certificados

### 4. Sistema USSD
- **Integração**: Simulação de requisições USSD via endpoint HTTP
- **Formato**: Menus textuais simples para celulares básicos
- **Código Acesso**: *123# como código padrão
- **Funções**: Acesso a cursos, progresso e informações básicas

## Camadas de Segurança

### 1. Anonimização
- Códigos de acesso no formato V#### (ex: V0042)
- Nenhuma informação pessoalmente identificável exigida para acesso aos cursos
- Separação de dados anônimos e identificáveis

### 2. Autenticação e Autorização
- Tokens JWT com expiração
- Limitação de taxa de requisições
- Validação rigorosa de entrada
- Autenticação baseada em papel para acesso de ONGs

### 3. Criptografia
- Dados em trânsito: TLS 1.3
- Dados em repouso: AES-256 (planejado para produção)
- Hashing de senhas: bcrypt

## Estrutura de Dados

### 1. Entidades Principais
- **Usuários**: Armazenam códigos de acesso anônimos; dados reais isolados
- **ONGs**: Organizações parceiras que ativam e acompanham beneficiárias
- **Cursos**: Programas de capacitação profissional (costura, culinária, agricultura)
- **Progresso**: Rastreamento individual por módulo e curso
- **Certificados**: Geração com códigos QR e verificação

### 2. Isolamento de Dados Sensíveis
- Informações de identificação real armazenadas separadamente
- Acesso restrito por autorização
- Auditoria de todas as operações de acesso

## Infraestrutura

### 1. Hospedagem
- Backend: Servidor Node.js com balanceamento de carga
- Frontend: Hospedagem estática
- Mobile: Distribuição via lojas de aplicativos
- Banco de dados: PostgreSQL gerenciado

### 2. Escalabilidade
- Arquitetura baseada em microsserviços (planejada)
- Cache com Redis
- Filas para processamento assíncrono
- CDNs para conteúdo estático

## Integrações Externas

### 1. Telecomunicações
- Integração com operadoras móveis para serviço USSD
- Gateway SMS para comunicações automatizadas

### 2. Terceiros
- Serviços de hospedagem
- Provedores de pagamento (planejado)
- Plataformas de emprego (planejado)

## Considerações Especiais para o Contexto de Moçambique

### 1. Acessibilidade
- Sistema USSD para celulares básicos
- Interface em português (língua oficial)
- Design responsivo para diferentes dispositivos

### 2. Conectividade
- Funcionalidade offline para aplicativo móvel
- Otimização para conexões de baixa velocidade
- Conteúdo compacto para redução de uso de dados

## Segurança e Conformidade

### 1. Normas e Padrões
- Conformidade com GDPR para proteção de dados
- Adesão às diretrizes da ONU sobre assistência a vítimas
- Práticas recomendadas de segurança OWASP

### 2. Monitoramento
- Logs detalhados de todas as operações
- Alertas para atividades suspeitas
- Relatórios de segurança regulares

## Evolução Futura

### 1. Próximas Implementações
- Integração com sistemas governamentais
- IA para recomendação de cursos
- Sistema de mentoria
- Marketplace de serviços

### 2. Melhorias Planejadas
- Autenticação biométrica
- Integração com blockchain para certificados
- Sistema de tradução automática para idiomas locais
- Funcionalidades off-grid

## Diagrama de Componentes

```
+-------------------+     +--------------------+     +------------------+
|   Aplicativo      | <-- |  API Backend       | --> | Banco de Dados   |
|   Móvel           |     |  (Node.js)         |     |  (PostgreSQL)    |
|   (React Native)  |     |                    |     |                  |
+-------------------+     +--------------------+     +------------------+
         |                          |                           |
         |                          |                           |
         v                          v                           v
+-------------------+     +--------------------+     +------------------+
|     Sistema       |     |    Dashboard       |     | Sistema de       |
|     USSD          |     |    Web ONG         |     |    Logs        |
|   (Integração)    |     |   (React)          |     |   (Segurança)    |
+-------------------+     +-------------------+     +------------------+
```

Esta arquitetura permite uma plataforma robusta, segura e acessível que atende às necessidades específicas de vítimas de tráfico humano em Moçambique, com foco especial em privacidade e inclusão digital.