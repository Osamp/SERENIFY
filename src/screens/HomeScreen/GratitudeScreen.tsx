import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import useGratitudeJournal from '@/src/hooks/useGratitudeJournal';
import { auth } from '@/app/Config/firebase'; // Import Firebase auth configuration

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface GratitudeScreenProps {}

const GratitudeScreen = (props: GratitudeScreenProps) => {
  const user = auth.currentUser; // Get current user
  const userId = user ? user.uid : ''; // Use userId for Firestore path
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
  const { journalData, setJournalData, fetchJournalData, saveJournalData, loading } = useGratitudeJournal();

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
    await saveJournalData(userId, currentDate, journalData.appreciate, journalData.lettingGo);
    Alert.alert('Success', 'Your gratitude journal has been saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Happy</Text>
      <Text style={styles.title}>Gratitude Journal</Text>

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

      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
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
});
