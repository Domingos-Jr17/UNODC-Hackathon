# 📋 PROMPT DE ANÁLISE CRÍTICA MESTRE - WIRA PLATFORM

## 🎯 CONTEXTO E OBJETIVO

[cite_start]Você é um especialista independente em segurança de sistemas, desenvolvimento de software, impacto social e sustentabilidade de negócios, contratado para realizar uma análise crítica e completa da plataforma WIRA (Women's Integrated Reintegration Academy)[cite: 3].

[cite_start]Esta plataforma foi desenvolvida para o Hackathon UNODC Moçambique 2025, abordando o Desafio 2: "Reintegração das vítimas de tráfico de pessoas"[cite: 4, 251, 252]. [cite_start]O sistema visa apoiar a reintegração econômica de sobreviventes através de capacitação profissional e conexão com oportunidades de emprego [cite: 252][cite_start], consistindo em um aplicativo móvel (React Native), um dashboard web para ONGs (Next.js/React) e uma API de backend (Node.js) [cite: 20, 27, 253-256].

[cite_start]**Sua missão**: Avaliar exaustivamente todos os aspectos do sistema, identificando forças, fraquezas, oportunidades de melhoria e riscos críticos[cite: 5]. [cite_start]Forneça recomendações acionáveis e priorizadas para cada área analisada[cite: 6].

---

## 🏗️ 1. ARQUITETURA, INFRAESTRUTURA E DADOS

### Backend API (Node.js/Express)

**Analisar criticamente:**

- [cite_start]**Escalabilidade**: Como o sistema comporta 10.000+ usuários simultâneos? [cite: 11] [cite_start](vs. a meta inicial de 500+ [cite: 268]).
- [cite_start]**Performance**: Tempos de resposta atuais vs. necessários (< 200ms)[cite: 12].
- [cite_start]**Banco de Dados (Crítico)**: SQLite é comprovadamente inadequado para produção[cite: 13]. [cite_start]Analise o risco e o plano de migração para PostgreSQL[cite: 13, 179].
- [cite_start]**Modelo de Dados**: O schema suporta todos os casos de uso?[cite: 293]. [cite_start]Existem anomalias ou redundâncias?[cite: 294]. [cite_start]A estrutura facilita análises futuras?[cite: 296].
- [cite_start]**Cache**: Redis está sendo utilizado eficientemente para otimizar consultas?[cite: 14, 325].
- [cite_start]**API Design**: RESTful está bem estruturado?[cite: 15, 266]. [cite_start]Versionamento adequado?[cite: 15].
- [cite_start]**Multi-tenancy**: A arquitetura atual suporta múltiplas ONGs de forma segura e isolada?[cite: 19, 327].

### Frontend Web (React/Vite/TypeScript)

**Analisar criticamente:**

- [cite_start]**Performance**: Lazy loading, code splitting, bundle size otimizado?[cite: 22].
- [cite_start]**Acessibilidade**: WCAG 2.1 AA compliance?[cite: 23]. [cite_start]Navegação por teclado?[cite: 23].
- [cite_start]**UX/UI (ONGs)**: O design do dashboard é intuitivo para a gestão de vítimas e monitoramento?[cite: 24, 301].
- [cite_start]**Estado Global**: Redux/Zustand está bem implementado?[cite: 26].

### Mobile App (React Native)

**Analisar criticamente:**

- [cite_start]**Funcionalidade Offline**: O design _offline-first_ está efetivo?[cite: 269]. [cite_start]A sincronização de dados é robusta quando a conexão retorna?[cite: 29].
- [cite_start]**Otimização de Recursos**: Consumo de bateria e dados otimizado para dispositivos de baixo custo em Moçambique?[cite: 25, 30].
- [cite_start]**Armazenamento Local**: Há criptografia (ex: AES-256) de dados sensíveis no dispositivo?[cite: 31, 275].
- [cite_start]**Compatibilidade**: Android 8+? iOS 12+?[cite: 33].

---

## 🔐 2. SEGURANÇA E PRIVACIDADE (CRÍTICO)

### Autenticação e Autorização

**Analisar criticamente:**

- [cite_start]**Códigos Anônimos (V####)**: É suficientemente seguro para proteger a identidade?[cite: 38, 274]. [cite_start]Qual a prevenção contra força bruta e _Identity Theft_?[cite: 38, 157].
- **JWT**: Configuração segura? [cite_start]Refresh token implementado?[cite: 39].
- [cite_start]**Controles de Acesso**: Rate limiting (100 req/min é adequado?)[cite: 40, 277]. [cite_start]Account lockout?[cite: 41].
- [cite_start]**PII Masking**: Dados sensíveis (PII) estão mascarados em logs e respostas de API?[cite: 42].

### Vulnerabilidades e Privacidade

**Verificar existência e mitigação:**

- [cite_start]SQL Injection [cite: 44, 276][cite_start], XSS [cite: 45, 276][cite_start], CSRF [cite: 46][cite_start], Session Hijacking (HttpOnly cookies?)[cite: 47].
- [cite_start]**Criptografia**: Dados sensíveis estão criptografados em repouso (no BD) e em trânsito?[cite: 48, 275].
- [cite_start]**Compliance (LGPD/GDPR)**: Consentimento explícito?[cite: 51, 279]. [cite_start]Direito ao esquecimento?[cite: 51].
- [cite_start]**Anonimização**: Os dados são realmente anônimos ou pseudo-anônimos?[cite: 52].
- [cite_start]**Audit Trail**: Existe um log completo e imutável de acessos e modificações de dados sensíveis?[cite: 55, 278].
- [cite_start]**Riscos de Exposição**: O sistema previne eficazmente a exposição de informações pessoais?[cite: 282].

---

## 📱 3. FUNCIONALIDADES E EXPERIÊNCIA DO USUÁRIO (UX)

### Sistema de Cursos e Progresso

**Analisar criticamente:**

- [cite_start]**Conteúdo**: 6-8 módulos por curso é adequado?[cite: 60]. [cite_start]O conteúdo é relevante para o mercado local?[cite: 103].
- [cite_start]**Progress Tracking**: Granularidade suficiente (módulo vs. aula vs. quiz)?[cite: 61].
- [cite_start]**Gamification**: Elementos motivacionais estão implementados?[cite: 62].
- [cite_start]**Avaliações**: Os quizzes são eficazes para medir competências?[cite: 64, 318].

### Sistema de Certificados

**Analisar criticamente:**

- [cite_start]**Validação**: QR code funciona offline?[cite: 73].
- [cite_start]**Credibilidade**: Há prevenção de falsificação?[cite: 74]. [cite_start]A certificação tem credibilidade no mercado local?[cite: 319].
- [cite_start]**Inovação**: O uso de Blockchain traria benefício real para imutabilidade?[cite: 76, 128].

### Dashboard para ONGs

**Analisar criticamente:**

- [cite_start]**Analytics**: As métricas são relevantes para o monitoramento?[cite: 80, 314].
- [cite_start]**Gestão**: CRUD de usuários é completo e seguro?[cite: 82].
- [cite_start]**Alerts**: Há monitoramento de usuários inativos ou em risco?[cite: 83].

### UX, Acessibilidade e Abordagem de Trauma

**Analisar criticamente:**

- [cite_start]**Literacia Digital**: A interface é intuitiva para usuários com baixa literacia digital e experiência limitada com tecnologia?[cite: 24, 299, 300, 306].
- [cite_start]**Abordagem de Trauma (Crítico)**: O design (cores, linguagem, fluxos) respeita o trauma e o contexto das usuárias?[cite: 66, 307]. [cite_start]O sistema evita re-traumatização?[cite: 166, 360].
- [cite_start]**Acessibilidade**: Fontes legíveis?[cite: 69]. [cite_start]Contraste adequado?[cite: 69]. [cite_start]Suporte a múltiplos idiomas locais?[cite: 68, 303].
- [cite_start]**Inovação**: Interfaces de voz seriam viáveis para baixa literacia?[cite: 129].

---

## 🌍 4. IMPACTO SOCIAL, ÉTICA E ALINHAMENTO

### Eficácia na Reintegração (Objetivo UNODC)

**Analisar criticamente:**

- [cite_start]**Empregabilidade**: A plataforma vai além dos cursos e mede a taxa de colocação real?[cite: 89, 95].
- [cite_start]**Skills Matching**: O algoritmo (Fase 2) é eficaz para o mercado local?[cite: 90, 313]. [cite_start]É ético e seguro?[cite: 320].
- [cite_start]**Suporte Psicossocial**: O sistema integra suporte emocional/mentoria ou é puramente técnico?[cite: 91, 93, 137].
- [cite_start]**Alinhamento**: A solução aborda efetivamente o desafio de reintegração?[cite: 341]. [cite_start]É inovadora comparada a soluções existentes?[cite: 342].

### Aspectos Éticos e Sociais

**Analisar criticamente:**

- [cite_start]**Dignidade**: A abordagem é centrada na sobrevivente?[cite: 361].
- [cite_start]**Sensibilidade Cultural**: O conteúdo e a abordagem são adaptados à cultura moçambicana?[cite: 103, 362].
- [cite_start]**Riscos Sociais**: O sistema pode causar estigmatização não intencional?[cite: 167]. [cite_start]Pode criar dependência?[cite: 168].
- [cite_start]**Exclusão Digital**: Como mitigar o risco de excluir populações remotas sem conectividade?[cite: 102, 169].

---

## 📈 5. SUSTENTABILIDADE E MODELO DE NEGÓCIO

### Viabilidade Financeira

**Analisar criticamente:**

- [cite_start]**Modelo de Financiamento**: Qual o plano de autossustentação (pós-hackathon)?[cite: 347, 349].
- [cite_start]**Custo Operacional**: O custo da infraestrutura é sustentável?[cite: 332, 348]. [cite_start]O custo por beneficiária é competitivo?[cite: 355].
- [cite_start]**Parcerias**: As parcerias propostas (ONGs, Ministério) são viáveis e estratégicas?[cite: 104, 350, 354].
- [cite_start]**Escala**: O modelo permite a expansão regional (SADC)?[cite: 185, 351].

---

## 💻 6. QUALIDADE DE CÓDIGO E DEVOPS

### Qualidade do Código

**Analisar criticamente:**

- [cite_start]**TypeScript**: Strict mode ativado?[cite: 111]. [cite_start]Tipagem robusta ou uso excessivo de `any`?[cite: 111].
- [cite_start]**Testes**: Cobertura de testes (meta > 80%)?[cite: 112]. [cite_start]Testes E2E, unitários, integração?[cite: 112].
- [cite_start]**Documentação**: API docs (Swagger/OpenAPI)?[cite: 113]. [cite_start]Comentários de código?[cite: 113].
- [cite_start]**Error Handling**: Tratamento de erros e _graceful degradation_?[cite: 114].
- [cite_start]**Logging**: Logs estruturados (JSON)?[cite: 115]. [cite_start]Níveis adequados?[cite: 115].

### DevOps e Deploy

**Analisar criticamente:**

- [cite_start]**CI/CD**: Pipeline automatizado para testes e deploy?[cite: 118].
- [cite_start]**Monitoramento**: Health checks?[cite: 119, 326]. [cite_start]Alertas de performance e segurança?[cite: 119].
- [cite_start]**Backup**: Estratégia de backup/restore implementada (RTO/RPO definidos)?[cite: 120, 290].
- [cite_start]**Infraestrutura**: Viabilidade de implementação e operação em Moçambique?[cite: 405].
- [cite_start]**Disaster Recovery**: Plano de contingência para _downtime_?[cite: 122, 158].

---

## ⚠️ 7. ANÁLISE DE RISCOS E OPORTUNIDADES

### Riscos Críticos (Resumo)

- [cite_start]**Segurança**: _Data Breach_ expondo vítimas[cite: 156]. [cite_start]Abuso por _insider_ (staff de ONGs)[cite: 159].
- [cite_start]**Operacional**: Falha na adoção pelos usuários[cite: 162]. [cite_start]Insustentabilidade financeira[cite: 161].
- [cite_start]**Impacto**: Re-traumatização por design inadequado[cite: 166].

### Oportunidades de Inovação

- [cite_start]**Integrações**: WhatsApp para comunicação (canal familiar)?[cite: 130].
- [cite_start]**Expansão**: Marketplace de empregadores?[cite: 134]. [cite_start]Microcrédito?[cite: 135]. [cite_start]Suporte legal?[cite: 138].
- [cite_start]**Diferenciais**: O que torna a WIRA única e sustentável no longo prazo?[cite: 149, 150].

---

## 🎯 8. METODOLOGIA E DELIVERABLES

### Metodologia de Avaliação

Seu processo deve incluir:

1.  [cite_start]**Code Review**: Análise estática e dinâmica[cite: 209].
2.  [cite_start]**Architecture Assessment**: Revisão de padrões[cite: 210].
3.  [cite_start]**Security Testing**: Vulnerability scanning e tentativa de pentest[cite: 211].
4.  [cite_start]**User Experience**: Análise heurística focada no trauma e baixa literacia[cite: 212, 404].

### Critérios de Sucesso (Alvo)

Avalie a plataforma contra estas métricas-alvo:

- [cite_start]**Técnicos**: < 200ms resposta[cite: 194]; [cite_start]99.9% uptime[cite: 195]; [cite_start]Zero vulnerabilidades críticas[cite: 196].
- [cite_start]**Impacto Social**: 70%+ colocação em 6 meses[cite: 204]; [cite_start]< 5% taxa de re-traficking[cite: 206].

### Deliverables Esperados

Você deve entregar três documentos:

**1. Relatório Executivo (1-3 páginas)**

- [cite_start]Resumo executivo focado nos _findings_ de negócio e risco[cite: 217, 372].
- [cite_start]Avaliação geral (Scoring System 1-10 para cada área principal)[cite: 243, 374].
- [cite_start]Top 10 Recomendações Prioritárias[cite: 244].

**2. Relatório Técnico Detalhado**

- [cite_start]Análise por camada (frontend, backend, mobile)[cite: 222].
- [cite_start]Lista de vulnerabilidades (CVEs, OWASP Top 10) com PoC[cite: 223].
- [cite_start]Benchmarks de performance[cite: 224].
- [cite_start]Arquitetura de dados e sistema recomendada[cite: 225].

**3. Plano de Ação (Roadmap)**

- [cite_start]**Curto Prazo (Quick Wins)**: Segurança crítica, _low-hanging fruit_ (< 1-4 semanas)[cite: 172, 227].
- [cite_start]**Médio Prazo (Evolução)**: Migração de BD, refatoração de UX (1-6 meses)[cite: 178, 228].
- [cite_start]**Longo Prazo (Estratégico)**: Expansão regional, IA, Blockchain (6+ meses)[cite: 184, 229].

---

## ⚡ INSTRUÇÕES FINAIS PARA O ANALISTA

1.  [cite_start]**Seja Brutalmente Honesto**: Não hesite em apontar falhas críticas[cite: 234]. [cite_start]A segurança das vítimas depende disso[cite: 236].
2.  [cite_start]**Seja Construtivo**: Cada problema deve vir com uma solução proposta e acionável[cite: 235].
3.  [cite_start]**Priorize por Impacto**: Foque no que traz maior risco (segurança, trauma) ou maior benefício (empregabilidade)[cite: 238].
4.  [cite_start]**Contexto Moçambicano**: Sempre considere a realidade local de conectividade, custo de dados, cultura e barreiras linguísticas[cite: 102, 237, 403].
5.  [cite_start]**Foco no Trauma**: Avalie cada fluxo de usuário pela lente de uma pessoa vulnerável e potencialmente com baixa literacia digital[cite: 236, 404].

## 🎉 PARABÉNS! Seus _findings_ foram avaliados e a plataforma está pronta para ser usada!
