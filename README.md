# WIRA Platform - MVP
> A Universidade Digital que Empodera Sobreviventes

Plataforma híbrida para capacitação e reintegração econômica de vítimas de tráfico humano em Moçambique, acessível via app e USSD.

## 🛠️ Tech Stack

- **Mobile App**: React Native + Expo
- **Frontend (Web)**: React + TypeScript + Tailwind CSS  
- **Backend**: Node.js + Express + TypeScript
- **USSD/SMS**: Africa's Talking API
- **Dados**: JSON local (MVP) / Supabase (futuro)

## 👥 Divisão de Tarefas

| Membro | Responsabilidades |
|--------|------------------|
| **Isa** | Frontend Web + Integração |
| **Domingos** | USSD + Backend + Mobile App |
| **Esperança** | Integração + Backend |

## 🌟 Features MVP

### Mobile App
- [x] Login com códigos anônimos (V0042)
- [x] Biblioteca de cursos (costura, culinária, agricultura)
- [x] Videoaulas offline
- [x] Quizzes interativos
- [x] Certificados digitais com QR
- [x] Progresso visual

### Web Dashboard
- [x] Registro de novos códigos
- [x] Monitoramento de progresso
- [x] Estatísticas de uso

### USSD Integration
- [x] Acesso via *130# 
- [x] Menu texto: cursos, progresso, certificados
- [x] SMS notificações

## 📋 Features por Pessoa

### **Isa**
- Web Dashboard: Login e autenticação
- Web Dashboard: Registro de códigos
- Web Dashboard: Monitoramento de progresso
- Integração: Frontend-Backend
- Integração: Dashboard-Mobile (sincronização)

### **Domingos**
- Mobile App: Navegação e UI
- Mobile App: Login e autenticação
- Mobile App: Biblioteca de cursos
- Mobile App: Videoaulas offline
- Mobile App: Quizzes e certificação
- USSD: Menu principal e navegação
- USSD: Acesso a cursos via texto
- USSD: Progresso via SMS
- Backend: API endpoints
- Backend: Autenticação
- Backend: Gerenciamento de dados

### **Esperança**
- Backend: API endpoints
- Backend: Autenticação
- Backend: Gerenciamento de dados
- Integração: Mobile-Backend (API)
- Integração: Dashboard-Backend (API)
- Integração: USSD-Backend (API)
- Integração: Sincronização de dados

## 🚀 Como Executar

### Mobile App
```bash
cd mobile-app
npm install
npx expo start
```

### Web Dashboard
```bash
cd dashboard
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### USSD Service
```bash
# Configurado via Africa's Talking Dashboard
# Endpoint: /ussd
```

## 📊 Impacto Esperado

- 500 sobreviventes capacitadas em 12 meses
- 60% de taxa de conclusão
- 60% com emprego formal após certificação

## 📞 Contato

Equipa WIRA - Hackathon UNODC Moçambique 2025
