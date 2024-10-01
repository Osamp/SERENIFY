import * as React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { auth } from "@/app/Config/firebase"; // Import Firebase auth configuration
import SerenifyText from '@/src/components/SerenifyText';
import SerenifyButton from '@/src/components/SerenifyButton';
import useAuthentication from '@/src/hooks/useAuthentication';


const backgroundLogo = require('../../../assets/images/logo_light.png');

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { logout } = useAuthentication();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Navigate to Login screen
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert("Logout failed");
    }
  };

  // Get the current user's ID
  const user = auth.currentUser;
  const userId = user ? user.uid : 'No user logged in';
  const fullName = user ? (user.displayName || 'Loading...') : 'No user logged in';
  console.log("Successful login for " + fullName);

  return (
    
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          <Image source={backgroundLogo} style={styles.logo} />
          
          
          
          {/* Display the User ID */}
          <View style={styles.inputWrapper}>
            <SerenifyText heading>Welcome,</SerenifyText>
            <SerenifyText>{fullName}</SerenifyText>
          </View>
          
          <View style={styles.inputWrapper}>
            <SerenifyText heading>How are you feeling today?</SerenifyText>
            
            <View style={styles.buttonContainer}>
              <SerenifyButton
                onPress={() => navigation.navigate('GratitudeScreen')} 
              >
                Happy
              </SerenifyButton>
              <SerenifyButton
                onPress={() => {
                  console.log('Sad button pressed');
                  navigation.navigate('MeditateScreen'); 
                }}
              >
                Sad
              </SerenifyButton>
            </View>
             {/* New Focus Button */}
        <View style={styles.inputWrapper}>
          <SerenifyButton onPress={() => navigation.navigate('FocusScreen')}>
            Focus
          </SerenifyButton>
        </View>
          </View>

          <View style={{ marginTop: 80, alignItems: 'center'}}>
            <SerenifyButton onPress={handleLogout}>Logout</SerenifyButton>
          </View>
        </View>
      </View>
    
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#79ded0',
    padding: 20,
  },
  inputsWrapper: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 50,
    alignSelf: 'flex-start', // Align to the left
    paddingHorizontal: 10, 
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center', 
  },
  inputWrapper: {
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Center the buttons
    marginTop: 15,
    width: '100%', // Adjust to full width
  },
  centerButtonWrapper: {
    flex: 1,
    justifyContent: 'center', // Vertically center the Focus button
    alignItems: 'center',      // Horizontally center the Focus button
    width: '100%',
  },
  
});
