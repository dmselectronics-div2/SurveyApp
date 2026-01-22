import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { API_URL } from '../../config';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/form-entries`);
        const result = await response.json();
        setData(result);
        calculateFilteredTotalCount(result);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [species, startDate, endDate]);

  const calculateFilteredTotalCount = (data) => {
    const totalCount = filterData().reduce((sum, item) => sum + (parseInt(item.count) || 0), 0);
    setTotalBirdCount(totalCount);
  };

  const filterData = () => {
    const normalizedSpecies = species ? species.toLowerCase() : null;
    const filteredData = data.filter((item) => {
      const itemSpecies = item.species ? item.species.toLowerCase() : '';
      const itemDate = new Date(item.date).toLocaleDateString();
      return (
        (!normalizedSpecies || itemSpecies === normalizedSpecies) &&
        (!startDate || new Date(item.date).toLocaleDateString() >= new Date(startDate).toLocaleDateString()) &&
        (!endDate || new Date(item.date).toLocaleDateString() <= new Date(endDate).toLocaleDateString())
      );
    });

    // Group by species and aggregate counts
    const groupedData = {};
    filteredData.forEach((item) => {
      const normalizedKey = item.species ? item.species.toLowerCase() : 'unknown';
      if (!groupedData[normalizedKey]) {
        groupedData[normalizedKey] = { ...item, count: parseInt(item.count) || 0 };
      } else {
        groupedData[normalizedKey].count += parseInt(item.count) || 0;
      }
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
            <View key={rowIndex} style={[styles.row, isDarkTheme ? styles.darkRow : styles.lightRow]}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={[styles.cell, { width: columnWidth }]}>
                  <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>
                    {formatValue(item[col.key])}
                  </Text>
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
