import React, {useEffect, useState} from 'react';
import {
  Text,
  Avatar,
  IconButton,
  Button,
  Dialog,
  Portal,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Appearance,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native';
import {getDatabase} from '../../database/db';
import {API_URL} from '../../../config';

const ProfileMenu = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('Birds');

  const [showDialog, setShowDialog] = useState(false);

  const handleEditToggle = () => {
    setIsEditingName(!isEditingName);
  };

  const handleAvatarChange = () => {
    navigation.navigate('ProfileImageChange', {email});
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/delete-account`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });

      if (response.ok) {
        Alert.alert(
          'Request Sent',
          "Account delete request sent to admin. We'll inform you when it's accepted.",
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to send account delete request. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error sending delete request:', error);
      Alert.alert('Error', 'An error occurred while sending the request.');
    }
  };

  const retriveEmailFromSQLite = async () => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const userEmail = results.rows.item(0).email;
            setEmail(userEmail);
            retrieveNameFromSQLite(userEmail);
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const retrieveNameFromSQLite = async (userEmail: string) => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name, area, userImageUrl FROM Users WHERE email = ?',
        [userEmail],
        (tx, results) => {
          if (results.rows.length > 0) {
            const row = results.rows.item(0);
            if (row.name) setName(row.name);
            if (row.area) setArea(row.area);
            if (row.userImageUrl) setAvatarUri(row.userImageUrl);
          }
        },
        error => {
          console.error('Error retrieving user from SQLite: ', error.message);
        },
      );
    });
  };

  useEffect(() => {
    retriveEmailFromSQLite();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  const handleLogoutClick = () => {
    navigation.navigate('LoginPage', {email});
    setShowDialog(false);
  };

  const handleShowLogoutConfirmation = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const colors = {
    bg: isDarkMode ? '#121212' : '#F5F5F5',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    headerBg: isDarkMode ? 'rgb(2, 93, 32)' : 'rgba(84, 200, 86, 0.85)',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subtext: isDarkMode ? '#AAAAAA' : '#777777',
    border: isDarkMode ? '#333333' : '#E8E8E8',
    iconBg: isDarkMode ? '#2A2A2A' : '#F0F0F0',
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.bg}]}
      contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={[styles.headerSection, {backgroundColor: colors.headerBg}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <IconButton icon="arrow-left" size={24} iconColor="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.avatarWrapper}>
          <Avatar.Image
            size={100}
            source={
              avatarUri
                ? {uri: avatarUri}
                : require('../../../assets/image/prof.jpg')
            }
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.avatarBadge}
            onPress={handleAvatarChange}>
            <IconButton
              icon="camera"
              size={16}
              iconColor="#FFFFFF"
              style={styles.badgeIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerName}>{name || 'User'}</Text>
        <Text style={styles.headerEmail}>{email}</Text>
      </View>

      {/* Info Cards Section */}
      <View style={styles.cardsSection}>
        {/* Name Card */}
        <View style={[styles.infoCard, {backgroundColor: colors.cardBg, borderColor: colors.border}]}>
          <View style={styles.cardIcon}>
            <IconButton icon="account" size={22} iconColor={isDarkMode ? '#54C856' : '#2E7D32'} />
          </View>
          <View style={styles.cardTextArea}>
            <Text style={[styles.cardLabel, {color: colors.subtext}]}>Full Name</Text>
            {isEditingName ? (
              <TextInput
                style={[styles.cardValueInput, {color: colors.text, borderBottomColor: colors.border}]}
                value={name}
                onChangeText={setName}
                onBlur={handleEditToggle}
                autoFocus
              />
            ) : (
              <Text style={[styles.cardValue, {color: colors.text}]}>{name || 'Not set'}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleEditToggle}>
            <IconButton
              icon={isEditingName ? 'check' : 'pencil-outline'}
              size={20}
              iconColor={colors.subtext}
            />
          </TouchableOpacity>
        </View>

        {/* Email Card */}
        <View style={[styles.infoCard, {backgroundColor: colors.cardBg, borderColor: colors.border}]}>
          <View style={styles.cardIcon}>
            <IconButton icon="email-outline" size={22} iconColor={isDarkMode ? '#54C856' : '#2E7D32'} />
          </View>
          <View style={styles.cardTextArea}>
            <Text style={[styles.cardLabel, {color: colors.subtext}]}>Email Address</Text>
            <Text style={[styles.cardValue, {color: colors.text}]}>{email || 'Not set'}</Text>
          </View>
        </View>

        {/* Area Card */}
        <View style={[styles.infoCard, {backgroundColor: colors.cardBg, borderColor: colors.border}]}>
          <View style={styles.cardIcon}>
            <IconButton icon="leaf" size={22} iconColor={isDarkMode ? '#54C856' : '#2E7D32'} />
          </View>
          <View style={styles.cardTextArea}>
            <Text style={[styles.cardLabel, {color: colors.subtext}]}>Preferred Area</Text>
            <Text style={[styles.cardValue, {color: colors.text}]}>{area || 'Not set'}</Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleShowLogoutConfirmation}>
          <IconButton icon="logout" size={20} iconColor="#FFFFFF" style={styles.actionBtnIcon} />
          <Text style={styles.actionButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAccount}>
          <IconButton icon="delete-outline" size={20} iconColor="#FFFFFF" style={styles.actionBtnIcon} />
          <Text style={styles.actionButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Logout Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout from the application?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog} textColor="#777">Cancel</Button>
            <Button onPress={handleLogoutClick} textColor="#E53935">Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 4,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'InriaSerif-Bold',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeIcon: {
    margin: 0,
    padding: 0,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'InriaSerif-Bold',
  },
  headerEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    fontFamily: 'Inter-regular',
  },
  cardsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardIcon: {
    marginRight: 4,
  },
  cardTextArea: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-regular',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InriaSerif-Bold',
  },
  cardValueInput: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InriaSerif-Bold',
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  actionBtnIcon: {
    margin: 0,
  },
  logoutButton: {
    backgroundColor: '#E53935',
  },
  deleteButton: {
    backgroundColor: '#5C6BC0',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InriaSerif-Bold',
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontFamily: 'InriaSerif-Bold',
  },
});

export default ProfileMenu;
