// AddScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, TextInput, Card } from 'react-native-paper';

type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Edit: { id: string };
};

type AddScreenProps = NativeStackScreenProps<RootStackParamList, 'Add'>;

const AddScreen: React.FC<AddScreenProps> = ({ navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('A Fazer');

  const handleAdd = async () => {
    if (taskName.trim() === '') {
      Alert.alert("Entrada inválida", "Nome da tarefa não pode ser vazio.");
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), { name: taskName, status: taskStatus });
      setTaskName('');
      setTaskStatus('A Fazer');
      navigation.navigate('Home'); // Redireciona para a Home após adicionar a tarefa
      Alert.alert("Tarefa adicionada", "Tarefa adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar a tarefa.");
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Adicionar Tarefa" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Nome da tarefa"
              value={taskName}
              onChangeText={setTaskName}
              style={styles.input}
            />
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
            <Button mode="contained" onPress={handleAdd} style={styles.button}>
              Adicionar Tarefa
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
  input: {
    marginBottom: 20,
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

export default AddScreen;
