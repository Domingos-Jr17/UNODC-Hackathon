# 📱 Sistema USSD WIRA - Documentação Completa

## 🎯 Visão Geral

O Sistema USSD da WIRA permite que vítimas de tráfico de pessoas acessem a plataforma educacional através de telefones básicos, sem necessidade de internet. Esta inclusão digital garante que todas as beneficiárias possam ter acesso à capacitação profissional, independentemente de seu dispositivo ou localização.

---

## 🏗️ Arquitetura Técnica

### **Componentes Implementados**

1. **Backend USSD** ([`ussd.routes.js`](backend/src/routes/ussd.routes.js))
   - Máquina de estados para navegação
   - Gerenciamento de sessões em memória
   - Validação de códigos de acesso
   - Integração com banco de dados SQLite

2. **API Endpoints**
   - `POST /api/ussd` - Endpoint principal para operadoras
   - `POST /api/ussd/test` - Endpoint para testes locais
   - `GET /api/ussd/status` - Status do serviço

3. **Sessões**
   - Timeout de 5 minutos de inatividade
   - Armazenamento temporário de estado
   - Limpeza automática de sessões expiradas

---

## 📋 Fluxos de Navegação USSD

### **Fluxo 1: Login e Acesso**

```
1. Usuária disca *123#
2. Sistema responde:
   CON Bem-vinda a WIRA - Women's Integrated Reintegration Academy

   Digite seu código de acesso (ex: V0042):

3. Usuária digita: V0042
4. Sistema valida e responde:
   CON Bem-vinda, V0042!

   Como podemos ajudar?
   1. Meus Cursos
   2. Meu Progresso
   3. Ajuda
   4. Sair
```

### **Fluxo 2: Consulta de Cursos**

```
SELECIONADO: 1. Meus Cursos

CON SEUS CURSOS:

1. Costura - Uniformes Escolares
   Progresso: 37% completo

2. Culinária Profissional
   Progresso: Novo

3. Agricultura Sustentável
   Progresso: 15% completo

0. Voltar ao menu principal
```

### **Fluxo 3: Detalhes do Curso**

```
SELECIONADO: 1. Costura

CON Costura - Uniformes Escolares

Progresso: 37% completo
Módulos: 8/8
Duração: 40 horas

Opções:
1. Continuar curso
2. Ver certificado
0. Voltar
```

### **Fluxo 4: Progresso Geral**

```
SELECIONADO: 2. Meu Progresso

CON PROGRESSO GERAL - V0042

Cursos Ativos: 3
Módulos Completos: 12/24
Horas de Estudo: 127
Última Atividade: Hoje

Estatísticas:
• Costura: 37% completo
• Culinária: Novo
• Agricultura: 15% completo

0. Voltar ao menu
```

### **Fluxo 5: Menu de Ajuda**

```
SELECIONADO: 3. Ajuda

CON WIRA - CENTRAL DE AJUDA

Estamos aqui para ajudar!

Códigos de Acesso:
• Formato: V#### (ex: V0042)
• Fornecido pela sua ONG

Suporte:
• Telefone: +258 84 123 4567
• WhatsApp: +258 84 123 4567
• Email: ajuda@wira.org

Horário: Seg-Sex, 8h-17h

0. Voltar ao menu principal
```

---

## 🔧 Configuração e Instalação

### **Pré-requisitos**
- Node.js 14+
- Banco de dados SQLite
- Porta 3000 disponível

### **Instalação**

```bash
# 1. Navegar para o diretório do backend
cd wira-platform/backend

# 2. Instalar dependências
npm install

# 3. Iniciar servidor
npm run dev

# Servidor rodará em: http://localhost:3000
```

### **Endpoints USSD**

```bash
# Status do serviço
GET http://localhost:3000/api/ussd/status

# Endpoint principal operadora
POST http://localhost:3000/api/ussd
Content-Type: application/json

{
  "sessionId": "session_123",
  "serviceCode": "*123#",
  "phoneNumber": "+258840000000",
  "text": "V0042*1*1"
}

# Endpoint de teste
POST http://localhost:3000/api/ussd/test
Content-Type: application/json

{
  "phoneNumber": "+258840000000",
  "text": "V0042"
}
```

---

## 🧪 Testes e Simulação

### **Teste Local com cURL**

```bash
# 1. Teste inicial (bem-vindo)
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'

# 2. Teste login com código
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042"}'

# 3. Teste navegação para cursos
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042*1"}'

# 4. Teste detalhes do curso
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042*1*1"}'
```

### **Teste com Postman**

1. **Criar requisição POST** para `http://localhost:3000/api/ussd/test`
2. **Headers**: `Content-Type: application/json`
3. **Body (JSON)**:
   ```json
   {
     "phoneNumber": "+258840000000",
     "text": "V0042"
   }
   ```

### **Simulação Completa**

```bash
# Sequência completa de testes
#!/bin/bash

BASE_URL="http://localhost:3000/api/ussd/test"

echo "🧪 TESTE USSD WIRA - Sequência Completa"
echo "====================================="

# Teste 1: Bem-vindo
echo -e "\n1. Tela inicial..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"text": ""}' | head -1

# Teste 2: Login
echo -e "\n2. Login com código V0042..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042"}' | head -1

# Teste 3: Menu principal
echo -e "\n3. Menu principal..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042"}' | head -1

echo -e "\n✅ Testes completos!"
```

