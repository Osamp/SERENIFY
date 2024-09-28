import { useState } from 'react';
import { db } from '@/app/Config/firebase'; // Correctly import `db`
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface JournalData {
  appreciate: string[];
  lettingGo: string[];
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

  // Function to save journal data
  const saveJournalData = async (userId: string, date: string, appreciate: string[], lettingGo: string[]) => {
    setLoading(true);
    try {
      const docRef = doc(db, `gratitudejournal/${userId}/entries/${date}`);
      await setDoc(docRef, { appreciate, lettingGo });
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
