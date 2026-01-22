// // import React, { useState } from 'react';
// // import CheckBox from 'react-native-check-box';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TextInput,
// //   Button,
// //   Alert,
// //   StyleSheet,
// //   Image,
// //   TouchableOpacity,
// //   Modal,
// //   FlatList,
// // } from 'react-native';
// // import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
// // import DateTimePickerModal from 'react-native-modal-datetime-picker';
// // // MultipleSelect Component
// // const MultipleSelect = ({
// //   options,
// //   selectedItems,
// //   onSelect,
// // }: {
// //   options: string[];
// //   selectedItems: string[];
// //   onSelect: (items: string[]) => void;
// // }) => {
// //   const toggleSelect = (item: string) => {
// //     if (selectedItems.includes(item)) {
// //       onSelect(selectedItems.filter((selectedItem) => selectedItem !== item));
// //     } else {
// //       onSelect([...selectedItems, item]);
// //     }
// //   };

// //   const renderOption = ({ item }: { item: string }) => (
// //     <TouchableOpacity onPress={() => toggleSelect(item)} style={styles.option}>
// //       <CheckBox
// //         isChecked={selectedItems.includes(item)}
// //         onClick={() => toggleSelect(item)}
// //       />
// //       <Text style={styles.optionText}>{item}</Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <FlatList
// //       data={options}
// //       renderItem={renderOption}
// //       keyExtractor={(item) => item}
// //       extraData={selectedItems}
// //     />
// //   );
// // };

// // const MultipleChoice = ({
// //   options,
// //   selectedOption,
// //   onSelect,
// // }: {
// //   options: string[];
// //   selectedOption: string | null;
// //   onSelect: (item: string) => void;
// // }) => {
// //   return (
// //     <FlatList
// //       data={options}
// //       renderItem={({ item }) => (
// //         <TouchableOpacity onPress={() => onSelect(item)} style={styles.option}>
// //           <CheckBox
// //             isChecked={selectedOption === item}
// //             onClick={() => onSelect(item)}
// //           />
// //           <Text style={styles.optionText}>{item}</Text>
// //         </TouchableOpacity>
// //       )}
// //       keyExtractor={(item) => item}
// //       extraData={selectedOption}
// //     />
// //   );
// // };

// // type Question = {
// //   text: string;
// //   type: string;
// //   required: boolean;
// //   options?: string[];
// // };

// // const QuestionsScreen = ({ route }: { route: { params: { questions: Question[]; formTitle: string } } }) => {
// //   const { questions, formTitle } = route.params;
// //   const [answers, setAnswers] = useState<any[]>(new Array(questions.length).fill(''));
// //   const [selectedImage, setSelectedImage] = useState<string | null>(null);
// //   const [dropdownVisible, setDropdownVisible] = useState<boolean[]>(new Array(questions.length).fill(false));
// //   const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean[]>(new Array(questions.length).fill(false));
// //   const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean[]>(new Array(questions.length).fill(false));

// //   const handleAnswerChange = (index: number, value: any) => {
// //     const updatedAnswers = [...answers];
// //     updatedAnswers[index] = value;
// //     setAnswers(updatedAnswers);
// //   };

// //   const handleImageUpload = (index: number) => {
// //     const options: ImageLibraryOptions = {
// //       mediaType: 'photo',
// //     };
// //     launchImageLibrary(options, (response) => {
// //       if (response.assets) {
// //         const imageUri = response.assets[0].uri;
// //         setSelectedImage(imageUri);
// //         handleAnswerChange(index, imageUri);
// //         Alert.alert('Picture Selected');
// //       }
// //     });
// //   };

// //   const validateForm = () => {
// //     if (formTitle.trim() === '') {
// //       Alert.alert('Validation Error', 'Form title cannot be empty.');
// //       return false;
// //     }

// //     if (questions.length === 0) {
// //       Alert.alert('Validation Error', 'You must add at least one question.');
// //       return false;
// //     }

// //     for (let i = 0; i < questions.length; i++) {
// //       const question = questions[i];

// //       // Check for empty question text
// //       if (question.text.trim() === '') {
// //         Alert.alert('Validation Error', `Question ${i + 1} cannot be empty.`);
// //         return false;
// //       }

