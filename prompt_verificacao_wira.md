# 🔍 PROMPT DE VERIFICAÇÃO DE EMERGÊNCIA - WIRA HÍBRIDO
## Hackathon UNODC Moçambique 2025 - Desafio 2: Reintegração Econômica de Vítimas de Tráfico Humano

---

## 🚨 **SITUAÇÃO DE EMERGÊNCIA - APRESENTAÇÃO EM <24H**

### **CONTEXTO ADICIONAL:**
- **URGÊNCIA CRÍTICA:** Apresentação do Hackathon amanhã (menos de 24 horas)
- **FOCO PRINCIPAL:** Consistência entre **prometido vs implementado**
- **ACESSO DISPONÍVEL:** Tenho acesso aos arquivos `proposta_hackathon_unodc.md`, `backlog_wira.md` e ao código implementado
- **OBJETIVO IMEDIATO:** Verificação **honesta e crítica** para garantir sucesso na apresentação
- **NECESSIDADE:** Identificar gaps críticos que podem comprometer a apresentação ao vivo

---

## 🎯 **MISSÃO DA VERIFICAÇÃO**

**OBJETIVO PRIMÁRIO:** Garantir que o WIRA Platform esteja **MINIMAMENTE VIÁVEL** para apresentação bem-sucedida, com foco em:

1. **Consistência Absoluta** entre documentos e implementação
2. **Funcionalidades Críticas** funcionando sem falhas
3. **Credibilidade** da demonstração ao vivo
4. **Prevenção de Fracassos** durante a apresentação

**PILARES CRÍTICOS:**
- **Honestidade Radical:** Identificar TODOS os problemas, mesmo que críticos
- **Foco em Bloqueadores:** Priorizar o que impede a apresentação
- **Realismo:** Considerar limite de tempo <24h para correções
- **Ação Imediata:** Gerar plano acionável para as próximas 12 horas

---

## 🔍 **DETECTOR DE INCONSISTÊNCIAS CRÍTICAS**

### **ANÁLISE DE CONSISTÊNCIA: PROMETIDO vs IMPLEMENTADO**

**VERIFICAÇÃO CRUZADA IMEDIATA:**
```
PROMESSA NA PROPOSTA         |     IMPLEMENTADO REALMENTE     |     GAP CRÍTICO?
─────────────────────────────────────────────────────────────────────────────────────
"Fase 1: Capacitação"       |     App de cursos funcional   |     ❓ VERIFICAR
"Fase 2: Matching em 30d"    |     Apenas mockup visual    |     ❓ VERIFICAR
"USSD funcional"             |     Simulação/Figma         |     ❓ VERIFICAR
"Dashboard ONG progresso"    |     Monitoramento ativo     |     ❓ VERIFICAR
"Anonimato total"           |     Códigos V#### apenas    |     ❓ VERIFICAR
"Offline-first"             |     Vídeos download       |     ❓ VERIFICAR
```

### **TABELA DE VERIFICAÇÃO RÁPIDA DE INCONSISTÊNCIAS:**

| Componente | Prometido | Implementado | Status | Gap Crítico? |
|------------|-----------|---------------|---------|---------------|
| **App Mobile** | 8 telas funcionais | ? | ❓ VERIFICAR | ⚠️ |
| **Quiz** | 70% aprovação | ? | ❓ VERIFICAR | 🔴 |
| **Certificado** | Digital com QR | ? | ❓ VERIFICAR | 🔴 |
| **USSD** | Funcional *130# | ? | ❓ VERIFICAR | ⚠️ |
| **Dashboard** | Monitorar progresso | ? | ❓ VERIFICAR | 🔴 |
| **Vagas** | Mockup (Fase 2) | ? | ❓ VERIFICAR | ⚠️ |
| **Offline** | Vídeos download | ? | ❓ VERIFICAR | 🔴 |
| **Anonimato** | Códigos V#### | ? | ❓ VERIFICAR | 🔴 |

### **PERGUNTAS DE DETECÇÃO DE INCONSISTÊNCIAS:**

**Responda SIM/NÃO para cada:**

