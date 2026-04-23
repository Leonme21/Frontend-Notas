import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importación de pantallas
import ConsultaScreen from './src/screens/ConsultaScreen';
import RegistroEstudianteScreen from './src/screens/RegistroEstudianteScreen';
import RegistroNotaScreen from './src/screens/RegistroNotaScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Ocultar el título de arriba
          tabBarStyle: { 
            backgroundColor: '#000', 
            height: 80, 
            borderTopWidth: 0,
            paddingBottom: 20
          },
          tabBarActiveBackgroundColor: '#4a2323', // Color rojizo oscuro para el botón activo según mockup
          tabBarInactiveTintColor: '#fff',
          tabBarActiveTintColor: '#fff',
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIconStyle: { display: 'none' } // En el mockup no hay iconos, solo texto
        }}
      >
        <Tab.Screen name="consulta" component={ConsultaScreen} />
        <Tab.Screen name="reg. estud" component={RegistroEstudianteScreen} />
        <Tab.Screen name="reg. nota" component={RegistroNotaScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
