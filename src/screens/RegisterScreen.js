import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos.'
      });
      return;
    }

    if (!email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O e-mail deve conter "@"!'
      });
      return;
    }

    if (password.length < 6 || password.length > 12) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'A senha deve ter entre 6 e 12 caracteres!'
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'As senhas não coincidem!'
      });
      return;
    }

    try {
      await api.post('/register', {
        nome: name,
        email,
        senha: password
      });

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Cadastro realizado com sucesso!'
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);

    } catch (error) {

      const mensagem =
        error.response?.data?.erro ||
        'Erro ao cadastrar usuário.';

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: mensagem
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2ebd59" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>SaldoSmart</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#333"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={handleRegister}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#333"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={handleRegister}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#333"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={handleRegister}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          placeholderTextColor="#333"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Já tem uma conta? Entre agora!</Text>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
