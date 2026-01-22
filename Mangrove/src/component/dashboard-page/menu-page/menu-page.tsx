import React, { useEffect, useState } from 'react';
import {Menu, Text, Avatar, Divider} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity, Alert, Appearance} from 'react-native';

interface MenuItemsProps {
  closeMenu: () => void;
  setIndex: (index: number) => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({closeMenu, setIndex, closeProfileMenu }) => {

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  const handleAvatarClick = (itemName: string, index: number) => {
    // Alert.alert(`${itemName} clicked!`);
    setIndex(index);
    closeMenu();
    if(closeProfileMenu) {
      closeProfileMenu();
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark'; 

  return (
    <>
      <Menu.Item
        // style={styles.menuItem}
        onPress={() => handleAvatarClick('Dashboard', 0)}
        style={[styles.menuItem, {marginLeft: 5,} ]}
        title={
          <View style={styles.menuContent}>
            <TouchableOpacity
              
              style={styles.touchable}>
              <Avatar.Image
                size={60}
                source={require('../../../assets/image/dashboard.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={[styles.avatarText, {color: isDarkMode ? "white": "black"}]}>DashBoard</Text>
          </View>
        }
      />
      <Menu.Item
        // onPress={closeMenu}
        // style={styles.menuItem}
        onPress={() => handleAvatarClick('Bird Survey', 1)}
        style={[styles.menuItem, {marginLeft: 5}]}
        title={
          <View style={styles.menuContent}>
            <TouchableOpacity
              
              style={styles.touchable}>
              <Avatar.Image
                size={60}
                source={require('../../../assets/image/birdsurvey.jpeg')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={[styles.avatarText, {color: isDarkMode ? "white": "black"}]}>Bird Survey</Text>
          </View>
        }
      />
      <Menu.Item
        // onPress={closeMenu}
        // style={styles.menuItem}
        onPress={() => handleAvatarClick('Collection', 2)}
        style={[styles.menuItem, {marginLeft: 5}]}
        title={
          <View style={styles.menuContent}>
            <TouchableOpacity
              
              style={styles.touchable}>
              <Avatar.Image
                size={60}
                source={require('../../../assets/image/bordGroup.jpeg')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={[styles.avatarText, {color: isDarkMode ? "white": "black"}]}>Collection</Text>
          </View>
        }
      />
      <Menu.Item
        // onPress={closeMenu}
        // style={styles.menuItem}
        onPress={() => handleAvatarClick('Bird Data', 3)}
        style={[styles.menuItem, {marginLeft: 5}]}
        title={
          <View style={styles.menuContent}>
            <TouchableOpacity
              
              style={styles.touchable}>
              <Avatar.Image
                size={60}
                source={require('../../../assets/image/survay.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={[styles.avatarText, {color: isDarkMode ? "white": "black"}]}>Bird Data</Text>
          </View>
        }
      />
      {/* <Menu.Item
        onPress={() => handleAvatarClick('Draft', 4)}
        style={[styles.menuItem, {marginLeft: 5}]}
        // style={styles.menuItem}
        title={
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.touchable}>
              <Avatar.Image
                size={60}
                source={require('../../../assets/image/Graphic.png')}
                style={styles.avatar}
              />
              <Text style={styles.avatarText}>Draft</Text>
            </TouchableOpacity>
          </View>
        }
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    // borderRadius: 50,
    width: 100,
    height: 'auto',
    paddingTop: 90,
    // marginTop:50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // display:'flex',
    // justifyContent:'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  menuContent: {
    width: 'auto',
    backgroundColor: 'rgba(255,255,255,0.01)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // display:'flex',
  },
  touchable: {
    // alignItems: 'center',
    // justifyContent: 'center',
    width: 80,
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  avatarText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
});

export default MenuItems;
