

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import { getDatabase } from '../database/db';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

const formatValue = (value) => {
  if (value instanceof Date) {
    return new Date(value).toLocaleDateString();
  }

  // Handle the 'weather' and 'water' fields if they are objects or stringified objects
  if (typeof value === 'object' && value !== null) {
    // If it's an object, stringify it without the curly braces and quotes
    try {
      return JSON.stringify(value)
        .replace(/[{}"]/g, '') // Remove curly braces and quotes
        .replace(/,/g, ', '); // Format the object nicely
    } catch (error) {
      return 'N/A'; // In case of error, return N/A
    }
  }

  // If it's a stringified JSON object, try to parse it and display it properly
  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      return JSON.stringify(parsedValue)
        .replace(/[{}"]/g, '') // Remove curly braces and quotes
        .replace(/,/g, ', '); // Format the object nicely
    } catch (error) {
      return value; // If parsing fails, return the original string
    }
  }

  return value !== undefined ? value : 'N/A';
};

const MypureTable = ({ startDate, endDate, rowData }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const showData = async () => {
    const db = await getDatabase();
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

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch(`${API_URL}/form-entries`);
    //       const result = await response.json();
    
    //       // Assuming that each entry contains an 'email' field, extract emails from the result
    //       const userEmails = result.map(item => item.email);
    //       setData(result);
          
    //       console.log("Fetched Data with Emails:", result);
    //       // Now you have access to the emails of the entries (userEmails)
    //     } catch (error) {
    //       console.error('Error fetching data', error);
    //     }
    //   };
    //   fetchData();
    // }, []);
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_URL}/form-entries`);
          const result = await response.json();

          setData(Array.isArray(result) ? result : []);
          console.log("Fetched Data:", result.length || 0, "entries");
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };

      fetchData();
    }, []);
    



    const handleEdit = (item) => {
      // setItemEmail(item.email); // Store the email of the selected item
      // console.log('Item email:', item.email);
      // console.log('Logged-in email:', email);
      // if (item.email === email) {
      //   // Proceed with editing the item if the email matches
      //   console.log('Editing item:', item);
        navigation.navigate('SelectEditMode', {
          selectedItemData: item,  // Pass the entire item object to the next screen
        });
      // } else {
      //   Alert.alert('Error', 'You can only edit your own entries.');
      // }
    };

  const handleDelete = async (rowIndex, rowItemEmail) => {
      if (email === rowItemEmail) {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this entry?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Delete Cancelled'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                try {
                  const id = data[rowIndex]._id.trim();
                  const response = await fetch(`${API_URL}/form-entry/${id}`, {
                    method: 'DELETE',
                  });
  
                  if (!response.ok) {
                    throw new Error('Failed to delete entry');
                  }
  
                  const newData = [...data];
                  newData.splice(rowIndex, 1);
                  setData(newData);
                  console.log(`Deleted row ${rowIndex}`);
                } catch (error) {
                  console.error('Error deleting entry:', error);
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', 'You can only delete your own entries.');
      }
    };
    const filterData = () => {
      // Convert startDate and endDate to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
      };
    
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
    
      return data.filter((item) => {
        const itemDate = item.date; // Assuming item.date is in 'YYYY-MM-DD' format
    
        return (
        
          (!formattedStartDate || itemDate >= formattedStartDate) && // Compare formatted date
          (!formattedEndDate || itemDate <= formattedEndDate) // Compare formatted date
        );
      });
    };
    

  const placeholderImage = undefined;

  
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 30) {
          // For Android 11+ (Scoped Storage) - No permission required for Downloads folder
          return true;
        } else {
          // For Android 10 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true; // iOS does not require explicit storage permission
    };
    
   const downloadCSV = async () => {
       const hasPermission = await requestStoragePermission();
     
       if (!hasPermission) {
         Alert.alert('Permission Denied', 'Storage permission is required to download the CSV file.');
         return;
       }
     
       const filteredData = filterData(); 
     
       if (filteredData.length === 0) {
         Alert.alert('No Data Found', 'No data available for download.');
         return;
       }
     
       const filteredColumns = columns.filter(col => col.key !== 'imageUri');
     
       const headers = filteredColumns.map(col => col.displayName).join(',') + '\n';
     
       const csvRows = filteredData.map(item => {
         const birdObservations = item.birdObservations || [];
         return birdObservations.map(bird =>
           filteredColumns.map(col => {
             let value = bird[col.key] || item[col.key] || 'N/A';
     
             // Clean 'remarks' column by removing image URIs or patterns like 'Image URI: ...'
             if (col.key === 'remarks') {
               value = typeof value === 'string' 
                 ? value.replace(/Image URI: [^\s]+/g, '').trim() // Remove 'Image URI: ...'
                 : value;
             }
     
             return `"${formatValue(value)}"`; 
           }).join(',')
         ).join('\n');
       }).join('\n');
     
       const csvContent = headers + csvRows;
     
       const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
       const path = `${RNFS.ExternalStorageDirectoryPath}/Download/BirdObservations_${timestamp}.csv`;
     
       try {
         await RNFS.writeFile(path, csvContent, 'utf8');
         Alert.alert('Success', `CSV file saved at: ${path}`);
       } catch (error) {
         console.error('Error saving CSV file:', error);
         Alert.alert('Error', 'Failed to save CSV file.');
       }
     };
     
     
    const extractImageUri = (remarks) => {
      const match = remarks.match(/Image URI:\s*(\S+)/);
      return match ? match[1] : null;
    };
    

const columns = [
    { key: 'habitatType', displayName: 'Habitat Type' },
    { key: 'point', displayName: 'Point' },
    { key: 'pointTag', displayName: 'Point Tag' },
    { key: 'latitude', displayName: 'Latitude' },
    { key: 'descriptor', displayName: 'Descriptor' },
    { key: 'longitude', displayName: 'Longitude' },
    { key: 'date', displayName: 'Date' },
    { key: 'startTime', displayName: 'Start Time' },
    { key: 'endTime', displayName: 'End Time' },
    { key: 'observers', displayName: 'Observers' },
    { key: 'weather', displayName: 'Weather Condition' },
    { key: 'radiusOfArea', displayName: 'Radius of Area' },
    { key: 'water', displayName: 'Presence of Water' },
    { key: 'season', displayName: 'Season of Paddy Field' },
    { key: 'statusOfVegy', displayName: 'Status of Vegetation' },
    // { key: 'remarks', displayName: 'Remark' },
   
    { key: 'species', displayName: 'Observed Species' },
    { key: 'count', displayName: 'Count' },
    { key: 'maturity', displayName: 'Maturity' },
    { key: 'sex', displayName: 'Sex' },
    { key: 'behaviour', displayName: 'Behavior' },
    { key: 'identification', displayName: 'Identification' },
    { key: 'status', displayName: 'Status' },
    {
      key: 'imageUri',
      displayName: 'Image Thumbnail',
      render: (value, rowData) => {
          const birdObservationImage = rowData.birdObservations?.[0]?.imageUri;
          const isLocalImage = birdObservationImage && birdObservationImage.startsWith('file://');
          return (
              <Image
                  source={{
                      uri: isLocalImage 
                          ? birdObservationImage 
                          : birdObservationImage || value || undefined,
                  }}
                  style={styles.thumbnail}
              />
          );
      },
  },
  
  {
      key: 'remarks',
      displayName: 'Remark',
      render: (value, rowData) => {
          const birdObservationRemarks = rowData.birdObservations?.[0]?.remarks || '';
          const imageUri = extractImageUri(birdObservationRemarks);
          const textContent = birdObservationRemarks.replace(/Image URI:\s*(\S+)/, '').trim();  // Extract remaining text
  
          return (
              <View>
                  {imageUri && (
                      <Image
                          source={{ uri: imageUri }}
                          style={styles.thumbnail}
                      />
                  )}
                  {textContent && (
                      <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>
                          {textContent}
                      </Text>
                  )}
              </View>
          );
      },
  }
  
    
  ];

  const columnWidth = 150;

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
     <TouchableOpacity onPress={downloadCSV} style={styles.downloadButton}>
      <Text style={styles.buttonText}>Download CSV</Text>
    </TouchableOpacity>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.headerRow, isDarkTheme ? styles.darkHeaderRow : styles.lightHeaderRow]}>
            {columns.map((col, index) => (
              <View key={index} style={[styles.headerCell, { width: columnWidth }]}>
                <Text style={[styles.headerText, isDarkTheme ? styles.darkText : styles.lightText]}>{col.displayName}</Text>
              </View>
            ))}
            <View style={[styles.headerCell, { width: columnWidth }]}>
              <Text style={[styles.headerText, isDarkTheme ? styles.darkText : styles.lightText]}>Actions</Text>
            </View>
          </View>
            {filterData().map((item, rowIndex) => {
              const birdObservations = item.birdObservations || [];
              return (
                  <React.Fragment key={rowIndex}>
                      {birdObservations.map((bird, birdIndex) => (
                          <View 
                              key={birdIndex} 
                              style={[styles.row, isDarkTheme ? styles.darkRow : styles.lightRow]}
                          >
                              {columns.map((col, colIndex) => (
                                  <View 
                                      key={colIndex} 
                                      style={[styles.cell, { width: columnWidth }]}
                                  >
                                    {col.key === 'species' ? (
                        // Regex to match text inside brackets and apply italic style
                        <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>
                          {bird[col.key] && bird[col.key].split('(').map((part, partIndex) => (
                            partIndex === 1 ? (
                              <>
                                {/* Display opening bracket before italicized content */}
                                <Text key={partIndex - 1}>(</Text>
                                <Text style={{ fontStyle: 'italic' }}>
                                  {part.split(')')[0]}
                                </Text>
                                {/* Display closing bracket after italicized content */}
                                <Text key={partIndex + 1}>
                                  {')'}
                                </Text>
                              </>
                            ) : (
                              part
                            )
                          ))}
                        </Text>
                      ):
                                      (col.key === 'imageUri') ? (
                                          bird.imageUri ? (
                                              <Image 
                                                  source={{ uri: bird.imageUri }}
                                                  style={{ width: 100, height: 100, borderRadius: 8 }}
                                                  resizeMode="cover"
                                              />
                                          ) : (
                                              <Text style={styles.noImageText}>No Image</Text>
                                          )
                                      ) : col.key === 'remarks' ? (
                                          col.render(bird[col.key] || item[col.key], item)
                                      ) : (
                                          <Text 
                                              style={[
                                                  styles.cellText, 
                                                  isDarkTheme ? styles.darkText : styles.lightText
                                              ]}
                                          >
                                              {formatValue(bird[col.key] || item[col.key])}
                                          </Text>
                                      )}
                                  </View>
                              ))}
                              <View 
                                  style={[
                                      styles.cell, 
                                      { width: columnWidth, flexDirection: 'row', justifyContent: 'space-around' }
                                  ]}
                              >
                                  <TouchableOpacity onPress={() => handleEdit(item)}>
                                      <Icon name="edit" size={24} color="blue" />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => handleDelete(rowIndex, item.email)}>
                                      <Icon name="delete" size={24} color="red" />
                                  </TouchableOpacity>
                              </View>
                          </View>
                      ))}
                  </React.Fragment>
              );
          })}
          
          
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
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MypureTable;
