import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showTaskSettings, setShowTaskSettings] = useState(false);
  const [showEditTasks, setShowEditTasks] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteTasks, setShowDeleteTasks] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <View>
        <Text style={styles.title}>Study Kitten 🐱</Text>
        <Text style={styles.subtitle}>Let&apos;s get some work done!</Text>
      </View>

      <View style={styles.section}>
      <View style={styles.taskHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>

        <Pressable
          style={styles.settingsButton}
          onPress={() => setShowTaskSettings(!showTaskSettings)}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      {showTaskSettings && (
        <View style={styles.settingsMenu}>
          <Pressable
            style={styles.settingsMenuItem}
            onPress={() => {
              setShowTaskSettings(false);
              setShowEditTasks(true);
            }}>
            <Text style={styles.settingsMenuText}>Edit</Text>
          </Pressable>

          <Pressable
            style={styles.settingsMenuItem}
            onPress={() => {
              setShowTaskSettings(false);
              setSelectedTaskIds([]);
              setShowDeleteTasks(true);
            }}>
            <Text style={styles.settingsMenuText}>Delete</Text>
          </Pressable>
        </View>
      )}

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

                  if (editingTaskId !== null) {
                    setTasks(
                      tasks.map((task) =>
                        task.id === editingTaskId
                          ? {
                              ...task,
                              title: newTaskTitle,
                              course: newTaskCourse,
                              dueDate: newTaskDueDate,
                            }
                          : task
                      )
                    );
                  
                    setEditingTaskId(null);
                  } else {
                    const newTask = {
                      id: Date.now(),
                      title: newTaskTitle,
                      course: newTaskCourse,
                      dueDate: newTaskDueDate,
                      completed: false,
                    };
                  
                    setTasks([...tasks, newTask]);
                  }

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
        <Text>
          {tasks.some((task) => task.completed)
            ? 'Your study kitten is proud of you! 💕'
            : 'Your study kitten is ready to study!'}
        </Text>
      </View>
      </ScrollView>
      <Modal
        visible={showEditTasks}
        transparent
        animationType="none"
        onRequestClose={() => setShowEditTasks(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowEditTasks(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Edit Task</Text>
            <Text style={styles.modalSubtitle}>
              Choose a task to edit
            </Text>

            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.modalTask}
                onPress={() => {
                  setEditingTaskId(task.id);
                  setNewTaskTitle(task.title);
                  setNewTaskCourse(task.course);
                  setNewTaskDueDate(task.dueDate);
                  setShowEditTasks(false);
                  setShowEditForm(true);
                }}>
                <Text style={styles.modalTaskTitle}>{task.title}</Text>
                <Text>{task.course}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditForm}
        transparent
        animationType="none"
        onRequestClose={() => setShowEditForm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowEditForm(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Edit Task</Text>

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
                if (editingTaskId === null) return;

                setTasks(
                  tasks.map((task) =>
                    task.id === editingTaskId
                      ? {
                          ...task,
                          title: newTaskTitle,
                          course: newTaskCourse,
                          dueDate: newTaskDueDate,
                        }
                      : task
                  )
                );

                setEditingTaskId(null);
                setShowEditForm(false);
                setNewTaskTitle('');
                setNewTaskCourse('');
                setNewTaskDueDate('');
              }}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteTasks}
        transparent
        animationType="none"
        onRequestClose={() => setShowDeleteTasks(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteTasks(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Delete Tasks</Text>
            <Text style={styles.modalSubtitle}>
              Choose the tasks you want to delete
            </Text>

            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.modalTask}
                onPress={() => {
                  setSelectedTaskIds((current) =>
                    current.includes(task.id)
                      ? current.filter((id) => id !== task.id)
                      : [...current, task.id]
                  );
                }}>
                <Text style={styles.modalTaskTitle}>{task.title}</Text>

                <View
                  style={[
                    styles.deleteBubble,
                    selectedTaskIds.includes(task.id) && styles.deleteBubbleSelected,
                  ]}
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.deleteSelectedButton}
              disabled={selectedTaskIds.length === 0}
              onPress={() => {
                setShowDeleteTasks(false);
                setShowDeleteConfirmation(true);
              }}>
              <Text style={styles.deleteSelectedButtonText}>
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteConfirmation}
        transparent
        animationType="none"
        onRequestClose={() => setShowDeleteConfirmation(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteConfirmation(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Are you sure?</Text>

            <Text style={styles.modalSubtitle}>
              You are about to delete:
            </Text>

            {tasks
              .filter((task) => selectedTaskIds.includes(task.id))
              .map((task) => (
                <Text key={task.id} style={styles.confirmTaskName}>
                  • {task.title}
                </Text>
              ))}

            <Pressable
              style={styles.confirmDeleteButton}
              onPress={() => {
                setTasks(
                  tasks.filter((task) => !selectedTaskIds.includes(task.id))
                );

                setSelectedTaskIds([]);
                setShowDeleteConfirmation(false);
              }}>
              <Text style={styles.deleteSelectedButtonText}>
                Yes, Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  deleteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FADADD',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  deleteButtonText: {
    fontWeight: 'bold',
  },

  editButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#E8DDF8',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  editButtonText: {
    fontWeight: 'bold',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  settingsButton: {
    padding: 6,
  },
  
  settingsIcon: {
    fontSize: 22,
  },

  settingsMenu: {
    position: 'absolute',
    top: 45,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    width: 100,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  
  settingsMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  
  settingsMenuText: {
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  
  modalCloseButton: {
    position: 'absolute',
    top: 12,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  
  modalCloseText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  modalSubtitle: {
    marginBottom: 15,
  },
  
  modalTask: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  
  modalTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  deleteBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 15,
  },

  deleteBubbleSelected: {
    backgroundColor: '#999',
  },

  deleteSelectedButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
  },
  
  deleteSelectedButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  confirmTaskName: {
    fontSize: 16,
    marginBottom: 8,
  },
  
  confirmDeleteButton: {
    marginTop: 15,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
  },
});