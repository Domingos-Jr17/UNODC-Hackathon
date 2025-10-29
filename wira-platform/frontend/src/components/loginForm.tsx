import { useNavigate, useLocation } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from '../contexts/AuthContext';
import { userCodeSchema, sanitizeInput } from '../lib/schemas';
import { announceToScreenReader } from '../lib/accessibility';
import { UserCodeFormData } from '../lib/schemas';

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(userCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit: SubmitHandler<UserCodeFormData> = async (data) => {
    // Sanitizar input antes de enviar
    const sanitizedCode = sanitizeInput.code(data.code);

    // Anunciar para leitores de tela
    announceToScreenReader('Autenticando usuário, por favor aguarde...', 'assertive');

    const success = await login(sanitizedCode);
    if (success) {
      announceToScreenReader('Login realizado com sucesso, redirecionando...', 'polite');
      navigate(from, { replace: true });
    } else {
      announceToScreenReader('Falha na autenticação, verifique seu código', 'assertive');
    }
  };

  const { register, handleSubmit: rhfHandleSubmit, formState } = form;
  const { errors, isSubmitting, isValid } = formState;


return (
  <Card className="w-full max-w-md" role="main" aria-labelledby="login-title">
      <CardHeader>
        <CardTitle
          id="login-title"
          className='flex justify-center'
        >
          WIRA
        </CardTitle>
        <CardDescription>
          Insira seu código de acesso anônimo para entrar na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={rhfHandleSubmit(handleSubmit)}
          className='space-y-6'
          noValidate
          aria-label="Formulário de login"
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="code" id="code-label">
                Código de Acesso
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="V0042"
                aria-labelledby="code-label"
                aria-describedby={errors.code ? "code-error" : "code-help"}
                aria-invalid={errors.code ? "true" : "false"}
                aria-required="true"
                maxLength={5}
                autoComplete="off"
                {...register("code")}
              />
              {errors.code && (
                <p
                  id="code-error"
                  className="text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {String(errors.code.message)}
                </p>
              )}
              <p
                id="code-help"
                className="text-xs text-muted-foreground"
                aria-live="polite"
              >
                Códigos válidos para demonstração: V0042, V0038, V0031
              </p>
            </div>
          </div>

          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isValid}
              aria-describedby={isSubmitting ? "submit-status" : undefined}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
            {isSubmitting && (
              <span
                id="submit-status"
                className="sr-only"
                aria-live="polite"
              >
                Processando login, aguarde...
              </span>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