1. **O que está no slide de arquitetura existe no código?**
2. **O tempo estimado no backlog corresponde ao que foi implementado?**
3. **As funcionalidades demonstráveis correspondem ao que foi prometido?**
4. **O pitch menciona algo que não funciona?**
5. **Há discrepância entre Fase 1 (hoje) e Fase 2 (30 dias)?**

---

## 🎯 DIMENSÕES CRÍTICAS DE ANÁLISE

### 1. 🚨 **VERIFICAÇÃO DE BLOQUEADORES CRÍTICOS** (P0 - Impede Apresentação)

**VERIFIQUE IMEDIATAMENTE (5 minutos):**

| Bloqueador Crítico | Status | Impacto na Apresentação |
|-------------------|--------|-----------------------|
| **App não abre ou crash** | ❓ VERIFICAR | 🔴 FALHA TOTAL |
| **Login não funciona (V0042)** | ❓ VERIFICAR | 🔴 FALHA TOTAL |
| **Quiz não calcula 70%** | ❓ VERIFICAR | 🔴 FALHA MAJOR |
| **Sem vídeo funcionando** | ❓ VERIFICAR | 🟠 FALHA MEDIA |
| **Dashboard não carrega** | ❓ VERIFICAR | 🟠 FALHA MEDIA |
| **Offline não funciona** | ❓ VERIFICAR | 🟡 FALHA MINOR |
| **Certificado não gera** | ❓ VERIFICAR | 🔴 FALHA MAJOR |

**DECISÃO RÁPIDA:**
- **Qualquer 🔴 = CORRIGIR IMEDIATAMENTE** (prioridade absoluta)
- **Qualquer 🟠 = CORRIGIR SE TEMPO** (importante mas não bloqueia)
- **Qualquer 🟡 = ACEITAR** (melhorar se sobrar tempo)

---

## ⚡ **FAST-TRACK DE VERIFICAÇÃO (30 minutos vs 2 horas)**

### **Etapa 1: Verificação de Bloqueadores (5 min)**
```
□ App abre sem crash no dispositivo de demonstração
□ Login com código V0042 funciona
□ Quiz completo com validação de 70%
□ Pelo menos 1 vídeo toca
□ Dashboard ONG carrega em localhost:3001
□ Navegação entre telas principais funciona
□ Sem erro visível em tela inicial
```

### **Etapa 2: Verificação de Consistência (15 min)**
```
□ O que está nos slides existe no código?
□ Fase 1 vs Fase 2 está claramente separada?
□ USSD é apenas simulação (não funcional)?
□ Dashboard mostra progresso, não vagas?
□ Anonimato com códigos V#### mantido?
□ Interface em português moçambicano?
```

### **Etapa 3: Verificação de Credibilidade (10 min)**
```
□ Dados de demo são realistas?
□ Fluxo completo funciona sem ajuda externa?
□ Demo pode ser feita em <5 minutos?
□ Backup preparado se algo falhar?
□ Respostas preparadas para questões difíceis?
```

---

### 2. 🎯 **ALINHAMENTO ESTRATÉGICO** (Proposta vs. Backlog)

**VERIFIQUE:**
- ✅ A proposta estabelece **FASE 1 = Capacitação** e **FASE 2 = Matching**
- ✅ O backlog aloca **70% do tempo** para capacitação (App + Cursos)
- ✅ O backlog marca USSD como **SIMULADO** (não funcional)
- ✅ O backlog trata vagas como **MOCKUP** (Fase 2, não implementável)
- ✅ Dashboard ONG foca em **MONITORAR PROGRESSO** (não validar vagas)

**QUESTÕES-CHAVE:**
```
1. O backlog reflete a prioridade clara em capacitação primeiro?
2. Foi entendido que matching = Fase 2 (30 dias após hackathon)?
3. USSD está claramente marcado como simulado/demonstração?
4. O dashboard foca em progresso de cursos, não em validação de empregos?
```

### 2. 🛠️ **IMPLEMENTAÇÃO TÉCNICA** (O que existe vs. O que foi proposto)

