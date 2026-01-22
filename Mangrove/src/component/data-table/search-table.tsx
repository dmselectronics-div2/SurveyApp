// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { API_URL } from '../../config';
// import SQLite from 'react-native-sqlite-storage';

// const formatValue = (value) => {
//   if (value instanceof Date) {
//     return new Date(value).toLocaleDateString();
//   }
//   return value !== undefined ? value : 'N/A';
// };

// const MypureTable = ({ startDate, endDate, handleEdit, rowData }) => {
//   const [data, setData] = useState([]);
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');

//   const db = SQLite.openDatabase(
//     {name: 'user_db.db', location: 'default'},
//     () => {
//       console.log('Database opened successfully');
//     },
//     error => {
//       console.error('Error opening database: ', error);
//     },
//   );


//   const showData = () => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM Users',
//         [],
//         (tx, results) => {
//           if (results.rows.length > 0) {
//             console.log('Results:', results.rows._array); // This should give you an array of the rows
//           } else {
//             console.log('No data found.');
//           }
//         },
//         error => {
//           console.log('Error retrieving data: ', error);
//         },
//       );
//     });
//   };

//   const retriveEmailFromSQLite = () => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT email FROM LoginData LIMIT 1',
//         [],
//         (tx, results) => {
//           if (results.rows.length > 0) {
//             const email = results.rows.item(0).email;
//             setEmail(email);
//             console.log('Retrieved email edit permission : ', email);
//             return {email};
//           } else {
//             console.log('No email and password stored.');
//             return null;
//           }
//         },
//         error => {
//           console.log('Error querying Users table: ' + error.message);
//         },
//       );
//     });
//   };

