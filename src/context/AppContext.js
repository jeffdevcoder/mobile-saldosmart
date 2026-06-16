import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'entrada',
      description: 'Salário Mensal',
      value: 4500.00,
      date: '05/06/2026',
    },
    {
      id: '2',
      type: 'saida',
      description: 'Supermercado Extra',
      value: 382.50,
      date: '06/06/2026',
    },
    {
      id: '3',
      type: 'saida',
      description: 'Assinatura Netflix',
      value: 55.90,
      date: '06/06/2026',
    },
    {
      id: '4',
      type: 'entrada',
      description: 'Desenvolvimento Freelance',
      value: 1200.00,
      date: '07/06/2026',
    },
    {
      id: '5',
      type: 'saida',
      description: 'Almoço Restaurante',
      value: 84.90,
      date: '08/06/2026',
    },
  ]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('@registered_users');
        if (storedUsers) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }
      } catch (e) {
        console.error('Error loading users', e);
      }
    };
    loadData();
  }, []);

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === 'entrada' ? acc + curr.value : acc - curr.value;
  }, 0);

  const login = (email, password) => {
    if (email === 'admin@saldosmart.com' && password === '123456') {
      return { email, role: 'admin' };
    }
    
    const userExists = registeredUsers.find(u => u.email === email && u.password === password);
    if (userExists) {
      return { email: userExists.email };
    }
    
    return false;
  };

  const register = async (email, password) => {
    if (email === 'admin@admin.com' || registeredUsers.some(u => u.email === email)) {
      return false;
    }
    
    const newUsersList = [...registeredUsers, { email, password }];
    setRegisteredUsers(newUsersList);

    try {
      await AsyncStorage.setItem('@registered_users', JSON.stringify(newUsersList));
    } catch (e) {
      console.error('Error saving users', e);
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
  };

  const addTransaction = (type, description, value) => {
    const newTransaction = {
      id: Date.now().toString(),
      type,
      description,
      value: parseFloat(value),
      date: new Date().toLocaleDateString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        transactions,
        balance,
        login,
        register,
        logout,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
