import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { STANDARD_NAVIGATION_OPTIONS } from '../utils/NavigationOptions';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import FocusScreen from '../screens/HomeScreen/FocusScreen';
import GratitudeScreen from '../screens/HomeScreen/GratitudeScreen';
import MeditateScreen from '../screens/HomeScreen/MeditateScreen';
import SleepScreen from '../screens/HomeScreen/SleepScreen';

const { Navigator, Screen } = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Navigator>
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="Signup" 
        component={SignupScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="Login" 
        component={LoginScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="Home" 
        component={HomeScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="FocusScreen" 
        component={FocusScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="GratitudeScreen" 
        component={GratitudeScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="MeditateScreen" 
        component={MeditateScreen} 
      />
      <Screen 
        options={STANDARD_NAVIGATION_OPTIONS} 
        name="SleepScreen" 
        component={SleepScreen} 
      />
    </Navigator>
  );
};

export default AuthStack;
