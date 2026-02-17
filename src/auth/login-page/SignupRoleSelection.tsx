import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  BackHandler,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SignupRoleSelection = () => {
  const navigation = useNavigation<any>();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'Government',
      label: 'Government',
      description: 'Government Official',
    },
    {
      id: 'ANRM',
      label: 'ANRM team',
      description: 'Aquatic and Natural Resource Management',
    },
    {
      id: 'Academia',
      label: 'Academia',
      description: 'Academic Institution',
    },
    {
      id: 'Undergraduate',
      label: 'Undergraduate',
      description: 'Undergraduate Student',
    },
    {
      id: 'Postgraduate',
      label: 'Postgraduate',
      description: 'Postgraduate Student',
    },
    {
      id: 'Naturalist',
      label: 'Naturalist',
      description: 'Nature Enthusiast',
    },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role to continue');
      return;
    }
    // Navigate to the next signup step with selected role
    navigation.navigate('SignupSurveyType', { role: selectedRole });
  };

  const RoleOption = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.roleOption,
        selectedRole === item.id && styles.roleOptionSelected,
      ]}
      onPress={() => setSelectedRole(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.radioContainer}>
        <View
          style={[
            styles.radioOuter,
            selectedRole === item.id && styles.radioOuterSelected,
          ]}
        >
          {selectedRole === item.id && (
            <View style={styles.radioInner} />
          )}
        </View>
      </View>
      <View style={styles.roleTextContainer}>
        <Text style={styles.roleLabel}>{item.label}</Text>
        <Text style={styles.roleDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/image/Nature.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Form Container */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>
              Select your role
            </Text>
            <Text style={styles.description}>
              Choose the option that best describes your position
            </Text>
          </View>

          {/* Role Selection */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {roles.map((role) => (
              <RoleOption key={role.id} item={role} />
            ))}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    margin: 20,
    marginTop: Platform.OS === 'ios' ? 80 : 70,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7856',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  roleOptionSelected: {
    borderColor: '#4A7856',
    backgroundColor: 'rgba(74, 120, 86, 0.08)',
  },
  radioContainer: {
    marginRight: 15,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4A7856',
    backgroundColor: 'rgba(74, 120, 86, 0.1)',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A7856',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  roleDescription: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  nextButton: {
    backgroundColor: '#4A7856',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default SignupRoleSelection;
