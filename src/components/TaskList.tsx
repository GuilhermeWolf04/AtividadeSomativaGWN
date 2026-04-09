import React from "react";
import { FlatList, ViewStyle, StyleProp } from "react-native";
import TaskItem from "./TaskItem";
import { TaskItem as TaskModel } from "../utils/handle-api";

interface TaskListProps {
  tasks: TaskModel[];
  onUpdateTask: (task: TaskModel) => void;
  onToggleComplete: (task: TaskModel) => void;
  onDeleteTask: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const TaskList = ({
  tasks,
  onUpdateTask,
  onToggleComplete,
  onDeleteTask,
  style,
  contentContainerStyle,
}: TaskListProps) => {
  return (
    <FlatList
      data={tasks}
      style={style}
      contentContainerStyle={contentContainerStyle}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TaskItem
          id={item._id}
          text={item.text}
          completed={!!item.completed}
          dueDate={item.dueDate ?? null}
          onUpdateTask={() => onUpdateTask(item)}
          onToggleComplete={() => onToggleComplete(item)}
          onDeleteTask={onDeleteTask}
        />
      )}
    />
  );
};

export default TaskList;