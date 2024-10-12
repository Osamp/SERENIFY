import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '@/app/Config/firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/app/Config/firebase';

const JournalDetailScreen = () => {
  const route = useRoute();
  const { date } = route.params as { date: string };
  const [journalData, setJournalData] = React.useState<any>(null);
  const userId = auth.currentUser?.uid || '';

  React.useEffect(() => {
    if (userId && date) {
      fetchJournalDetails(userId, date);
    }
  }, [userId, date]);

  const fetchJournalDetails = async (userId: string, date: string) => {
    try {
      const docRef = doc(db, `gratitudejournal/${userId}/entries/${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setJournalData(docSnap.data());
      } else {
        console.log('No journal entry found.');
      }
    } catch (error) {
      console.error('Error fetching journal details:', error);
    }
  };

  if (!journalData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Entry for {date}</Text>
      <Text style={styles.subTitle}>Today I Appreciate:</Text>
      {journalData.appreciate.map((item: string, index: number) => (
        <Text key={index} style={styles.text}>{item}</Text>
      ))}
      <Text style={styles.subTitle}>Today I am Letting Go:</Text>
      {journalData.lettingGo.map((item: string, index: number) => (
        <Text key={index} style={styles.text}>{item}</Text>
      ))}
      {journalData.imageUrl && <Image source={{ uri: journalData.imageUrl }} style={styles.image} />}
    </View>
  );
};

export default JournalDetailScreen;

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
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});
