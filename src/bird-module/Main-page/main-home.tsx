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
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppBarPage from '../appbar-page/appbar-page';
import BottomNavbar from '../bottom-navpage/bottom-navbar';
// import Layout from './layout';
import MyDataTable from '../data-table/display-table';
import MainDashboardPage from '../dashboard-page/dash-board';
// import BottomNavbar from '../bottom-navpage/bottom-navpage';


const MainHomePage = () => {
  const [title, setTitle] = useState('Dashboard');
  const navigation = useNavigation();
  const menuAnchorRef = useRef(null);

  return (
    <PaperProvider>
      <AppBarPage title={title} />
      <BottomNavbar setTitle={setTitle} />
    </PaperProvider>
   
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 120,
    height: 'auto',
    marginTop: 10,
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

export default MainHomePage;
