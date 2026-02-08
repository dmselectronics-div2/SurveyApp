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
import { getDatabase } from '../database/db';
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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const db = await getDatabase();

        // Get email from LoginData
        const [loginResults] = await db.executeSql('SELECT email FROM LoginData', []);
        if (loginResults.rows.length > 0) {
          const emailLocal = loginResults.rows.item(0).email;
          console.log('emailLocal ', emailLocal);

          // Get avatar from Users
          const [userResults] = await db.executeSql(
            'SELECT userImageUrl FROM Users WHERE email = ?',
            [emailLocal],
          );
          if (userResults.rows.length > 0) {
            const retrieveImage = userResults.rows.item(0).userImageUrl;
            if (retrieveImage) {
              setAvatarUri(retrieveImage);
            } else {
              setAvatarUri('../../assets/image/prof.jpg');
            }
          } else {
            console.log('No user found in SQLite');
          }
        } else {
          console.log('No Email');
        }
      } catch (error: any) {
        console.log('Error querying database: ' + error.message);
      }
    };
    loadUserData();
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
