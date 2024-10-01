
// import * as React from 'react';
// import { Text, View, StyleSheet } from 'react-native';

// interface MeditateScreenProps {}

// const MeditateScreen = (props: MeditateScreenProps) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.status}>Sad</Text>
//       <Text style={styles.title}>Meditate</Text>
//       <Text style={styles.subtitle}>Meditation Guide Playlist</Text>
//       <View style={styles.playerContainer}>
//         <Text style={styles.player}>02:00</Text>
//         <Text style={styles.player}>...</Text>
//         <Text style={styles.player}>◄ ▮ ►</Text>
//         <Text style={styles.player}>🔍</Text>
//         <Text style={styles.player}>05:10</Text>
//       </View>
//     </View>
//   );
// };

// export default MeditateScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#d8f3f8',
//   },
//   status: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     padding: 10,
//     backgroundColor: '#ccc',
//     borderRadius: 10,
//     position: 'absolute',
//     top: 50,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 30,
//   },
//   playerContainer: {
//     width: '90%',
//     height: 200,
//     backgroundColor: '#6ec6ca',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   player: {
//     fontSize: 20,
//     marginBottom: 10,
//   },
// });


import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import useMeditationJournal from '@/src/hooks/useMeditationJournal';
import { auth } from '@/app/Config/firebase'; // Import Firebase auth configuration

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface MeditateScreenProps {}

const MeditateScreen = (props: MeditateScreenProps) => {
  const user = auth.currentUser; // Get current user
  const userId = user ? user.uid : ''; // Use userId for Firestore path
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
  const { meditationData, setMeditationData, fetchMeditationData, saveMeditationData, loading } = useMeditationJournal();

  React.useEffect(() => {
    if (userId) {
      fetchMeditationData(userId, currentDate); // Fetch meditation journal data if user is logged in
    }
  }, [userId, currentDate]);

  const handleInputChange = (field: 'reflection' | 'focus', index: number, text: string) => {
    setMeditationData(prev => ({
      ...prev,
      [field]: prev[field].map((item, idx) => (idx === index ? text : item)),
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'No user logged in. Please log in first.');
      return;
    }
    await saveMeditationData(userId, currentDate, meditationData.reflection, meditationData.focus);
    Alert.alert('Success', 'Your meditation journal has been saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Sad</Text>
      <Text style={styles.title}>Meditation Journal</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Today's Reflection</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={meditationData.reflection[0]}
          onChangeText={text => handleInputChange('reflection', 0, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={meditationData.reflection[1]}
          onChangeText={text => handleInputChange('reflection', 1, text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Today's Focus</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={meditationData.focus[0]}
          onChangeText={text => handleInputChange('focus', 0, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={meditationData.focus[1]}
          onChangeText={text => handleInputChange('focus', 1, text)}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
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
  },
});
