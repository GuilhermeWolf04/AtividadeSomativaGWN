import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';


interface TaskItemProps {
    id: string;
  text: string;
    onUpdateTask: (id: string, text: string) => void;
    onDeleteTask: (id: string) => void;
}

const TaskItem = ({ id, text, onUpdateTask, onDeleteTask }: TaskItemProps) => {
  return (
    <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{text}</Text>
            <View style={styles.icons}>
                <TouchableOpacity onPress={() => onUpdateTask(id, text)}>
                    <Feather name="edit" size={20} color="#fff" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteTask(id)}>
                    <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
                </TouchableOpacity>
            </View>
    </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: '#000',
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 5,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    taskText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    icons: {
        flexDirection: 'row',
        gap: 16,
        marginLeft: 16,
    },
    icon: {
        padding: 2,
    },
});


export default TaskItem;
