


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import CollectionCard from './collection-card'; // Adjust the path as needed
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';
API_URL

const CollectionPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);// State to keep track of the member being edited

  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );


useEffect(() => {
  retriveEmailFromSQLite();
  // retriveAllFromDataSQLite();
}, []);

const retriveEmailFromSQLite = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT email FROM LoginData LIMIT 1',
      [],
      (tx, results) => {
        if (results.rows.length > 0) {
          const email = results.rows.item(0).email;
          setEmail(email);
          console.log('Retrieved email profile : ', email);
          return {email};
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
  const fetchData = async () => {
    setLoading(true); // Ensure loading starts before fetching

    try {
      const response = await fetch(`${API_URL}/form-entries`);
      const result = await response.json();

      if (!Array.isArray(result)) {
        console.error('Invalid data format:', result);
        setEntries([]); // Reset to empty array if data is invalid
        return;
      }

      const filteredData = result.filter(item => item.email === email);

      if (filteredData.length === 0) {
        console.log(`No entries found for email: ${email}`);
      }

      setEntries(filteredData);
      console.log('Fetched Data with Emails:', filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEntries([]); // Prevent undefined data in case of error
    } finally {
      setLoading(false); // Ensure loading state resets
    }
  };

  if (email) {
    fetchData(); // Only fetch data after email is retrieved
  }
}, [email]); // Add 'email' as a dependency



  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <ScrollView>
        <View style={styles.title_container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            entries.map((entry, index) => (
              <CollectionCard key={index} entry={entry} />
            
            ))
            
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title_container: {
    flex: 1,
    marginTop: '2%',
    marginBottom: '2%',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default CollectionPage;
