# 🛠️ BACKLOG TÉCNICO - WIRA HÍBRIDO CORRIGIDO
## Foco: Capacitação Digital | 28-30 Outubro 2025 | 3 dias = 30h úteis

---

## 🎯 PRINCÍPIO ORIENTADOR

> **"Capacitação PRIMEIRO. Emprego DEPOIS. Sempre com excelência."**

**FASE 1 (Funcional no Hackathon):** App de capacitação + Certificação  
**FASE 2 (Mockup/Código):** Matching de vagas + Acompanhamento

---

## 📊 ESTRATÉGIA DE PRIORIZAÇÃO

| Componente | Status no Hackathon | % Tempo |
|------------|---------------------|---------|
| **App Mobile - Capacitação** | ✅ FUNCIONAL | 50% |
| **Backend API - Cursos** | ✅ FUNCIONAL | 20% |
| **Dashboard ONG** | ✅ FUNCIONAL (básico) | 15% |
| **USSD Capacitação** | ✅ FUNCIONAL (Africa's Talking) | 10% |
| **Matching de Vagas** | 🎨 MOCKUP (tela fake) | 5% |
| **Polimento + Demo** | ✅ CRÍTICO | 5% |

---

## 📅 CRONOGRAMA DETALHADO (3 DIAS)

### **DIA 1: SEGUNDA (28/Out) - APP CAPACITAÇÃO CORE (10h)**

#### **MANHÃ (4h): Setup + Estrutura App**

**08:00 - 09:00 | Setup React Native**
```bash
# MUST - 1h
npx create-expo-app wira-app
cd wira-app

# Instalar dependências ESSENCIAIS
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npm install expo-av  # Para vídeos
npm install expo-file-system  # Download offline

# NÃO instalar (não precisa no MVP):
# ❌ Supabase (usar JSON local primeiro)
# ❌ React Query (overkill para MVP)
# ❌ Redux (state simples com Context)
```

**09:00 - 10:30 | Estrutura de Navegação**
```typescript
// MUST - 1.5h
// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens - FOCO EM CAPACITAÇÃO
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CourseLibraryScreen from './screens/CourseLibraryScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import VideoLessonScreen from './screens/VideoLessonScreen';
import QuizScreen from './screens/QuizScreen';
import CertificateScreen from './screens/CertificateScreen';
import ProgressScreen from './screens/ProgressScreen';

// FASE 2 (apenas mockup, não funcional)
import JobsMockupScreen from './screens/JobsMockupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#1E3A8A' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CourseLibrary" component={CourseLibraryScreen} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
        <Stack.Screen name="VideoLesson" component={VideoLessonScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Certificate" component={CertificateScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        
        {/* MOCKUP - Fase 2 */}
        <Stack.Screen 
          name="JobsMockup" 
          component={JobsMockupScreen}
          options={{ title: 'Vagas (Em Breve)' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**10:30 - 12:00 | Telas de Onboarding**
```typescript
// MUST - 1.5h
// screens/WelcomeScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-blue-900 justify-center items-center p-6">
      <Image 
        source={require('../assets/logo.png')}
        style={{ width: 150, height: 150 }}
      />
      
      <Text className="text-4xl font-bold text-white mt-8 text-center">
        WIRA
      </Text>
      
      <Text className="text-xl text-blue-200 mt-4 text-center">
        A Universidade Digital que{'\n'}Empodera Sobreviventes
      </Text>
      
      <View className="mt-12 w-full">
        <TouchableOpacity
          className="bg-white py-4 px-8 rounded-lg mb-4"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-blue-900 text-center font-bold text-lg">
            Já tenho código de acesso
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-blue-700 py-4 px-8 rounded-lg border-2 border-white"
          onPress={() => {
            // Simular registro (na real é via ONG)
            alert('Para obter código, contacte sua ONG de apoio');
          }}
        >
          <Text className="text-white text-center font-bold text-lg">
            Preciso de código
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text className="text-blue-300 text-sm mt-8 text-center">
        📚 Capacitação Profissional Certificada{'\n'}
        🎓 Reconhecida pelo Ministério do Trabalho
      </Text>
    </View>
  );
}

// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    if (code.length < 5) {
      Alert.alert('Erro', 'Código inválido');
      return;
    }
    
    setLoading(true);
    
    // Simular verificação (no real seria API)
    setTimeout(async () => {
      // Códigos de demonstração
      const validCodes = ['V0042', 'V0038', 'V0031'];
      
      if (validCodes.includes(code.toUpperCase())) {
        // Salvar código localmente
        await AsyncStorage.setItem('userCode', code.toUpperCase());
        
        // Navegar para Home
        navigation.replace('Home');
      } else {
        Alert.alert(
          'Código não encontrado', 
          'Contacte sua ONG para obter código válido'
        );
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-blue-900 mb-2">
        Bem-vinda de volta!
      </Text>
      
      <Text className="text-gray-600 mb-8">
        Digite seu código de acesso fornecido pela ONG
      </Text>
      
      <TextInput
        className="border-2 border-gray-300 p-4 rounded-lg text-lg mb-6"
        placeholder="Ex: V0042"
        value={code}
        onChangeText={(text) => setCode(text.toUpperCase())}
        maxLength={5}
        autoCapitalize="characters"
      />
      
      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-lg"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? 'Verificando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="mt-6"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-blue-600 text-center">
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

#### **TARDE (6h): Telas de Capacitação PRINCIPAIS**

**14:00 - 16:00 | Home + Biblioteca de Cursos**
```typescript
// MUST - 2h
// screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [userCode, setUserCode] = useState('');
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    certificatesEarned: 0,
    hoursLearned: 0
  });
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    const code = await AsyncStorage.getItem('userCode');
    setUserCode(code || '');
    
    // Carregar progresso (simulado)
    const progress = await AsyncStorage.getItem('userProgress');
    if (progress) {
      setStats(JSON.parse(progress));
    }
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-6 pb-12">
        <Text className="text-white text-lg">Olá,</Text>
        <Text className="text-white text-3xl font-bold">{userCode}! 👋</Text>
        <Text className="text-blue-200 mt-2">
          Continue sua jornada de aprendizado
        </Text>
      </View>
      
      {/* Stats Cards */}
      <View className="px-4 -mt-8">
        <View className="bg-white rounded-lg shadow p-4 mb-4">
          <Text className="text-gray-600 text-sm mb-2">Seu Progresso</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-600">
                {stats.coursesCompleted}
              </Text>
              <Text className="text-gray-500 text-xs">Cursos Completos</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-3xl font-bold text-green-600">
                {stats.certificatesEarned}
              </Text>
              <Text className="text-gray-500 text-xs">Certificados</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-600">
                {stats.hoursLearned}h
              </Text>
              <Text className="text-gray-500 text-xs">Horas de Estudo</Text>
            </View>
          </View>
          
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg"
            onPress={() => navigation.navigate('Progress')}
          >
            <Text className="text-white text-center font-semibold">
              Ver Progresso Detalhado
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View className="px-4 mt-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          Ações Rápidas
        </Text>
        
        <TouchableOpacity
          className="bg-white rounded-lg shadow p-4 mb-3 flex-row items-center"
          onPress={() => navigation.navigate('CourseLibrary')}
        >
          <View className="bg-blue-100 w-12 h-12 rounded-lg items-center justify-center mr-4">
            <Text className="text-2xl">📚</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900">Biblioteca de Cursos</Text>
            <Text className="text-gray-500 text-sm">
              Explore novos cursos profissionais
            </Text>
          </View>
          <Text className="text-blue-600 text-xl">›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-white rounded-lg shadow p-4 mb-3 flex-row items-center"
          onPress={() => navigation.navigate('Certificate')}
        >
          <View className="bg-green-100 w-12 h-12 rounded-lg items-center justify-center mr-4">
            <Text className="text-2xl">🏆</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900">Meus Certificados</Text>
            <Text className="text-gray-500 text-sm">
              {stats.certificatesEarned} certificado(s) obtido(s)
            </Text>
          </View>
          <Text className="text-green-600 text-xl">›</Text>
        </TouchableOpacity>
        
        {/* MOCKUP - Fase 2 */}
        <TouchableOpacity
          className="bg-gray-100 rounded-lg shadow p-4 mb-3 flex-row items-center opacity-60"
          onPress={() => navigation.navigate('JobsMockup')}
        >
          <View className="bg-purple-100 w-12 h-12 rounded-lg items-center justify-center mr-4">
            <Text className="text-2xl">💼</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900">
              Vagas Compatíveis
            </Text>
            <Text className="text-gray-500 text-sm">
              🔄 Em breve | Fase 2
            </Text>
          </View>
          <Text className="text-gray-400 text-xl">›</Text>
        </TouchableOpacity>
      </View>
      
      {/* Current Course (if any) */}
      <View className="px-4 mt-6 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          Continue Aprendendo
        </Text>
        
        <View className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4">
          <Text className="text-white font-bold text-lg mb-1">
            Costura Avançada
          </Text>
          <Text className="text-blue-100 text-sm mb-3">
            Módulo 3 de 8 • 65% completo
          </Text>
          
          <View className="bg-white/30 rounded-full h-2 mb-3">
            <View 
              className="bg-white rounded-full h-2" 
              style={{ width: '65%' }}
            />
          </View>
          
          <TouchableOpacity
            className="bg-white py-2 rounded-lg"
            onPress={() => navigation.navigate('CourseDetail', { courseId: 'costura' })}
          >
            <Text className="text-blue-600 text-center font-bold">
              Continuar Curso →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// screens/CourseLibraryScreen.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

const COURSES = [
  {
    id: 'costura',
    title: 'Costura Avançada',
    subtitle: 'Produção de Uniformes Escolares',
    duration: '40 horas',
    modules: 8,
    level: 'Intermediário',
    icon: '👗',
    color: 'blue',
    inProgress: true
  },
  {
    id: 'culinaria',
    title: 'Culinária Profissional',
    subtitle: 'Técnicas de Cozinha Moçambicana',
    duration: '35 horas',
    modules: 7,
    level: 'Básico',
    icon: '🍳',
    color: 'green'
  },
  {
    id: 'agricultura',
    title: 'Agricultura Sustentável',
    subtitle: 'Cultivo de Milho e Hortaliças',
    duration: '30 horas',
    modules: 6,
    level: 'Básico',
    icon: '🌱',
    color: 'emerald'
  }
];

export default function CourseLibraryScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Biblioteca de Cursos
        </Text>
        <Text className="text-gray-600 mb-6">
          Escolha um curso para começar sua capacitação profissional
        </Text>
        
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course.id}
            className="bg-white rounded-lg shadow mb-4 overflow-hidden"
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
          >
            <View className="flex-row">
              <View className={`bg-${course.color}-100 w-24 items-center justify-center`}>
                <Text className="text-5xl">{course.icon}</Text>
              </View>
              
              <View className="flex-1 p-4">
                {course.inProgress && (
                  <View className="bg-blue-100 self-start px-2 py-1 rounded mb-1">
                    <Text className="text-blue-600 text-xs font-bold">
                      EM PROGRESSO
                    </Text>
                  </View>
                )}
                
                <Text className="font-bold text-gray-900 text-lg">
                  {course.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  {course.subtitle}
                </Text>
                
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-xs mr-3">
                    ⏱ {course.duration}
                  </Text>
                  <Text className="text-gray-500 text-xs mr-3">
                    📘 {course.modules} módulos
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    📊 {course.level}
                  </Text>
                </View>
              </View>
              
              <View className="justify-center pr-4">
                <Text className="text-gray-400 text-2xl">›</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
```

**16:00 - 18:00 | Detalhe do Curso + Vídeo**
```typescript
// MUST - 2h
// screens/CourseDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dados simulados do curso
const COURSE_DATA = {
  costura: {
    title: 'Costura Avançada',
    description: 'Aprenda técnicas profissionais de costura para produção de uniformes escolares. Ao final, você estará apta a trabalhar em fábricas têxteis ou cooperativas.',
    instructor: 'Professora Ana Machel',
    modules: [
      { id: 1, title: 'Preparação de Máquina Industrial', duration: '45 min', completed: true },
      { id: 2, title: 'Técnicas de Costura Reta', duration: '60 min', completed: true },
      { id: 3, title: 'Costura de Bolsos', duration: '50 min', completed: false },
      { id: 4, title: 'Montagem de Camisas', duration: '75 min', completed: false },
      { id: 5, title: 'Acabamentos Profissionais', duration: '40 min', completed: false },
      { id: 6, title: 'Controle de Qualidade', duration: '30 min', completed: false },
      { id: 7, title: 'Produtividade e Prazos', duration: '35 min', completed: false },
      { id: 8, title: 'Avaliação Final', duration: '60 min', completed: false }
    ]
  }
};

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params;
  const course = COURSE_DATA[courseId];
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    calculateProgress();
  }, []);
  
  const calculateProgress = () => {
    const completed = course.modules.filter(m => m.completed).length;
    const total = course.modules.length;
    setProgress(Math.round((completed / total) * 100));
  };
  
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-6">
        <Text className="text-white text-2xl font-bold mb-2">
          {course.title}
        </Text>
        <Text className="text-blue-100">
          👩‍🏫 {course.instructor}
        </Text>
      </View>
      
      {/* Progress */}
      <View className="p-6 bg-gray-50">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600 font-semibold">Seu Progresso</Text>
          <Text className="text-blue-600 font-bold">{progress}%</Text>
        </View>
        
        <View className="bg-gray-300 rounded-full h-3">
          <View 
            className="bg-blue-600 rounded-full h-3"
            style={{ width: `${progress}%` }}
          />
        </View>
        
        <Text className="text-gray-500 text-sm mt-2">
          {course.modules.filter(m => m.completed).length} de {course.modules.length} módulos completados
        </Text>
      </View>
      
      {/* Description */}
      <View className="p-6">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          Sobre este Curso
        </Text>
        <Text className="text-gray-600 leading-6">
          {course.description}
        </Text>
      </View>
      
      {/* Modules */}
      <View className="p-6 pt-0">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Módulos do Curso
        </Text>
        
        {course.modules.map((module, index) => (
          <TouchableOpacity
            key={module.id}
            className={`border rounded-lg p-4 mb-3 ${
              module.completed ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
            }`}
            onPress={() => {
              if (index <= 2) { // Permitir apenas até módulo 3 na demo
                navigation.navigate('VideoLesson', { 
                  courseId,
                  moduleId: module.id 
                });
              }
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <View className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
                    module.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <Text className="text-white text-xs font-bold">
                      {module.completed ? '✓' : index + 1}
                    </Text>
                  </View>
                  <Text className={`font-semibold ${
                    module.completed ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {module.title}
                  </Text>
                </View>
                
                <Text className="text-gray-500 text-sm ml-8">
                  ⏱ {module.duration}
                </Text>
              </View>
              
              <Text className={`text-xl ${
                module.completed ? 'text-green-500' : 'text-gray-400'
              }`}>
                {module.completed ? '✓' : '▶'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Certificate CTA */}
      {progress === 100 && (
        <View className="p-6 pt-0">
          <TouchableOpacity
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 items-center"
            onPress={() => navigation.navigate('Certificate', { courseId })}
          >
            <Text className="text-white font-bold text-lg mb-1">
              🏆 Obter Certificado
            </Text>
            <Text className="text-green-100 text-sm">
              Parabéns! Você completou o curso
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// screens/VideoLessonScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Video } from 'expo-av';

export default function VideoLessonScreen({ route, navigation }) {
  const { courseId, moduleId } = route.params;
  const [videoComplete, setVideoComplete] = useState(false);
  
  const handleVideoEnd = () => {
    setVideoComplete(true);
  };
  
  const handleContinue = () => {
    // Ir para quiz
    navigation.navigate('Quiz', { courseId, moduleId });
  };
  
  return (
    <View className="flex-1 bg-black">
      {/* Video Player */}
      <View className="flex-1 justify-center">
        <Video
          source={require('../assets/videos/costura-mod3.mp4')} // Vídeo demo
          style={{ width: '100%', height: 300 }}
          useNativeControls
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              handleVideoEnd();
            }
          }}
        />
      </View>
      
      {/* Lesson Info */}
      <View className="bg-white p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Módulo {moduleId}: Costura de Bolsos
        </Text>
        <Text className="text-gray-600 mb-4">
          Aprenda a técnica profissional de costura de bolsos em uniformes escolares.
        </Text>
        
        {videoComplete ? (
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg"
            onPress={handleContinue}
          >
            <Text className="text-white text-center font-bold text-lg">
              Fazer Quiz do Módulo →
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-100 py-4 rounded-lg">
            <Text className="text-gray-500 text-center">
              Assista o vídeo até o final para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
```

**18:00 - 20:00 | Quiz + Certificado**
```typescript
// MUST - 2h
// screens/QuizScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_QUESTIONS = {
  costura: {
    3: [
      {
        question: 'Qual é o primeiro passo ao costurar um bolso?',
        options: [
          'Cortar o tecido',
          'Preparar o acabamento das bordas',
          'Costurar diretamente na peça',
          'Medir e marcar a posição'
        ],
        correct: 3
      },
      {
        question: 'Qual ponto é mais adequado para fixar bolsos?',
        options: [
          'Ponto reto simples',
          'Ponto zigue-zague',
          'Ponto```typescript
          'Ponto reto reforçado',
          'Ponto overlock'
        ],
        correct: 2
      },
      {
        question: 'Qual margem de costura é recomendada para bolsos de uniformes?',
        options: [
          '0.5 cm',
          '1 cm',
          '1.5 cm',
          '2 cm'
        ],
        correct: 1
      },
      {
        question: 'Como garantir que o bolso fique simétrico?',
        options: [
          'Costurar rapidamente',
          'Usar alfinetes e marcações',
          'Confiar na experiência',
          'Medir apenas uma vez'
        ],
        correct: 1
      },
      {
        question: 'Qual o erro mais comum ao costurar bolsos?',
        options: [
          'Usar linha errada',
          'Não reforçar os cantos',
          'Costurar muito devagar',
          'Usar agulha grossa'
        ],
        correct: 1
      }
    ]
  }
};

export default function QuizScreen({ route, navigation }) {
  const { courseId, moduleId } = route.params;
  const questions = QUIZ_QUESTIONS[courseId][moduleId];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };
  
  const handleSubmit = async () => {
    // Calcular pontuação
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    // Salvar progresso se passou (>= 70%)
    if (finalScore >= 70) {
      await saveProgress(courseId, moduleId);
    }
  };
  
  const saveProgress = async (courseId, moduleId) => {
    // Atualizar progresso no AsyncStorage
    const progressKey = `progress_${courseId}`;
    const existing = await AsyncStorage.getItem(progressKey);
    
    let progress = existing ? JSON.parse(existing) : { completedModules: [] };
    
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      await AsyncStorage.setItem(progressKey, JSON.stringify(progress));
    }
  };
  
  const handleContinue = () => {
    if (score >= 70) {
      navigation.navigate('CourseDetail', { courseId });
    } else {
      Alert.alert(
        'Tente Novamente',
        'Você precisa de pelo menos 70% para passar. Reveja o conteúdo e tente novamente.',
        [
          { text: 'Rever Aula', onPress: () => navigation.goBack() },
          { text: 'Tentar Quiz Novamente', onPress: () => {
            setCurrentQuestion(0);
            setSelectedAnswers({});
            setShowResults(false);
            setScore(0);
          }}
        ]
      );
    }
  };
  
  if (showResults) {
    return (
      <View className="flex-1 bg-white p-6 justify-center items-center">
        <View className={`w-32 h-32 rounded-full items-center justify-center mb-6 ${
          score >= 70 ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Text className="text-5xl">
            {score >= 70 ? '✓' : '✗'}
          </Text>
        </View>
        
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {score >= 70 ? 'Parabéns!' : 'Quase lá!'}
        </Text>
        
        <Text className="text-6xl font-bold text-blue-600 mb-2">
          {score}%
        </Text>
        
        <Text className="text-gray-600 text-center mb-8">
          Você acertou {Math.round(questions.length * score / 100)} de {questions.length} questões
        </Text>
        
        {score >= 70 ? (
          <View className="w-full">
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <Text className="text-green-700 font-semibold mb-1">
                ✓ Módulo Completo
              </Text>
              <Text className="text-green-600 text-sm">
                Este progresso foi salvo automaticamente
              </Text>
            </View>
            
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-lg"
              onPress={handleContinue}
            >
              <Text className="text-white text-center font-bold text-lg">
                Continuar para Próximo Módulo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full">
            <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <Text className="text-orange-700 font-semibold mb-1">
                Nota mínima: 70%
              </Text>
              <Text className="text-orange-600 text-sm">
                Reveja o conteúdo e tente novamente
              </Text>
            </View>
            
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-lg mb-3"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-center font-bold">
                Rever Conteúdo da Aula
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-200 py-4 rounded-lg"
              onPress={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setShowResults(false);
                setScore(0);
              }}
            >
              <Text className="text-gray-700 text-center font-bold">
                Tentar Quiz Novamente
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Progress */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">
              Questão {currentQuestion + 1} de {questions.length}
            </Text>
            <Text className="text-blue-600 font-semibold">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </Text>
          </View>
          
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-blue-600 rounded-full h-2"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </View>
        </View>
        
        {/* Question */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-bold text-gray-900">
            {question.question}
          </Text>
        </View>
        
        {/* Options */}
        <View className="mb-6">
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`border-2 rounded-lg p-4 mb-3 ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => handleSelectAnswer(currentQuestion, index)}
            >
              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <View className="w-3 h-3 rounded-full bg-white" />
                  )}
                </View>
                
                <Text className={`flex-1 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-700'
                }`}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Navigation */}
        <View className="flex-row justify-between">
          {currentQuestion > 0 && (
            <TouchableOpacity
              className="bg-gray-200 py-3 px-6 rounded-lg"
              onPress={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <Text className="text-gray-700 font-semibold">
                ← Anterior
              </Text>
            </TouchableOpacity>
          )}
          
          <View className="flex-1" />
          
          {isLastQuestion ? (
            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${
                allAnswered ? 'bg-green-600' : 'bg-gray-300'
              }`}
              onPress={handleSubmit}
              disabled={!allAnswered}
            >
              <Text className={`font-semibold ${
                allAnswered ? 'text-white' : 'text-gray-500'
              }`}>
                Finalizar Quiz ✓
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${
                selectedAnswers[currentQuestion] !== undefined
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
              onPress={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              <Text className={`font-semibold ${
                selectedAnswers[currentQuestion] !== undefined
                  ? 'text-white'
                  : 'text-gray-500'
              }`}>
                Próxima →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// screens/CertificateScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

export default function CertificateScreen({ route, navigation }) {
  const { courseId } = route.params;
  const [userCode, setUserCode] = useState('');
  const [certificate, setCertificate] = useState(null);
  
  useEffect(() => {
    loadCertificate();
  }, []);
  
  const loadCertificate = async () => {
    const code = await AsyncStorage.getItem('userCode');
    setUserCode(code);
    
    // Simular dados do certificado
    setCertificate({
      courseName: 'Costura Avançada - Uniformes Escolares',
      completionDate: new Date().toLocaleDateString('pt-MZ'),
      hours: 40,
      issuer: 'WIRA - Centro de Acolhimento Maputo',
      certificateId: `WIRA-${code}-${courseId.toUpperCase()}-2025`
    });
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Acabei de completar o curso "${certificate.courseName}" através do WIRA! 🎓\n\nCertificado ID: ${certificate.certificateId}`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  if (!certificate) {
    return <View className="flex-1 bg-white items-center justify-center">
      <Text>Carregando certificado...</Text>
    </View>;
  }
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Certificate Card */}
        <View className="bg-white rounded-lg shadow-lg p-6 mb-6 border-4 border-blue-600">
          <View className="items-center mb-6">
            <Text className="text-blue-600 font-bold text-sm mb-2">
              CERTIFICADO DE CONCLUSÃO
            </Text>
            <View className="w-16 h-1 bg-blue-600 mb-4" />
          </View>
          
          <Text className="text-center text-gray-600 mb-2">
            Certificamos que
          </Text>
          
          <Text className="text-center text-2xl font-bold text-gray-900 mb-4">
            {userCode}
          </Text>
          
          <Text className="text-center text-gray-600 mb-2">
            completou com sucesso o curso de
          </Text>
          
          <Text className="text-center text-xl font-bold text-blue-600 mb-6">
            {certificate.courseName}
          </Text>
          
          <View className="border-t border-gray-200 pt-4 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Carga Horária:</Text>
              <Text className="font-semibold">{certificate.hours} horas</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Data de Conclusão:</Text>
              <Text className="font-semibold">{certificate.completionDate}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Instituição:</Text>
              <Text className="font-semibold text-right flex-1 ml-2">
                {certificate.issuer}
              </Text>
            </View>
          </View>
          
          {/* QR Code */}
          <View className="items-center py-4 border-t border-gray-200">
            <Text className="text-gray-600 text-sm mb-3">
              Verificar Autenticidade:
            </Text>
            <QRCode
              value={`https://wira.mz/verify/${certificate.certificateId}`}
              size={120}
            />
            <Text className="text-gray-500 text-xs mt-2 text-center">
              ID: {certificate.certificateId}
            </Text>
          </View>
          
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-xs text-gray-500 text-center">
              Certificado digital validado por WIRA{'\n'}
              Reconhecido pelo Ministério do Trabalho de Moçambique
            </Text>
          </View>
        </View>
        
        {/* Actions */}
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg mb-3"
          onPress={handleShare}
        >
          <Text className="text-white text-center font-bold text-lg">
            📤 Partilhar Certificado
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-green-600 py-4 rounded-lg mb-3"
        >
          <Text className="text-white text-center font-bold text-lg">
            📥 Descarregar PDF
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-gray-200 py-4 rounded-lg"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-gray-700 text-center font-bold">
            Voltar ao Início
          </Text>
        </TouchableOpacity>
        
        {/* Achievement Badge */}
        <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mt-6">
          <Text className="text-center text-white font-bold text-lg mb-2">
            🏆 Parabéns pela Conquista!
          </Text>
          <Text className="text-center text-white/90 text-sm">
            Você está mais próxima de alcançar seus objetivos profissionais.
            Continue aprendendo!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
```

---

**RESULTADO DIA 1:**
```
✅ App React Native completo e funcional
✅ Navegação entre 8 telas principais
✅ Foco total em CAPACITAÇÃO (não vagas)
✅ Sistema de quiz e progresso
✅ Certificação digital com QR code
✅ Interface polida e profissional
```

---

### **DIA 2: TERÇA (29/Out) - DASHBOARD + BACKEND (10h)**

#### **MANHÃ (4h): Backend API Simples**

**09:00 - 10:30 | Setup Backend Básico**
```bash
# MUST - 1.5h

mkdir wira-backend
cd wira-backend
npm init -y

# Dependências mínimas
npm install express cors
npm install --save-dev nodemon typescript @types/express @types/node

# Criar tsconfig.json
npx tsc --init

# Estrutura de pastas
mkdir src
mkdir src/routes
mkdir src/data
```

```typescript
// src/index.ts
// MUST - Backend minimalista (sem banco de dados real)

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Dados simulados em memória (suficiente para demo)
const USERS = {
  'V0042': {
    code: 'V0042',
    name: 'Maria Silva', // Criptografado em produção
    ngo: 'Centro Acolhimento Maputo',
    courses: ['costura'],
    progress: {
      costura: { completedModules: [1, 2, 3], percentage: 37.5 }
    },
    certificates: ['costura']
  },
  'V0038': {
    code: 'V0038',
    name: 'Ana Costa',
    ngo: 'Centro Acolhimento Maputo',
    courses: ['culinaria'],
    progress: {
      culinaria: { completedModules: [1], percentage: 14 }
    },
    certificates: []
  }
};

const COURSES = [
  {
    id: 'costura',
    title: 'Costura Avançada',
    modules: 8,
    hours: 40,
    level: 'Intermediário'
  },
  {
    id: 'culinaria',
    title: 'Culinária Profissional',
    modules: 7,
    hours: 35,
    level: 'Básico'
  },
  {
    id: 'agricultura',
    title: 'Agricultura Sustentável',
    modules: 6,
    hours: 30,
    level: 'Básico'
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/auth/login', (req, res) => {
  const { code } = req.body;
  
  if (USERS[code]) {
    res.json({
      success: true,
      user: USERS[code]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Código não encontrado'
    });
  }
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: COURSES
  });
});

app.get('/api/users/:code/progress', (req, res) => {
  const user = USERS[req.params.code];
  
  if (user) {
    res.json({
      success: true,
      data: user.progress
    });
  } else {
    res.status(404).json({ success: false });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 WIRA Backend rodando em http://localhost:${PORT}`);
});
```

**10:30 - 13:00 | Dashboard ONG (React)**
```bash
# MUST - 2.5h

npx create-react-app wira-dashboard --template typescript
cd wira-dashboard
npm install react-router-dom tailwindcss
npx tailwindcss init -p
cd wira-dashboard
npm install
```

```typescript
// app/page.tsx
// Dashboard ONG - FOCO EM CAPACITAÇÃO

'use client';

import { useState, useEffect } from 'react';

interface Victim {
  code: string;
  ngo: string;
  courses: string[];
  progress: any;
  certificates: string[];
}

export default function Dashboard() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [stats, setStats] = useState({
    totalVictims: 0,
    activeCourses: 0,
    certificatesIssued: 0
  });
  
  useEffect(() => {
    // Dados simulados
    const mockVictims: Victim[] = [
      {
        code: 'V0042',
        ngo: 'Centro Acolhimento Maputo',
        courses: ['costura'],
        progress: { costura: { percentage: 37.5 } },
        certificates: []
      },
      {
        code: 'V0038',
        ngo: 'Centro Acolhimento Maputo',
        courses: ['culinaria'],
        progress: { culinaria: { percentage: 14 } },
        certificates: []
      },
      {
        code: 'V0031',
        ngo: 'Centro Acolhimento Maputo',
        courses: ['costura'],
        progress: { costura: { percentage: 100 } },
        certificates: ['costura']
      }
    ];
    
    setVictims(mockVictims);
    setStats({
      totalVictims: 3,
      activeCourses: 3,
      certificatesIssued: 1
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">WIRA - Dashboard ONG</h1>
        <p className="text-blue-100">Centro de Acolhimento Maputo</p>
      </header>
      
      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 mb-2">👥</div>
            <h3 className="text-gray-600 text-sm font-medium">Sobreviventes Cadastradas</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalVictims}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-green-600 mb-2">📚</div>
            <h3 className="text-gray-600 text-sm font-medium">Cursos em Andamento</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCourses}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-purple-600 mb-2">🏆</div>
            <h3 className="text-gray-600 text-sm font-medium">Certificados Emitidos</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.certificatesIssued}</p>
          </div>
        </div>
        
        {/* Victims Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Progresso de Capacitação
            </h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Certificados
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {victims.map((victim) => (
                <tr key={victim.code}>
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-blue-600">
                      {victim.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {victim.courses[0] === 'costura' ? 'Costura Avançada' :
                     victim.courses[0] === 'culinaria' ? 'Culinária Profissional' :
                     'Agricultura Sustentável'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${victim.progress[victim.courses[0]].percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {Math.round(victim.progress[victim.courses[0]].percentage)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {victim.certificates.length > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        {victim.certificates.length} certificado(s)
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Em progresso</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

---

#### **TARDE (6h): USSD Funcional + Mockup Vagas**

**14:00 - 16:00 | Integração USSD com Africa's Talking**
```
MUST - 2h

Implementar USSD funcional com Africa's Talking API:
1. Endpoint para *130# → Menu Principal
   "Bem-vinda ao WIRA
    1. Meus Cursos
    2. Meu Progresso
    3. Certificados"

2. Endpoint para Opção 1 → Lista de Cursos
   "Cursos Disponíveis:
    1. Costura Avançada (em progresso)
    2. Culinária Profissional
    3. Agricultura Sustentável"

3. Endpoint para Opção 2 → Progresso
   "Costura Avançada:
    37% completo
    3 de 8 módulos
    Próximo: Montagem de Camisas"

4. Integração com backend para dados em tempo real
```

**16:00 - 18:00 | Tela Mockup de Vagas (Fase 2)**
```typescript
// screens/JobsMockupScreen.tsx
// MOCKUP - Mostrar visão futura

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function JobsMockupScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Banner "Em Desenvolvimento" */}
      <View className="bg-blue-600 p-4">
        <Text className="text-white text-center font-bold text-lg mb-1">
          🔄 FASE 2: EM DESENVOLVIMENTO
        </Text>
        <Text className="text-blue-100 text-center text-sm">
          Funcionalidade disponível em 30 dias
        </Text>
      </View>
      
      {/* Mockup de Vagas */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Vagas Compatíveis com Seu Perfil
        </Text>
        
        {/* Vaga 1 - Compatibilidade Alta */}
        <View className="bg-white rounded-lg shadow mb-4 overflow-hidden opacity-70">
          <View className="bg-green-100 p-2">
            <Text className="text-green-700 font-bold text-center">
              ⭐ 95% COMPATÍVEL
            </Text>
          </View>
          
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Costureira - Fábrica Textil Matola
            </Text```typescript
            <Text className="text-gray-600 text-sm mb-3">
              Produção de uniformes escolares
            </Text>
            
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700">💰 Salário:</Text>
              <Text className="font-semibold text-gray-900 ml-2">8.000 MT/mês</Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700">📍 Localização:</Text>
              <Text className="font-semibold text-gray-900 ml-2">Matola (5km)</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Text className="text-gray-700">✓ Status:</Text>
              <Text className="font-semibold text-green-600 ml-2">Validada por ONG</Text>
            </View>
            
            <View className="bg-gray-100 p-3 rounded-lg mb-3">
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Por que 95% compatível?
              </Text>
              <Text className="text-xs text-gray-600">
                • Suas habilidades batem perfeitamente{'\n'}
                • Mesma localização (Matola){'\n'}
                • Você tem certificado exigido
              </Text>
            </View>
            
            <TouchableOpacity 
              className="bg-gray-400 py-3 rounded-lg"
              disabled
            >
              <Text className="text-white text-center font-bold">
                Candidatar (Disponível em Fase 2)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Vaga 2 */}
        <View className="bg-white rounded-lg shadow mb-4 overflow-hidden opacity-70">
          <View className="bg-blue-100 p-2">
            <Text className="text-blue-700 font-bold text-center">
              ⭐ 88% COMPATÍVEL
            </Text>
          </View>
          
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Costureira - Cooperativa Mulheres
            </Text>
            <Text className="text-gray-600 text-sm mb-3">
              Trabalho em cooperativa feminina
            </Text>
            
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700">💰 Salário:</Text>
              <Text className="font-semibold text-gray-900 ml-2">6.500 MT/mês</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Text className="text-gray-700">📍 Localização:</Text>
              <Text className="font-semibold text-gray-900 ml-2">Maputo Centro</Text>
            </View>
            
            <TouchableOpacity 
              className="bg-gray-400 py-3 rounded-lg"
              disabled
            >
              <Text className="text-white text-center font-bold">
                Candidatar (Disponível em Fase 2)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <Text className="font-bold text-blue-900 mb-2">
            📅 Cronograma Fase 2
          </Text>
          <Text className="text-blue-700 text-sm mb-2">
            Esta funcionalidade estará disponível em 30 dias após o hackathon.
          </Text>
          <Text className="text-blue-600 text-sm">
            ✓ Algoritmo de matching já codificado{'\n'}
            ✓ Validação tripla de segurança{'\n'}
            ✓ Acompanhamento pós-emprego
          </Text>
        </View>
        
        {/* GitHub Link */}
        <TouchableOpacity 
          className="bg-gray-800 p-4 rounded-lg mt-4"
          onPress={() => {
            // Abrir GitHub
          }}
        >
          <Text className="text-white text-center font-bold mb-1">
            💻 Ver Código no GitHub
          </Text>
          <Text className="text-gray-300 text-center text-xs">
            github.com/wira-platform/matching-engine
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
```

**18:00 - 20:00 | Seed Data + Polimento**
```typescript
// SHOULD - 2h

// Criar dados realistas para demonstração
// data/seed.json

{
  "courses": [
    {
      "id": "costura",
      "title": "Costura Avançada - Uniformes Escolares",
      "description": "Curso completo de costura industrial focado em produção de uniformes escolares. Técnicas profissionais reconhecidas pelo mercado.",
      "instructor": "Professora Ana Machel",
      "duration": "40 horas",
      "modules": 8,
      "level": "Intermediário",
      "skills": ["Máquina industrial", "Costura reta", "Acabamentos", "Controle qualidade"],
      "certification": "Reconhecido pelo Ministério do Trabalho"
    },
    {
      "id": "culinaria",
      "title": "Culinária Profissional Moçambicana",
      "description": "Técnicas de cozinha profissional focadas em pratos moçambicanos e gestão de cozinha.",
      "instructor": "Chef João Sitoe",
      "duration": "35 horas",
      "modules": 7,
      "level": "Básico",
      "skills": ["Técnicas básicas", "Pratos tradicionais", "Higiene alimentar", "Gestão de cozinha"],
      "certification": "Reconhecido pelo Ministério do Trabalho"
    },
    {
      "id": "agricultura",
      "title": "Agricultura Sustentável",
      "description": "Técnicas modernas de cultivo de milho e hortaliças com foco em sustentabilidade e produtividade.",
      "instructor": "Eng. Maria Cossa",
      "duration": "30 horas",
      "modules": 6,
      "level": "Básico",
      "skills": ["Preparação solo", "Plantio", "Irrigação", "Colheita", "Pós-colheita"],
      "certification": "Certificado WIRA"
    }
  ],
  "victims": [
    {
      "code": "V0042",
      "registeredAt": "2025-09-15",
      "ngo": "Centro de Acolhimento Maputo",
      "courses": ["costura"],
      "progress": {
        "costura": {
          "completedModules": [1, 2, 3],
          "currentModule": 4,
          "percentage": 37.5,
          "hoursCompleted": 15,
          "lastActivity": "2025-10-25"
        }
      },
      "certificates": [],
      "stats": {
        "totalHours": 15,
        "coursesStarted": 1,
        "coursesCompleted": 0,
        "certificatesEarned": 0
      }
    },
    {
      "code": "V0038",
      "registeredAt": "2025-09-20",
      "ngo": "Centro de Acolhimento Maputo",
      "courses": ["culinaria"],
      "progress": {
        "culinaria": {
          "completedModules": [1],
          "currentModule": 2,
          "percentage": 14,
          "hoursCompleted": 5,
          "lastActivity": "2025-10-24"
        }
      },
      "certificates": [],
      "stats": {
        "totalHours": 5,
        "coursesStarted": 1,
        "coursesCompleted": 0,
        "certificatesEarned": 0
      }
    },
    {
      "code": "V0031",
      "registeredAt": "2025-08-10",
      "ngo": "Centro de Acolhimento Maputo",
      "courses": ["costura"],
      "progress": {
        "costura": {
          "completedModules": [1, 2, 3, 4, 5, 6, 7, 8],
          "currentModule": null,
          "percentage": 100,
          "hoursCompleted": 40,
          "lastActivity": "2025-10-20"
        }
      },
      "certificates": ["costura"],
      "stats": {
        "totalHours": 40,
        "coursesStarted": 1,
        "coursesCompleted": 1,
        "certificatesEarned": 1
      }
    }
  ]
}

// Adicionar no app:
// AsyncStorage.setItem('seedData', JSON.stringify(SEED_DATA));
```

**RESULTADO DIA 2:**
```
✅ Backend API funcional (dados em memória)
✅ Dashboard ONG mostrando progresso de capacitação
✅ USSD funcional com Africa's Talking API
✅ Mockup de vagas (Fase 2) visualmente convincente
✅ Seed data realista para demonstração
```

---

### **DIA 3: QUARTA (30/Out) - POLIMENTO + DEMO (10h)**

#### **MANHÃ (4h): Testes + Bugfixes + Assets**

**09:00 - 10:30 | Testes de Fluxo Completo**
```
MUST - 1.5h

TESTAR MANUALMENTE:

1. Fluxo App Completo (cronometrar: deve ser < 3 min)
   □ Abrir app
   □ Login com V0042
   □ Ver dashboard
   □ Entrar em "Biblioteca de Cursos"
   □ Abrir "Costura Avançada"
   □ Ver progresso (37%)
   □ Clicar em Módulo 3
   □ Play vídeo (10 segundos)
   □ Fazer quiz (5 questões)
   □ Ver resultado (passar com 80%)
   □ Voltar ao curso (progresso atualiza para 50%)
   
2. Testar Dashboard ONG
   □ Abrir http://localhost:3001
   □ Ver 3 vítimas listadas
   □ Progresso atualiza corretamente
   □ Estatísticas corretas
   
3. Testar Mockup de Vagas
   □ No app, ir para "Vagas Compatíveis"
   □ Ver 2 vagas mockup
   □ Banner "Fase 2" visível
   □ Botão "GitHub" funciona

ANOTAR BUGS ENCONTRADOS E CORRIGIR
```

**10:30 - 12:00 | Adicionar Assets e Polimento Visual**
```
MUST - 1.5h

Assets Necessários:

□ Logo WIRA (PNG transparente, 512x512)
□ Splash screen (1080x1920)
□ Ícones de categorias (costura, culinária, agricultura)
□ 1 vídeo demo de aula (30 segundos, comprimido)
□ Imagens ilustrativas para certificado

Polimento Visual:

□ Ajustar espaçamentos (padding/margin)
□ Verificar cores consistentes (paleta azul)
□ Adicionar loading states (spinners)
□ Melhorar feedback visual (botões pressionados)
□ Adicionar animações suaves (Animated API)
□ Testar em diferentes tamanhos de tela
```

**12:00 - 13:00 | Preparar Backup e Contingências**
```
MUST - 1h

PLANO B (se demo falhar):

1. Gravar Vídeo Demo Completo (3 minutos)
   □ Abrir app
   □ Navegar por todas as telas principais
   □ Mostrar quiz funcionando
   □ Mostrar certificado
   □ Mostrar dashboard ONG
   □ Mostrar mockup vagas
   
2. Exportar APK/IPA para instalação rápida
   □ eas build (se tiver tempo)
   □ OU rodar via Expo Go
   
3. Screenshots de Alta Qualidade
   □ 10 telas principais
   □ Imprimir em A4 (plano C)
   
4. Copiar TUDO em 2 pen drives
   □ Código completo
   □ APK/IPA
   □ Vídeo demo
   □ Screenshots
   □ Slides atualizados
```

---

#### **TARDE (6h): Slides + Ensaio + Preparação Final**

**14:00 - 16:00 | Atualizar Slides (conforme análise)**
```
MUST - 2h

Ajustes Críticos (P0):

□ Slide 1: Adicionar "Fase 1 + Fase 2"
□ Slide 3: Separar visualmente as fases
□ Slide 4: Renomear "MVP" → "Implementação"
□ Adicionar Slide Novo: "Por Quê 2 Fases?"
□ Slide 5: Destacar USSD como "funcional"
□ Slide 6: Adicionar ODS 4

Exportar:
□ PowerPoint (.pptx)
□ PDF (backup)
□ Imagens PNG de cada slide
```

**16:00 - 18:00 | Ensaio Geral (3x)**
```
CRITICAL - 2h

ENSAIO 1 (16:00-16:30):
□ Pitch completo com slides
□ Demo ao vivo (app + dashboard)
□ Cronometrar: DEVE SER < 5:00 min
□ Anotar: onde travou? onde acelerou?

AJUSTES (16:30-17:00):
□ Cortar partes que ultrapassaram tempo
□ Simplificar explicações técnicas longas
□ Melhorar transições entre demo e slides

ENSAIO 2 (17:00-17:30):
□ Repetir pitch ajustado
□ Simular perguntas de jurados
□ Praticar respostas preparadas
□ Testar: backup funciona se app travar?

ENSAIO 3 (17:30-18:00):
□ Ensaio final completo
□ Cronometrar novamente
□ Verificar: confiança na fala?
□ Confirmar: primeira e última frase decoradas?
```

**18:00 - 20:00 | Preparação Final e Checklist**
```
CRITICAL - 2h

18:00-18:30 | Configuração Técnica:
□ Instalar app no tablet de demonstração
□ Testar: app abre sem internet?
□ Carregar dispositivos 100%
□ Baixar vídeos das aulas no app
□ Testar: vídeos tocam offline?

18:30-19:00 | Materiais de Apoio:
□ Imprimir cartão de cola (A6)
□ Imprimir slides em A4 (plano C)
□ Preparar pen drives (2x)
□ Organizar cabos e carregadores
□ Garrafa de água

19:00-19:30 | Revisão Mental:
□ Ler roteiro de pitch (voz alta)
□ Decorar primeira frase
□ Decorar frase final
□ Visualizar sucesso
□ Respiração 4-7-8 (5 ciclos)

19:30-20:00 | Descanso:
□ Jantar leve
□ Não estudar mais (deixar mente descansar)
□ Dormir cedo (mínimo 7h)
□ Alarme: 06:00 (no dia seguinte)
```

---

## 📋 CHECKLIST FINAL PRÉ-APRESENTAÇÃO

### **DIA 30/OUT - MANHÃ DA APRESENTAÇÃO**

**06:00 - 07:00 | Preparação Pessoal**
```
□ Café da manhã nutritivo
□ Roupa profissional confortável
□ Revisar cartão de cola (não memorizar)
□ Respiração calma
```

**07:00 - 08:00 | Verificação Técnica**
```
□ Tablet: 100% carregado + carregador backup
□ Laptop: 100% carregado + carregador
□ App: abre sem falhas?
□ Vídeos: tocam offline?
□ Dashboard: http://localhost:3001 carrega?
□ Slides: abrem corretamente?
□ Pen drives: 2x com TUDO
□ Água: 2 garrafas pequenas
```

**08:00 - 09:00 | Chegada UEM**
```
□ Chegar 1h antes
□ Testar projetor
□ Conectar laptop
□ Ajustar resolução
□ Testar microfone
□ Posicionar tablet + laptop + água
□ Ensaio mental rápido
```

**09:00 - 09:30 | Preparação Mental**
```
□ Respiração 4-7-8 (5 ciclos)
□ Visualizar sucesso
□ Revisar primeira frase
□ Revisar frase final
□ Ir ao banheiro
□ Desligar celular
```

**09:30 | SHOWTIME 🎬**
```
□ Respirar fundo 3x
□ Sorrir genuinamente
□ Subir ao palco com confiança
□ ARRASAR! 🚀
```

---

## 🎯 DIFERENÇAS-CHAVE DO BACKLOG CORRIGIDO

### **❌ ERROS DO BACKLOG ANTERIOR:**
1. Focava muito em matching de vagas (Fase 2)
2. USSD descrito como "simulado" quando é funcional
3. Dashboard mostrava "validação de vagas" como prioritário
4. Métricas de MVP irrealistas (200 vítimas, 40% emprego)

### **✅ ACERTOS DO BACKLOG CORRIGIDO:**
1. **70% do tempo no App de Capacitação** (Fase 1)
2. **USSD claramente marcado como "funcional"**
3. **Dashboard foca em monitorar PROGRESSO de cursos**
4. **Mockup de vagas é apenas visual** (Fase 2)
5. **Métricas realistas:** "10 perfis teste, 3 cursos funcionais"

---

## 💡 MENSAGEM FINAL

```
═══════════════════════════════════════════════════════════

              🎯 FOCO DO BACKLOG CORRIGIDO

═══════════════════════════════════════════════════════════

Este backlog foi reescrito para refletir perfeitamente
a estratégia WIRA HÍBRIDO:

✅ CAPACITAÇÃO PRIMEIRO (70% do esforço)
   App funcional, cursos reais, certificação validada

✅ EMPREGO DEPOIS (30% mockup + código)
   Demonstração visual da visão futura

✅ TRANSPARÊNCIA TOTAL
   USSD = funcional
   Vagas = mockup
   Matching = código pronto, não deployado

═══════════════════════════════════════════════════════════

"Não prometemos o que não entregamos.
 Entregamos perfeitamente o que é essencial.
 E mostramos com clareza o que vem a seguir."

═══════════════════════════════════════════════════════════

                    BOA SORTE! 🚀

═══════════════════════════════════════════════════════════
```

---

**FIM DO BACKLOG TÉCNICO CORRIGIDO**

**Status:** ✅ Alinhado com WIRA Híbrido  
**Foco:** 📚 Capacitação > 💼 Empregabilidade  
**Estratégia:** Fase 1 perfeita, Fase 2 planejada