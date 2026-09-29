import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Study for Sociology Exam',
      course: 'SOC 101',
      dueDate: 'September 30',
      completed: false,
    },

    {
      id: 2,
      title: 'Finish Programming Assignment',
      course: 'CS 415',
      dueDate: 'October 2',
      completed: false,
    },
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Study Kitten 🐱</Text>
        <Text style={styles.subtitle}>Let&apos;s get some work done!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <Pressable 
            style={styles.addButton}
            onPress={() => setShowAddTask(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </Pressable>

          {showAddTask && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>New Task</Text>

              <TextInput
                style={styles.input}
                placeholder="Task name"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Course"
                value={newTaskCourse}
                onChangeText={setNewTaskCourse}
              />

              <TextInput
                style={styles.input}
                placeholder="Due date"
                value={newTaskDueDate}
                onChangeText={setNewTaskDueDate}
              />

              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  if (!newTaskTitle || !newTaskCourse || !newTaskDueDate) {
                    return;
                  }

                  const newTask = {
                    id: Date.now(),
                    title: newTaskTitle,
                    course: newTaskCourse,
                    dueDate: newTaskDueDate,
                    completed: false,
                  };

                  setTasks([...tasks, newTask]);

                  setNewTaskTitle('');
                  setNewTaskCourse('');
                  setNewTaskDueDate('');
                  setShowAddTask(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save Task</Text>
              </Pressable>
            </View>
          )}

        {tasks.map((task) => (
          <View style={styles.card} key={task.id}>
            <Text
              style={[
                styles.taskTitle,
                task.completed && styles.completedTask,
              ]}
            >
              {task.title}
            </Text>

            <Text>{task.course}</Text>
            <Text>Due: {task.dueDate}</Text>

            <Pressable
              style={styles.completeButton}
              onPress={() => {
                setTasks(
                  tasks.map((item) =>
                    item.id === task.id
                      ? { ...item, completed: !item.completed }
                      : item
                  )
                );
              }}
            >
              <Text>
                {task.completed ? '✓ Completed' : 'Mark Complete'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.kittenSection}>
        <Text style={styles.kitten}>🐱</Text>
        <Text>Your study kitten is ready to study!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF7FC',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },

  section: {
    marginTop: 35,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
  },

  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  kittenSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  kitten: {
    fontSize: 80,
    marginBottom: 10,
  },

  completeButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F2D7E9',
    borderRadius: 10,
    alignItems: 'center',
  },

  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },

  addButton: {
    backgroundColor: '#F2D7E9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },
  
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: '#F2D7E9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});