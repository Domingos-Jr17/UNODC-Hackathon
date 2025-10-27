import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type WelcomeScreenNavigationProp = NavigationProp<any>;

interface WelcomeScreenProps {
    navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleGetCode = () => {
        // Simular registro (na real é via ONG)
        alert('Para obter código, contacte sua ONG de apoio');
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>WIRA</Text>

            <Text style={styles.subtitle}>
                A Universidade Digital que{'\n'}Empodera Sobreviventes
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>
                        Já tenho código de acesso
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.getCodeButton}
                    onPress={handleGetCode}
                >
                    <Text style={styles.getCodeButtonText}>
                        Preciso de código
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
                📚 Capacitação Profissional Certificada{'\n'}
                🎓 Reconhecida pelo Ministério do Trabalho
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E3A8A',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#90CAF9',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 40,
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 12,
    },
    loginButtonText: {
        color: '#1E3A8A',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    getCodeButton: {
        backgroundColor: '#1E3A8A',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    getCodeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#90CAF9',
        textAlign: 'center',
        lineHeight: 20,
    },
});