import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../services/api';

export default function RegistroEstudianteScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [materia, setMateria] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!cedula || !nombre || !materia) {
      Alert.alert('¡Atención!', 'Cédula, Nombre y Materia son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/estudiantes', {
        cedula, nombre, correo, celular, materia
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('¡Éxito!', 'Estudiante registrado correctamente.');
        setCedula(''); setNombre(''); setCorreo(''); setCelular(''); setMateria('');
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'No se pudo registrar';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Nuevo Estudiante</Text>

        <View style={styles.card}>
          <Text style={styles.instructions}>Completa la información para dar de alta al estudiante.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula</Text>
            <TextInput
              style={styles.input}
              value={cedula}
              onChangeText={setCedula}
              keyboardType="numeric"
              placeholder="Número de identificación"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              placeholder="usuario@correo.com"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Celular</Text>
            <TextInput
              style={styles.input}
              value={celular}
              onChangeText={setCelular}
              keyboardType="phone-pad"
              placeholder="Ej: 3001234567"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Materia</Text>
            <TextInput
              style={styles.input}
              value={materia}
              onChangeText={setMateria}
              placeholder="Asignatura inicial"
              placeholderTextColor="#64748b"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.buttonText}>Registrar Estudiante</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 25, paddingTop: 60, paddingBottom: 40 },
  header: { color: '#38bdf8', fontSize: 32, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  instructions: { color: '#94a3b8', textAlign: 'center', marginBottom: 25, fontSize: 14 },
  card: { backgroundColor: '#1e293b', padding: 25, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  inputGroup: { marginBottom: 18 },
  label: { color: '#fbbf24', fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#334155', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: '#475569' },
  button: { backgroundColor: '#38bdf8', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15, shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonText: { color: '#0f172a', fontWeight: 'bold', fontSize: 18 }
});
