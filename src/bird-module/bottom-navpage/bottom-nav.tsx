import React, {useState} from 'react';
import {
  BottomNavigation,
  PaperProvider,
} from 'react-native-paper';
import MainDashboardPage from '../dashboard-page/dash-board';
import BirdSurveyForm from '../survey-drafts/bird-survey-form';
import CollectionPage from '../collection-page/collection';
import SearchOption from '../Search-page/search-option';

// Bottom Nav Bar
const DashboardRoute = () => <MainDashboardPage />;
const AlbumsRoute = () => <BirdSurveyForm />;
const RecentsRoute = () => <CollectionPage />;
const NotificationsRoute = () => <SearchOption />;

const BottomNav = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'dashboard',
      title: 'Dashboard',
      focusedIcon: 'view-dashboard',
      unfocusedIcon: 'view-dashboard-outline',
    },
    {
      key: 'albums',
      title: 'Survey',
      focusedIcon: 'format-list-bulleted',
      unfocusedIcon: 'format-list-bulleted',
    },
    {
      key: 'recents',
      title: 'Drafts',
      focusedIcon: 'file-document-edit',
      unfocusedIcon: 'file-document-edit-outline',
    },
    {
      key: 'notifications',
      title: 'Data',
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

  return (
    <PaperProvider>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
};

export default BottomNav;
