import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/src/navigation/AppStack'; // Import the AppStack types
import { db } from '@/app/Config/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '@/app/Config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome'; // For the delete icon

// Define the navigation type for this screen
type MeditationHistoryScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'MeditationHistoryScreen'
>;

const MeditationHistoryScreen = () => {
  const navigation = useNavigation<MeditationHistoryScreenNavigationProp>(); // Set typed navigation
  const [entries, setEntries] = React.useState<string[]>([]);
  const userId = auth.currentUser?.uid || '';

  React.useEffect(() => {
    if (userId) {
      fetchMeditationEntries(userId);
    }
  }, [userId]);

  const fetchMeditationEntries = async (userId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, `meditationjournal/${userId}/entries`));
      const dates = querySnapshot.docs.map((doc) => doc.id);
      setEntries(dates);
    } catch (error) {
      console.error('Error fetching meditation entries:', error);
    }
  };

  const handleDelete = async (date: string) => {
    // Show confirmation dialog before deletion
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete the entry for ${date}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Delete the entry from Firestore
              const docRef = doc(db, `meditationjournal/${userId}/entries`, date);
              await deleteDoc(docRef);

              // Remove the entry from the local state
              setEntries((prevEntries) => prevEntries.filter((entry) => entry !== date));

              Alert.alert('Deleted', `Entry for ${date} has been deleted.`);
            } catch (error) {
              console.error('Error deleting meditation entry:', error);
              Alert.alert('Error', 'An error occurred while trying to delete the entry.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.entryItem}>
      <TouchableOpacity
        style={styles.entryContent}
        onPress={() => navigation.navigate('MeditationDetailScreen', { date: item })}
      >
        <Text style={styles.entryText}>{item}</Text>
      </TouchableOpacity>
      {/* Delete button */}
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation History</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MeditationHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d8f3f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  entryItem: {
    flexDirection: 'row', // Add row direction to display delete button and entry side by side
    alignItems: 'center',
    backgroundColor: '#6ec6ca',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between', // Space out the content and the delete button
  },
  entryContent: {
    flex: 1,
  },
  entryText: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 15,
  },
});
