import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoursesScreen() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS 415',
      name: 'Software Engineering',
    },
    {
      id: 2,
      code: 'SOC 101',
      name: 'Sociology',
    },
  ]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>My Courses 📚</Text>
        <Text style={styles.subtitle}>
          Keep all your classes in one place.
        </Text>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => setShowAddCourse(true)}
      >
        <Text style={styles.addButtonText}>+ Add Course</Text>
      </Pressable>

      {showAddCourse && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>New Course</Text>

          <TextInput
            style={styles.input}
            placeholder="Course code"
            value={newCourseCode}
            onChangeText={setNewCourseCode}
          />

          <TextInput
            style={styles.input}
            placeholder="Course name"
            value={newCourseName}
            onChangeText={setNewCourseName}
          />

          <Pressable
            style={styles.saveButton}
            onPress={() => {
              if (!newCourseCode || !newCourseName) {
                return;
              }

              if (editingCourseId !== null) {
                setCourses(
                  courses.map((course) =>
                    course.id === editingCourseId
                      ? {
                          ...course,
                          code: newCourseCode,
                          name: newCourseName,
                        }
                      : course
                  )
                );
              
                setEditingCourseId(null);
              } else {
                const newCourse = {
                  id: Date.now(),
                  code: newCourseCode,
                  name: newCourseName,
                };
              
                setCourses([...courses, newCourse]);
              }

              setNewCourseCode('');
              setNewCourseName('');
              setShowAddCourse(false);
            }}
          >
            <Text style={styles.saveButtonText}>Save Course</Text>
          </Pressable>
        </View>
      )}

      {courses.map((course) => (
        <View style={styles.courseCard} key={course.id}>
          <Text style={styles.courseName}>{course.code}</Text>
          <Text>{course.name}</Text>

          <Pressable
            style={styles.editButton}
            onPress={() => {
              setEditingCourseId(course.id);
              setNewCourseCode(course.code);
              setNewCourseName(course.name);
              setShowAddCourse(true);
            }}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={() => {
              setCourses(courses.filter((item) => item.id !== course.id));
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      ))}
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
    marginBottom: 25,
  },

  addButton: {
    backgroundColor: '#F2D7E9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  courseCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
});