import React, {useState, useEffect} from 'react';
import {
  BottomNavigation,
  PaperProvider,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import ByvalviDashboard from '../dashboard-page/dash-board';
import MangroveNew from '../survey-form-page/new';
import ByvalviCollection from '../collection-page/collection';
import MangroveDataTableComponent from '../data-table/MyDataTable';
import NetworkStatusBanner from '../../components/NetworkStatusBanner';

// Bottom Nav Bar Routes
const DashboardRoute = () => <ByvalviDashboard />;
const SurveyRoute = () => <MangroveNew />;
const DraftsRoute = () => <ByvalviCollection />;
const DataRoute = () => <MangroveDataTableComponent />;

const ByvalviBottomNavbar = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'dashboard',
      title: 'Dashboard',
      focusedIcon: 'view-dashboard',
      unfocusedIcon: 'view-dashboard-outline',
    },
    {
      key: 'survey',
      title: 'Survey',
      focusedIcon: 'format-list-bulleted',
      unfocusedIcon: 'format-list-bulleted',
    },
    {
      key: 'drafts',
      title: 'Drafts',
      focusedIcon: 'file-document-edit',
      unfocusedIcon: 'file-document-edit-outline',
    },
    {
      key: 'data',
      title: 'Data',
      focusedIcon: 'database',
      unfocusedIcon: 'database-outline',
    },
  ]);

  const scenes: Record<string, React.FC> = {
    dashboard: DashboardRoute,
    survey: SurveyRoute,
    drafts: DraftsRoute,
    data: DataRoute,
  };

  const CurrentScene = scenes[routes[index].key];

  return (
    <PaperProvider>
      <View style={{flex: 1}}>
        <NetworkStatusBanner />
        <View style={{flex: 1}}>
          <CurrentScene />
        </View>
        <View style={styles.footerBar}>
          <BottomNavigation.Bar
            navigationState={{index, routes}}
            onTabPress={({route}) => {
              const idx = routes.findIndex(r => r.key === route.key);
              setIndex(idx);
            }}
            style={{backgroundColor: 'transparent', elevation: 0}}
            theme={{
              colors: {
                secondaryContainer: '#e8f5e9',
                onSecondaryContainer: '#2e7d32',
                onSurfaceVariant: '#757575',
                elevation: {level2: 'transparent'},
              },
            }}
            activeColor="#2e7d32"
            inactiveColor="#757575"
          />
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  footerBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ByvalviBottomNavbar;
