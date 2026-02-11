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
import BirdSurveyForm from '../survey-drafts/bird-survey-form';
import CollectionPage from '../collection-page/collection';
import ProfileMenu from '../dashboard-page/menu-page/profile-page';
import MyDataTable from '../data-table/display-table';
import SearchOption from '../Search-page/search-option';
import SelectEditMode from '../Edit-Survey/Edit-permition';

// Bottom Nav Bar
const DashboardRoute = () => <MainDashboardPage />;
const AlbumsRoute = () => <BirdSurveyForm />;
const RecentsRoute = () => <CollectionPage />;
const NotificationsRoute = () => <SearchOption />;
const ProfilePageRoute = () => <ProfileMenu />;

const BottomNavbar = ({ setTitle }) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
//   const [title, setTitle] = useState('Dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSelectEditMode, setShowSelectEditMode] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [menuContent, setMenuContent] = useState(null);
  const menuAnchorRef = useRef(null);

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

  return (
    <PaperProvider>
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

export default BottomNavbar;