**VERIFIQUE STACK COMPLETO:**

#### **Backend (Node.js/Express)**
```yaml
Endpoints implementados:
- ✅ /api/auth/login (autenticação anônima V####)
- ✅ /api/courses (lista de cursos com progresso)
- ✅ /api/progress (salvar progresso dos módulos)
- ✅ /api/certificates (gerar certificado com QR)
- ✅ /health (health check completo)
- ✅ CORS configurado para frontend

Dados em memória OK para demo:
- Usuários: V0042 (Maria), V0038 (Ana), V0031 (João)
- Cursos: Costura, Culinária, Agricultura
- Progress: Valores realistas (37%, 14%, 100%)
```

#### **Mobile App (React Native/Expo)**
```yaml
Telas implementadas e funcionando:
- ✅ WelcomeScreen (onboarding + opção de código)
- ✅ LoginScreen (autenticação com códigos V####)
- ✅ HomeScreen (dashboard pessoal com stats)
- ✅ CourseLibraryScreen (biblioteca de 3 cursos)
- ✅ CourseDetailScreen (detalhes com módulos e progresso)
- ✅ VideoLessonScreen (player com vídeo real)
- ✅ QuizScreen (5 perguntas, 70% para passar)
- ✅ CertificateScreen (certificado digital com QR)
- ✅ JobsMockupScreen (MOCKUP Fase 2 - não funcional)

Funcionalidades críticas:
- ✅ Offline-first (AsyncStorage para progresso)
- ✅ Navegação fluida entre telas
- ✅ Progresso visual (barras, percentuais)
- ✅ Sistema de quiz com feedback imediato
```

#### **ONG Dashboard (Next.js/Vite)**
```yaml
Implementado e funcional:
- ✅ Dashboard principal com 3 KPIs (vítimas, cursos, certificados)
- ✅ Tabela de progresso de usuários (códigos, %, certificados)
- ✅ Design profissional com Tailwind CSS
- ✅ Dados realistas sincronizados com backend

FOCO CORRETO: Monitorar CAPACITAÇÃO, não validar vagas
```

### 3. ⏰ **VIABILIDADE DE EXECUÇÃO** (Timeline 3 Dias = 30h úteis)

**VERIFIQUE CRONOGRAMA REALISTA:**

#### **Dia 1 (10h): App Mobile Core**
```yaml
Manhã (4h):
- ✅ Setup React Native + Expo + dependências ESSENCIAIS
- ✅ Estrutura navegação (8 telas principais)
- ✅ WelcomeScreen + LoginScreen (com validação V0042)

Tarde (6h):
- ✅ HomeScreen (dashboard com stats)
- ✅ CourseLibrary + CourseDetail
- ✅ VideoLesson (com vídeo real)
- ✅ Quiz + Certificate (funcional completo)

Resultado: App 100% funcional para capacitação
```

#### **Dia 2 (10h): Backend + Dashboard**
```yaml
Manhã (4h):
- ✅ Backend Express minimalista (dados em memória)
- ✅ Endpoints RESTful funcionando
- ✅ CORS configurado

Tarde (6h):
- ✅ Dashboard Next.js/Vite funcional
- ✅ Protótipo USSD no Figma (NÃO implementar real)
- ✅ JobsMockupScreen (apenas visual)

Resultado: Sistema completo demostrável
```

#### **Dia 3 (10h): Polimento + Demo**
```yaml
Manhã (4h):
- ✅ Testes completos do fluxo
- ✅ Assets e polimento visual
- ✅ Backup e contingências

Tarde (6h):
- ✅ Slides atualizados
- ✅ Ensaio geral (3x)
- ✅ Preparação final

Resultado: Apresentação impecável
```

### 4. 🎭 **DEMOSTRABILIDADE** (O que será mostrado ao vivo)

**VERIFIQUE FLUXO COMPLETO (máximo 5 minutos):**

