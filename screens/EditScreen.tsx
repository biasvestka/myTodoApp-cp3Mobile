// EditScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, Card } from 'react-native-paper';

type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Edit: { id: string };
};

type EditScreenProps = NativeStackScreenProps<RootStackParamList, 'Edit'>;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const { id } = route.params;
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('A Fazer');

  useEffect(() => {
    const fetchTask = async () => {
      const taskDoc = await getDoc(doc(db, 'tasks', id));
      if (taskDoc.exists()) {
        setTaskName(taskDoc.data()?.name);
        setTaskStatus(taskDoc.data()?.status);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'tasks', id), { status: taskStatus });
      navigation.navigate('Home'); // Redireciona para a Home após atualizar a tarefa
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a tarefa.");
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Atualizar Tarefa" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Title title={taskName} />
          <Card.Content>
            <View style={styles.pickerWrapper}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={taskStatus}
                  style={styles.picker}
                  onValueChange={(itemValue) => setTaskStatus(itemValue)}
                >
                  <Picker.Item label="A Fazer" value="A Fazer" />
                  <Picker.Item label="Em Andamento" value="Em Andamento" />
                  <Picker.Item label="Concluída" value="Concluída" />
                </Picker>
              </View>
            </View>
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
              Atualizar Status
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  pickerWrapper: {
    marginBottom: Platform.OS === 'ios' ? 150 : 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
});

export default EditScreen;
