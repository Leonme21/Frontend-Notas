import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../services/api';

export default function RegistroNotaScreen() {
  const [cedula, setCedula] = useState('');
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [nombreEncontrado, setNombreEncontrado] = useState('');
  const [notas, setNotas] = useState({ n1: '', n2: '', n3: '', n4: '' });
  const [definitivaLocal, setDefinitivaLocal] = useState('----');
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!cedula && !nombreBusqueda) {
      Alert.alert('Atención', 'Ingresa una cédula o un nombre para buscar');
      return;
    }
    setLoading(true);
    try {
      // Intentamos buscar. Nota: Tu backend debe soportar búsqueda por nombre si usas ese campo.
      const url = cedula ? `/estudiantes/${cedula}` : `/estudiantes?nombre=${nombreBusqueda}`;
      const response = await api.get(url);

      const data = Array.isArray(response.data) ? response.data[0] : response.data;

      if (data) {
        setNombreEncontrado(data.nombre);
        if (cedula === '') setCedula(data.cedula?.toString());
        setNotas({
          n1: data.nota1?.toString() || '0',
          n2: data.nota2?.toString() || '0',
          n3: data.nota3?.toString() || '0',
          n4: data.nota4?.toString() || '0',
        });
        setDefinitivaLocal(data.definitiva?.toString() || '----');
      }
    } catch (error) {
      Alert.alert('Error', 'Estudiante no encontrado');
      setNombreEncontrado('');
    } finally {
      setLoading(false);
    }
  };

  const calcularDefinitiva = () => {
    const { n1, n2, n3, n4 } = notas;
    const promedio = (parseFloat(n1 || 0) + parseFloat(n2 || 0) + parseFloat(n3 || 0) + parseFloat(n4 || 0)) / 4;
    setDefinitivaLocal(promedio.toFixed(2));
  };

  const handleGuardar = async () => {
    if (!cedula || !nombreEncontrado) {
      Alert.alert('Error', 'Primero busca un estudiante');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/estudiantes/notas/${cedula}`, {
        nota1: parseFloat(notas.n1) || 0,
        nota2: parseFloat(notas.n2) || 0,
        nota3: parseFloat(notas.n3) || 0,
        nota4: parseFloat(notas.n4) || 0,
      });
      Alert.alert('¡Guardado!', 'Las notas se han actualizado en el servidor.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las notas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Gestión de Notas</Text>

        <View style={styles.searchCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula</Text>
            <TextInput style={styles.input} value={cedula} onChangeText={setCedula} keyboardType="numeric" placeholder="102030..." placeholderTextColor="#64748b" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={nombreBusqueda} onChangeText={setNombreBusqueda} placeholder="Nombre del estudiante" placeholderTextColor="#64748b" />
          </View>
          <TouchableOpacity style={styles.consultButton} onPress={handleConsultar} disabled={loading}>
            {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.buttonText}>Consultar</Text>}
          </TouchableOpacity>
        </View>

        {nombreEncontrado ? (
          <View style={styles.notesCard}>
            <Text style={styles.studentName}>{nombreEncontrado}</Text>

            {['1', '2', '3', '4'].map((num) => (
              <View key={num} style={styles.rowInput}>
                <Text style={styles.notaLabel}>Nota {num}</Text>
                <TextInput
                  style={styles.notaInput}
                  value={notas[`n${num}`]}
                  onChangeText={(val) => setNotas({ ...notas, [`n${num}`]: val })}
                  keyboardType="decimal-pad"
                />
              </View>
            ))}

            <View style={styles.actionFooter}>
              <View style={styles.definitivaDisplay}>
                <Text style={styles.definitivaText}>{definitivaLocal}</Text>
              </View>

              <TouchableOpacity style={styles.calcButton} onPress={calcularDefinitiva}>
                <Text style={styles.buttonTextSmall}>definitiva</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                <Text style={styles.buttonTextSmall}>guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingTop: 50 },
  header: { color: '#38bdf8', fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  searchCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, marginBottom: 20 },
  inputGroup: { marginBottom: 12 },
  label: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#334155', borderRadius: 10, padding: 12, color: '#fff' },
  consultButton: { backgroundColor: '#38bdf8', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0f172a', fontWeight: 'bold' },
  buttonTextSmall: { color: '#0f172a', fontWeight: 'bold', fontSize: 13 },

  notesCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 25, borderWeight: 1, borderColor: '#fff', borderWidth: 1 },
  studentName: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textDecorationLine: 'underline' },
  rowInput: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' },
  notaLabel: { color: '#fff', fontSize: 16 },
  notaInput: { backgroundColor: '#fff', width: '60%', borderRadius: 5, padding: 8, color: '#000', fontSize: 16 },

  actionFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, alignItems: 'center' },
  definitivaDisplay: { backgroundColor: '#d1e7dd', padding: 12, borderRadius: 10, minWidth: 80, alignItems: 'center', borderWidth: 1, borderColor: '#a3cfbb' },
  definitivaText: { color: '#0f5132', fontWeight: 'bold', fontSize: 16 },
  calcButton: { backgroundColor: '#d1e7dd', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#a3cfbb' },
  saveButton: { backgroundColor: '#cfe2ff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#b6d4fe' }
});
