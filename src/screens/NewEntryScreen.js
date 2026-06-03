import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function NewEntryScreen({ route, navigation }) {
  const { type } = route.params; // 'entrada' or 'saida'
  const isEntry = type === 'entrada';
  
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  
  const { addTransaction } = useContext(AppContext);

  const handleSave = () => {
    if (description && value && !isNaN(value)) {
      addTransaction(type, description, value);
      navigation.goBack();
    } else {
      alert('Por favor, preencha a descrição e um valor válido.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Nova {isEntry ? 'Entrada' : 'Saída'}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descrição (ex: Salário, Mercado)"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor (R$)"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={[styles.button, isEntry ? styles.entryButton : styles.expenseButton]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Salvar {isEntry ? 'Entrada' : 'Saída'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  entryButton: {
    backgroundColor: '#28a745',
  },
  expenseButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
