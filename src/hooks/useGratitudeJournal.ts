import { useState } from 'react';
import { db, storage } from '@/app/Config/firebase'; // Import Firebase Firestore and Storage
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage methods

interface JournalData {
  appreciate: string[];
  lettingGo: string[];
  imageUrl?: string; // Add an optional imageUrl property
}

const useGratitudeJournal = () => {
  const [journalData, setJournalData] = useState<JournalData>({
    appreciate: ['', ''],
    lettingGo: ['', ''],
  });
  const [loading, setLoading] = useState(false);

  // Function to fetch journal data for a specific date
  const fetchJournalData = async (userId: string, date: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, `gratitudejournal/${userId}/entries/${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setJournalData(docSnap.data() as JournalData);
      } else {
        console.log('No data found for the specified date.');
      }
    } catch (error) {
      console.error('Error fetching journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (userId: string, date: string, imageUri: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob(); // Convert image into blob format
      const storageRef = ref(storage, `gratitudejournal/${userId}/images/${date}.jpg`); // Storage path
      await uploadBytes(storageRef, blob); // Upload image
      const imageUrl = await getDownloadURL(storageRef); // Get public URL of the image
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Function to save journal data
  const saveJournalData = async (
    userId: string,
    date: string,
    appreciate: string[],
    lettingGo: string[],
    imageUri?: string
  ) => {
    setLoading(true);
    try {
      let imageUrl = '';

      if (imageUri) {
        imageUrl = await uploadImage(userId, date, imageUri) || ''; // Upload image and get the URL
      }

      const docRef = doc(db, `gratitudejournal/${userId}/entries/${date}`);
      await setDoc(docRef, { appreciate, lettingGo, imageUrl }); // Save data with the image URL

      console.log('Journal data saved successfully.');
    } catch (error) {
      console.error('Error saving journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    journalData,
    setJournalData,
    fetchJournalData,
    saveJournalData,
    loading,
  };
};

export default useGratitudeJournal;
