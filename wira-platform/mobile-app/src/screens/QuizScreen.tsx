import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function QuizScreen({ route, navigation }) {
    const { courseId, moduleId } = route.params;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const quizData = {
        costura: {
            questions: [
                {
                    id: 1,
                    question: 'Qual é o primeiro passo ao costurar um bolso?',
                    options: [
                        'Cortar o tecido',
                        'Preparar o acabamento das bordas',
                        'Costurar diretamente na peça',
                        'Medir e marcar a posição'
                    ],
                    correctAnswer: 3,
                    explanation: 'Antes de costurar, é essencial medir e marcar a posição exata do bolso na peça para garantir alinhamento.'
                },
                {
                    id: 2,
                    question: 'Qual máquina industrial é mais adequada para produção de uniformes escolares?',
                    options: [
                        'Máquina reta',
                        'Máquina overlock',
                        'Máquina zig-zag',
                        'Máquina industrial plana'
                    ],
                    correctAnswer: 3,
                    explanation: 'Máquinas industriais planas são ideais para produção em massa de uniformes, pois oferecem maior velocidade e consistência.'
                },
                {
                    id: 3,
                    question: 'Qual é a função da agulha dupla em uma máquina industrial?',
                    options: [
                        'Criar pontos decorativos',
                        'Fazer costura reforçada',
                        'Costurar duas camadas de tecido simultaneamente',
                        'Permitir costura mais rápida em tecidos espessos'
                    ],
                    correctAnswer: 3,
                    explanation: 'A agulha dupla permite costurar duas camadas simultaneamente, aumentando a produtividade em tecidos espessos.'
                },
                {
                    id: 4,
                    question: 'Como deve ser a tensão da linha na máquina industrial?',
                    options: [
                        'A mais alta possível',
                        'A mais baixa possível',
                        'A recomendada pelo fabricante',
                        'Ajustada conforme o tecido'
                    ],
                    correctAnswer: 3,
                    explanation: 'A tensão deve ser ajustada conforme o tipo de tecido. Tecidos finos exigem tensão menor, enquanto tecidos espessos exigem tensão maior.'
                },
                {
                    id: 5,
                    question: 'Qual é a finalidade do ponto de arremate?',
                    options: [
                        'Decorar a peça',
                        'Fortalecer a costura',
                        'Evitar desfiamento',
                        'Todas as anteriores'
                    ],
                    correctAnswer: 4,
                    explanation: 'O ponto de arremate tem múltiplas finalidades: decorar, fortalecer e evitar desfiamento.'
                }
            ]
        }
    };

    const courseQuiz = quizData[courseId] || quizData.costura;
    const questions = courseQuiz.questions;

    const handleAnswerSelect = (questionId, answerIndex) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[questionId] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleSubmit = () => {
        let correctAnswers = 0;

        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const finalScore = Math.round((correctAnswers / questions.length) * 100);
        setScore(finalScore);
        setShowResults(true);

        if (finalScore >= 70) {
            Alert.alert(
                'Parabéns!',
                `Você acertou ${correctAnswers} de ${questions.length} perguntas (${finalScore}%). Módulo concluído com sucesso!`,
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        } else {
            Alert.alert(
                'Continue Estudando',
                `Você acertou ${correctAnswers} de ${questions.length} perguntas (${finalScore}%). Estude mais e tente novamente.`,
                [
                    { text: 'OK', onPress: () => setShowResults(false) }
                ]
            );
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setScore(0);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backButton}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Quiz - Módulo {moduleId}</Text>
            </View>

            {!showResults ? (
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Pergunta {currentQuestion + 1} de {questions.length}
            </Text>
            <View style={styles.progressIndicator}>
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index <= currentQuestion && styles.progressDotActive
                  ]}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {questions[currentQuestion].question}
            </Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion] === index && styles.optionButtonSelected
                ]}
                onPress={() => handleAnswerSelect(currentQuestion, index)}
              >
                <Text style={styles.optionText}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.navigationContainer}>
          {currentQuestion > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <Text style={styles.navigationButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}
          
          {currentQuestion < questions.length - 1 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setCurrentQuestion(currentQuestion + 1)}
            >
              <Text style={styles.navigationButtonText}>Próxima</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Finalizar</Text>
            </TouchableOpacity>
          )}
        </View>
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreTitle}>Resultado</Text>
                        <Text style={styles.scoreValue}>{score}%</Text>
                        <Text style={styles.scoreMessage}>
                            {score >= 70 ? 'Aprovado!' : 'Reprovado - Tente Novamente'}
                        </Text>
                    </View>

                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>Detalhes</Text>
                        <Text style={styles.detailsText}>
                            Você acertou {Math.round((score / 100) * questions.length)} de {questions.length} perguntas
                        </Text>
                        <Text style={styles.detailsText}>
                            Pontuação necessária: 70% para aprovação
                        </Text>
                    </View>

                    <View style={styles.explanationCard}>
                        <Text style={styles.explanationTitle}>Feedback de Aprendizagem</Text>
                        <Text style={styles.explanationText}>
                            {questions.map((question, index) => (
                                <Text key={index} style={styles.explanationItem}>
                                    {index + 1}. {question.explanation}
                                </Text>
                            ))}
                        </Text>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRetry}
                        >
                            <Text style={styles.retryButtonText}>Refazer Quiz</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.continueButtonText}>Voltar ao Curso</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    backButton: {
        fontSize: 16,
        color: '#1E3A8A',
        marginRight: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    questionContainer: {
        padding: 20,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    questionNumber: {
        fontSize: 16,
        color: '#757575',
    },
    progressIndicator: {
        flexDirection: 'row',
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 2,
    },
    progressDotActive: {
        backgroundColor: '#1E3A8A',
    },
    questionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 20,
        lineHeight: 24,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    optionButtonSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#1E3A8A',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    previousButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButton: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    navigationButtonText: {
        color: '#333333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultsContainer: {
        padding: 20,
    },
    scoreCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: score >= 70 ? '#4CAF50' : '#F44336',
        marginBottom: 5,
    },
    scoreMessage: {
        fontSize: 16,
        color: '#757575',
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    detailsText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 5,
        lineHeight: 22,
    },
    explanationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    explanationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    explanationText: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
    },
    explanationItem: {
        marginBottom: 5,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    retryButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});