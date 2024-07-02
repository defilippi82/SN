import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import {Panico} from '../screens/Panico';
import {RegistrarSocio} from '../screens/RegistrarSocios';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Panico" component={Panico} />
        <Stack.Screen name="RegistrarSocio" component={RegistrarSocio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
