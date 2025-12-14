# Guia de Contribuição para o Projeto WIRA

Primeiramente, obrigado por considerar contribuir para a Plataforma WIRA! Cada contribuição ajuda a transformar vidas de vítimas de tráfico humano em Moçambique.

## Código de Conduta

Ao participar deste projeto, você concorda em seguir nosso [Código de Conduta](CODE_OF_CONDUCT.md).

## Como Posso Contribuir?

### Reportar Bugs

1. Verifique se já não existe um issue aberto sobre o mesmo problema
2. Abra um novo issue com um título claro e descrição detalhada
3. Inclua detalhes do ambiente e passos para reproduzir o problema
4. Adicione labels apropriadas

### Sugerir Melhorias

1. Verifique se a ideia já não foi sugerida
2. Abra um issue com "Feature Request" ou "Enhancement"
3. Descreva o problema que está tentando resolver
4. Explique como sua sugestão melhora a plataforma

### Código

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Faça suas alterações
4. Adicione testes para novas funcionalidades
5. Atualize documentação se necessário
6. Envie seu pull request

## Diretrizes de Desenvolvimento

### Segurança e Privacidade (Prioridade #1)

- Manuseie dados sensíveis com extrema cautela
- Nunca exponha dados pessoais nas interfaces
- Siga práticas de anonimização rigorosas
- Implemente criptografia onde apropriado
- Use mascaramento de PII em logs

### Estilo de Código

#### Backend (TypeScript)
- Siga o estilo do projeto existente
- Use tipagem rigorosa com TypeScript
- Escreva testes unitários para funções críticas
- Documente APIs com JSDoc

#### Frontend (React/TypeScript)
- Componentes reutilizáveis e bem documentados
- Use hooks de forma apropriada
- Mantenha consistência no design
- Acesseibilidade (WCAG AA) é obrigatória

#### Mobile (React Native)
- Desempenho é crítico
- Considere dispositivos de baixo custo
- Funcionalidade offline é essencial
- UX simplificada para baixa literacia digital

### Convenções de Commit

Use conventional commits:

```
feat: adicionar sistema de notificações
fix: corrigir vazamento de dados em login
docs: atualizar documentação da API
style: formatar código backend
refactor: reestruturar controller de cursos
test: adicionar testes para autenticação
chore: atualizar dependências
```

### Estrutura de Branch

- `main`: Código em produção
- `develop`: Código em desenvolvimento
- `feature/`: Novas funcionalidades
- `hotfix/`: Correções críticas
- `release/`: Preparação para lançamento

### Pull Requests

1. Descreva claramente o problema resolvido
2. Link issue relevante se existir
3. Inclua capturas de tela se aplicável
4. Certifique-se de que os testes passam
5. Peça revisão de outros colaboradores

## Ambiente de Desenvolvimento

Siga o [Guia de Setup](docs/technical/setup.md) para configurar seu ambiente local.

Execute o script de setup:
```bash
cd wira-platform\scripts
setup-dev-env.bat
```

## Considerações Especiais para o WIRA

### Sensibilidade ao Trauma
- Considere o impacto emocional das interfaces
- Evite design que possa causar estresse
- Faça testes com stakeholders relevantes

### Acessibilidade
- Baixa literacia digital é comum
- Muitas usuárias têm baixa instrução formal
- Design deve ser extremamente intuitivo
- Considere línguas locais além de português

### Contexto de Moçambique
- Conectividade pode ser limitada
- Muitos usuários têm celulares básicos
- USSD é crítico para inclusão digital
- Considerar custos de dados móveis

## Recursos para Contribuição

- [Documentação Técnica](docs/technical/)
- [Guia de Setup](docs/technical/setup.md)
- [Arquitetura do Sistema](docs/technical/architecture.md)
- [Documentação da API](docs/technical/api.md)

## Precisa de Ajuda?

- Abra um issue com sua dúvida
- Entre em contato com a equipe do projeto
- Consulte a [documentação](docs/)

---

Lembre-se: Este projeto tem como objetivo apoiar vítimas de tráfico humano. Cada contribuição é parte de um esforço maior para promover dignidade, segurança e reintegração econômica.