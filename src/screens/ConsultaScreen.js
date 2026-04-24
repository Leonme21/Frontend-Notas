import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';

export default function ConsultaScreen() {
  const [cedula, setCedula] = useState('');
  const [nombreBusqueda, setNombreBusqueda] = useState(''); // Nuevo estado
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!cedula && !nombreBusqueda) {
      Alert.alert('¡Opps!', 'Por favor ingresa una cédula o un nombre');
      return;
    }
    setLoading(true);
    try {
      // Usamos tu nuevo endpoint flexible
      const url = cedula ? `/estudiantes/${cedula}` : `/estudiantes?nombre=${nombreBusqueda}`;
      const response = await api.get(url);

      // Si es búsqueda por nombre, tomamos el primer resultado del array
      const data = Array.isArray(response.data) ? response.data[0] : response.data;

      if (data) {
        setEstudiante(data);
        if (!cedula) setCedula(data.cedula?.toString());
      } else {
        setEstudiante(null);
        Alert.alert('No encontrado', 'No se hallaron resultados.');
      }
    } catch (error) {
      setEstudiante(null);
      Alert.alert('Error', 'Estudiante no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Consultar Notas</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cédula</Text>
          <TextInput
            style={styles.input}
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
            placeholder="Ej: 123456"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>O buscar por Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombreBusqueda}
            onChangeText={setNombreBusqueda}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor="#64748b"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConsultar} disabled={loading}>
          {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.buttonText}>Consultar</Text>}
        </TouchableOpacity>
      </View>

      {estudiante && (
        <View style={styles.resultCard}>
          <Text style={styles.studentName}>{estudiante.nombre}</Text>
          <Text style={styles.materiaTitle}>{estudiante.materia || 'Materia no asignada'}</Text>

          <View style={styles.grid}>
            {[1, 2, 3, 4].map((num) => (
              <View key={num} style={styles.notaItem}>
                <Text style={styles.notaLabel}>Nota {num}</Text>
                <Text style={styles.notaValue}>{estudiante[`nota${num}`] || '0'}</Text>
              </View>
            ))}
          </View>

          <View style={styles.definitivaContainer}>
            <Text style={styles.definitivaLabel}>Puntaje Final</Text>
            <Text style={styles.definitivaValue}>{estudiante.definitiva || '0.00'}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ... (los estilos se mantienen iguales al diseño anterior)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 25, paddingTop: 60 },
  header: { color: '#38bdf8', fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, elevation: 10 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#fbbf24', fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#334155', borderRadius: 12, padding: 15, color: '#f8fafc', fontSize: 16 },
  button: { backgroundColor: '#38bdf8', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0f172a', fontWeight: 'bold', fontSize: 18 },
  resultCard: { backgroundColor: '#1e293b', marginTop: 25, padding: 20, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: '#4ade80' },
  studentName: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  materiaTitle: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  notaItem: { width: '45%', backgroundColor: '#334155', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center' },
  notaLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 5 },
  notaValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  definitivaContainer: { marginTop: 10, padding: 20, backgroundColor: '#4ade8020', borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#4ade80' },
  definitivaLabel: { color: '#4ade80', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  definitivaValue: { color: '#4ade80', fontSize: 36, fontWeight: 'bold' }
});
