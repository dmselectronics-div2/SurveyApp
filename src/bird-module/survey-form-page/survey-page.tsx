import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomDropdown from '../reusable-components/dropdown';
import { API_URL } from '../../config';


const defaultHabitatTypes = [
  {label: 'Tanks', value: 'Tanks'},
  {label: 'Dutch Canal', value: 'Dutch Canal'},
  {label: 'Beach', value: 'Beach'},
  {label: 'Paddy Field', value: 'Paddy Field'},
  {label: 'Woody Pathway', value: 'Woody Pathway'},
  {label: 'Grassland', value: 'Grassland'},
  {label: 'Monocrop-Coconut', value: 'Monocrop-Coconut'},
  {label: 'Home Garden', value: 'Home Garden'},
  {label: 'Natural Mangroves', value: 'Natural Mangroves'},
  {label: 'ANRM site', value: 'ANRM site'},
];

const HabitatScreen = () => {
  const [habitat, setHabitat] = useState('');
  const [error, setError] = useState(null);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Habitat Type</Text>

      <CustomDropdown
        tableName="habitat_types"
        apiEndpoint={`${API_URL}/habitats`}
        placeholder="Select Habitat Type"
        value={habitat}
        setValue={setHabitat}
        updateSummary={() => console.log('Selected:', habitat)}
        isDarkMode={false}
        error={error}
        defaultData={defaultHabitatTypes}
      />
    </View>
  );
};

export default HabitatScreen;
