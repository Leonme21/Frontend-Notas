import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function ConsultaScreen() {
  const [cedula, setCedula] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!cedula) {
      Alert.alert('Error', 'Ingresa una cédula para consultar');
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/estudiantes/${cedula}`);
      setEstudiante(response.data);
    } catch (error) {
      setEstudiante(null);
      Alert.alert('Error', 'Estudiante no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cédula</Text>
          <TextInput style={styles.input} value={cedula} onChangeText={setCedula} keyboardType="numeric" />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConsultar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Consultar</Text>}
        </TouchableOpacity>

        {estudiante && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Materia: {estudiante.materia}</Text>
            <Text style={styles.resultText}>Nota 1: {estudiante.nota1}</Text>
            <Text style={styles.resultText}>Nota 2: {estudiante.nota2}</Text>
            <Text style={styles.resultText}>Nota 3: {estudiante.nota3}</Text>
            <Text style={styles.resultText}>Nota 4: {estudiante.nota4}</Text>
            <Text style={[styles.resultText, styles.definitiva]}>Definitiva: {estudiante.definitiva}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  form: { marginTop: 50 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  label: { color: '#fff', width: 80, fontSize: 16 },
  input: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#fff', color: '#fff', padding: 5 },
  button: { backgroundColor: '#1c2833', padding: 12, borderRadius: 5, alignSelf: 'flex-end', marginTop: 10, minWidth: 100, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { borderWeight: 1, borderColor: '#fff', borderWidth: 1, padding: 20, marginTop: 40, borderRadius: 10 },
  resultText: { color: '#fff', fontSize: 18, marginBottom: 10 },
  definitiva: { borderTopWidth: 1, borderTopColor: '#fff', paddingTop: 10, fontWeight: 'bold', color: '#4caf50' }
});
