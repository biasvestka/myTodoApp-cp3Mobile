import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { FAB, List, Appbar, Card, IconButton, Provider, Button } from 'react-native-paper';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Edit: { id: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Task = {
  id: string;
  name: string;
  status: string;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);



useEffect(() => {
  const collectionRef = collection(db, 'tasks');
  const q = filterStatus ? query(collectionRef, where('status', '==', filterStatus)) : query(collectionRef);

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const sortedTasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      sortedTasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    sortedTasks.sort((b, a) => {
      return parseInt(b.id) - parseInt(a.id);
    });
    setTasks(sortedTasks);
  });

  return unsubscribe;
}, [filterStatus]);


  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const handleEdit = (id: string) => {
    navigation.navigate('Edit', { id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'A Fazer':
        return 'red';
      case 'Em Andamento':
        return 'yellow';
      case 'Concluída':
        return 'green';
      default:
        return 'gray';
    }
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filtrar por Status</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { setFilterStatus(null); setModalVisible(false); }}
          >
            <View style={[styles.statusIndicator, { backgroundColor: 'gray' }]} />
            <Text style={styles.filterButtonText}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { setFilterStatus('A Fazer'); setModalVisible(false); }}
          >
            <View style={[styles.statusIndicator, { backgroundColor: 'red' }]} />
            <Text style={styles.filterButtonText}>A Fazer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { setFilterStatus('Em Andamento'); setModalVisible(false); }}
          >
            <View style={[styles.statusIndicator, { backgroundColor: 'yellow' }]} />
            <Text style={styles.filterButtonText}>Em Andamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { setFilterStatus('Concluída'); setModalVisible(false); }}
          >
            <View style={[styles.statusIndicator, { backgroundColor: 'green' }]} />
            <Text style={styles.filterButtonText}>Concluída</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="My ToDo" />
        </Appbar.Header>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <List.Item
                  titleStyle={{ color: 'black' }}
                  title={item.name}
                  description={item.status}
                  left={() => <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />}
                  right={() => (
                    <>
                      <IconButton icon="pencil" onPress={() => handleEdit(item.id)} />
                      <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
                    </>
                  )}
                />
              </Card.Content>
            </Card>
          )}
        />
        {renderFilterModal()}
        <FAB
          style={styles.filter}
          small
          icon="filter-outline"
          onPress={() => setModalVisible(true)}
        />
        <FAB
          style={styles.add}
          icon="plus"
          onPress={() => navigation.navigate('Add')}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    margin: 10,
    backgroundColor: 'white',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    alignSelf: 'center',
  },
  add: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  filter: {
    position: 'absolute',
    right: 16,
    bottom: 86,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;
