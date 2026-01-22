import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, onClose, message }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      // Clear timeout if the component unmounts before the timeout completes
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertMessage}>{message}</Text>
          <FastImage
            style={styles.iconStyles}
            source={require('../../assets/image/done.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
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
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    fontWeight: '600',
  },
  buttonText: {
    fontSize: 16, // Set your desired font size here
  },
  iconStyles: {
    width: 100,
    height: 100,
    marginBottom: 10, // Optional: Add margin if needed
  },
});

export default CustomAlert;
