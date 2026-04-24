import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [contador, setContador] = useState(0);
  const [permiso, setPermiso] = useState(null);

  useEffect(() => {
    cargarContador();
  }, []);

  useEffect(() => {
    guardarContador(contador);
  }, [contador]);

  const incrementar = () => {
    setContador(prev => prev + 1);
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem('contador', JSON.stringify(valor));
    } catch (e) {
      console.log('Error guardando', e);
    }
  };

  const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem('contador');
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error cargando', e);
    }
  };

  const pedirPermiso = async () => {
    try {
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      setPermiso(status);

      if (status === 'granted') {
        alert('Permiso concedido 👍');
      } else {
        alert('Necesitamos permisos para enviarte notificaciones.');
      }
    } catch (e) {
      console.log('expo-notifications no está instalado', e);
      alert('Instala expo-notifications con:\nnpx expo install expo-notifications');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones App</Text>

      <View style={styles.buttonSpacer}>
        <Button title="Pedir permiso" onPress={pedirPermiso} color="#6200ee" />
      </View>

      {permiso !== null && (
        <Text style={styles.statusText}>Estado de permiso: {permiso}</Text>
      )}

      <View style={styles.counterBox}>
        <Text style={styles.counterText}>Contador: {contador}</Text>
        <Button title="Incrementar +1" onPress={incrementar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonSpacer: {
    marginBottom: 10,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  counterBox: {
    marginTop: 40,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 24,
    marginBottom: 15,
  },
});