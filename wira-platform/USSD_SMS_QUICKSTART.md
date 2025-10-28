# 🚀 GUÍA RÁPIDA - COMO INICIALIZAR E TESTAR O SISTEMA USSD/SMS WIRA

## 📋 PRÉ-REQUISITOS

### **Software Necessário:**
- Node.js (v14 ou superior)
- Navegador web moderno (Chrome, Firefox, Edge)
- Terminal de linha de comando
- Conexão com internet (para carregar frontend)

---

## 🎯 **PASSO 1: INICIAR O SISTEMA**

### **1.1 Abrir Terminal**
```bash
# Navegar para o diretório do projeto
cd E:\IT-developer\Hackathons\hackathos_trafico_de_pessoas\mvp\test_hack\wira-platform\backend
```

### **1.2 Iniciar Servidor USSD/SMS**

**Opção A: Usar JavaScript (Recomendado para Demo)**
```bash
# Iniciar servidor completo
node ussd-server.js

# Servidor deve responder:
🚀 WIRA USSD/SMS Enhanced Server started on port 3000
📊 Health: http://localhost:3000/health
📱 USSD Test: curl -X POST http://localhost:3000/api/ussd/test
📧 SMS Status: http://localhost:3000/api/sms/status
🎬 Demo Sequence: http://localhost:3000/api/demo/ussd/sequence

📱 USSD Shortcode: *123#
📞 SMS Service: Online (Mock)
⏰ Session Timeout: 5 minutes
```

**Opção B: Usar TypeScript (Para Desenvolvimento)**
```bash
# Instalar dependências TypeScript
npm install

# Iniciar servidor TypeScript em modo desenvolvimento
npm run dev:ussd

# Ou compilar e executar
npm run build
npm run start:ussd

# Para o servidor simples TypeScript
npm run dev:simple
```

### **1.3 Iniciar Frontend de Demonstração**
```bash
# Abrir novo terminal
cd E:\IT-developer\Hackathons\hackathos_trafico_de_pessoas\mvp\test_hack\wira-platform\frontend
node serve.cjs

# Frontend deve responder:
🚀 WIRA Dashboard Server started on port 3001
📊 Dashboard: http://localhost:3001
🔧 Backend: http://localhost:3000
```

---

## 🧪 **PASSO 2: VERIFICAR FUNCIONAMENTO**

### **2.1 Teste de Health Check**
```bash
# Verificar se servidor está online
curl http://localhost:3000/health

# Resposta esperada:
{
  "status": "OK",
  "timestamp": "2025-10-27T11:10:52.491Z",
  "uptime": 20.5872537,
  "environment": "development",
  "version": "3.0.0-ussd-enhanced",
  "services": {
    "api": "online",
    "ussd": "online",
    "sms": "online (mock)",
    "database": "connected (memory)"
  }
}
```

### **2.2 Teste USSD Básico**
```bash
# Testar tela inicial USSD
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text":""}'

# Resposta esperada:
{
  "success": true,
  "response": "CON Bem-vinda a WIRA - Women's Integrated Reintegration Academy\n\nSeu código de acesso (ex: V0042):",
  "sessionId": "test_1761563453350",
  "step": "login"
}
```

---

## 📱 **PASSO 3: TESTE USSD COMPLETO**

### **3.1 Sequência de Login**
```bash
# Passo 1: Login com código V0042
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"demo123","phoneNumber":"+258840000000","text":"V0042"}'

# Resposta esperada:
{
  "success": true,
  "response": "CON Bem-vinda, Maria! 👋\n\nComo podemos ajudar?\n1. Meus Cursos\n2. Meu Progresso\n3. Ajuda\n4. Sair",
  "sessionId": "demo123",
  "step": "main_menu"
}
```

### **3.2 Navegação por Menus**
```bash
# Visualizar progresso (opção 2)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"demo123","phoneNumber":"+258840000000","text":"2"}'

# Ver cursos (opção 1)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"demo123","phoneNumber":"+258840000000","text":"1"}'

# Menu de ajuda (opção 3)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"demo123","phoneNumber":"+258840000000","text":"3"}'
```

### **3.3 Códigos de Acesso Disponíveis**
- **V0042** - Maria Silva (Costura 37%, Culinária 14%)
- **V0038** - Ana Costa (Culinária 14%)
- **V0031** - João Matos (Costura 100% - com certificado)