// //       // Check for multipleChoice or multipleSelect without options
// //       if ((question.type === 'multipleChoice' || question.type === 'multipleSelect') && question.options.length === 0) {
// //         Alert.alert(
// //           'Validation Error',
// //           `Question ${i + 1} must have at least one option for the selected type.`
// //         );
// //         return false;
// //       }

// //       // Email validation
// //       if (question.type === 'email') {
// //         const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
// //         if (!emailRegex.test(question.text.toLowerCase())) {
// //           Alert.alert('Validation Error', `Invalid email format in Question ${i + 1}.`);
// //           return false;
// //         }
// //       }
// //     }

// //     return true;
// //   };

// //   const handleSubmit = () => {
// //     if (validateForm()) {
// //       Alert.alert('Submitted Answers', JSON.stringify(answers, null, 2));
// //     }
// //   };

// //   const showDatePicker = (index: number) => {
// //     setDatePickerVisibility((prev) => {
// //       const updated = [...prev];
// //       updated[index] = true;
// //       return updated;
// //     });
// //   };

// //   const hideDatePicker = (index: number) => {
// //     setDatePickerVisibility((prev) => {
// //       const updated = [...prev];
// //       updated[index] = false;
// //       return updated;
// //     });
// //   };

// //   const handleDateConfirm = (index: number, date: Date) => {
// //     const formattedDate = date.toISOString().split('T')[0];
// //     handleAnswerChange(index, formattedDate);
// //     hideDatePicker(index);
// //   };

// //   const showTimePicker = (index: number) => {
// //     setTimePickerVisibility((prev) => {
// //       const updated = [...prev];
// //       updated[index] = true;
// //       return updated;
// //     });
// //   };

// //   const hideTimePicker = (index: number) => {
// //     setTimePickerVisibility((prev) => {
// //       const updated = [...prev];
// //       updated[index] = false;
// //       return updated;
// //     });
// //   };

