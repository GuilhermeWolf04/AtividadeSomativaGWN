import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';


interface TaskItemProps {
    id: string;
    text: string;
    completed?: boolean;
    dueDate?: string | null;
    onUpdateTask: () => void;
    onToggleComplete: () => void;
    onDeleteTask: (id: string) => void;
}

const TaskItem = ({ id, text, completed = false, dueDate = null, onUpdateTask, onToggleComplete, onDeleteTask }: TaskItemProps) => {
    const hasDueDate = !!dueDate;
    const isOverdue = hasDueDate && !completed && new Date(dueDate as string).setHours(23, 59, 59, 999) < Date.now();
    return (
        <View style={styles.taskContainer}>
            <View style={styles.textBlock}>
                <Text style={[styles.taskText, completed && styles.textTaskCompleted]}>{text}</Text>
                {hasDueDate && (<Text style={[styles.dueDateText, isOverdue && styles.overdueText]}>
                    {isOverdue ? "Vencida em: " : "Vence em: "}{new Date(dueDate as string).toLocaleDateString()}</Text>)}
            </View>
            <View style={styles.icons}>
                <Pressable onPress={onUpdateTask}>
                    <Feather name="edit" size={20} color="#fff" style={styles.icon} />
                </Pressable>
                <Pressable onPress={() => onDeleteTask(id)}>
                    <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
                </Pressable>
                <Checkbox style={styles.checkbox} value={completed} onValueChange={onToggleComplete} /></View>
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
    textBlock: {
        flex: 1,
    },
    taskText: {
        color: '#fff',
        fontSize: 16,
    },
    icons: {
        flexDirection: 'row',
        gap: 16,
        marginLeft: 16,
    },
    icon: {
        padding: 2,
    },
    section: {
        flexDirection: 'row',
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
    },
    textTaskCompleted: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    dueDateText: {
        marginTop: 4,
        fontSize: 12,
        color: "#ddd",
    },
    overdueText: {
        color: "#ff6b6b",
        fontWeight: "700",
    },
});


export default TaskItem;
