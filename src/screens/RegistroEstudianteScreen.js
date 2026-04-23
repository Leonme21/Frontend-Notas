import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function RegistroEstudianteScreen() {
  // Manejo de estado para los campos del formulario
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [materia, setMateria] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validación básica
    if (!cedula || !nombre || !materia) {
      Alert.alert('Atención', 'Por favor completa los campos obligatorios (Cédula, Nombre y Materia)');
      return;
    }

    setLoading(true);
    try {
      // Llamada a tu API en Render
      const response = await api.post('/estudiantes', {
        cedula,
        nombre,
        correo,
        celular,
        materia
      });

      if (response.status === 201) {
        Alert.alert('¡Éxito!', 'Estudiante registrado y materia asignada correctamente.');
        // Limpiamos los campos después del éxito
        setCedula('');
        setNombre('');
        setCorreo('');
        setCelular('');
        setMateria('');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'No se pudo conectar con el servidor';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Estudiante</Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cédula</Text>
          <TextInput style={styles.input} value={cedula} onChangeText={setCedula} placeholderTextColor="#666" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholderTextColor="#666" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo</Text>
          <TextInput style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular</Text>
          <TextInput style={styles.input} value={celular} onChangeText={setCelular} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Materia</Text>
          <TextInput style={styles.input} value={materia} onChangeText={setMateria} placeholder="Ej: Programación" />
        </View>
        
        <TouchableOpacity 
          style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  form: { padding: 10 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  label: { color: '#fff', width: 80, fontSize: 16 },
  input: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#fff', color: '#fff', padding: 5, fontSize: 16 },
  primaryButton: { backgroundColor: '#1c2833', padding: 15, borderRadius: 8, alignSelf: 'flex-end', marginTop: 20, minWidth: 120, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