// //   const handleTimeConfirm = (index: number, time: Date) => {
// //     const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //     handleAnswerChange(index, formattedTime);
// //     hideTimePicker(index);
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.title}>{formTitle}</Text>
// //       {questions.map((question, index) => (
// //         <View key={index} style={styles.questionContainer}>
// //           {question.type === 'shortText' && (
// //             <TextInput
// //               placeholder={`${question.text}${question.required ? ' *' : ''}`}
// //               value={answers[index]}
// //               onChangeText={(value) => handleAnswerChange(index, value)}
// //               style={styles.input}
// //             />
// //           )}
// //           {question.type === 'email' && (
// //             <TextInput
// //               placeholder={`${question.text}${question.required ? ' *' : ''}`}
// //               value={answers[index]}
// //               onChangeText={(value) => handleAnswerChange(index, value)}
// //               keyboardType="email-address"
// //               style={styles.input}
// //             />
// //           )}
// //           {question.type === 'date' && (
// //             <View style={styles.inputWrapper}>
// //               <TextInput
// //                 placeholder={`${question.text}${question.required ? ' *' : ''}`}
// //                 value={answers[index]}
// //                 onChangeText={(value) => handleAnswerChange(index, value)}
// //                 style={[styles.input, styles.inputWithIcon]}
// //               />
// //               <TouchableOpacity onPress={() => showDatePicker(index)} style={styles.iconWrapper}>
// //                 <Icon name="calendar" size={15} color="#000" />
// //               </TouchableOpacity>
// //               <DateTimePickerModal
// //                 isVisible={isDatePickerVisible[index]}
// //                 mode="date"
// //                 onConfirm={(date) => handleDateConfirm(index, date)}
// //                 onCancel={() => hideDatePicker(index)}
// //               />
// //             </View>
// //           )}
// //           {question.type === 'time' && (
// //             <View style={styles.inputWrapper}>
// //               <TextInput
// //                 placeholder={`${question.text}${question.required ? ' *' : ''}`}
// //                 value={answers[index]}
// //                 onChangeText={(value) => handleAnswerChange(index, value)}
// //                 style={[styles.input, styles.inputWithIcon]}
// //               />
// //               <TouchableOpacity onPress={() => showTimePicker(index)} style={styles.iconWrapper}>
// //                 <Icon name="clock-o" size={15} color="#000" />
// //               </TouchableOpacity>
// //               <DateTimePickerModal
// //                 isVisible={isTimePickerVisible[index]}
// //                 mode="time"
// //                 onConfirm={(time) => handleTimeConfirm(index, time)}
// //                 onCancel={() => hideTimePicker(index)}
// //               />
// //             </View>
// //           )}
// //           {question.type === 'multipleSelect' && question.options && (
// //             <TouchableOpacity style={styles.input} onPress={() => setDropdownVisible(prev => {
// //               const updated = [...prev];
// //               updated[index] = !prev[index];
// //               return updated;
// //             })}>
// //               <Text style={styles.placeholderText}>
// //                 {answers[index]?.length > 0 ? answers[index].join(', ') : `${question.text}${question.required ? ' *' : ''}`}
// //               </Text>
// //               <Icon name="chevron-down" size={15} style={styles.dropdownIcon} />
// //               {dropdownVisible[index] && (
// //                 <MultipleSelect
// //                   options={question.options}
// //                   selectedItems={answers[index]}
// //                   onSelect={(selectedItems) => {
// //                     handleAnswerChange(index, selectedItems);
// //                     setDropdownVisible(prev => {
// //                       const updated = [...prev];
// //                      // updated[index] = false; // Close dropdown after selection
// //                       return updated;
// //                     });
// //                   }}
// //                 />
// //               )}
// //             </TouchableOpacity>
// //           )}
// //           {question.type === 'multipleChoice' && question.options && (
// //             <TouchableOpacity style={styles.input} onPress={() => setDropdownVisible(prev => {
// //               const updated = [...prev];
// //               updated[index] = !prev[index];
// //               return updated;
// //             })}>
// //               <Text style={styles.placeholderText}>
// //                 {answers[index] || `${question.text}${question.required ? ' *' : ''}`}
// //               </Text>
// //               <Icon name="chevron-down" size={15} style={styles.dropdownIcon} />
// //               {dropdownVisible[index] && (
// //                 <MultipleChoice
// //                   options={question.options}
// //                   selectedOption={answers[index]}
// //                   onSelect={(selectedOption) => {
// //                     handleAnswerChange(index, selectedOption);
// //                     setDropdownVisible(prev => {
// //                       const updated = [...prev];
// //                       updated[index] = false; // Close dropdown after selection
// //                       return updated;
// //                     });
// //                   }}
// //                 />
// //               )}
// //             </TouchableOpacity>
// //           )}
// //           {question.type === 'picture' && (
// //   <View style={styles.inputWrapper}>
// //     <TextInput
// //       placeholder={`${question.text}${question.required ? ' *' : ''}`}
// //       value={answers[index]}
// //       editable={false} // Prevent editing directly
// //       style={[styles.input, styles.inputWithIcon]}
// //     />
// //     <TouchableOpacity onPress={() => handleImageUpload(index)} style={styles.iconWrapper}>
// //       <Icon name="camera" size={15} color="#000" />
// //     </TouchableOpacity>
// //     {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
// //   </View>
// // )}
// //         </View>
// //       ))}
// //       <Button title="Submit" onPress={handleSubmit} />
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         padding: 20,
// //         flex: 1,
// //       },
// //       title: {
// //         fontSize: 24,
// //         fontWeight: 'bold',
// //         marginBottom: 20,
// //       },
// //       questionContainer: {
// //         marginBottom: 20,
// //       },
// //       input: {
// //         borderWidth: 1,
// //         borderColor: '#ccc',
// //         borderRadius: 8,
// //         padding: 10,
// //         backgroundColor: 'white',
// //       },
// //       inputWrapper: {
// //         position: 'relative',
// //       },
// //       inputWithIcon: {
// //         paddingRight: 40,
// //       },
// //       iconWrapper: {
// //         position: 'absolute',
// //         right: 10,
// //         top: 15,
// //       },
// //       placeholderText: {
// //         color: '#999',
// //       },
// //       dropdownIcon: {
// //         position: 'absolute',
// //         right: 10,
// //         top: 10,
// //       },
// //       option: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         padding: 10,
// //       },
// //       optionText: {
// //         marginLeft: 10,
// //       },
// //       imageUploadButton: {
// //         alignItems: 'center',
// //         backgroundColor: '#f0f0f0',
// //         padding: 10,
// //         borderRadius: 8,
// //         marginTop: 10,
// //       },
// //       uploadButtonText: {
// //         color: '#007BFF',
// //       },
// //       imagePreview: {
// //         width: 100,
// //         height: 100,
// //         marginTop: 10,
// //         borderRadius: 8, 
// //         borderWidth: 1,
// //         borderColor: '#ccc',
// //       },
// //     });
    
    

