import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import ListScreen from './screens/ListScreen';
import FormScreen from './screens/FormScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Listado">
          <Drawer.Screen name="Bienvenida" component={WelcomeScreen} />
          <Drawer.Screen name="Listado" component={ListScreen} />
          <Drawer.Screen name="Formulario" component={FormScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
