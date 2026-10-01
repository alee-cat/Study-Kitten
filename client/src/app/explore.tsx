import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [showEditCourses, setShowEditCourses] = useState(false);
  const [showDeleteCourses, setShowDeleteCourses] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [showDeleteCourseConfirmation, setShowDeleteCourseConfirmation] = useState(false);

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >

      <View>
        <Text style={styles.title}>Study Kitten 🐱</Text>

        <Text style={styles.subtitle}>
          Keep all your classes in one place.
        </Text>
      </View>

      <View style={styles.section}>

        <View style={styles.courseHeader}>
          <Text style={styles.sectionTitle}>Courses</Text>

          <Pressable
            style={styles.settingsButton}
            onPress={() => setShowCourseSettings(!showCourseSettings)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {showCourseSettings && (
          <View style={styles.settingsMenu}>
            <Pressable
              style={styles.settingsMenuItem}
              onPress={() => {
                setShowCourseSettings(false);
                setShowEditCourses(true);
              }}
            >
              <Text style={styles.settingsMenuText}>Edit</Text>
            </Pressable>

            <Pressable
              style={styles.settingsMenuItem}
              onPress={() => {
                setShowCourseSettings(false);
                setSelectedCourseIds([]);
                setShowDeleteCourses(true);
              }}
            >
              <Text style={styles.settingsMenuText}>Delete</Text>
            </Pressable>
          </View>
        )}
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddCourse(true)}
        >
          <Text style={styles.addButtonText}>+ Add Course</Text>
        </Pressable>

      {showAddCourse && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingCourseId !== null ? 'Edit Course' : 'New Course'}
          </Text>

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
            <Text style={styles.saveButtonText}>
              {editingCourseId !== null ? 'Save Changes' : 'Save Course'}
            </Text>
          </Pressable>
        </View>
      )}

      {courses.map((course) => (
        <View style={styles.courseCard} key={course.id}>
          <Text style={styles.courseName}>{course.code}</Text>
          <Text>{course.name}</Text>

        </View>
      ))}
      </ScrollView>

      <Modal
        visible={showEditCourses}
        transparent
        animationType="none"
        onRequestClose={() => setShowEditCourses(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowEditCourses(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Edit Course</Text>

            <Text style={styles.modalSubtitle}>
              Choose a course to edit
            </Text>

            {courses.map((course) => (
              <Pressable
                key={course.id}
                style={styles.courseSelectItem}
                onPress={() => {
                  setEditingCourseId(course.id);
                  setNewCourseCode(course.code);
                  setNewCourseName(course.name);
                  setShowEditCourses(false);
                  setShowAddCourse(true);
                }}
              >
                <Text style={styles.courseSelectCode}>
                  {course.code}
                </Text>
              
                <Text style={styles.courseSelectName}>
                  {course.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteCourses}
        transparent
        animationType="none"
        onRequestClose={() => setShowDeleteCourses(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteCourses(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Delete Courses</Text>

            <Text style={styles.modalSubtitle}>
              Choose the courses you want to delete
            </Text>

            {courses.map((course) => (
              <Pressable
                key={course.id}
                style={styles.courseSelectItem}
                onPress={() => {
                  setSelectedCourseIds((current) =>
                    current.includes(course.id)
                      ? current.filter((id) => id !== course.id)
                      : [...current, course.id]
                  );
                }}
              >
                <Text style={styles.courseSelectCode}>
                  {course.code}
                </Text>

                <Text style={styles.courseSelectName}>
                  {course.name}
                </Text>

                <View
                  style={[
                    styles.deleteBubble,
                    selectedCourseIds.includes(course.id) &&
                      styles.deleteBubbleSelected,
                  ]}
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.deleteSelectedButton}
              disabled={selectedCourseIds.length === 0}
              onPress={() => {
                setShowDeleteCourses(false);
                setShowDeleteCourseConfirmation(true);
              }}
            >
              <Text style={styles.deleteSelectedButtonText}>
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteCourseConfirmation}
        transparent
        animationType="none"
        onRequestClose={() => setShowDeleteCourseConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteCourseConfirmation(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Are you sure?</Text>

            <Text style={styles.modalSubtitle}>
              You are about to delete:
            </Text>

            {courses
              .filter((course) => selectedCourseIds.includes(course.id))
              .map((course) => (
                <Text key={course.id} style={styles.confirmCourseName}>
                  • {course.code} — {course.name}
                </Text>
              ))}

            <Pressable
              style={styles.confirmDeleteButton}
              onPress={() => {
                setCourses(
                  courses.filter(
                    (course) => !selectedCourseIds.includes(course.id)
                  )
                );

                setSelectedCourseIds([]);
                setShowDeleteCourseConfirmation(false);
              }}
            >
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

  scrollContent: {
    paddingBottom: 40,
  },

  courseHeader: {
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

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  section: {
    marginTop: 10,
  },

  courseSelectItem: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  
  courseSelectCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  courseSelectName: {
    fontSize: 14,
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

  deleteBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#999',
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

  confirmCourseName: {
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