// // export default QuestionsScreen;


// // import React, { useState, useEffect } from 'react';
// // import {
// //   ScrollView,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   Button,
// //   View,
// //   Alert,
// //   ActivityIndicator
// // } from 'react-native';
// // import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// // import DateTimePickerModal from 'react-native-modal-datetime-picker';

// // type Question = {
// //   text: string;
// //   type: string;
// //   required: boolean;
// //   options?: string[];
// // };

// // const QuestionsScreen = ({ route }: { route: { params: { formId: string } } }) => {
// //   const { formId } = route.params; // Get the formId passed from previous screen
// //   const [formData, setFormData] = useState<{ formTitle: string; questions: Question[] } | null>(null);
// //   const [answers, setAnswers] = useState<any[]>([]); // For storing answers to the questions
// //   const [loading, setLoading] = useState<boolean>(true); // Loading state

// //   // Fetch the form data when the component mounts
// //   useEffect(() => {
// //     const fetchFormData = async () => {
// //       try {
// //         const response = await fetch(`http://172.20.8.45:5001/getForm/${formId}`); // Your backend URL
// //         const data = await response.json();

// //         if (response.ok) {
// //           setFormData(data); // Set the form data received from the backend
// //           setAnswers(new Array(data.questions.length).fill('')); // Initialize answers array with empty strings
// //         } else {
// //           Alert.alert('Error', 'Form not found');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching form data:', error);
// //         Alert.alert('Error', 'Failed to load form');
// //       } finally {
// //         setLoading(false); // Stop loading once data is fetched
// //       }
// //     };

// //     fetchFormData();
// //   }, [formId]);

// //   const handleAnswerChange = (index: number, value: any) => {
// //     const updatedAnswers = [...answers];
// //     updatedAnswers[index] = value;
// //     setAnswers(updatedAnswers);
// //   };

// //   const handleSubmit = () => {
// //     Alert.alert('Form Submitted', JSON.stringify(answers, null, 2));
// //   };

// //   if (loading) {
// //     return <ActivityIndicator size="large" color="#0000ff" />; // Show loading spinner while fetching data
// //   }

// //   return (
// //     <ScrollView style={styles.container}>
// //       {formData && (
// //         <>
// //           <Text style={styles.title}>{formData.formTitle}</Text>

// //           {formData.questions.map((question, index) => (
// //             <View key={index} style={styles.questionContainer}>
// //               <Text style={styles.questionText}>{question.text}</Text>

// //               {/* Handle the different types of questions */}
// //               {question.type === 'shortText' && (
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder={question.text}
// //                   value={answers[index]}
// //                   onChangeText={(value) => handleAnswerChange(index, value)}
// //                 />
// //               )}
// //               {question.type === 'email' && (
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder={question.text}
// //                   value={answers[index]}
// //                   onChangeText={(value) => handleAnswerChange(index, value)}
// //                   keyboardType="email-address"
// //                 />
// //               )}
// //               {question.type === 'multipleSelect' && question.options && (
// //                 <View>
// //                   {question.options.map((option, i) => (
// //                     <Text key={i} style={styles.optionText}>
// //                       {option}
// //                     </Text>
// //                   ))}
// //                 </View>
// //               )}
// //               {/* Add other question types here as needed */}
// //             </View>
// //           ))}

// //           <Button title="Submit" onPress={handleSubmit} />
// //         </>
// //       )}
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     flex: 1,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //   },
// //   questionContainer: {
// //     marginBottom: 20,
// //   },
// //   questionText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //     padding: 10,
// //     marginTop: 10,
// //     backgroundColor: '#fff',
// //   },
// //   optionText: {
// //     fontSize: 16,
// //     marginVertical: 5,
// //   },
// // });

// // export default QuestionsScreen;


    

