import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PreviewField {
  label: string;
  value: string | undefined;
  isImage?: boolean;
}

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  fields: PreviewField[];
  isSubmitting: boolean;
  language: 'en' | 'si' | 'ta';
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  fields,
  isSubmitting,
  language,
}) => {
  const translations = {
    en: {
      previewTitle: 'Preview Your Data',
      confirm: 'Confirm & Submit',
      edit: 'Edit',
      submitting: 'Submitting...',
    },
    si: {
      previewTitle: 'ඔබේ දත්ත පෙරදසුන',
      confirm: 'තහවුරු කර ඉදිරිපත් කරන්න',
      edit: 'සංස්කරණය',
      submitting: 'ඉදිරිපත් කරමින්...',
    },
    ta: {
      previewTitle: 'உங்கள் தரவின் முன்னோட்டம்',
      confirm: 'உறுதிசெய்து சமர்ப்பிக்கவும்',
      edit: 'திருத்து',
      submitting: 'சமர்ப்பிக்கப்படுகிறது...',
    },
  };

  const t = translations[language] || translations.en;

  const renderFieldValue = (field: PreviewField) => {
    if (field.isImage && field.value) {
      return (
        <Image
          source={{ uri: field.value }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <Text style={styles.fieldValue}>
        {field.value || '-'}
      </Text>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.previewTitle}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Category Title */}
          <View style={styles.categoryHeader}>
            <Icon name="visibility" size={24} color="#4A7856" />
            <Text style={styles.categoryTitle}>{title}</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {fields.map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {renderFieldValue(field)}
              </View>
            ))}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.editButton, isSubmitting && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Icon name="edit" size={20} color="#4A7856" />
              <Text style={styles.editButtonText}>{t.edit}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, isSubmitting && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.submittingContent}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={[styles.confirmButtonText, { marginLeft: 8 }]}>
                    {t.submitting}
                  </Text>
                </View>
              ) : (
                <>
                  <Icon name="check-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>{t.confirm}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  closeButton: {
    padding: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryTitle: {
    fontSize: 18,
    color: '#4A7856',
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Times New Roman',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    maxHeight: 400,
  },
  fieldContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'Times New Roman',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A7856',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#4A7856',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  confirmButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#4A7856',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4A7856',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submittingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PreviewModal;
