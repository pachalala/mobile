import * as React from 'react';
import { View, Alert, FlatList } from 'react-native';
import { TextInput, Button, Text, List } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';

// Función para guardar datos en AsyncStorage
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('userData', jsonValue);
  } catch (e) {
    console.error("Error al guardar los datos", e);
  }
};

// Función para obtener datos desde AsyncStorage
const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error al obtener los datos", e);
  }
};

// Pantalla de Bienvenida
function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>¡Bienvenido a la aplicación!</Text>
    </View>
  );
}

// Pantalla de Listado de Usuarios
function ListScreen({ navigation }) {
  const [users, setUsers] = React.useState([]);

  // Obtener los usuarios almacenados al cargar la pantalla
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setUsers(data);

    console.log ("data:"+ data);

    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button mode="contained" onPress={() => navigation.navigate('Formulario')}>
        Crear nuevo
      </Button>
 



      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.nombre}
            description={item.correo}
            onPress={() => navigation.navigate('Formulario', { user: item })}
          />
        )}
      />
    </View>
  );
}

// Pantalla con un Formulario Simple usando react-hook-form
function FormScreen({ route, navigation }) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isEditing, setIsEditing] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  // Cargar datos del usuario si está editando
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setUsers(data);

      if (route.params?.user) {
        const { user } = route.params;
        setValue('name', user.nombre);
        setValue('email', user.correo);
        setIsEditing(true);
      }
    };
    fetchData();
  }, [route.params, setValue]);

  // Función para guardar o editar usuario
  const onSubmit = async data => {
    let updatedUsers = [...users];

    if (isEditing) {
      const index = updatedUsers.findIndex(u => u.correo === route.params.user.correo);
      updatedUsers[index] = { nombre: data.name, correo: data.email };
    } else {
      updatedUsers.push({ nombre: data.name, correo: data.email });
    }

    await storeData(updatedUsers);
    Alert.alert('Datos guardados', `Nombre: ${data.name}, Email: ${data.email}`);
    navigation.navigate('Listado');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'El nombre es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nombre"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.name}
            style={{ marginBottom: 20 }}
          />
        )}
      />
      {errors.name && <Text style={{ color: 'red', marginBottom: 20 }}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'El correo electrónico es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Correo electrónico no válido',
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Correo Electrónico"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            keyboardType="email-address"
            error={!!errors.email}
            style={{ marginBottom: 20 }}
          />
        )}
      />
      {errors.email && <Text style={{ color: 'red', marginBottom: 20 }}>{errors.email.message}</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {isEditing ? 'Editar' : 'Crear'}
      </Button>
    </View>
  );
}

// Crear el Drawer Navigator
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