#### **Parte 1: App Mobile (3 minutos)**
```yaml
1. Welcome → Login com V0042 (10 seg)
2. Dashboard pessoal (15 seg)
3. Biblioteca de Cursos (15 seg)
4. Curso Costura (ver módulos, 37% progresso) (30 seg)
5. Módulo 3: Play vídeo (20 seg)
6. Quiz: 5 perguntas (60 seg)
7. Resultado: Passou com 80% (20 seg)
8. Certificado digital com QR (30 seg)

TOTAL: ~3 minutos
```

#### **Parte 2: Dashboard ONG (1 minuto)**
```yaml
1. Abrir localhost:3001
2. Mostrar 3 vítimas, KPIs
3. V0042 com 37% (atualizado do quiz)
4. V0031 com certificado emitido

TOTAL: ~1 minuto
```

#### **Parte 3: Visão Futura (1 minuto)**
```yaml
1. Mostrar mockup de vagas (não funcional)
2. Explicar Fase 2 em 30 dias
3. Mostrar código matching no GitHub

TOTAL: ~1 minuto
```

### 5. 🔒 **PROTÓCOLOS ÉTICOS E SEGURANÇA**

**VERIFIQUE IMPLEMENTAÇÃO:**
```yaml
Anonimato:
- ✅ Códigos V#### (V0042) - NENHUM PII exposto
- ✅ Nome real criptografado (não mostrado em demo)
- ✅ Dashboard mostra apenas códigos e progresso

Segurança:
- ✅ JWT tokens (backend)
- ✅ CORS configurado
- ✅ Dados sensíveis criptografados (layout do código)

Consentimento:
- ✅ Login via código (fornecido pela ONG)
- ✅ App SEM cadastro direto
- ✅ Demonstração não mostra dados reais de vítimas
```

### 6. 📊 **MÉTRICAS E KPIS DEFINIDOS**

**VERIFIQUE MÉTRICAS REALISTAS:**
```yaml
Para Hackathon (demonstração):
- ✅ 3 perfis teste (V0042, V0038, V0031)
- ✅ 3 cursos funcionais
- ✅ 1 certificado emitido (V0031)
- ✅ Sistema completo demostrável

Para Pitch (impacto esperado):
- ✅ 500 sobreviventes em 12 meses (realista pós-hackathon)
- ✅ 60% taxa de conclusão de cursos
- ✅ 300+ certificados emitidos
- ✅ Fase 2: 60% empregabilidade em 6 meses
```

---

## ❓ PERGUNTAS CRÍTICAS DE VALIDAÇÃO

### **Para os Desenvolvedores (VERIFICAÇÃO TÉCNICA):**

**Foco Estratégico:**
1. **Você implementou USSD funcional real ou apenas simulou/protótipo?**
   - ✅ CORRETO: Simulação via Figma + endpoints de teste
   - ❌ INCORRETO: Integração real com Africa's Talking

2. **O dashboard ONG mostra validação de vagas ou apenas monitoramento de progresso?**
   - ✅ CORRETO: Apenas progresso de cursos e capacitação
   - ❌ INCORRETO: Funcionalidades de validação de empregadores

3. **A tela de vagas (JobsScreen) é funcional ou mockup visual?**
   - ✅ CORRETO: Mockup estático com mensagem "Fase 2 em desenvolvimento"
   - ❌ INCORRETO: Sistema funcional de matching

4. **Você alocou proporcionalmente 70% do tempo em capacitação e 30% em visão futura?**
   - Verificar tempos reais de implementação no backlog

**Implementação Técnica:**
5. **O app funciona completamente offline para vídeos e progresso?**
   - ✅ CORRETO: Download de vídeos + AsyncStorage para progresso
   - ❌ INCORRETO: Depende de internet constante

