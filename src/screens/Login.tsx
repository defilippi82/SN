import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { UserContext } from '../services/UserContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUserData } = useContext(UserContext);
  const navigation = useNavigation();

  const login = async () => {
    try {
      const q = query(collection(db, "usuarios"), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.contrasena === password) {
            setUserData(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
            Alert.alert(
              'Ingreso exitoso',
              `¡Bienvenido, ${userData.nombre}! Realice su reserva`,
              [{ text: 'OK', onPress: () => navigation.navigate('Panico') }]
            );
          } else {
            Alert.alert('Error', 'Contraseña incorrecta');
          }
        });
      } else {
        Alert.alert('Error', 'Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso de Socios / Inquilinos</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ingresar" onPress={login} color="green" />
        <Button title="Registrarse" onPress={() => navigation.navigate('RegistrarSocio')} color="grey" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Login;
