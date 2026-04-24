import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Usaremos iconos para que se vea mejor

import ConsultaScreen from './src/screens/ConsultaScreen';
import RegistroEstudianteScreen from './src/screens/RegistroEstudianteScreen';
import RegistroNotaScreen from './src/screens/RegistroNotaScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Configuración de Iconos
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Consulta') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Reg. Estud') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            } else if (route.name === 'Reg. Nota') {
              iconName = focused ? 'create' : 'create-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // Estilo General de la Barra
          tabBarActiveTintColor: '#38bdf8',
          tabBarInactiveTintColor: '#94a3b8',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1e293b',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Consulta" component={ConsultaScreen} />
        <Tab.Screen name="Reg. Estud" component={RegistroEstudianteScreen} />
        <Tab.Screen name="Reg. Nota" component={RegistroNotaScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
