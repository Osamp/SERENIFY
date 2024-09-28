import * as React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { auth } from "@/app/Config/firebase"; // Import Firebase auth configuration
import BackgroundScreenWrapper from '@/src/components/BackgroundScreenWrapper';
import SerenifyText from '@/src/components/SerenifyText';
import SerenifyButton from '@/src/components/SerenifyButton';
import useAuthentication from '@/src/hooks/useAuthentication';

const backgroundImage = require('../../../assets/images/login_bg.jpg');
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
  const fullName = user ? (user.displayName || 'No name available') : 'No user logged in';

  return (
    <BackgroundScreenWrapper image={backgroundImage}>
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          <Image source={backgroundLogo} style={styles.logo} />
          <SerenifyText heading bold>Serenify</SerenifyText>
          <SerenifyText>find a moment of Peace</SerenifyText>
          
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
          </View>

          <View style={{ marginTop: 15 }}>
            <SerenifyButton onPress={handleLogout}>Logout</SerenifyButton>
          </View>
        </View>
      </View>
    </BackgroundScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputsWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  inputWrapper: {
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '60%', // Adjust to fit buttons better
  },
});
