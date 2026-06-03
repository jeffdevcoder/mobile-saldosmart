import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, SairaStencilOne_400Regular } from '@expo-google-fonts/saira-stencil-one';
import Toast from 'react-native-toast-message';

export default function App() {
  let [fontsLoaded] = useFonts({
    SairaStencilOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
