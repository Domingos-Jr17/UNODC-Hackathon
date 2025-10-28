import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Digite um email válido."),
  password: z.string().min(3, {
    message: "A senha deve ter no mínimo 4 caracteres.",
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<{ email: string; password: string; }> = () => {
   
    navigate("/dashboard");
  }

  return (
    
      <div className=" items-center p-8 border border-gray-200 rounded-2xl flex mx-auto shadow-lg text-center bg-white w-full max-w-md">
       
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="email"
                      aria-invalid={!!fieldState.error}
                      placeholder="Digite seu email"
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldState.error ? 'border border-red-500' : 'border border-gray-300'
                      }`}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      type="password"
                      aria-invalid={!!fieldState.error}
                      placeholder="Digite sua senha"
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldState.error ? 'border border-red-500' : 'border border-gray-300'
                      }`}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                  
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            <div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>
        </Form>
      </div>


  );
}
