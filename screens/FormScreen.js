import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { storeData, getData } from '../utils/storage';

export default function FormScreen({ route, navigation }) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setUsers(data);

     console.log("Params:"+ JSON.stringify( route.params ));

      if (route.params?.user) {
        const { user } = route.params;
        setValue('name', user.nombre);
        setValue('email', user.correo);
        setIsEditing(true);
      }
       else
       {
        setValue('name', '');
        setValue('email', '');


       }


    };
    fetchData();
  }, [route.params, setValue]);

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
