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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export default function NewEntryScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { type: initialType } = route.params || { type: 'entrada' };

  const [transactionType, setTransactionType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  
  const isEntry = transactionType === 'entrada';
  const { user } = useContext(AppContext);

  const handleSave = async () => {
    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campo Vazio',
        text2: 'Por favor, informe uma descrição.'
      });
      return;
    }

    const numericValue = parseFloat(value.replace(',', '.'));

    if (isNaN(numericValue) || numericValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Valor Inválido',
        text2: 'Por favor, informe um valor maior que zero.'
      });
      return;
    }

    try {
      await api.post(
        '/transactions',
        {
          tipo: transactionType,
          valor: numericValue,
          descricao: description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Transação salva com sucesso!'
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);

    } catch (error) {
      console.log(error.response?.data || error);

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível salvar a transação.'
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Movimentação</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleTab, 
              isEntry ? styles.toggleTabEntryActive : null
            ]}
            onPress={() => setTransactionType('entrada')}
            activeOpacity={0.9}
          >
            <Feather 
              name="arrow-up-right" 
              size={18} 
              color={isEntry ? '#fff' : '#64748b'} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[styles.toggleText, isEntry ? styles.toggleTextActive : null]}>
              Entrada
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.toggleTab, 
              !isEntry ? styles.toggleTabExpenseActive : null
            ]}
            onPress={() => setTransactionType('saida')}
            activeOpacity={0.9}
          >
            <Feather 
              name="arrow-down-left" 
              size={18} 
              color={!isEntry ? '#fff' : '#64748b'} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[styles.toggleText, !isEntry ? styles.toggleTextActive : null]}>
              Saída
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <View style={styles.inputWrapper}>
            <Feather name="file-text" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário, Supermercado, Aluguel"
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              autoCapitalize="sentences"
            />
          </View>

          <Text style={styles.inputLabel}>Valor (R$)</Text>
          <View style={styles.inputWrapper}>
            <Feather name="dollar-sign" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor="#94a3b8"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isEntry ? styles.saveButtonEntry : styles.saveButtonExpense]} 
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              Salvar {isEntry ? 'Entrada' : 'Saída'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    padding: 4,
    borderRadius: 16,
    marginBottom: 35,
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTabEntryActive: {
    backgroundColor: '#2ebd59',
    shadowColor: '#2ebd59',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleTabExpenseActive: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#fff',
  },
  form: {
    marginBottom: 35,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1e293b',
  },
  buttonContainer: {
    marginTop: 10,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonEntry: {
    backgroundColor: '#2ebd59',
    shadowColor: '#2ebd59',
  },
  saveButtonExpense: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