6. **O sistema de anonimato (códigos V####) é implementado corretamente?**
   - ✅ CORRETO: Nenhum PII exposto, apenas códigos anônimos
   - ❌ INCORRETO: Nomes ou dados pessoais visíveis

7. **O quiz exige 70% de acerto para aprovação?**
   - ✅ CORRETO: Implementado e funcional
   - ❌ INCORRETO: Aprovação automática ou percentual diferente

### **Para o Projeto (VERIFICAÇÃO DOCUMENTAL):**

**Consistência entre Documentos:**
8. **O pitch/slides separam claramente Fase 1 (funcional hoje) vs Fase 2 (visão futura)?**
   - Verificar se slides mencionam "30 dias após hackathon"

9. **As métricas de impacto (500 vítimas, 60% empregabilidade) são realistas e contextualizadas?**
   - Verificar se apresentadas como metas pós-hackathon

10. **O slide de arquitetura mostra exatamente o stack implementado ou algo não implementado?**
    - Deve mostrar React Native, Node.js, SQLite/Supabase

11. **A demonstração ao vivo foca em capacitação ou tenta mostrar empregabilidade?**
    - ✅ CORRETO: 70% do tempo em app de cursos
    - ❌ INCORRETO: Foco em sistema de vagas

12. **O orçamento proposto ($56.500 ano 1) é compatível com o esforço de desenvolvimento descrito?**
    - Verificar justificativa de custos

### **Para o Contexto Moçambicano (VERIFICAÇÃO CULTURAL):**

13. **Todo o conteúdo está em português de Moçambique (não Brasil)?**
    - Verificar termos: "telemóvel" vs "celular", "MT" vs "R$"

14. **Os cursos são relevantes para o mercado local (costura, culinária moçambicana, agricultura)?**
    - Verificar se adaptados à realidade local

15. **A solução considera limitações de infraestrutura (internet 3G,电力)?**
    - Verificar abordagem offline-first

---

## ✅ CHECKLIST FINAL DE CONFORMIDADE

### **Implementação Técnica (Obrigatório):**
```
□ App React Native com 8 telas funcionais
□ Backend Express com endpoints RESTful
□ Dashboard ONG mostrando progresso
□ Sistema de quiz funcionando (70% pass)
□ Certificado digital com QR code
□ Dados simulados realistas (V0042, V0038, V0031)
□ Offline support no app
□ Navegação fluida entre telas
□ Interface em português moçambicano
```

### **Alinhamento com Proposta (Crítico):**
```
□ Fase 1 = Capacitação (implementada)
□ Fase 2 = Matching (mockup/código apenas)
□ USSD = Simulado (Figma/video)
□ Dashboard = Monitorar progresso (não validar vagas)
□ Foco em 70% capacitação, 30% emprego (visão)
□ Anonimato total (códigos V####)
□ Protocolo ético seguido
```

### **Viabilidade de Demonstração (Essencial):**
```
□ Demo completa em < 5 minutos
□ App funcional offline
□ Todos os componentes rodando
□ Backup preparado (vídeos, screenshots)
□ Slides alinhados com implementação
□ Primeira e última frase decoradas
□ 3 ensaios gerais completos
```

---

## 🚨 **SISTEMA DE PRIORIZAÇÃO P0 - BLOQUEADORES DE APRESENTAÇÃO**

### **CLASSIFICAÇÃO DE RISCOS PARA <24H:**

| Prioridade | Tipo | Tempo para Corrigir | Impacto se NÃO corrigido |
|------------|------|-------------------|--------------------------|
| **P0** | Bloqueador Total | 2-6 horas | ❌ **APRESENTAÇÃO FALHA** |
| **P1** | Crítico | 1-2 horas | ⚠️ **CRÉDIBILIDADE COMPROMETIDA** |
| **P2** | Importante | 30-60 min | 🟡 **QUALIDADE REDUZIDA** |

---

### **🔴 ITENS P0 - BLOQUEADORES TOTAIS (CORRIGIR OBRIGATORIAMENTE)**

**Estes itens IMPERDEM a apresentação se não corrigidos:**

1. **App crash ou não abre no dispositivo de demonstração**
   - **Verificação:** Tentar abrir app 3x consecutivas
   - **Tempo para corrigir:** 2-4 horas
   - **Solução rápida:** Testar em dispositivo diferente, simplificar navegação

2. **Login com código V0042 não funciona**
   - **Verificação:** Tentar login múltiplas vezes
   - **Tempo para corrigir:** 1-2 horas
   - **Solução rápida:** Hardcode login para demo, corrigir validação depois

3. **Quiz não calcula corretamente ou aceita qualquer resposta**
   - **Verificação:** Completar quiz com respostas erradas
   - **Tempo para corrigir:** 2-3 horas
   - **Solução rápida:** Mock de resultado positivo para demo

4. **Dashboard ONG não carrega ou mostra erro visível**
   - **Verificação:** Abrir localhost:3001 e verificar console
   - **Tempo para corrigir:** 1-2 horas
   - **Solução rápida:** Criar versão estática em HTML puro

5. **Navegação entre telas principais quebra**
   - **Verificação:** Testar todos os botões de navegação
   - **Tempo para corrigir:** 1-3 horas
   - **Solução rápida:** Simplificar para fluxo linear (avançar/voltar)

---

### **⚠️ ITENS P1 - CRÍTICOS (CORRIGIR SE TEMPO DISPONÍVEL)**

6. **Inconsistência entre slides e implementação real**
7. **Quiz sem validação real (aceita qualquer resposta)**
8. **Vídeos não tocam ou demoram muito para carregar**
9. **Certificado não gera ou QR code não aparece**
10. **Interface em português do Brasil ou erros de idioma**

---

### **🟡 ITENS P2 - ACEITÁVEIS SE NÃO HOUVER TEMPO**

11. **Offline não funciona completamente**
12. **USSD apenas simulado (aceitável para hackathon)**
13. **Polimento visual imperfeito**
14. **Animações ou transições suaves ausentes**

---

## 🚨 **RED FLAGS ESPECÍFICAS DE INCONSISTÊNCIA**

### **DETEÇÃO RÁPIDA DE PROBLEMAS CRÍTICOS:**

**Se encontrar QUALQUER um destes, PARE E AVALIE:**

**Inconsistências Fatais:**
- ❌ **Slide promete USSD funcional mas código tem apenas mockup**
- ❌ **Fala sobre "500 usuários" mas só 3 perfis teste existem**
- ❌ **Apresenta "matching funcional" mas apenas tela mockup existe**
- ❌ **Menciona "validação de empregadores" mas dashboard só mostra progresso**

**Problemas de Credibilidade:**
- ❌ **Pitch fala sobre "casos de sucesso" mas nenhum existe real**
- ❌ **Apresenta "algoritmo funcionando" mas está comentado no código**
- ❌ **Promete "parcerias assinadas" mas apenas contatos informais**
- ❌ **Mostra "métricas reais" mas são todas simuladas**

**Se identificar 2+ red flags acima, REAVALIE ESTRATÉGIA IMEDIATAMENTE!**

---

## 📊 SISTEMA DE PONTUAÇÃO DE CONFORMIDADE

### **Cálculo do Score Final (0-100):**

**A. Implementação Técnica (40 pontos)**
- Fase 1 funcional completa: 0-30 pontos
- Qualidade do código: 0-10 pontos

**B. Alinhamento Estratégico (30 pontos)**
- Consistência Proposta vs Backlog: 0-15 pontos
- Foco correto (70% capacitação): 0-15 pontos

**C. Adequação Contextual (20 pontos)**
- Adaptação moçambicana: 0-10 pontos
- Protocolos éticos e segurança: 0-10 pontos

**D. Qualidade de Demonstração (10 pontos)**
- Fluidez da demo: 0-5 pontos
- Preparação para contingências: 0-5 pontos

### **Interpretação dos Resultados:**
- **90-100:** Excelente ✅ Pronto para apresentação
- **80-89:** Bom ✅ Pequenos ajustes necessários
- **70-79:** Aceitável ⚠️ Ajustes moderados necessários
- **60-69:** Precisa Melhorar ❌ Gaps significativos
- **< 60:** Insuficiente 🚨 Repensar abordagem

---

## 📝 ESTRUTURA DO RELATÓRIO DE VERIFICAÇÃO

Ao final da análise, produza um relatório com:

### **1. Score de Conformidade (0-100)**
- Implementação Técnica: ___/100
- Alinhamento Estratégico: ___/100
- Viabilidade de Demo: ___/100
- Conformidade Ética: ___/100

### **2. Itens Críticos Pendentes**
- Lista de tarefas para completar
- Prioridade (P0, P1, P2)
- Tempo estimado para correção

### **3. Riscos de Demonstração**
- Pontos que podem falhar na apresentação
- Planos de contingência
- Materiais de backup

### **4. Recomendações Finais**
- Ajustes no pitch
- Melhorias na demo
- Otimização de tempo

---

## 🎯 OBJETIVO FINAL

**Garantir que o WIRA Platform esteja 100% alinhado com a proposta hackathon UNODC, com foco em CAPACITAÇÃO FUNCIONAL (Fase 1) e visão clara para Fase 2, resultando em uma demonstração impecável e impacto real para vítimas de tráfico humano em Moçambique.**

---

## 📋 **RELATÓRIO ACELERADO DE VERIFICAÇÃO (15 minutos)**

### **🚨 VERIFICAÇÃO DE EMERGÊNCIA - APRESENTAÇÃO EM <24H**
**Data:** ____/____/2025 **Hora:** ____:____
**Status:** ⚠️ **EMERGÊNCIA** - Apresentação amanhã

---

## 🔴 **CHECKLIST DE BLOQUEADORES CRÍTICOS (P0)**

**VERIFIQUE E MARQUE:**

| Bloqueador P0 | Status ✅/❌ | Tempo para Corrigir | Plano de Ação |
|----------------|---------------|-------------------|----------------|
| App abre sem crash | | | |
| Login V0042 funciona | | | |
| Quiz calcula 70% | | | |
| Vídeo toca | | | |
| Dashboard carrega | | | |
| Navegação básica funciona | | | |
| Sem erro visível inicial | | | |

**TOTAL P0:** ____/7 itens funcionando

---

## ⚠️ **DETECTOR RÁPIDO DE INCONSISTÊNCIAS**

**PROMESSA VS REALIDADE:**

| Item Prometido | Status Real | Gap Crítico? |
|----------------|-------------|----------------|
| "Fase 1 funcional" | | |
| "USSD funcional" | | |
| "Matching em 30 dias" | | |
| "500 usuários" | | |
| "Parcerias assinadas" | | |

**Sinalizador de Risco:**
- **0-1 gaps:** ✅ Apresentação viável
- **2-3 gaps:** ⚠️ Requer ajustes no pitch
- **4+ gaps:** ❌ Reavaliar estratégia

---

## 📊 **SCORE RÁPIDO DE VIABILIDADE (0-100)**

**Cálculo Simples:**
- **Funcionalidades Críticas (50%):** ____/50
- **Consistência Documental (30%):** ____/30
- **Credibilidade da Demo (20%):** ____/20
- **TOTAL:** ____/100

---

## 🎯 **PLANO DE AÇÃO IMEDIATO (Próximas 12 horas)**

### **🔴 AÇÕES P0 - FAZER AGORA (Bloqueadores)**

1. **CORRIGIR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Evita falha total

2. **CORRIGIR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Evita falha total

3. **CORRIGIR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Evita falha total

### **⚠️ AÇÕES P1 - SE SOBRAR TEMPO**

1. **MELHORAR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Melhora credibilidade

2. **AJUSTAR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Reduz questões difíceis

### **🟡 AÇÕES P2 - MELHORIAS FINAIS**

1. **POLIR:** _________________________
   - **Tempo necessário:** ____ horas
   - **Impacto:** Impressão profissional

---

## ❓ **DECISÃO ESTRATÉGICA**

**Status da Apresentação:**
- [ ] ✅ **PRONTA PARA APRESENTAR** (Score >80, P0=0)
- [ ] ⚠️ **VIÁVEL COM AJUSTES** (Score 70-80, P0≤2)
- [ ] ❌ **PRECISA REAVALIAÇÃO** (Score <70, P0>2)

**Estratégia Recomendada:**
- [ ] **Seguir plano original** (apresentar como está)
- [ ] **Ajustar pitch para focar no que funciona** (omitir gaps)
- [ ] **Mudar para demonstração mais simples** (reduzir scope)
- [ ] **Adiar funcionalidades críticas** (apresentar como roadmap)

---

## 📋 **CHECKLIST FINAL DE PREPARAÇÃO**

**Para Apresentação (marque ✅):**

- [ ] Dispositivos 100% carregados
- [ ] Backup de vídeo (se app falhar)
- [ ] Screenshots de todas as telas
- [ ] Respostas preparadas para questões difíceis
- [ ] Contingência técnica clara
- [ ] Teste completo do fluxo (3x)
- [ ] Timer para 5 minutos
- [ ] Pen drive com todos os materiais
- [ ] Cabos e adaptadores

---

## 🏁 **VEREDITO FINAL**

**Classificação:**
- [ ] **APRESENTÁVEL** ✅ (Risco baixo)
- [ ] **APRESENTÁVEL COM CUIDADO** ⚠️ (Risco médio)
- [ ] **ALTO RISCO** ❌ (Precisa decisão imediata)

**Recomendação Final:**
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

**Assinatura:** _________________________
**Hora Final:** ____:____

---

*Este relatório foi otimizado para emergência <24h. Foque em bloqueadores críticos e ações imediatas.*

---

## 📖 **COMO USAR ESTE PROMPT OTIMIZADO**

### **PARA USO IMEDIATO (<24h):**

**Passo 1 - Copiar Contexto Completo (1 min):**
```
Copiar todo o conteúdo deste arquivo: prompt_verificacao_wira.md
Incluir na conversa com IA: ChatGPT, Claude, ou outra
Adicionar: "Tenho <24h para apresentação do Hackathon UNODC"
```

**Passo 2 - Fornecer Acesso aos Arquivos (2 min):**
```
Explicar à IA: "Tenho acesso a:
- proposta_hackathon_unodc.md
- backlog_wira.md
- Código implementado (descrever estrutura)"
```

**Passo 3 - Solicitar Verificação Rápida (1 min):**
```
"Execute verificação completa usando o framework acima.
Priorize P0 (bloqueadores) e inconsistências críticas.
Use relatório acelerado de 15 minutos."
```

**Passo 4 - Focar em Resultados Acionáveis (10 min):**
```
Pergunte: "Quais são os 3 problemas críticos que devo corrigir agora?"
"Qual é o plano de ação para as próximas 6 horas?"
"Posso apresentar assim ou preciso ajustar o pitch?"
```

### **TEMPO ESTIMADO TOTAL: 15 MINUTOS**

---

## ⚡ **DICAS DE USO EFICIENTE**

**Para Máxima Efetividade:**
1. **Seja Honesto:** Não oculte problemas - a IA vai encontrá-los anyway
2. **Foque em Ação:** Peça soluções específicas, não apenas diagnóstico
3. **Pergunte sobre Priorização:** "O que corrigir primeiro nas próximas 2 horas?"
4. **Solicite Planos de Contingência:** "E se X falhar durante a apresentação?"

**Comandos Úteis para a IA:**
- "Identifique top 5 blockers críticos"
- "Quais inconsistências os jurados notarão?"
- "Sugira 3 correções rápidas com maior impacto"
- "Ajude a reformular pitch para focar no que funciona"

---

## 🎯 **OBJETIVO FINAL GARANTIDO**

**Este prompt otimizado assegura que você possa:**
1. **Identificar RAPIDAMENTE** todos os problemas críticos
2. **Priorizar CORREÇÕES** que realmente importam para a apresentação
3. **Tomar DECISÕES ESTRATÉGICAS** informadas e realistas
4. **APRESENTAR COM CONFIANÇA** sabendo exatamente o que funciona
5. **MINIMIZAR RISCOS** de falha ou perda de credibilidade

---

**Lembre-se: É melhor apresentar algo simples que funciona do que algo complexo que falha.**

---

*Prompt criado para verificação sistemática e completa da implementação do WIRA HÍBRIDO - Hackathon UNODC 2025*
*Versão Otimizada para Emergência <24h*