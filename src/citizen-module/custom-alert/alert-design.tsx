import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  language?: 'en' | 'si' | 'ta'; // English, Sinhala, Tamil
}

const translations = {
  en: {
    title: 'Success !',
    message: 'Your form has been successfully submitted! We\'ll get back to you soon.',
    button: 'Continue',
  },
  si: {
    title: 'සාර්ථකයි !',
    message: 'ඔබගේ තොරතුරු ඇතුළත් කිරීම සාර්ථකව සිදුකරන ලදි.',
    button: 'ඉදිරියට',
  },
  ta: {
    title: 'சிறப்பு!',
    message: 'உங்களுடைய தரவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டுள்ளது.',
    button: 'தொடரவும்',
  },
};

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, onClose, language = 'en' }) => {
  const t = translations[language] || translations.en;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Checkmark Icon */}
          <View style={styles.iconContainer}>
            <Icon name="check-circle" size={80} color="#39c66dd6" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{t.title}</Text>

          {/* Message */}
          <Text style={styles.message}>{t.message}</Text>

          {/* Continue Button */}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{t.button}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: 320,
    paddingVertical: 30,
    paddingHorizontal: 25,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  message: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontFamily: 'serif',
  },
  button: {
    backgroundColor: '#39c66dd6',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'serif',
  },
});

export default CustomAlert;
