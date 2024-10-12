import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/src/navigation/AppStack';
import * as ImagePicker from 'expo-image-picker';
import useGratitudeJournal from '@/src/hooks/useGratitudeJournal';
import { auth } from '@/app/Config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';



// Define the navigation type for this screen
type GratitudeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'GratitudeScreen'
>;
  
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero
  return `${year}-${month}-${day}`; // Return date in YYYY-MM-DD format
};

const GratitudeScreen = () => {
  const navigation = useNavigation<GratitudeScreenNavigationProp>();
  const user = auth.currentUser; // Get current user
  const userId = user ? user.uid : ''; // Use userId for Firestore path
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
  const { journalData, setJournalData, fetchJournalData, saveJournalData, loading } = useGratitudeJournal();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null); // Store the selected image URI

  React.useEffect(() => {
    if (userId) {
      fetchJournalData(userId, currentDate); // Fetch journal data if user is logged in
    }
  }, [userId, currentDate]);

  const handleInputChange = (field: 'appreciate' | 'lettingGo', index: number, text: string) => {
    setJournalData(prev => ({
      ...prev,
      [field]: prev[field].map((item, idx) => (idx === index ? text : item)),
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'No user logged in. Please log in first.');
      return;
    }
    await saveJournalData(userId, currentDate, journalData.appreciate, journalData.lettingGo, selectedImage || undefined);
    Alert.alert('Success', 'Your gratitude journal has been saved!');
  };

  // Handle image picking
  const handlePickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      // Check if the pickerResult is not canceled and has assets
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage(pickerResult.assets[0].uri); // Set the selected image URI from the first asset
      }
    } else {
      Alert.alert('Permission required', 'You need to grant permission to access the media library.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Today I Appreciate</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={journalData.appreciate[0]}
          onChangeText={text => handleInputChange('appreciate', 0, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={journalData.appreciate[1]}
          onChangeText={text => handleInputChange('appreciate', 1, text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Today I am Letting Go</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={journalData.lettingGo[0]}
          onChangeText={text => handleInputChange('lettingGo', 0, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={journalData.lettingGo[1]}
          onChangeText={text => handleInputChange('lettingGo', 1, text)}
        />
      </View>

      {/* Button to pick an image */}
      <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      {/* Show selected image */}
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

      <Button title="Submit" onPress={handleSubmit} disabled={loading} />

      {/* History button with icon */}
      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('JournalHistoryScreen')}>
        <Icon name="history" size={24} color="white" />
        <Text style={styles.historyText}>View History</Text>
      </TouchableOpacity>
    </View>
     </TouchableWithoutFeedback>
  );
};

export default GratitudeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8f3f8',
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
    backgroundColor: '#6ec6ca',
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
  },
  imageButton: {
    backgroundColor: '#6ec6ca',
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
    backgroundColor: '#6ec6ca',
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
