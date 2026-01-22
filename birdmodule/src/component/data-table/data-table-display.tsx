import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';

const formatValue = (value) => {
  if (value instanceof Date) {
    return new Date(value).toLocaleDateString();
  }
  return value !== undefined ? value : 'N/A';
};

const MyCitizenTable = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const db = SQLite.openDatabase(
    { name: 'user_db.db', location: 'default' },
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  const showData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('Results:', results.rows._array); // This should give you an array of the rows
          } else {
            console.log('No data found.');
          }
        },
        error => {
          console.log('Error retrieving data: ', error);
        },
      );
    });
  };

  const retriveEmailFromSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const email = results.rows.item(0).email;
            setEmail(email);
            console.log('Retrieved email edit permission : ', email);
            return { email };
          } else {
            console.log('No email and password stored.');
            return null;
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    showData();
    retriveEmailFromSQLite();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/citizens`);
        const result = await response.json();
  
        if (!result || !Array.isArray(result.data)) {
          console.error('Expected an array but received:', result);
          setData([]); // Ensure data is always an array
          return;
        }
  
        setData(result.data); // Extract only the `data` array
      } catch (error) {
        console.error('Error fetching data', error);
        setData([]); // Prevent undefined issues
      }
    };
  
    fetchData();
  }, []);
  
  
  

  const filterData = () => {
    if (!Array.isArray(data)) {
      console.warn('Data is not an array:', data);
      return [];
    }
  
    return data.filter(item => {
      const itemDate = new Date(item.date).toLocaleDateString();
      return (
        (!startDate || new Date(item.date).toLocaleDateString() >= new Date(startDate).toLocaleDateString()) &&
        (!endDate || new Date(item.date).toLocaleDateString() <= new Date(endDate).toLocaleDateString())
      );
    });
  };
  

  const placeholderImage = 'https://example.com/placeholder.png';

  const columns = [
    { key: 'latitude', displayName: 'Latitude' },
    { key: 'longitude', displayName: 'Longitude' },
    { key: 'name', displayName: 'Observer Name' },
    { key: 'mobile', displayName: 'Mobile number' },
    {
      key: 'imageUri',
      displayName: 'Image Thumbnail',
      render: (value) => (
        <Image
          source={{ uri: value || placeholderImage }}
          style={styles.thumbnail}
        />
      )
    },
   
    // { key: 'waterLevelOnResources', displayName: 'Water Level (On Resources)' },
  ];

  const columnWidth = 150;

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.headerRow, isDarkTheme ? styles.darkHeaderRow : styles.lightHeaderRow]}>
            {columns.map((col, index) => (
              <View key={index} style={[styles.headerCell, { width: columnWidth }]}>
                <Text style={[styles.headerText, isDarkTheme ? styles.darkText : styles.lightText]}>{col.displayName}</Text>
              </View>
            ))}
          </View>
          {filterData().map((item, rowIndex) => (
            <View key={rowIndex} style={[styles.row, isDarkTheme ? styles.darkRow : styles.lightRow]}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={[styles.cell, { width: columnWidth }]}>
                  {col.key === 'imageUri' ? col.render(item[col.key]) : <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>{formatValue(item[col.key])}</Text>}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1c1c1c',
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  table: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  lightHeaderRow: {
    borderBottomColor: '#ccc',
    borderTopColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  darkHeaderRow: {
    borderBottomColor: '#444',
    borderTopColor: '#444',
    backgroundColor: '#333',
  },
  headerCell: {
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  lightRow: {
    borderBottomColor: '#ccc',
  },
  darkRow: {
    borderBottomColor: '#444',
  },
  cell: {
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  cellText: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default MyCitizenTable;
