# Documentação da API da Plataforma WIRA

## Visão Geral

A API da plataforma WIRA fornece endpoints para gerenciamento de beneficiárias, cursos, progresso e certificados. A API utiliza autenticação baseada em JWT e prioriza a privacidade e segurança dos dados das beneficiárias.

## Convenções da API

- **Formato de resposta**: JSON
- **Codificação**: UTF-8
- **Autenticação**: JWT via cabeçalho `Authorization: Bearer <token>`
- **Códigos de status**: Seguindo convenções HTTP
- **Campos**: Utilizando camelCase
- **Códigos de Beneficiárias**: Formato V#### (ex: V0042)

## Autenticação

### Login com Código Anônimo
```
POST /api/auth/login
Content-Type: application/json

{
  "code": "V0042"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "user": {
    "anonymousCode": "V0042",
    "role": "VICTIM"
  }
}
```

## Endpoints

### Autenticação
#### POST /api/auth/login
Autentica uma beneficiária com código anônimo.

**Parâmetros:**
- `code` (string, obrigatório): Código de acesso no formato V####

#### POST /api/auth/validate
Valida um token JWT existente.

**Headers:**
- `Authorization: Bearer <token>`

### Cursos
#### GET /api/courses
Lista todos os cursos ativos.

**Resposta:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "costura-001",
      "title": "Costura Profissional",
      "description": "Curso completo de costura",
      "duration_hours": 40,
      "modules_count": 8
    }
  ]
}
```

#### GET /api/courses/:id
Obtém detalhes de um curso específico.

#### GET /api/courses/:id/modules
Lista os módulos de um curso.

#### GET /api/courses/:id/quiz
Obtém o quiz de um curso.

### Progresso
#### GET /api/progress/user/:userCode/course/:courseId
Obtém o progresso de uma beneficiária em um curso específico.

**Headers:**
- `Authorization: Bearer <token>`

#### PUT /api/progress/user/:userCode/course/:courseId
Atualiza o progresso de uma beneficiária em um curso.

**Parâmetros:**
- `completed_modules` (array): Lista de módulos completados
- `current_module` (integer): Módulo atual
- `percentage` (integer): Porcentagem de conclusão

### Certificados
#### POST /api/certificates/generate
Gera um certificado para uma beneficiária que completou um curso.

**Parâmetros:**
- `anonymousCode` (string): Código da beneficiária
- `courseId` (string): ID do curso
- `score` (integer): Pontuação obtida (0-100)

#### GET /api/certificates/verify/:verificationCode
Verifica a autenticidade de um certificado.

#### GET /api/certificates/user/:anonymousCode/course/:courseId
Obtém o certificado de uma beneficiária para um curso específico.

### ONGs
#### GET /api/ngos
Lista todas as ONGs parceiras (requer autenticação de administrador).

#### GET /api/ngos/:id
Obtém detalhes de uma ONG específica.

#### POST /api/ngos
Cria uma nova ONG (requer autenticação de administrador).

### Logs de Auditoria
#### GET /api/audit-logs
Lista os logs de auditoria (requer autenticação de administrador).

#### GET /api/audit-logs/user/:userCode
Obtém logs de auditoria para uma beneficiária específica.

### USSD
#### POST /api/ussd
Processa requisições USSD provenientes de operadoras móveis.

**Parâmetros:**
- `sessionId` (string): ID da sessão USSD
- `serviceCode` (string): Código do serviço USSD
- `phoneNumber` (string): Número de telefone do usuário
- `text` (string): Texto digitado pelo usuário

#### POST /api/ussd/test
Endpoint para testar funcionalidades USSD.

#### GET /api/ussd/status
Obtém o status do serviço USSD.

#### POST /api/sms/send
Envia uma mensagem SMS (simulação para demonstração).

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Requisição inválida
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Não autorizado para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `429 Too Many Requests`: Limite de requisições excedido
- `500 Internal Server Error`: Erro interno do servidor

## Segurança

### Validação de Entrada
Todos os endpoints realizam validação rigorosa de entrada:
- Formato do código de beneficiária (V####)
- Limites para pontuações (0-100)
- Validação de IDs existentes
- Sanitização de dados

### Limitação de Taxa
- Geral: 100 requisições por 15 minutos por IP
- Autenticação: 5 tentativas por 15 minutos por IP
- USSD: 20 requisições por 5 minutos por número

### Criptografia
- Dados em trânsito: HTTPS/TLS
- Dados sensíveis: Criptografia AES-256 (em implementação)
- Senhas: Hash bcrypt

## Exemplos de Uso

### Consultando Progresso de uma Beneficiária
```
GET /api/progress/user/V0042/course/costura-001
Authorization: Bearer <token_valido>
```

### Gerando um Certificado
```
POST /api/certificates/generate
Authorization: Bearer <token_valido>
Content-Type: application/json

{
  "anonymousCode": "V0042",
  "courseId": "costura-001",
  "score": 85
}
```

## Tratamento de Erros

Todos os endpoints retornam erros no formato:
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva",
  "details": "Informações adicionais (opcional)"
}
```

## Considerações de Privacidade

- Nenhuma informação pessoalmente identificável é exposta via API pública
- Dados sensíveis são acessados apenas por pessoal autorizado
- Todos os acessos são registrados para auditoria
- Tokens têm tempo de expiração limitado