import React, {
  useState,
  useContext,
  useCallback
} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const username = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) 
    : 'Usuário';

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setBalance(response.data.saldo);
      setTotalEntries(response.data.entradas);
      setTotalExpenses(response.data.saidas);

    } catch (error) {
      console.log(error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await api.get('/transactions', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setTransactions(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      loadTransactions();
    }, [user])
  );

  const renderItem = ({ item }) => {
    const isEntry = item.tipo === 'entrada';
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconWrapper, isEntry ? styles.iconWrapperEntry : styles.iconWrapperExpense]}>
          <Feather 
            name={isEntry ? 'arrow-up-right' : 'arrow-down-left'} 
            size={20} 
            color={isEntry ? '#2ebd59' : '#dc3545'} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.descricao}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View style={styles.transactionActions}>
          <Text
            style={[
              styles.transactionValue,
              isEntry ? styles.entryText : styles.expenseText
            ]}
          >
            {isEntry ? '+' : '-'} R$ {Number(item.valor).toFixed(2)}
          </Text>

          <TouchableOpacity
            onPress={() => {
              handleDelete(item.id);
            }}
            style={styles.deleteButton}
          >
            <Feather
              name="trash-2"
              size={18}
              color="#dc3545"
            />
        </TouchableOpacity>
        </View>
      </View>
  );
  };

  const handleDelete = async (id) => {

  try {
    const response = await api.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    await loadDashboard();
    await loadTransactions();

    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Transação removida.'
    });

  } catch (error) {
    console.log('ERRO COMPLETO:', error);
    console.log('ERRO RESPONSE:', error.response?.data);
    console.log('STATUS:', error.response?.status);

    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Não foi possível remover.'
    });
  }
};

  const handleLogout = () => {
    Toast.show({
      type: 'info',
      text1: 'Saindo...',
      text2: 'Você está sendo desconectado'
    });

    setTimeout(() => {
      logout();
    }, 3000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />

      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Olá, {username}!</Text>
            <Text style={styles.subGreeting}>Bem-vindo ao SaldoSmart</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Geral Disponível</Text>
        <Text style={styles.balanceValue}>R$ {balance.toFixed(2)}</Text>
        
        <View style={styles.cardDivider} />
        
        <View style={styles.totalsContainer}>
          <View style={styles.totalBlock}>
            <View style={styles.totalHeader}>
              <Feather name="arrow-up-circle" size={16} color="#e6f9ec" />
              <Text style={styles.totalLabel}>Entradas</Text>
            </View>
            <Text style={styles.totalAmountEntry}>R$ {totalEntries.toFixed(2)}</Text>
          </View>
          
          <View style={styles.verticalDivider} />

          <View style={styles.totalBlock}>
            <View style={styles.totalHeader}>
              <Feather name="arrow-down-circle" size={16} color="#fdebee" />
              <Text style={styles.totalLabel}>Saídas</Text>
            </View>
            <Text style={styles.totalAmountExpense}>R$ {totalExpenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Transações Recentes</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#cbd5e1" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>Nenhuma movimentação registrada</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={[styles.actionsContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.entryButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NewEntry', { type: 'entrada' })}
        >
          <Feather name="plus-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Nova entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.expenseButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NewEntry', { type: 'saida' })}
        >
          <Feather name="minus-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Nova saída</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f6fa',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2ebd59',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#2ebd59',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subGreeting: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#0f7331',
    shadowColor: '#0f7331',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 18,
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBlock: {
    flex: 1,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  totalAmountEntry: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmountExpense: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 15,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapperEntry: {
    backgroundColor: '#e6f9ec',
  },
  iconWrapperExpense: {
    backgroundColor: '#fdebee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryText: {
    color: '#2ebd59',
  },
  expenseText: {
    color: '#dc3545',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  entryButton: {
    backgroundColor: '#2ebd59',
    shadowColor: '#2ebd59',
  },
  expenseButton: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  transactionActions: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    marginTop: 6,
  },
  transactionActions: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    marginTop: 8,
  },
});