import React, {useState, useEffect, useRef} from 'react';
import { Appbar, Avatar, IconButton, Menu } from 'react-native-paper';
import MenuItems from '../dashboard-page/menu-page/menu-page';
import { StyleSheet, TouchableOpacity } from 'react-native';

const AppBarPage = ({ title}) => {
  const _goBack = () => console.log('Went back');
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');

  const [menuVisible, setMenuVisible] = useState(false);
  const [index, setIndex] = useState(0);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };

  const closeProfileMenu = () => setShowProfileMenu(false);

  return (
    <Appbar.Header>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={styles.menu}
          anchor={
            <IconButton
              icon="menu"
              iconColor="black" // Change the color to black
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
              iconColor="black"
              size={30}
              style={{marginRight: 20}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowProfileMenu(true)}>
            <Avatar.Image
              size={30}
              source={require('../../assets/image/Bird.jpeg')}
              style={{marginRight: 22}}
            />
          </TouchableOpacity>
        )}
      </Appbar.Header>
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

export default AppBarPage;
