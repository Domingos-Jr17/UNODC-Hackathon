"use client"
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TypographyH1, TypographyH4, TypographySmall, TypographyMuted } from '@/components/ui/typography';
import { Spinner } from '@/components/ui/spinner';
import { UserPlus, Check } from 'lucide-react';
import { toast, Toaster } from "sonner";



interface FormData {
    realName: string;
    ngoId: string;
    initialSkills: string;
    dateOfBirth:string
}

export default function ActivateUser() {
    const [formData, setFormData] = useState<FormData>({
        realName: '',
        ngoId: '',
        initialSkills: '',
        dateOfBirth: ''

    });

    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = useCallback((field: keyof FormData) => 
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value
            }));
    }, []);

    const handleGenerateCode = useCallback(() => {
        if (!formData.realName || !formData.ngoId) {
            toast.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);
        const id = toast.loading('Gerando código...');

        // Simular geração de código
        setTimeout(() => {
            const newCode = 'V' + Math.floor(Math.random() * 9000 + 1000);
            setGeneratedCode(newCode);
            setLoading(false);

            toast.dismiss(id);
           
            toast.success(`Código gerado com sucesso: ${newCode}`);
        }, 1000);
    }, [formData]);

    const handleSendSMS = useCallback(() => {
        if (!generatedCode) {
            toast.error('Gere um código primeiro');
            return;
        }

        const id = toast.loading('Enviando SMS...');
        // Simular envio de SMS
        setTimeout(() => {
            toast.dismiss(id);
            toast.success('Código enviado com sucesso');
        }, 800);
    }, [generatedCode]); 

    return (
        <div className="bg-blue-50 min-h-screen">
            {/* renderizar Toaster para os toasts */}
            <Toaster position="top-right" />
            <>
            <div className="w-full h-auto flex justify-end p-4">
  <div className="flex gap-4">
    <Button
    
      onClick={() => (window.location.href = "/login")}
    >
      Sair
    </Button>

    <Button
      onClick={() => (window.location.href = "/dashboard")}
      className='bg-white text-black'
    >
      Voltar ao Dashboard
    </Button>
  </div>
</div>

                <div className="p-6 ml-24">
                    <TypographyH1 className="mb-6">
                        Ativar Novo Usuário
                    </TypographyH1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <Card>
                                <CardContent>
                                    <TypographyH4 className="mb-4">
                                        Informações do Usuário
                                    </TypographyH4>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="realName">Nome Completo</Label>
                                            <Input
                                                id="realName"
                                                required
                                                value={formData.realName}
                                                onChange={handleInputChange('realName')}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                                            <Input
                                                id="dateOfBirth"
                                                required
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange('dateOfBirth')}
                                                placeholder='DD/MM/AA'
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="ngoId">ONG de Acolhimento</Label>
                                            <Input
                                                id="ngoId"
                                                required
                                                value={formData.ngoId}
                                                onChange={handleInputChange('ngoId')}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="initialSkills">Habilidades Iniciais</Label>
                                            <textarea
                                                id="initialSkills"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.initialSkills}
                                                onChange={handleInputChange('initialSkills')}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        <div>
                            <Card>
                                <CardContent>
                                    <TypographyH4 className="mb-4">
                                        Gerar Código de Acesso
                                    </TypographyH4>

                                    {/* botão mostra spinner enquanto loading */}
                                    <Button
                                        className="w-full mb-4"
                                        onClick={handleGenerateCode}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" className="mr-2" />
                                                Gerando Código...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Gerar Código
                                            </>
                                        )}
                                    </Button>

                                    {generatedCode && (
                                        <div className="p-4 bg-green-100 border border-green-200 rounded-lg mt-4">
                                            <TypographySmall className="text-green-800">
                                                Código Gerado:
                                            </TypographySmall>
                                            <TypographyH4 className="text-green-900">
                                                {generatedCode}
                                            </TypographyH4>
                                            <TypographySmall className="text-green-800 mt-2">
                                                Guarde este código para o usuário. Ele será necessário para acessar o aplicativo.
                                            </TypographySmall>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleSendSMS}
                                        disabled={!generatedCode}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Enviar Código por SMS
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <TypographyMuted>
                            O usuário receberá um código anônimo para acessar o aplicativo WIRA.
                            Seu nome real nunca será exposto.
                        </TypographyMuted>
                    </div>
                </div>
        </>
        </div>
    );
}