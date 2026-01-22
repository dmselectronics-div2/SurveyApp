import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Appearance,
  useColorScheme,
} from 'react-native';
import { Switch } from 'react-native-elements';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Question = {
  text: string;
  type: string;
  required: boolean;
  options: string[];
};

const FormBuilder = ({ navigation }: { navigation: any }) => {
  const [formTitle, setFormTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('shortText');
  const [isRequired, setIsRequired] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const colorScheme = useColorScheme(); // Detect system theme
  const isDarkMode = colorScheme === 'dark'; 
  const themeStyles = isDarkMode
  ? {
      backgroundColor: '#000',
      color: '#fff',
    }
  : {
      backgroundColor: '#fff',
      color: '#000',
    };

  const addOrUpdateQuestion = () => {
    if (questionText === '') {
      Alert.alert('Please enter a question');
      return;
    }

    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = {
        ...updatedQuestions[editIndex],
        text: questionText,
        type: questionType,
        required: isRequired,
      };
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } else {
      setQuestions([
        ...questions,
        { text: questionText, type: questionType, required: isRequired, options: [] },
      ]);
    }

    setQuestionText('');
    setQuestionType('shortText');
    setIsRequired(false);
    setShowModal(false);
    setShowQuestionForm(false);
  };

  // const submitForm = () => {
  //   if (formTitle.trim() === '') {
  //     Alert.alert('Please enter a form title');
  //     return;
  //   }

  //   // Navigate to FormTemp component and pass formTitle as a prop
  //   // navigation.navigate('FormTemp', { formTitle });
  //   navigation.navigate('FormTemp', { questions, formTitle })
   
  // };

  const submitForm = async () => {
    if (formTitle.trim() === '') {
      Alert.alert('Please enter a form title');
      return;
    }
   
    try {
      console.log('Submitting form with data:', { formTitle, questions }); // Log the data you're sending
      const response = await fetch('http://172.20.8.45:5001/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formTitle, questions }),
      });
  
      const result = await response.json();
      console.log('Backend Response:', result); // Log the backend response
  
      if (response.ok) {
        Alert.alert('Form saved successfully');
        navigation.navigate('FormTemp', { formTitle, questions });
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
 // Log the error for debugging
    }
    navigation.navigate('FormTemp')
    setFormTitle('');
    setQuestions([]);
    setQuestionText('');
    setQuestionType('shortText');
    setIsRequired(false);
    setNewOption('');
    setEditIndex(null);
    setShowModal(false);
    setShowQuestionForm(false);
  };
  
  

  const handleAddOption = (index: number) => {
    if (newOption === '') {
      Alert.alert('Please enter an option');
      return;
    }
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push(newOption);
    setQuestions(updatedQuestions);
    setNewOption('');
  };

 
  
  const handleDeleteOption = (qIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setQuestionText(question.text);
    setQuestionType(question.type);
    setIsRequired(question.required);
    setEditIndex(index);
    setShowQuestionForm(true);
  };

  const renderQuestionInput = (question: Question, index: number) => {
    switch (question.type) {
      case 'email':
        return <TextInput placeholder="Enter email" keyboardType="email-address"  style={[styles.input, { color: themeStyles.color }]} />;
      case 'shortText':
        return <TextInput placeholder="Enter short answer"  style={[styles.input, { color: themeStyles.color }]}  />;
      case 'date':
        return <TextInput placeholder="Select Date"  style={[styles.input, { color: themeStyles.color }]} />;
      case 'time':
        return <TextInput placeholder="Select Time" style={[styles.input, { color: themeStyles.color }]}  />;
      case 'multipleChoice':
        return (
          <View>
            {question.options.map((option, i) => (
              <View key={i} style={styles.optionContainer}>
                <Text  style={{ color: themeStyles.color }}>{option}</Text>
                <TouchableOpacity onPress={() => handleDeleteOption(index, i)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              placeholder="Add option"
              value={newOption}
              onChangeText={setNewOption}
              style={[styles.input, { color: themeStyles.color }]}
            />
            <Button title="Add Option" onPress={() => handleAddOption(index)} />
          </View>
        );
        case 'multipleSelect':
            return (
              <View>
                {question.options.map((option, i) => (
                  <View key={i} style={styles.optionContainer}>
                    <Text  style={{ color: themeStyles.color }}>{option}</Text>
                    <TouchableOpacity onPress={() => handleDeleteOption(index, i)}>
                      <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  placeholder="Add option"
                  value={newOption}
                  onChangeText={setNewOption}
                  style={[styles.input, { color: themeStyles.color }]}
                />
                <Button title="Add Option" onPress={() => handleAddOption(index)} style={styles.addOptionButton} />
              </View>
            );
      case 'picture':
        return (
          <Button
            title="Upload Picture"
            onPress={() => {
              const options: ImageLibraryOptions = {
                mediaType: 'photo',
              };
              launchImageLibrary(options, response => {
                if (response.assets) {
                  Alert.alert('Picture Selected');
                }
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: themeStyles.color }]}>Create Your Form</Text>

      <TextInput
        placeholder="Enter form title"
        value={formTitle}
        onChangeText={setFormTitle}
        style={[styles.titleInput, { color: themeStyles.color }]}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'} 
      />

      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={{ color: themeStyles.color }}>{question.text}</Text>
          {renderQuestionInput(question, index)}
          <View style={styles.questionActionButtons}>
            <TouchableOpacity onPress={() => handleEditQuestion(index)} style={styles.iconButton}>
        <Icon name="edit" size={24} color="#0000ff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteQuestion(index)} style={styles.iconButton}>
        <Icon name="delete" size={24} color="#ff0000" />
      </TouchableOpacity>

                
          </View>
        </View>
      ))}

      {showQuestionForm && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your question"
              value={questionText}
              onChangeText={setQuestionText}
              // style={[styles.input, { flex: 1 }]}
              style={[styles.input, { color: themeStyles.color }]} 
            />
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.dropdownIconContainer}>
              <Icon name="arrow-drop-down" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: themeStyles.color }]}>Is this question required?</Text>
            <Switch value={isRequired} onValueChange={setIsRequired} />
          </View>
          <Button
            title={editIndex !== null ? 'Update Question' : 'Add Question'}
            onPress={addOrUpdateQuestion}
          />
        </>
      )}
<View style={styles.submitbutton}>
      <Button
        title="Submit Form"
        // onPress={() => navigation.navigate('FormTemp', { formTitle })}
        onPress={submitForm}
      />
</View>
   
      <Modal
        animationType="slide"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.color }]}>Select Answer Type</Text>
            {['shortText', 'email', 'date', 'time', 'multipleChoice','multipleSelect', 'picture'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setQuestionType(type);
                  setShowModal(false);
                }}
                style={styles.optionButton}
              >
                <Text style={[styles.optionText, { color: themeStyles.color }]}>{type}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancel" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
      <View style={[
    styles.fixedFooter,
    { backgroundColor: isDarkMode ? '#333' : 'rgba(255, 255, 255, 0.7)' },
  ]}>
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: isDarkMode ? '#555' : '#006BFF',
          },
        ]}
        // style={[styles.floatingButton, { color: themeStyles.color }]}
        onPress={() => setShowQuestionForm(true)}
      >
       <Icon name="add" size={30} color={isDarkMode ? '#fff' : '#fff'} />
      </TouchableOpacity>
    </View>
    </View>
 
  );
};


const styles = StyleSheet.create({
    container: {
      padding: 20,
     
    },
    iconButton: {
        marginHorizontal: 5,
        padding: 5,
      },
      
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    submitbutton:{
        marginBottom: 55,
        marginTop: 10,
    },
    titleInput: {
      borderBottomWidth: 1,
      marginBottom: 20,
      paddingVertical: 10,
    },
    questionContainer: {
      marginBottom: 20,
    },
    questionActionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 0,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
      flex: 1,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    toggleLabel: {
      marginRight: 10,
    },
    floatingButton: {
        backgroundColor: '#006BFF',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginRight: 35,
      },
      fixedFooter: {
        position: 'absolute',
        bottom: 0,
        width: '120%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional background to mimic a navbar
        borderTopWidth: 0,
        borderTopColor: '#ccc',
      },      
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: 300,
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
    },
    optionButton: {
      padding: 10,
    },
    optionText: {
      fontSize: 16,
    },
    deleteButton: {
      color: 'red',
    },
    addOptionButton: {
      marginTop: 10,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
    },
    bottomBar: {
      height: 50,
      backgroundColor: '#6200ee', // You can customize the color
    },
  });

export default FormBuilder;