---

## 📧 **PASSO 4: TESTE SISTEMA SMS**

### **4.1 Verificar Status SMS**
```bash
# Verificar serviço SMS
curl http://localhost:3000/api/sms/status

# Resposta esperada:
{
  "success": true,
  "service": "WIRA SMS Service",
  "status": "Online (Mock)",
  "totalSent": 0,
  "recentMessages": [],
  "timestamp": "2025-10-27T11:11:15.147Z"
}
```

### **4.2 Enviar SMS Manual**
```bash
# Enviar SMS de teste
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+258841234567","message":"Teste SMS WIRA - Funcionando!"}'

# Resposta esperada:
{
  "success": true,
  "message": "SMS sent successfully",
  "sms": {
    "id": 1761563525667,
    "to": "+258841234567",
    "message": "Teste SMS WIRA - Funcionando!",
    "sentAt": "2025-10-27T11:12:05.667Z",
    "status": "sent",
    "provider": "mock-sms-provider"
  }
}
```

### **4.3 Verificar SMS Enviados**
```bash
# Listar todos os SMS
curl http://localhost:3000/api/sms/all

# Mostra SMS automáticos enviados pelo USSD
```

---

## 🎬 **PASSO 5: DEMONSTRAÇÃO AUTOMÁTICA**

### **5.1 Sequência Completa Automática**
```bash
# Executar demo USSD completa
curl http://localhost:3000/api/demo/ussd/sequence

# Resposta esperada com 3 passos:
{
  "success": true,
  "demoSequence": [
    {
      "step": "Welcome",
      "response": "CON Bem-vinda a WIRA..."
    },
    {
      "step": "Login",
      "response": "CON Bem-vinda, Maria! 👋..."
    },
    {
      "step": "Progress",
      "response": "CON PROGRESSO GERAL - V0042..."
    }
  ]
}
```

---

## 🖥️ **PASSO 6: ACESSAR FRONTS INTERATIVOS**

### **6.1 Dashboard Principal**
- **URL:** `http://localhost:3001`
- **Funcionalidades:** KPIs, progresso, status USSD

### **6.2 Demonstração USSD/SMS**
- **URL:** `http://localhost:3001/ussd-demo.html`
- **Funcionalidades:**
  - Simulador de telefone USSD
  - Chat SMS interativo
  - Templates rápidos
  - Demo automática
  - Status do sistema em tempo real

### **6.3 Como Usar o Frontend USSD:**
1. **Teclado USSD:** Digite `*123#` depois `V0042`
2. **Navegação:** Use botões numéricos 1-4
3. **SMS:** Digite mensagem e clique "Enviar"
4. **Demo:** Clique "Demo Automática" para teste completo

---

## 🔧 **PASSO 7: SOLUÇÃO DE PROBLEMAS**

### **7.1 Problemas Comuns e Soluções**

| Problema | Causa | Solução |
|----------|-------|---------|
| "address already in use" | Porta 3000 ocupada | Feche outros processos Node.js |
| "Connection refused" | Servidor não iniciado | Verifique se `node ussd-server.js` está rodando |
| "Invalid JSON" | Erro de formatação | Use aspas duplas no JSON |
| "Session expired" | Timeout USSD | Use nova sessão ou reinicie navegador |

### **7.2 Comandos Úteis**
```bash
# Verificar portas em uso
netstat -ano | findstr :3000

# Matar processos Node.js
taskkill /f /im node.exe

# Reiniciar servidor completo
# Feche terminal atual e abra novo
```

### **7.3 Verificação de Conectividade**
```bash
# Testar conectividade com backend
curl -v http://localhost:3000/health

# Testar endpoint USSD
curl -v -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text":""}'

# Testar endpoint SMS
curl -v http://localhost:3000/api/sms/status
```

---

## 📊 **PASSO 8: MONITORAMENTO**

### **8.1 Status em Tempo Real**
```bash
# Status USSD
curl http://localhost:3000/api/ussd/status

# Status SMS
curl http://localhost:3000/api/sms/status

# Health Check completo
curl http://localhost:3000/health
```

### **8.2 Logs do Sistema**
O servidor exibe logs em tempo real:
```
📱 USSD Request: Session=demo123, Phone=+258840000000, Text="V0042"
📤 USSD Response: CON Bem-vinda, Maria! 👋
✅ Usuário autenticado: V0042
📱 Sending SMS to +258840000000: "Bem-vinda Maria ao WIRA!"
✅ SMS sent successfully! ID: 1761563525667
```

