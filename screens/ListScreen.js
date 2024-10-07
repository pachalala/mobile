import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../utils/storage';

export default function ListScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await getData();
        setUsers(data);
      };
      fetchData();
    }, [])
  );

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
