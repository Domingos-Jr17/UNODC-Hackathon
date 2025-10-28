import { z } from "zod";

// Schema para validação de código de usuário
export const userCodeSchema = z.object({
  code: z.string()
    .min(5, "O código deve ter no mínimo 5 caracteres.")
    .max(5, "O código deve ter no máximo 5 caracteres.")
    .regex(/^V\d{4}$/, "Formato inválido. Use V#### (ex: V0042)")
    .transform(val => val.toUpperCase().trim())
});

// Schema para ativação de usuário
export const activateUserSchema = z.object({
  realName: z.string()
    .min(2, "Nome deve ter no mínimo 2 caracteres.")
    .max(100, "Nome deve ter no máximo 100 caracteres.")
    .regex(/^[a-zA-Z\sÀ-ÿ]+$/, "Nome deve conter apenas letras e espaços.")
    .transform(val => val.trim()),

  ngoId: z.string()
    .min(3, "ID da ONG é obrigatório.")
    .max(20, "ID da ONG deve ter no máximo 20 caracteres.")
    .regex(/^[A-Z0-9-]+$/, "ID da ONG deve conter apenas letras maiúsculas, números e hífens.")
    .transform(val => val.toUpperCase().trim()),

  dateOfBirth: z.string()
    .min(6, "Data de nascimento é obrigatória.")
    .regex(/^\d{2}\/\d{2}\/\d{2}$/, "Formato inválido. Use DD/MM/AA")
    .transform(val => val.trim()),

  initialSkills: z.string()
    .max(500, "Habilidades devem ter no máximo 500 caracteres.")
    .transform(val => val.trim())
    .optional()
    .or(z.literal(""))
});

// Schema para filtros de monitoramento
export const monitorFilterSchema = z.object({
  status: z.enum(['all', 'Ativo', 'Inativo'])
});

// Funções de sanitização
export const sanitizeInput = {
  // Remove caracteres perigosos para prevenir XSS
  text: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();
  },

  // Sanitiza nomes (remove caracteres especiais exceto espaços e acentos)
  name: (input: string): string => {
    return input
      .replace(/[^a-zA-Z\sÀ-ÿ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  },

  // Sanitiza códigos (mantém apenas formato V####)
  code: (input: string): string => {
    return input
      .toUpperCase()
      .replace(/[^V\d]/g, "")
      .substring(0, 5);
  },

  // Sanitiza IDs (remove caracteres especiais)
  id: (input: string): string => {
    return input
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .trim();
  }
};

// Função de validação de data
export const validateDate = (dateString: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [day, month, year] = dateString.split('/').map(Number);
  const fullYear = 2000 + year; // Assumir século 21 para anos de 2 dígitos

  const date = new Date(fullYear, month - 1, day);
  return (
    date.getFullYear() === fullYear &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date >= new Date(1900, 0, 1) &&
    date <= new Date()
  );
};

// Tipos exportados
export type ActivateUserFormData = z.infer<typeof activateUserSchema>;
export type UserCodeFormData = z.infer<typeof userCodeSchema>;
export type MonitorFilterData = z.infer<typeof monitorFilterSchema>;