---

## 🌐 Integração com Operadoras

### **Formato Padrão USSD**

```json
{
  "sessionId": "unique_session_id",
  "serviceCode": "*123#",
  "phoneNumber": "+25884XXXXXXX",
  "text": "user_input_sequence"
}
```

### **Resposta Esperada**

```
CON Menu interativo (Continuation)
END Mensagem final (Termination)
```

### **Configuração Operadora**

Para integrar com operadoras móveis em Moçambique:

1. **mCel**: Configurar webhook para `https://api.wira.org/ussd`
2. **Vodacom**: Implementar callback URL
3. **Tmcel**: Registrar endpoint USSD

**Exemplo de configuração:**
```javascript
const ussdConfig = {
  shortcode: "*123#",
  endpoint: "https://api.wira.org/api/ussd",
  method: "POST",
  timeout: 30000,
  retries: 3
};
```

---

## 🔒 Segurança e Validação

### **Implementado**
- ✅ **Validação de códigos**: Formato V#### obrigatório
- ✅ **Timeout de sessão**: 5 minutos inatividade
- ✅ **Rate limiting**: Prevenção contra abuso
- ✅ **Sanitização de input**: Limpeza de dados
- ✅ **Logging**: Auditoria de acessos

### **Códigos de Acesso Demo**
- **V0042**: Maria Silva - Costura (37% completo)
- **V0038**: Ana Machel - Culinária (Novo)
- **V0031**: João Sitoe - Agricultura (15% completo)

---

## 📊 Monitoramento e Debug

### **Logs de Sistema**

```bash
# Ver logs do servidor
npm run dev

# Logs USSD aparecem como:
📱 USSD Request: Session=session_123, Phone=+258840000000, Text="V0042"
📤 USSD Response: CON Bem-vinda a WIRA...
✅ Usuário autenticado: V0042
🗑️ Sessão expirada: session_456
```

### **Status do Serviço**

```bash
# Verificar status
curl http://localhost:3000/api/ussd/status

# Resposta esperada:
{
  "service": "WIRA USSD Service",
  "status": "Online",
  "activeSessions": 3,
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Health Check Completo**

```bash
curl http://localhost:3000/health

# Inclui status USSD:
{
  "status": "OK",
  "services": {
    "api": "online",
    "ussd": "online",
    "database": "connected"
  }
}
```

---

## 🚀 Deploy em Produção

### **Variáveis de Ambiente**

```env
# Configuração USSD
USSD_SHORTCODE=*123#
USSD_TIMEOUT=300000
USSD_MAX_SESSIONS=1000

# Segurança
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://wira.org

# Monitoramento
LOG_LEVEL=info
METRICS_ENABLED=true
```

### **Docker Configuração**

```dockerfile
# Dockerfile para serviço USSD
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### **Nginx Proxy**

```nginx
# nginx.conf para USSD
server {
    listen 80;
    server_name ussd.wira.org;

    location /api/ussd {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
    }
}
```

---

## 📈 Métricas e KPIs

### **Métricas de Uso**
- **Sessões ativas**: Número de usuárias conectadas
- **Taxa de conclusão**: % de cursos finalizados via USSD
- **Tempo médio de sessão**: Duração das interações
- **Taxa de abandono**: % de sessões não concluídas

### **KPIs Esperados**
- **Acessibilidade**: +95% cobertura em áreas rurais
- **Engajamento**: 70% de usuárias ativas semanais
- **Conclusão**: 60% taxa de conclusão de cursos
- **Satisfação**: >4.5/5 nas avaliações

---

## 🆘 Suporte e Troubleshooting

### **Problemas Comuns**

| Problema | Causa | Solução |
|----------|-------|---------|
| "Serviço indisponível" | Servidor offline | Reiniciar backend |
| "Código inválido" | Formato errado | Usar V#### |
| "Sessão expirada" | Timeout | Reiniciar navegação |
| "Sem resposta" | Rede lenta | Verificar conectividade |

### **Comandos Úteis**

```bash
# Verificar se servidor está rodando
ps aux | grep node

# Verificar porta ocupada
netstat -tlnp | grep :3000

# Testar conectividade
telnet localhost 3000

# Verificar logs em tempo real
tail -f /var/log/wira/ussd.log
```

### **Contato de Suporte**

- **Technical**: tech@wira.org
- **Operadoras**: operators@wira.org
- **Emergency**: +258 84 123 4567

---

## 🔄 Roadmap Futuro

### **V1.1 (3 meses)**
- 🔄 Integração com M-Pesa para certificados
- 🔄 Sistema offline com SMS
- 🔄 Suporte multilingue (Emakhuwa, Xichangana)
- 🔄 Analytics avançado

### **V2.0 (6 meses)**
- 🔄 IA para recomendações personalizadas
- 🔄 Voz (IVR) complementar ao USSD
- 🔄 Integração WhatsApp Business
- 🔄 Dashboard USSD Analytics

---

## 📚 Referências

- **USSD Guidelines**: GSMA USSD Best Practices
- **Security**: OWASP Mobile Security
- **Accessibility**: UN Digital Inclusion Standards
- **Privacy**: GDPR Compliant USSD Implementation

---

**Sistema USSD WIRA** - Inclusão digital através de tecnologia acessível e empoderadora.

*Desenvolvido com ❤️ para vítimas de tráfico de pessoas em Moçambique*