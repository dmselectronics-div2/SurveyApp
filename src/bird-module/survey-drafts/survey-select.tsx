import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const Notepad = () => {
  const [content, setContent] = useState([]);
  const [text, setText] = useState('');

  // Open Camera
  const openCamera1 = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        setContent([...content, { type: 'image', uri: response.assets[0].uri }]);
      }
    });
  };

  // Open Gallery
  const openGallery1 = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        setContent([...content, { type: 'image', uri: response.assets[0].uri }]);
      }
    });
  };

  // Add Text
  const addText = () => {
    if (text.trim()) {
      setContent([...content, { type: 'text', text }]);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {content.map((item, index) => (
          item.type === 'text' ? (
            <TextInput
              key={index}
              style={styles.textContent}
              value={item.text}
              editable={false}
              multiline
            />
          ) : (
            <Image key={index} source={{ uri: item.uri }} style={styles.imagePreview} />
          )
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write your note..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity onPress={addText} style={styles.iconButton}>
          <Icon name="check" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openCamera1} style={styles.iconButton}>
          <Icon name="camera" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openGallery1} style={styles.iconButton}>
          <Icon name="image" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Notepad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 10,
  },
  textContent: {
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});