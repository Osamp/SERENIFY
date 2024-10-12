import { useState } from 'react';
import { db } from '@/app/Config/firebase'; // Correctly import `db`
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface MeditationData {
  reflection: string[]; // This will contain the text input from the textarea
  imageUrl?: string; // Optional image URL field
}

const useMeditationJournal = () => {
  const [meditationData, setMeditationData] = useState<MeditationData>({
    reflection: [''], // Single reflection input
  });
  const [loading, setLoading] = useState(false);

  // Function to fetch meditation journal data for a specific date
  const fetchMeditationData = async (userId: string, date: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, `meditationjournal/${userId}/entries/${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMeditationData(docSnap.data() as MeditationData);
      } else {
        console.log('No data found for the specified date.');
      }
    } catch (error) {
      console.error('Error fetching meditation journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save meditation journal data, including the image URL
  const saveMeditationData = async (userId: string, date: string, reflection: string[], imageUrl?: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, `meditationjournal/${userId}/entries/${date}`);
      await setDoc(docRef, { reflection, imageUrl }); // Save the reflection and image URL
      console.log('Meditation journal data saved successfully.');
    } catch (error) {
      console.error('Error saving meditation journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    meditationData,
    setMeditationData,
    fetchMeditationData,
    saveMeditationData,
    loading,
  };
};

export default useMeditationJournal;
