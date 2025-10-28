import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  email: z.string().email("Digite um email válido."),
  password: z.string().min(4, {
    message: "A senha deve ter no mínimo 4 caracteres.",
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async () => {
    navigate("/dashboard");
  }

  const { register, handleSubmit: rhfHandleSubmit, formState } = form;
  const { errors, isSubmitting, isValid } = formState;


return (
  <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className='flex justify-center' >WIRA</CardTitle>
        <CardDescription>
          Insira os seus dados do email e senha para acessar a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={rhfHandleSubmit(handleSubmit)} className='space-y-6'>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{String(errors.email.message)}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu a senha
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600">{String(errors.password.message)}</p>
              )}
            </div>
          </div>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