---

## 🎯 **PASSO 9: DEMONSTRAÇÃO PARA JURADOS**

### **9.1 Roteiro Sugerido (2 minutos)**

**Minuto 1: Backend API**
```bash
# Mostrar health check
curl http://localhost:3000/health

# Mostrar login USSD
curl -X POST http://localhost:3000/api/ussd/test -d '{"text":"V0042"}'
```

**Minuto 2: Frontend Interativo**
- Acessar: `http://localhost:3001/ussd-demo.html`
- Clicar "Demo Automática"
- Mostrar navegação USSD e envio automático de SMS

### **9.2 Pontos a Destacar**
1. **USSD funciona sem internet** - inclusão digital real
2. **SMS automáticos** - comunicação proativa
3. **Códigos anônimos** - V0042, V0038, V0031
4. **Frontend profissional** - demonstração clara
5. **Integração completa** - USSD ↔ SMS ↔ Dashboard

---

## 🚨 **PASSO 10: BACKUP E RECUPERAÇÃO**

### **10.1 Arquivos Importantes**
- `ussd-server.js` - Servidor principal USSD/SMS
- `ussd-demo.html` - Frontend de demonstração
- `simple-server.js` - Backend básico (backup)

### **10.2 Configurações**
- **Porta USSD:** 3000
- **Porta Frontend:** 3001
- **Timeout Sessão:** 5 minutos
- **Shortcode USSD:** *123#

### **10.3 Dados de Demo**
- **Usuários:** V0042 (Maria), V0038 (Ana), V0031 (João)
- **Cursos:** Costura, Culinária, Agricultura
- **Progresso:** Dados realistas (37%, 14%, 100%)

---

## ✅ **CHECKLIST FINAL DE FUNCIONALIDADE**

- [ ] **Servidor USSD/SMS rodando** na porta 3000
- [ ] **Frontend demonstração** acessível em 3001
- [ ] **Login USSD** funcionando com V0042
- [ ] **Navegação completa** por menus USSD
- [ ] **Envio automático de SMS** após ações USSD
- [ ] **SMS manual** enviando e recebendo
- [ ] **Health check** respondendo corretamente
- [ ] **Logs visíveis** no terminal
- [ ] **Demo automática** funcionando
- [ ] **Integração frontend-backend** operacional

---

## 🔧 **INFORMAÇÕES SOBRE MIGRAÇÃO TYPESCRIPT**

### **Arquivos Migrados**
- ✅ `src/types/ussd.ts` - Definições de tipo completas
- ✅ `src/simple-server.ts` - Servidor básico com tipagem
- ✅ `src/ussd-server.ts` - Servidor USSD completo com tipagem
- ✅ `package.json` - Scripts de build e desenvolvimento TypeScript

### **Scripts TypeScript Disponíveis**
```bash
npm run dev:ussd      # Desenvolvimento USSD Server
npm run dev:simple    # Desenvolvimento Simple Server
npm run build         # Compilar TypeScript para JavaScript
npm run start:ussd    # Executar USSD Server compilado
npm run start:simple  # Executar Simple Server compilado
npm run demo          # Build + Executar USSD Server
```

### **Vantagens da Migração**
- 🔒 **Type Safety**: Verificação de tipos em tempo de compilação
- 🛠️ **Melhor IDE**: Autocompletar e refatoração
- 📚 **Documentação**: Tipos como documentação viva
- 🔧 **Manutenibilidade**: Código mais robusto e escalável

### **Nota de Desenvolvimento**
Para apresentações e demostrações, use a versão JavaScript (`node ussd-server.js`) por ser mais simples e direta. Para desenvolvimento futuro, prefira a versão TypeScript.

---

## 🎉 **PRONTO PARA APRESENTAÇÃO!**

Se todos os itens acima estão marcados ✅, o sistema USSD/SMS WIRA está **100% funcional** e pronto para demonstração no Hackathon UNODC!

**URLs Importantes:**
- 📱 **USSD Demo:** `http://localhost:3001/ussd-demo.html`
- 📊 **Dashboard:** `http://localhost:3001`
- 🔧 **API Health:** `http://localhost:3000/health`

**Boa sorte com a apresentação!** 🚀