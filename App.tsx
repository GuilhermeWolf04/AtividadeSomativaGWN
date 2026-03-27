import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './src/components/TaskList';
import { addTask, deleteAllTasks, deleteTask, getAllTasks, updateTask, TaskItem as TaskModel } from './src/utils/handle-api';

const MAX_TASK_LENGTH = 20;

export default function App() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  const resetForm = () => {
    setIsUpdating(false);
    setTaskId('');
    setText('');
  };

  const handleDeleteAllTasks = () => {
    Alert.alert('Excluir tarefas', 'Excluir todas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: () => {
          deleteAllTasks(tasks, setTasks);
          resetForm();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image source={require('./tasks/images/image.png')} style={styles.logoImage} />
        </View>
        <Text style={styles.header}>Tarefas</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total de tarefas: {tasks.length}
          </Text>
        </View>

        <View style={styles.top}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{isUpdating ? 'Editando tarefa' : 'Nova tarefa'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Adicione uma tarefa..."
              value={text}
              onChangeText={(val) => setText(val)}
              maxLength={MAX_TASK_LENGTH}
              keyboardType="default"
              autoCapitalize="sentences"
              returnKeyType="done"
            />
            <Text style={styles.inputHint}>{text.length}/{MAX_TASK_LENGTH} caracteres</Text>
          </View>

          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={
                isUpdating
                  ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
                  : () => addTask(text, setText, setTasks)
              }
            >
              <Text style={styles.addButtonText}>
                {isUpdating ? "Atualizar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {tasks.length > 0 && (
          <View style={styles.nativeButtonContainer}>
            <Button title="Excluir todas as tarefas" onPress={handleDeleteAllTasks} color="#b00020" />
          </View>
        )}

        <TaskList
          tasks={tasks}
          onUpdateTask={updateMode}
          onDeleteTask={(id) => deleteTask(id, setTasks)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  totalContainer: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  top: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 10,
  },
  inputGroup: {
    width: '100%',
  },
  submitContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16,
  },
  inputHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nativeButtonContainer: {
    marginTop: 12,
    alignSelf: 'center',
    width: '60%',
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
