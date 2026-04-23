import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';

export default function RegistroNotaScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState({ n1: '', n2: '', n3: '', n4: '' });
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!cedula) return;
    setLoading(true);
    try {
      const response = await api.get(`/estudiantes/${cedula}`);
      setNombre(response.data.nombre);
      setNotas({
        n1: response.data.nota1?.toString() || '0',
        n2: response.data.nota2?.toString() || '0',
        n3: response.data.nota3?.toString() || '0',
        n4: response.data.nota4?.toString() || '0',
      });
    } catch (error) {
      Alert.alert('Error', 'Estudiante no encontrado');
      setNombre('');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/estudiantes/notas/${cedula}`, {
        nota1: parseFloat(notas.n1),
        nota2: parseFloat(notas.n2),
        nota3: parseFloat(notas.n3),
        nota4: parseFloat(notas.n4),
      });
      Alert.alert('Éxito', 'Notas guardadas correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las notas');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}><Text style={styles.label}>Cédula</Text><TextInput style={styles.input} value={cedula} onChangeText={setCedula} keyboardType="numeric" /></View>
        <View style={styles.inputGroup}><Text style={styles.label}>Nombre</Text><Text style={styles.nameText}>{nombre || '---'}</Text></View>
        
        <TouchableOpacity style={styles.consultButton} onPress={handleConsultar} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Consultar'}</Text>
        </TouchableOpacity>

        <View style={styles.notesBox}>
          {['1', '2', '3', '4'].map((num) => (
            <View key={num} style={styles.inputGroup}>
              <Text style={styles.label}>Nota {num}</Text>
              <TextInput 
                style={styles.input} 
                value={notas[`n${num}`]} 
                onChangeText={(val) => setNotas({...notas, [`n${num}`]: val})} 
                keyboardType="decimal-pad"
              />
            </View>
          ))}
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
              <Text style={styles.buttonText}>guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  form: { marginTop: 30 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { color: '#fff', width: 80, fontSize: 16 },
  input: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#fff', color: '#fff', padding: 5 },
  nameText: { color: '#aaa', fontSize: 16, flex: 1 },
  consultButton: { backgroundColor: '#1c2833', padding: 10, borderRadius: 5, alignSelf: 'flex-end', marginBottom: 20 },
  notesBox: { borderWeight: 1, borderColor: '#fff', borderWidth: 1, padding: 20, borderRadius: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  saveButton: { backgroundColor: '#1c2833', padding: 12, borderRadius: 5, minWidth: 100, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
