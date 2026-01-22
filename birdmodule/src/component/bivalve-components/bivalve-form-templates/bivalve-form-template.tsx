import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, ActivityIndicator, Button,View } from 'react-native';

type Question = {
  text: string;
  type: string;
  required: boolean;
  options?: string[];
};

type FormData = {
  formTitle: string;
  questions: Question[];
  _id: string;  // Add _id to access the form identifier
};

const FormTemp = ({ navigation }: { navigation: any }) => {
  const [forms, setForms] = useState<FormData[]>([]); // Store all forms here
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all forms from the backend when the component is mounted
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('http://172.20.8.45:5001/getAllForms'); // Backend URL to fetch all forms
        const data = await response.json();

        if (response.ok) {
          setForms(data); // Set the fetched forms data
        } else {
          console.log('Error fetching forms:', data.message);
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchForms();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading spinner while fetching
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.heading}>Available Forms</Text>

      {/* Render the list of forms */}
      {forms.map((form) => (
        <View key={form._id} style={styles.formContainer}>
          <Text style={styles.formTitle}>{form.formTitle}</Text>

          {/* Button to navigate to the form details page */}
          <Button
            title="View Form"
            onPress={() => navigation.navigate('QuestionsScreen', { formId: form._id })}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormTemp;
