
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello from MyComponent!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 18,
    color: '#343a40',
  },
});

export default MyComponent;
