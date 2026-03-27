import React from "react";
import { FlatList, ViewStyle, StyleProp } from "react-native";
import TaskItem from "./TaskItem";
import { TaskItem as TaskModel } from "../utils/handle-api";

interface TaskListProps {
  tasks: TaskModel[];
  onUpdateTask: (id: string, text: string) => void;
  onDeleteTask: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const TaskList = ({
  tasks,
  onUpdateTask,
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
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    />
  );
};

export default TaskList;