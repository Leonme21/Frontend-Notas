import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function RegistroEstudianteScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [materia, setMateria] = useState('');

  const [materiasList, setMateriasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMaterias, setFetchingMaterias] = useState(true);

  // Cargar materias del backend al iniciar
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const response = await api.get('/estudiantes/config/materias');
        setMateriasList(response.data);
        if (response.data.length > 0) {
          setMateria(response.data[0].nombre);
        }
      } catch (error) {
        console.error('Error cargando materias:', error);
      } finally {
        setFetchingMaterias(false);
      }
    };
    cargarMaterias();
  }, []);

  const handleRegister = async () => {
    if (!cedula || !nombre || !materia) {
      Alert.alert('¡Atención!', 'Cédula, Nombre y Materia son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/estudiantes', {
        cedula, nombre, correo, celular, materia
      });
      Alert.alert('¡Éxito!', 'Estudiante registrado correctamente.');
      setCedula(''); setNombre(''); setCorreo(''); setCelular('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar');
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula</Text>
            <TextInput style={styles.input} value={cedula} onChangeText={setCedula} keyboardType="numeric" placeholder="Cédula" placeholderTextColor="#64748b" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre completo" placeholderTextColor="#64748b" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo</Text>
            <TextInput style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" placeholder="correo@ejemplo.com" placeholderTextColor="#64748b" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Celular</Text>
            <TextInput style={styles.input} value={celular} onChangeText={setCelular} keyboardType="phone-pad" placeholder="Celular" placeholderTextColor="#64748b" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Materia</Text>
            <View style={styles.pickerWrapper}>
              {fetchingMaterias ? (
                <ActivityIndicator color="#38bdf8" style={{ padding: 15 }} />
              ) : (
                <Picker
                  selectedValue={materia}
                  onValueChange={(val) => setMateria(val)}
                  dropdownIconColor="#38bdf8"
                  mode="dropdown"
                  style={styles.picker}
                  itemStyle={styles.pickerItemStyle} // Solo para iOS
                >
                  {materiasList.length === 0 ? (
                    <Picker.Item label="No hay materias" value="" color="#94a3b8" />
                  ) : (
                    materiasList.map((m, i) => (
                      <Picker.Item
                        key={i}
                        label={m.nombre}
                        value={m.nombre}
                        color={Platform.OS === 'ios' ? '#ffffff' : '#ffffff'}
                      />
                    ))
                  )}
                </Picker>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.buttonText}>Registrar Estudiante</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: { color: '#38bdf8', fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 25, elevation: 10 },
  inputGroup: { marginBottom: 18 },
  label: { color: '#fbbf24', fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#334155', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16 },

  pickerWrapper: {
    backgroundColor: '#334155',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    overflow: 'hidden'
  },
  picker: {
    color: '#ffffff',
    backgroundColor: '#334155',
    height: 55,
    width: '100%',
  },
  pickerItemStyle: {
    color: '#ffffff',
    fontSize: 16,
    height: 150, // Solo afecta a iOS
  },

  button: { backgroundColor: '#38bdf8', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#0f172a', fontWeight: 'bold', fontSize: 18 }
});
