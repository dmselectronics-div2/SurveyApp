import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  language?: 'en' | 'si' | 'ta'; // English, Sinhala, Tamil
  type?: 'success' | 'error' | 'network'; // Message type
  title?: string; // Custom title
  message?: string; // Custom message
  buttonText?: string; // Custom button text
}

const translations = {
  en: {
    successTitle: 'Success !',
    successMessage: 'Your form has been successfully submitted! We\'ll get back to you soon.',
    errorTitle: 'Error !',
    errorMessage: 'Something went wrong. Please try again.',
    networkTitle: 'Network Issue !',
    networkMessage: 'Connection problem. Please check your internet and try again.',
    button: 'Continue',
  },
  si: {
    successTitle: 'සාර්ථකයි !',
    successMessage: 'ඔබගේ තොරතුරු ඇතුළත් කිරීම සාර්ථකව සිදුකරන ලදි.',
    errorTitle: 'දෝෂයි !',
    errorMessage: 'යමක් වැරැද්දී ගොස් ඇත. කරුණාකර නැවත උත්සාහ කරන්න.',
    networkTitle: 'ජාල ගැටළුවි !',
    networkMessage: 'සම්බන්ධතා ගැටළුවි. ඔබගේ ඉන්ටර්නෙට් සම්බන්ධතා පරීක්ෂා කර නැවත උත්සාහ කරන්න.',
    button: 'ඉදිරියට',
  },
  ta: {
    successTitle: 'சிறப்பு!',
    successMessage: 'உங்களுடைய தரவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டுள்ளது.',
    errorTitle: 'பிழை !',
    errorMessage: 'ஏதோ பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    networkTitle: 'நெட்வொர்க் சிக்கல் !',
    networkMessage: 'இணையதள இணைப்பு சிக்கல். உங்கள் இணையத்தை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    button: 'தொடரவும்',
  },
};

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  visible, 
  onClose, 
  language = 'en',
  type = 'success',
  title,
  message,
  buttonText
}) => {
  const t = translations[language] || translations.en;

  // Determine the title, message, icon and colors based on type
  const getAlertConfig = () => {
    const customTitle = title || t[`${type}Title`];
    const customMessage = message || t[`${type}Message`];

    switch (type) {
      case 'error':
        return {
          title: customTitle,
          message: customMessage,
          iconName: 'error',
          iconColor: '#DC2626', // Red
          backgroundColor: '#FEF2F2', // Light red
          buttonColor: '#DC2626',
        };
      case 'network':
        return {
          title: customTitle,
          message: customMessage,
          iconName: 'wifi-off',
          iconColor: '#F59E0B', // Yellow/Amber
          backgroundColor: '#FFFBEB', // Light yellow
          buttonColor: '#F59E0B',
        };
      case 'success':
      default:
        return {
          title: customTitle,
          message: customMessage,
          iconName: 'check-circle',
          iconColor: '#39c66dd6', // Green
          backgroundColor: '#F0FDF4', // Light green
          buttonColor: '#39c66dd6',
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { backgroundColor: config.backgroundColor }]}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name={config.iconName} size={80} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: config.iconColor }]}>{config.title}</Text>

          {/* Message */}
          <Text style={styles.message}>{config.message}</Text>

          {/* Continue Button */}
          <TouchableOpacity style={[styles.button, { backgroundColor: config.buttonColor }]} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{buttonText || t.button}</Text>
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
    borderRadius: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
  },
  message: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontFamily: 'Times New Roman',
  },
  button: {
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
    fontFamily: 'Times New Roman',
  },
});

export default CustomAlert;