// import React, { useState, useEffect } from 'react';
// import {
//   ScrollView,
//   Text,
//   StyleSheet,
//   TextInput,
//   Button,
//   View,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';


// type Question = {
//   text: string;
//   type: string;
//   required: boolean;
//   options?: string[];
// };

// const QuestionsScreen = ({ route }: { route: { params: { formId: string } } }) => {
//   const { formId } = route.params; // Get the formId passed from previous screen
//   const [formData, setFormData] = useState<{ formTitle: string; questions: Question[] } | null>(null);
//   const [answers, setAnswers] = useState<any[]>([]); // For storing answers to the questions
//   const [loading, setLoading] = useState<boolean>(true); // Loading state

//   // Fetch the form data when the component mounts
//   useEffect(() => {
//     const fetchFormData = async () => {
//       try {
//         const response = await fetch(`http://192.168.0.100:5001/getForm/${formId}`); // Your backend URL
//         const data = await response.json();

//         if (response.ok) {
//           setFormData(data); // Set the form data received from the backend
//           setAnswers(new Array(data.questions.length).fill('')); // Initialize answers array with empty strings
//         } else {
//           Alert.alert('Error', 'Form not found');
//         }
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//         Alert.alert('Error', 'Failed to load form');
//       } finally {
//         setLoading(false); // Stop loading once data is fetched
//       }
//     };

//     fetchFormData();
//   }, [formId]);

//   const handleAnswerChange = (index: number, value: any) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[index] = value;
//     setAnswers(updatedAnswers);
//   };

//   const handleSubmit = async () => {
//     const formattedAnswers = formData.questions.map((question, index) => ({
//       questionId: question._id,    // Question ID from the form
//       answer: answers[index],      // User's answer
//     }));
  
//     try {
//       const response = await fetch('http://192.168.0.100:5001/submitAnswers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           formId,  // Form ID to identify the form being answered
//           answers: formattedAnswers,  // Answers with question IDs
//         }),
//       });
  
//       const result = await response.json();
  
//       if (response.ok) {
//         Alert.alert('Form Submitted', 'Your answers have been submitted successfully!');
//       } else {
//         Alert.alert('Error', result.message || 'Failed to submit answers');
//       }
//     } catch (error) {
//       // Alert.alert('Error', 'Failed to submit answers.');
//       // console.error('Error submitting answers:', error);
//       Alert.alert('Form Submitted', 'Your answers have been submitted successfully!');
//     }
//     setAnswers(new Array(formData.questions.length).fill(''));

//   };
  

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />; // Show loading spinner while fetching data
//   }

//   return (
//     <ScrollView style={styles.container}>
//       {formData && (
//         <>
//           <Text style={styles.title}>{formData.formTitle}</Text>

//           {formData.questions.map((question, index) => (
//             <View key={index} style={styles.questionContainer}>
//               <Text style={styles.questionText}>{question.text}</Text>

//               {/* Handle the different types of questions */}
//               {question.type === 'shortText' && (
//                 <TextInput
//                   style={styles.input}
//                   placeholder={question.text}
//                   value={answers[index]}
//                   onChangeText={(value) => handleAnswerChange(index, value)}
//                 />
//               )}
//               {question.type === 'email' && (
//                 <TextInput
//                   style={styles.input}
//                   placeholder={question.text}
//                   value={answers[index]}
//                   onChangeText={(value) => handleAnswerChange(index, value)}
//                   keyboardType="email-address"
//                 />
//               )}
//               {question.type === 'multipleSelect' && question.options && (
//                 <View>
//                   {question.options.map((option, i) => (
//                     <Text key={i} style={styles.optionText}>
//                       {option}
//                     </Text>
//                   ))}
//                 </View>
//               )}
//               {/* Add other question types here as needed */}
//             </View>
//           ))}

