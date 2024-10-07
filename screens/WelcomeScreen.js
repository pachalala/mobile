import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>¡Bienvenido a la aplicación!</Text>
    </View>
  );
}
