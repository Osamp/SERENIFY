import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/Config/firebase';
import { auth } from '@/app/Config/firebase';

const MeditationDetailScreen = () => {
  const route = useRoute();
  const { date } = route.params as { date: string };
  const [meditationData, setMeditationData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchMeditationEntry = async () => {
      const docRef = doc(db, `meditationjournal/${auth.currentUser?.uid}/entries/${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMeditationData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchMeditationEntry();
  }, [date]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entry for {date}</Text>
      {meditationData ? (
        <>
          <Text style={styles.textLabel}>Reflection:</Text>
          <Text style={styles.textContent}>{meditationData.reflection}</Text>
          {meditationData.imageUrl && (
            <>
              <Text style={styles.textLabel}>Image:</Text>
              <Image source={{ uri: meditationData.imageUrl }} style={styles.image} />
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default MeditationDetailScreen;

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
  textLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  textContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
