import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Pressable, Alert, Modal, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import { addTask, deleteAllTasks, deleteTask, getAllTasks, updateTask, TaskItem as TaskModel } from './src/utils/handle-api';

const MAX_TASK_LENGTH = 20;

export default function App() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (task: TaskModel) => {
    setIsUpdating(true);
    setText(task.text);
    setTaskId(task._id);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ?? null);
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const resetForm = () => {
    setIsUpdating(false);
    setTaskId('');
    setText('');
    setCompleted(false);
    setDueDate(null);
    setShowDatePicker(false);
  };

  const openCreateTaskModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleDeleteAllTasks = () => {
    setTasks([]);
    resetForm();
    deleteAllTasks(tasks, setTasks);
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate.toISOString());
    }
  };

  const handleSaveTask = () => {
    if (isUpdating) {
      updateTask(taskId, text, completed, dueDate, setTasks, setText, setIsUpdating);
    } else {
      addTask(text, completed, dueDate, setTasks);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleToggleComplete = (task: TaskModel) => {
    updateTask(
      task._id,
      task.text,
      !task.completed,
      task.dueDate ?? null,
      setTasks,
      setText,
      setIsUpdating
    );
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
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>{isUpdating ? 'Editar tarefa' : 'Nova tarefa'}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.textStyle}>Fechar</Text>
                  </Pressable>
                  <View style={styles.inputGroup}>
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

                  <Pressable style={styles.dateButton} onPress={() =>{ Keyboard.dismiss(); setShowDatePicker(true)} }>
                    <Feather name="calendar" size={18} color="#111" />
                    <Text style={styles.dateButtonText}>
                      {dueDate ? `Vence em: ${new Date(dueDate).toLocaleDateString()}` : 'Selecionar data de vencimento'}
                    </Text>
                  </Pressable>

                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate ? new Date(dueDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}

                  <View style={styles.submitContainer}>
                    <Pressable
                      style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                      onPress={handleSaveTask}
                    >
                      <Text style={styles.addButtonText}>
                        {isUpdating ? "Atualizar" : "Adicionar"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={openCreateTaskModal}>
              <Text style={styles.textStyle}>Adicionar tarefas</Text>
            </Pressable>
          </View>
        </View>

        {tasks.length > 0 && (
          <View style={styles.nativeButtonContainer}>
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={handleDeleteAllTasks}
            >
              <Text style={styles.deleteButtonText}>Excluir todas as tarefas</Text>
            </Pressable>
          </View>
        )}

        <TaskList
          tasks={tasks}
          onUpdateTask={updateMode}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={(id) => deleteTask(id, setTasks)}
          style={styles.list}
          contentContainerStyle={styles.listContent}

        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView >
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
  addButtonPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 1,
    opacity: 0.95,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.85,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
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
  modalView: {
    width: '90%',
    maxWidth: 520,
    minHeight: 360,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    color: '#111',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#000',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: '100%',
    marginBottom: 14,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  dateButton: {
    width: '100%',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    zIndex: 2,
  },
  dateButtonText: {
    color: '#111',
    fontSize: 14,
  },
});