//           <Button title="Submit" onPress={handleSubmit} />
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   questionContainer: {
//     marginBottom: 20,
//   },
//   questionText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 10,
//     backgroundColor: '#fff',
//   },
//   optionText: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
// });

// export default QuestionsScreen;

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Button,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'react-native-check-box';

type Question = {
  text: string;
  type: string;
  required: boolean;
  options?: string[];
  _id?: string;
};

const MultipleSelect = ({
  options,
  selectedItems,
  onSelect,
}: {
  options: string[];
  selectedItems: string[];
  onSelect: (items: string[]) => void;
}) => {
  const toggleSelect = (item: string) => {
    if (selectedItems.includes(item)) {
      onSelect(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      onSelect([...selectedItems, item]);
    }
  };

  const renderOption = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => toggleSelect(item)} style={styles.option}>
      <CheckBox
        isChecked={selectedItems.includes(item)}
        onClick={() => toggleSelect(item)}
      />
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={options}
      renderItem={renderOption}
      keyExtractor={(item) => item}
      extraData={selectedItems}
    />
  );
};

const MultipleChoice = ({
  options,
  selectedOption,
  onSelect,
}: {
  options: string[];
  selectedOption: string | null;
  onSelect: (item: string) => void;
}) => {
  return (
    <FlatList
      data={options}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)} style={styles.option}>
          <CheckBox
            isChecked={selectedOption === item}
            onClick={() => onSelect(item)}
          />
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item}
      extraData={selectedOption}
    />
  );
};

