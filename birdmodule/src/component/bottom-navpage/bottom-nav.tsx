import React, {useState, useEffect, useRef} from 'react';
import {
  BottomNavigation,
  Text,
  Appbar,
  Avatar,
  IconButton,
  PaperProvider,
  Menu,
} from 'react-native-paper';
import MainDashboardPage from '../dashboard-page/dash-board';
import MenuItems from '../dashboard-page/menu-page/menu-page';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DropdownComponent from '../survey-form-page/new';
import CollectionPage from '../collection-page/collection';
import ProfileMenu from '../dashboard-page/menu-page/profile-page';
import MyDataTable from '../data-table/display-table';
import SearchPage from '../Search-page/search-page';
import SearchOption from '../Search-page/search-option';
import {Appearance} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import * as Keychain from 'react-native-keychain';
import SurveyComponent from '../survey-drafts/add-new-survey';

// Bottom Nav Bar
const DashboardRoute = () => <MainDashboardPage />;
const AlbumsRoute = () => <SurveyComponent />;
const RecentsRoute = () => <CollectionPage />;
const NotificationsRoute = () => <SearchOption />;
const ProfilePageRoute = () => <ProfileMenu />;

const BottomNav = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('Dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [menuContent, setMenuContent] = useState(null);
  const menuAnchorRef = useRef(null);

  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState('');

  // Open the SQLite database
  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  const [routes] = useState([
    {
      key: 'dashboard',
      title: 'Dashboard',
      topTitle: 'Birds Dashboard',
      focusedIcon: 'view-dashboard',
      unfocusedIcon: 'view-dashboard-outline',
    },
    {
      key: 'albums',
      title: 'Survey',
      topTitle: 'Birds Survey',
      focusedIcon: 'format-list-bulleted',
      unfocusedIcon: 'format-list-bulleted',
    },
    {
      key: 'recents',
      title: 'Collection',
      topTitle: 'Birds Collection',
      focusedIcon: 'folder-multiple',
      unfocusedIcon: 'folder-multiple-outline',
    },
    {
      key: 'notifications',
      title: 'Data',
      topTitle: 'Birds Details',
      focusedIcon: 'database',
      unfocusedIcon: 'database-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
  });

  // Update the title based on the index
  useEffect(() => {
    if (showProfileMenu) {
      setTitle('Profile Menu');
    } else {
      setTitle(routes[index].topTitle);
    }
  }, [index, routes, showProfileMenu]);

  // Functions to show and hide the menu
  const openMenu = () => {
    setMenuVisible(true);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };

  const closeProfileMenu = () => setShowProfileMenu(false);

  const navigateToOtherPage = () => {
    setShowBottomNav(false);
    navigation.navigate('EditCount'); // Replace with your actual navigation logic
  };

  // Function to retrieve email from SQLite
  const retrieveNameFromSQLite = userEmail => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT userImageUrl FROM Users WHERE email = ?',
        [userEmail],
        (tx, results) => {
          if (results.rows.length > 0) {
            const retrieveImage = results.rows.item(0).userImageUrl;

            if (retrieveImage) {
              setAvatarUri(retrieveImage); // Use the image from the database if it exists
            } else {
              setAvatarUri('../../assets/image/prof.jpg'); // Default to a local placeholder if no image is found
            }
          } else {
            console.log('No user found in SQLite');
          }
        },
        error => {
          console.error('Error retrieving user from SQLite: ', error.message);
        },
      );
    });
  };

  const saveLastUserToSQLite = () => {
    console.log('DF');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData',
        [],
        (tx, results) => {
          console.log('result A', results.rows.item(0));
          console.log('Number of rows: ', results.rows.length);
          if (results.rows.length > 0) {
            const emailLocal = results.rows.item(0).email;
            console.log('emailLocal ', emailLocal);
            retrieveNameFromSQLite(emailLocal);
          } else {
            // If no row exists, insert a new one
            console.log('No Email ')
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  // Retrieving the email
  const retrieveEmailSecurely = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        const email = credentials.username; // This will give you the email
        setEmail(email);
        console.log('Retrieved email profile : ', email);
        retrieveNameFromSQLite(email);
        return {email}; 
      } else {
        console.log('No email and password stored.');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve email and password', error);
    }
  };

  useEffect(() => {
    // retrieveEmailSecurely();
    saveLastUserToSQLite();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <PaperProvider>
      <Appbar.Header>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={[
            styles.menu,
            {
              backgroundColor: isDarkMode
                ? 'rgba(107, 107, 107, 0.9)'
                : 'rgba(217, 217, 217, 0.9)',
            },
          ]}
          anchor={
            <IconButton
              icon="menu"
              iconColor={isDarkMode ? 'white' : 'black'} // Change the color to black
              size={30}
              onPress={openMenu}
              style={{marginLeft: 20}}
            />
          }>
          <MenuItems
            closeMenu={closeMenu}
            setIndex={setIndex}
            closeProfileMenu={closeProfileMenu}
          />
        </Menu>

        <Appbar.Content
          title={title}
          titleStyle={{
            textAlign: 'center',
            flex: 1,
            fontWeight: 'bold',
            marginRight: 20,
            marginTop: 20,
          }}
        />

        {showProfileMenu ? (
          <TouchableOpacity onPress={() => setShowProfileMenu(false)}>
            <IconButton
              icon="keyboard-backspace"
              iconColor={isDarkMode ? 'white' : 'black'}
              size={30}
              style={{marginRight: 20}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowProfileMenu(true)}>
            <Avatar.Image
              size={35}
              source={
                avatarUri
                  ? {uri: avatarUri}
                  : require('../../assets/image/prof.jpg')
              }
              style={{marginRight: 20}}
            />
          </TouchableOpacity>
        )}
      </Appbar.Header>

      {showProfileMenu ? (
        <ProfileMenu />
      ) : (
        <>
          {showBottomNav && (
            <BottomNavigation
              navigationState={{index, routes}}
              onIndexChange={setIndex}
              renderScene={renderScene}
            />
          )}
        </>
      )}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 120,
    height: 'auto',
    marginTop: 60,
    // paddingLeft:20,
    // paddingRight:20,
    // paddingTop: 50,
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default BottomNav;
