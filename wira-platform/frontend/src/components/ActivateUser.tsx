"use client"
import React, { useState, useCallback } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { PersonAdd, Check } from '@mui/icons-material';
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
        <Box sx={{ bgcolor: '#e6f6ff', minHeight: '100vh' }}>
            {/* renderizar Toaster para os toasts */}
            <Toaster position="top-right" />
            <>
            <div className="w-full h-auto flex justify-end p-4 border-black">
  <div className="flex gap-20">
    <button
      onClick={() => (window.location.href = "/login")}
      className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
    >
      Sair
    </button>

    <button
      onClick={() => (window.location.href = "/dashboard")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    >
      Voltar ao Dashboard
    </button>
  </div>
</div>

                <Box sx={(theme) => ({ p: 3,  ml:25 })}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Ativar Novo Usuário
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 10}}>
                        <Box>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Informações do Usuário
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Nome Completo"
                                            value={formData.realName}
                                            onChange={handleInputChange('realName')}
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Data de Nascimento"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange('dateOfBirth')}
                                            variant="outlined"
                                            placeholder='DD/MM/AA'
                                        />
                                       
                                       
                                    </Box>
                            

                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="ONG de Acolhimento"
                                            value={formData.ngoId}
                                            onChange={handleInputChange('ngoId')}
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Habilidades Iniciais"
                                            value={formData.initialSkills}
                                            onChange={handleInputChange('initialSkills')}
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                               
                        </Box>

                        <Box>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Gerar Código de Acesso
                                    </Typography>

                                    {/* botão mostra spinner enquanto loading */}
									<Button
										fullWidth
										variant="contained"
										color="primary"
										startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd />}
										onClick={handleGenerateCode}
										disabled={loading}
										sx={{ mb: 2 }}
									>
										Gerar Código
									</Button>

                                    {generatedCode && (
                                 <Box sx={(theme) => ({ p: 2, bgcolor: theme.palette.success.light, borderRadius: 1, mt: 2 })}>
                                            <Typography variant="body2" sx={(theme) => ({ color: theme.palette.success.contrastText })}>
                                                Código Gerado:
                                            </Typography>
                                            <Typography variant="h5" sx={(theme) => ({ color: theme.palette.success.dark })}>
                                                {generatedCode}
                                            </Typography>
                                            <Typography variant="body2" sx={(theme) => ({ color: theme.palette.success.contrastText, mt: 1 })}>
                                                Guarde este código para o usuário. Ele será necessário para acessar o aplicativo.
                                            </Typography>
                                        </Box>
                                    )}
     
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<Check />}
                                        onClick={handleSendSMS}
                                        disabled={!generatedCode}
                                    >
                                        Enviar Código por SMS
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                            O usuário receberá um código anônimo para acessar o aplicativo WIRA.
                            Seu nome real nunca será exposto.
                        </Typography>
                    </Box>
                </Box>
        </>
        </Box>
    );
}