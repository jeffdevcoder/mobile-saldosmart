import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Image
} from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import { AppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AppContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Preencha todos os campos.'
      });

      return;
    }

    try {
      const response = await api.post('/login', {
        email,
        senha: password
      });

      const { token, usuario } = response.data;

      setTimeout(async () => {
        const userData = {
          ...usuario,
          token
        };

        await AsyncStorage.setItem(
          '@SaldoSmart:user',
          JSON.stringify(userData)
        );

        setUser(userData);
      }, 1000);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!'
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Email ou senha inválidos.'
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2ebd59" />
      
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
        <Text style={styles.title}>SaldoSmart</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#333"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={handleLogin}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#333"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Primeira vez? Cadastre-se!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ebd59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'SairaStencilOne_400Regular',
    color: 'white',
    marginTop: 5,
  },
  formContainer: {
    width: '85%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#26a64d',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1e873e',
    marginTop: 5,
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  linkButton: {
    alignItems: 'center',
    padding: 10,
  },
  linkText: {
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
});
