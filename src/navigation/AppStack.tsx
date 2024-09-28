import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { STANDARD_NAVIGATION_OPTIONS } from '../utils/NavigationOptions';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import GratitudeScreen from '../screens/HomeScreen/GratitudeScreen';
import FocusScreen from '../screens/HomeScreen/FocusScreen'; 
import MeditateScreen from '../screens/HomeScreen/MeditateScreen';
import SleepScreen from '../screens/HomeScreen/SleepScreen';

const { Navigator, Screen } = createNativeStackNavigator();

const AppStack: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <Navigator>
        {/* Home Screen */}
        <Screen
          options={STANDARD_NAVIGATION_OPTIONS}
          name="Home"
          component={HomeScreen}
        />

        {/* Other Screens */}
        <Screen
          options={STANDARD_NAVIGATION_OPTIONS}
          name="GratitudeScreen"
          component={GratitudeScreen}
        />
        <Screen
          options={STANDARD_NAVIGATION_OPTIONS}
          name="FocusScreen"
          component={FocusScreen}
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
    </>
  );
};

export default AppStack;
