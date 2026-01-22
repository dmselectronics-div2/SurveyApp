import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';
API_URL


const EmailInput = () => {
  const [email, setEmail] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post(`${API_URL}/send-email`, { email });//axios.post(`${API_URL}/register`, userData)
      Alert.alert('Success', response.data);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to send email');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Generate" onPress={handleGenerate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default EmailInput;
