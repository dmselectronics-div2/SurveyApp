import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomDropdown from '../reusable-components/dropdown';


const HabitatScreen = () => {
  const [habitat, setHabitat] = useState('');
  const [error, setError] = useState(null);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Habitat Type</Text>

      <CustomDropdown
        tableName="habitat_types"
        apiEndpoint="http://82.180.155.215:5001/habitats"
        placeholder="Select Habitat Type"
        value={habitat}
        setValue={setHabitat}
        updateSummary={() => console.log('Selected:', habitat)}
        isDarkMode={false}
        error={error}
      />
    </View>
  );
};

export default HabitatScreen;
