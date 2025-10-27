import React, { useState, useCallback } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { PersonAdd, Check } from '@mui/icons-material';


interface FormData {
    realName: string;
    ngoId: string;
    initialSkills: string;
}

export default function ActivateUser() {
    const [formData, setFormData] = useState<FormData>({
        realName: '',
        ngoId: '',
        initialSkills: ''
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
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);

        // Simular geração de código
        setTimeout(() => {
            const newCode = 'V' + Math.floor(Math.random() * 9000 + 1000);
            setGeneratedCode(newCode);
            setLoading(false);

            alert(`Código gerado: ${newCode}\n\nUsuário ativado com sucesso!`);
        }, 1000);
    }, [formData]);

    const handleSendSMS = useCallback(() => {
        if (!generatedCode) {
            alert('Gere um código primeiro');
            return;
        }

        // Simular envio de SMS
        alert(`SMS enviado para o usuário com código: ${generatedCode}`);
    }, [generatedCode]);

    return (
        <Box sx={(theme) => ({ p: 3, bgcolor: theme.palette.background.default, minHeight: '100vh' })}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ativar Novo Usuário
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
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

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<PersonAdd />}
                                onClick={handleGenerateCode}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                {loading ? 'Gerando...' : 'Gerar Código Anônimo'}
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
                    O usuário receberá um código anônimo (ex: V0042) para acessar o aplicativo WIRA.
                    Seu nome real nunca será exposto.
                </Typography>
            </Box>
        </Box>
    );
}