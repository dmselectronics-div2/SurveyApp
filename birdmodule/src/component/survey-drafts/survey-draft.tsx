// // === FRONTEND (React Native) ===

// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const App = () => {
//   const [cloudOptions, setCloudOptions] = useState([
//     { label: '0-33%', value: '0-33%' },
//     { label: '33%-66%', value: '33%-66%' },
//     { label: '66%-100%', value: '66%-100%' },
//     { label: 'Other', value: 'Other' },
//   ]);
//   const [cloudCover, setCloudCover] = useState(null);
//   const [showInput, setShowInput] = useState(false);
//   const [customCloudCover, setCustomCloudCover] = useState('');

//   const updateWeatherSummary = (cloud, rain, wind, sunshine) => {
//     console.log('Updating weather summary:', cloud);
//   };

//   useEffect(() => {
//     fetch('http://localhost:5000/api/cloudcover')
//       .then(res => res.json())
//       .then(data => {
//         const formatted = data.map(item => ({ label: item.label, value: item.value }));
//         setCloudOptions([...formatted, { label: 'Other', value: 'Other' }]);
//       })
//       .catch(err => console.error('Fetch failed', err));
//   }, []);

//   const handleAddCustomValue = async () => {
//     const newValue = customCloudCover.trim();
//     if (!newValue) return;

//     try {
//       const res = await fetch('http://localhost:5000/api/cloudcover', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ label: newValue, value: newValue })
//       });

//       if (!res.ok) throw new Error('Could not add');

//       const filtered = cloudOptions.filter(item => item.value !== 'Other');
//       const newOption = { label: newValue, value: newValue };
//       setCloudOptions([...filtered, newOption, { label: 'Other', value: 'Other' }]);
//       setCloudCover(newValue);
//       setCustomCloudCover('');
//       setShowInput(false);
//       updateWeatherSummary(newValue);
//     } catch (e) {
//       console.warn(e.message);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Dropdown
//         style={styles.dropdown}
//         data={cloudOptions}
//         labelField="label"
//         valueField="value"
//         placeholder="Cloud Cover"
//         value={cloudCover}
//         onChange={item => {
//           if (item.value === 'Other') {
//             setShowInput(true);
//           } else {
//             setCloudCover(item.value);
//             setShowInput(false);
//             updateWeatherSummary(item.value);
//           }
//         }}
//       />

//       {showInput && (
//         <View style={{ marginTop: 10 }}>
//           <TextInput
//             placeholder="Enter custom cloud cover"
//             value={customCloudCover}
//             onChangeText={setCustomCloudCover}
//             style={styles.input}
//           />
//           <Button title="Add" onPress={handleAddCustomValue} />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   dropdown: {
//     backgroundColor: 'white',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10
//   }
// });

// export default App;

// // === BACKEND (Node.js + Express + MongoDB) ===

// // server.js