//   useEffect(() => {
//     showData();
//     retriveEmailFromSQLite();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${API_URL}/form-entries`);
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error('Error fetching data', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async (rowIndex, rowItemEmail) => {
//     console.log('row data email in New ', rowItemEmail, ' ', email);
//     if(email===rowItemEmail){
//       Alert.alert(
//         'Confirm Delete',
//         'Are you sure you want to delete this entry?',
//         [
//           {
//             text: 'Cancel',
//             onPress: () => console.log('Delete Cancelled'),
//             style: 'cancel',
//           },
//           {
//             text: 'OK',
//             onPress: async () => {
//               try {
//                 const id = data[rowIndex]._id.trim();
//                 const response = await fetch(`${API_URL}/form-entry/${id}`, {
//                   method: 'DELETE',
//                 });
  
//                 if (!response.ok) {
//                   throw new Error('Failed to delete entry');
//                 }
  
//                 const newData = [...data];
//                 newData.splice(rowIndex, 1);
//                 setData(newData);
//                 console.log(`Deleted row ${rowIndex}`);
//               } catch (error) {
//                 console.error('Error deleting entry:', error);
//               }
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//     }else {
//       Alert.alert('Error', `You can't Delete this form`);
//     }
    
//   };

//   const filterData = () => {
//     return data.filter(item => {
//       const itemDate = new Date(item.date).toLocaleDateString();
//       return (
//         (!startDate || new Date(item.date).toLocaleDateString() >= new Date(startDate).toLocaleDateString()) &&
//         (!endDate || new Date(item.date).toLocaleDateString() <= new Date(endDate).toLocaleDateString())
//       );
//     });
//   };

//   const placeholderImage = 'https://example.com/placeholder.png';

//   const columns = [
//     { key: 'habitatType', displayName: 'Habitat Type' },
//     { key: 'point', displayName: 'Point' },
//     { key: 'pointTag', displayName: 'Point Tag' },
//     { key: 'latitude', displayName: 'Latitude' },
//     { key: 'longitude', displayName: 'Longitude' },
//     { key: 'date', displayName: 'Date' },
//     { key: 'startTime', displayName: 'Start Time' },
//     { key: 'endTime', displayName: 'End Time' },
//     { key: 'observers', displayName: 'Observers' },
//     { key: 'Weather', displayName: 'Weather Condition' },
//     { key: 'radiusOfArea', displayName: 'Radius of Area' },
//     // { key: 'water', displayName: 'Presence of Water' },
//     { key: 'season', displayName: 'Season of Paddy Field' },
//     { key: 'statusOfVegy', displayName: 'Status of Vegetation' },
//     { key: 'remark', displayName: 'Remark' },
//     { key: 'species', displayName: 'Observed Species' },
//     { key: 'count', displayName: 'Count' },
//     { key: 'maturity', displayName: 'Maturity' },
//     { key: 'sex', displayName: 'Sex' },
//     { key: 'behaviour', displayName: 'Behavior' },
//     { key: 'identification', displayName: 'Identification' },
//     { key: 'status', displayName: 'Status' },
//     { 
//       key: 'imageUri', 
//       displayName: 'Image Thumbnail', 
//       render: (value) => (
//         <Image
//           source={{ uri: value || placeholderImage }}
//           style={styles.thumbnail}
//         />
//       )
//     },
//     // { key: 'cloudIntensity', displayName: 'Cloud Intensity' },
//     // { key: 'rainIntensity', displayName: 'Rain Intensity' },
//     // { key: 'windIntensity', displayName: 'Wind Intensity' },
//     // { key: 'sunshineIntensity', displayName: 'Sunshine Intensity' },
//     { key: 'waterAvailability', displayName: 'Water Availability' },
//     // { key: 'waterLevelWaterResources', displayName: 'Water Level (Water Resources)' },
//     // { key: 'waterAvailabilityWaterResources', displayName: 'Water Availability (Water Resources)' },
//     // { key: 'selectedValues', displayName: 'Selected Values' },
//     // { key: 'selectedBehaviours', displayName: 'Selected Behaviours' },
//     // { key: 'waterLevel', displayName: 'Water Level' },
//     // { key: 'selectedWaterConditions', displayName: 'Selected Water Conditions' },
//     // { key: 'waterAvailabilityOnLand', displayName: 'Water Availability (On Land)' },
//     // { key: 'waterAvailabilityOnResources', displayName: 'Water Availability (Resources)' },
//     { key: 'waterLevelOnLand', displayName: 'Water Level (On Land)' },
//     { key: 'waterLevelOnResources', displayName: 'Water Level (On Resources)' },
//     // { key: 'weather', displayName: 'Weather' }
//   ];


//   const columnWidth = 150;

//   return (
//     <View style={styles.container}>
//       <ScrollView horizontal>
//         <View style={styles.table}>
//           <View style={styles.headerRow}>
//             {columns.map((col, index) => (
//               <View key={index} style={[styles.headerCell, { width: columnWidth }]}>
//                 <Text style={styles.headerText}>{col.displayName}</Text>
//               </View>
//             ))}
//             <View style={[styles.headerCell, { width: columnWidth }]}>
//               <Text style={styles.headerText}>Actions</Text>
//             </View>
//           </View>
//           {filterData().map((item, rowIndex) => (
//             <View key={rowIndex} style={styles.row}>
//               {columns.map((col, colIndex) => (
//                 <View key={colIndex} style={[styles.cell, { width: columnWidth }]}>
//                   {col.key === 'imageUri' ? col.render(item[col.key]) : <Text style={styles.cellText}>{formatValue(item[col.key])}</Text>}
//                 </View>
//               ))}
//               <View style={[styles.cell, { width: columnWidth, flexDirection: 'row', justifyContent: 'space-around' }]}>
//                 <TouchableOpacity onPress={() => handleEdit(item)}>
//                   {/* <Icon name="edit" size={24} color="lightblue" /> */}
//                   <Icon name="edit" size={24} color= {item.email===email ? "lightblue" : "grey"} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDelete(rowIndex, item.email)}>
//                   <Icon name="delete" size={24} color={item.email===email ? "salmon" : "grey"} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#1c1c1c',
//   },
//   table: {
//     flexDirection: 'column',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//     borderTopWidth: 1,
//     borderTopColor: '#444',
//     backgroundColor: '#333',
//   },
//   headerCell: {
//     borderRightWidth: 1,
//     borderRightColor: '#444',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 5,
//   },
//   headerText: {
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//   },
//   cell: {
//     borderRightWidth: 1,
//     borderRightColor: '#444',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 5,
//   },
//   cellText: {
//     color: 'white',
//     textAlign: 'center',
//   },
//   thumbnail: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
// });

// export default MypureTable;



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

const MypureTable = ({ startDate, endDate, handleEdit, rowData }) => {
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
        const response = await fetch(`${API_URL}/form-entries`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (rowIndex, rowItemEmail) => {
    console.log('row data email in New ', rowItemEmail, ' ', email);
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
      Alert.alert('Error', `You can't Delete this form`);
    }

  };

  const filterData = () => {
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
    { key: 'habitatType', displayName: 'Habitat Type' },
    { key: 'point', displayName: 'Point' },
    { key: 'pointTag', displayName: 'Point Tag' },
    { key: 'latitude', displayName: 'Latitude' },
    { key: 'longitude', displayName: 'Longitude' },
    { key: 'date', displayName: 'Date' },
    { key: 'startTime', displayName: 'Start Time' },
    { key: 'endTime', displayName: 'End Time' },
    { key: 'observers', displayName: 'Observers' },
    { key: 'Weather', displayName: 'Weather Condition' },
    { key: 'radiusOfArea', displayName: 'Radius of Area' },
    { key: 'season', displayName: 'Season of Paddy Field' },
    { key: 'statusOfVegy', displayName: 'Status of Vegetation' },
    { key: 'remark', displayName: 'Remark' },
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
      render: (value) => (
        <Image
          source={{ uri: value || placeholderImage }}
          style={styles.thumbnail}
        />
      )
    },
    { key: 'waterAvailability', displayName: 'Water Availability' },
    { key: 'waterLevelOnLand', displayName: 'Water Level (On Land)' },
    { key: 'waterLevelOnResources', displayName: 'Water Level (On Resources)' },
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
            <View style={[styles.headerCell, { width: columnWidth }]}>
              <Text style={[styles.headerText, isDarkTheme ? styles.darkText : styles.lightText]}>Actions</Text>
            </View>
          </View>
          {filterData().map((item, rowIndex) => (
            <View key={rowIndex} style={[styles.row, isDarkTheme ? styles.darkRow : styles.lightRow]}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={[styles.cell, { width: columnWidth }]}>
                  {col.key === 'imageUri' ? col.render(item[col.key]) : <Text style={[styles.cellText, isDarkTheme ? styles.darkText : styles.lightText]}>{formatValue(item[col.key])}</Text>}
                </View>
              ))}
              <View style={[styles.cell, { width: columnWidth, flexDirection: 'row', justifyContent: 'space-around' }]}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Icon name="edit" size={24} color={item.email === email ? "lightblue" : "grey"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(rowIndex, item.email)}>
                  <Icon name="delete" size={24} color={item.email === email ? "salmon" : "grey"} />
                </TouchableOpacity>
              </View>
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

export default MypureTable;
