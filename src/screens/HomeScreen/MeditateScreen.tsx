import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/src/navigation/AppStack'; // Import AppStack types
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library
import useMeditationJournal from '@/src/hooks/useMeditationJournal';
import { auth, storage } from '@/app/Config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Define the navigation type for this screen
type MeditateScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'MeditateScreen'
>;

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MeditateScreen = () => {
  const navigation = useNavigation<MeditateScreenNavigationProp>(); // Set typed navigation
  const user = auth.currentUser;
  const userId = user ? user.uid : '';
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
  const { meditationData, setMeditationData, fetchMeditationData, saveMeditationData, loading } = useMeditationJournal();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userId) {
      fetchMeditationData(userId, currentDate);
    }
  }, [userId, currentDate]);

  const handleInputChange = (text: string) => {
    setMeditationData(prev => ({
      ...prev,
      reflection: [text],
    }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage(pickerResult.assets[0].uri);
      }
    } else {
      Alert.alert('Permission required', 'You need to grant permission to access the media library.');
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'No user logged in. Please log in first.');
      return;
    }

    let imageUrl: string | undefined = undefined;

    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `meditationjournal/${userId}/${currentDate}/image`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    await saveMeditationData(userId, currentDate, meditationData.reflection, imageUrl);
    Alert.alert('Success', 'Your meditation journal has been saved!');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Today's Reflection</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            placeholder="Write here..."
            value={meditationData.reflection[0]}
            multiline={true}
            numberOfLines={10}
            onChangeText={handleInputChange}
          />
        </View>

        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

        <Button title="Submit" onPress={handleSubmit} disabled={loading} />

        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('MeditationHistoryScreen')}>
          <Icon name="history" size={24} color="white" />
          <Text style={styles.historyText}>View History</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MeditateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6d2',
    padding: 20,
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    position: 'absolute',
    top: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '90%',
    backgroundColor: '#ffcc80',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  largeInput: {
    height: 250,
  },
  imageButton: {
    backgroundColor: '#ffcc80',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcc80',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  historyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
});
