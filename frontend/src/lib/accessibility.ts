// Utilitários para acessibilidade

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remover após anúncio
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const generateAriaLabel = (action: string, object?: string, context?: string) => {
  const parts = [action];
  if (object) parts.push(object);
  if (context) parts.push(context);
  return parts.join(' ');
};

export const getKeyboardNavigationInstructions = (elementType: 'button' | 'link' | 'input' | 'table') => {
  const instructions = {
    button: 'Press Enter or Space to activate',
    link: 'Press Enter to navigate',
    input: 'Type to enter text',
    table: 'Use arrow keys to navigate cells, Enter to select'
  };
  return instructions[elementType];
};

export const setFocusToElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
    return true;
  }
  return false;
};

// Verificar contraste de cores (básico)
export const checkColorContrast = (foreground: string, background: string): number => {
  // Função simples para calcular contraste (em produção, usar biblioteca como 'color-contrast')
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Gerar IDs únicos para ARIA
export const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Mapeamento de roles para elementos
export const getAriaRole = (elementType: string) => {
  const roleMap: Record<string, string> = {
    button: 'button',
    link: 'link',
    input: 'textbox',
    checkbox: 'checkbox',
    radio: 'radio',
    select: 'combobox',
    table: 'table',
    'table-row': 'row',
    'table-cell': 'cell',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo'
  };
  return roleMap[elementType];
};