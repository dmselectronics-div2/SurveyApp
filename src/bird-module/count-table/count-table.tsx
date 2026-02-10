

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { API_URL } from '../../config';
import { getDatabase } from '../database/db';

const formatValue = (value) => {
  if (value instanceof Date) {
    return new Date(value).toLocaleDateString();
  }
  return value !== undefined ? value : 'N/A';
};

const MyCountTable = ({ species, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [totalBirdCount, setTotalBirdCount] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [email, setEmail] = useState(null);

useEffect(() => {
  retriveEmailFromSQLite();
}, []);

const retriveEmailFromSQLite = async () => {
  const db = await getDatabase();
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
    try {
      const response = await fetch(`${API_URL}/form-entries`);
      const result = await response.json();

      if (!Array.isArray(result)) {
        console.error('Invalid data format:', result);
        setData([]); // Reset to empty array if data is invalid
        return;
      }

      // Filter data by email
      const filteredData = result.filter(item => item.email === email);

      setData(filteredData);
      console.log('Filtered Data:', filteredData);

      // Calculate the total count for filtered data only
      const totalCount = filteredData.length;
      console.log('Total Count:', totalCount);

      calculateFilteredTotalCount(filteredData); // Use filtered data for calculations
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      calculateFilteredTotalCount([]); // Reset count on error
    }
  };

  if (email) {
    fetchData(); // Ensure data is fetched only when the email is available
  }
}, [email, species, startDate, endDate]);



  const calculateFilteredTotalCount = () => {
    const totalCount = data.reduce((sum, item) => {
      // Aggregate count from birdObservations array
      if (item.birdObservations && item.birdObservations.length > 0) {
        item.birdObservations.forEach(bird => {
          sum += parseInt(bird.count) || 0;
        });
      }
      return sum;
    }, 0);

    console.log("✅ Calculated Total Bird Count:", totalCount);
    setTotalBirdCount(totalCount);
  };

  const filterData = () => {
    // Normalize species to lowercase for case-insensitive comparison
    const normalizedSpecies = species ? species.toLowerCase() : null;
  
    // Convert start and end dates to 'YYYY-MM-DD' format for comparison
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    // Filter data based on species and date range
    const filteredData = data.filter((item) => {
      const itemSpecies = item.species ? item.species.toLowerCase() : '';
      const itemDate = item.date ? item.date : ''; // Assuming item.date is in 'YYYY-MM-DD' format
  
      return (
        (!normalizedSpecies || itemSpecies === normalizedSpecies) &&
        (!formattedStartDate || itemDate >= formattedStartDate) && // Compare formatted date
        (!formattedEndDate || itemDate <= formattedEndDate) // Compare formatted date
      );
    });
  
    // Group by species and aggregate bird counts from birdObservations
    const groupedData = {};
  
    filteredData.forEach((item) => {
      const birdObservations = item.birdObservations || [];
      birdObservations.forEach((bird) => {
        const normalizedKey = bird.species ? bird.species.toLowerCase() : 'unknown';
  
        if (!groupedData[normalizedKey]) {
          groupedData[normalizedKey] = { species: bird.species, count: parseInt(bird.count) || 0 };
        } else {
          groupedData[normalizedKey].count += parseInt(bird.count) || 0;
        }
      });
    });
  
    return Object.values(groupedData);
  };
  
  const columns = [
    { key: 'species', displayName: 'Observed Species' },
    { key: 'count', displayName: 'Count' },
  ];

  const columnWidth = 150;

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <View>
        <Text style={[styles.totalText, isDarkTheme ? styles.darkText : styles.lightText]}>
          Total Bird Count In Selected Date Range
        </Text>
        <View style={[styles.totalCountBox, isDarkTheme ? styles.darkTotalCountBox : styles.lightTotalCountBox]}>
          <Text style={styles.totalCount}>{totalBirdCount}</Text>
        </View>
      </View>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.headerRow, isDarkTheme ? styles.darkHeaderRow : styles.lightHeaderRow]}>
            {columns.map((col, index) => (
              <View key={index} style={[styles.headerCell, { width: columnWidth }]}>
                <Text style={[styles.headerText, isDarkTheme ? styles.darkText : styles.lightText]}>
                  {col.displayName}
                </Text>
              </View>
            ))}
          </View>
          {filterData().map((item, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <View style={[styles.row, isDarkTheme ? styles.darkRow : styles.lightRow]}>
                {columns.map((col, colIndex) => (
                  <View key={colIndex} style={[styles.cell, { width: columnWidth }]}>
                    <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>
                      {col.key === 'count' ? formatValue(item.count) : formatValue(item[col.key])}
                    </Text>
                  </View>
                ))}
              </View>
            </React.Fragment>
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
  table: {
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 60,
    borderLeftWidth: 1,
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
  totalText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  totalCountBox: {
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  lightTotalCountBox: {
    backgroundColor: 'green',
  },
  darkTotalCountBox: {
    backgroundColor: '#444',
  },
  totalCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyCountTable;