const QuestionsScreen = ({ route }: { route: { params: { formId: string } } }) => {
  const { formId } = route.params; // Get the formId passed from previous screen
  const [formData, setFormData] = useState<{ formTitle: string; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]); // For storing answers to the questions
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean[]>([]);
  const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://172.20.8.45:5001/getForm/${formId}`);
        const data = await response.json();

        if (response.ok) {
          setFormData(data);
          setAnswers(new Array(data.questions.length).fill(''));
          setDatePickerVisibility(new Array(data.questions.length).fill(false));
          setTimePickerVisibility(new Array(data.questions.length).fill(false));
        } else {
          Alert.alert('Error', 'Form not found');
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        Alert.alert('Error', 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleAnswerChange = (index: number, value: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleImageUpload = (index: number) => {
    const options: ImageLibraryOptions = { mediaType: 'photo' };
    launchImageLibrary(options, (response) => {
      if (response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        handleAnswerChange(index, imageUri);
        Alert.alert('Picture Selected');
      }
    });
  };

  const validateForm = () => {
    if (formData?.formTitle.trim() === '') {
      Alert.alert('Validation Error', 'Form title cannot be empty.');
      return false;
    }

    if (formData?.questions.length === 0) {
      Alert.alert('Validation Error', 'You must add at least one question.');
      return false;
    }

    for (let i = 0; i < formData?.questions.length; i++) {
      const question = formData?.questions[i];

      // Check for empty question text
      if (question.text.trim() === '') {
        Alert.alert('Validation Error', `Question ${i + 1} cannot be empty.`);
        return false;
      }

      // Check for multipleChoice or multipleSelect without options
      if (
        (question.type === 'multipleChoice' || question.type === 'multipleSelect') &&
        question.options?.length === 0
      ) {
        Alert.alert(
          'Validation Error',
          `Question ${i + 1} must have at least one option for the selected type.`
        );
        return false;
      }
    }

    return true;
  };

  // const handleSubmit = async () => {
  //   if (validateForm()) {
  //     const formattedAnswers = formData?.questions.map((question, index) => ({
  //       questionId: question._id,
  //       answer: answers[index],
  //     }));

  //     try {
  //       const response = await fetch('http://192.168.0.100:5001/submitAnswers', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           formId,
  //           answers: formattedAnswers,
  //         }),
  //       });

  //       const result = await response.json();

  //       if (response.ok) {
  //         Alert.alert('Form Submitted', 'Your answers have been submitted successfully!');
  //       } else {
  //         Alert.alert('Error', result.message || 'Failed to submit answers');
  //       }
  //     } catch (error) {
  //       Alert.alert('Error', 'Failed to submit answers');
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    try {
      // Assuming you're checking the question type to handle multiple choice/select properly
      const formattedAnswers = formData?.questions.map((question, index) => {
        let answer = answers[index];
        
        // If the question is multipleSelect or multipleChoice, ensure the answer is stored as an array
        if (question.type === 'multipleSelect' || question.type === 'multipleChoice') {
          // Make sure it's an array for multiple choices
          if (!Array.isArray(answer)) {
            answer = [answer]; // Make it an array if it's a single value
          }
        }
        
        return {
          questionId: question._id,
          answer: answer, // Store as array or string based on question type
        };
      });
  
      const response = await fetch('http://172.20.8.45:5001/submitAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          answers: formattedAnswers,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Form Submitted', 'Your answers have been submitted successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      Alert.alert('Error', 'Failed to submit answers');
    }
  };
  

  const handleDateConfirm = (index: number, date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    handleAnswerChange(index, formattedDate);
    setDatePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const handleTimeConfirm = (index: number, time: Date) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    handleAnswerChange(index, formattedTime);
    setTimePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {formData && (
        <>
          <Text style={styles.title}>{formData.formTitle}</Text>

          {formData.questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.text}</Text>

              {question.type === 'shortText' && (
                <TextInput
                  style={styles.input}
                  placeholder={question.text}
                  value={answers[index]}
                  onChangeText={(value) => handleAnswerChange(index, value)}
                />
              )}

              {question.type === 'email' && (
                <TextInput
                  style={styles.input}
                  placeholder={question.text}
                  value={answers[index]}
                  onChangeText={(value) => handleAnswerChange(index, value)}
                  keyboardType="email-address"
                />
              )}

              {question.type === 'multipleSelect' && question.options && (
                <MultipleSelect
                  options={question.options}
                  selectedItems={answers[index]}
                  onSelect={(selectedItems) => handleAnswerChange(index, selectedItems)}
                />
              )}

              {question.type === 'multipleChoice' && question.options && (
                <MultipleChoice
                  options={question.options}
                  selectedOption={answers[index]}
                  onSelect={(selectedOption) => handleAnswerChange(index, selectedOption)}
                />
              )}

              {question.type === 'picture' && (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    value={answers[index]}
                    editable={false}
                    placeholder={question.text}
                  />
                  <TouchableOpacity onPress={() => handleImageUpload(index)} style={styles.iconWrapper}>
                    <Icon name="camera" size={15} color="#000" />
                  </TouchableOpacity>
                  {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
                </View>
              )}

              {question.type === 'date' && (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    value={answers[index]}
                    placeholder={question.text}
                    onChangeText={(value) => handleAnswerChange(index, value)}
                  />
                  <TouchableOpacity onPress={() => setDatePickerVisibility((prev) => {
                      const updated = [...prev];
                      updated[index] = true;
                      return updated;
                    })} style={styles.iconWrapper}>
                    <Icon name="calendar" size={15} color="#000" />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible[index]}
                    mode="date"
                    onConfirm={(date) => handleDateConfirm(index, date)}
                    onCancel={() => setDatePickerVisibility((prev) => {
                      const updated = [...prev];
                      updated[index] = false;
                      return updated;
                    })}
                  />
                </View>
              )}

              {question.type === 'time' && (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    value={answers[index]}
                    placeholder={question.text}
                    onChangeText={(value) => handleAnswerChange(index, value)}
                  />
                  <TouchableOpacity onPress={() => setTimePickerVisibility((prev) => {
                      const updated = [...prev];
                      updated[index] = true;
                      return updated;
                    })} style={styles.iconWrapper}>
                    <Icon name="clock-o" size={15} color="#000" />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible[index]}
                    mode="time"
                    onConfirm={(time) => handleTimeConfirm(index, time)}
                    onCancel={() => setTimePickerVisibility((prev) => {
                      const updated = [...prev];
                      updated[index] = false;
                      return updated;
                    })}
                  />
                </View>
              )}
            </View>
          ))}
       <View style={styles.submitButton}>
          <Button  title="Submit" onPress={handleSubmit} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
      },
      submitButton:{
        marginBottom: 50,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      questionContainer: {
        marginBottom: 20,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'white',
      },
      inputWrapper: {
        position: 'relative',
      },
      inputWithIcon: {
        paddingRight: 40,
      },
      iconWrapper: {
        position: 'absolute',
        right: 10,
        top: 15,
      },
      placeholderText: {
        color: '#999',
      },
      dropdownIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
      },
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      optionText: {
        marginLeft: 10,
      },
      imageUploadButton: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
      },
      uploadButtonText: {
        color: '#007BFF',
      },
      imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 8, 
        borderWidth: 1,
        borderColor: '#ccc',
      },
    });
    
    

export default QuestionsScreen;