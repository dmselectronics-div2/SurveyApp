import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
  title?: string;
  message?: string;
  buttonText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  type = 'success',
  title,
  message,
  buttonText = 'Continue',
}) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'error':
        return {
          title: title || 'Error !',
          message: message || 'Something went wrong. Please try again.',
          iconName: 'error',
          iconColor: '#DC2626',
          backgroundColor: '#FEF2F2',
          buttonColor: '#DC2626',
        };
      case 'success':
      default:
        return {
          title: title || 'Success !',
          message: message || 'Your form has been successfully submitted! We\'ll get back to you soon.',
          iconName: 'check-circle',
          iconColor: '#39c66dd6',
          backgroundColor: '#F0FDF4',
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
          <View style={styles.iconContainer}>
            <Icon name={config.iconName} size={80} color={config.iconColor} />
          </View>
          <Text style={[styles.title, { color: config.iconColor }]}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: config.buttonColor }]} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{buttonText}</Text>
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
