import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import GratitudeScreen from '../screens/HomeScreen/GratitudeScreen';
import FocusScreen from '../screens/HomeScreen/FocusScreen';
import MeditateScreen from '../screens/HomeScreen/MeditateScreen';
import SleepScreen from '../screens/HomeScreen/SleepScreen';
import JournalHistoryScreen from '../screens/HomeScreen/JournalHistoryScreen';
import JournalDetailScreen from '../screens/HomeScreen/JournalDetailScreen';
import MeditationHistoryScreen from '../screens/HomeScreen/MeditationHistoryScreen'; // Import Meditation history screen
import MeditationDetailScreen from '../screens/HomeScreen/MeditationDetailScreen'; // Import Meditation detail screen

// Define the types for the navigation parameters
export type AppStackParamList = {
  Home: undefined;
  GratitudeScreen: undefined;
  FocusScreen: undefined;
  MeditateScreen: undefined;
  SleepScreen: undefined;
  JournalHistoryScreen: undefined;
  JournalDetailScreen: { date: string }; // Expecting 'date' as parameter in JournalDetailScreen
  MeditationHistoryScreen: undefined; // Define for Meditation History Screen
  MeditationDetailScreen: { date: string }; // Expecting 'date' as parameter in MeditationDetailScreen
};

// Create the Stack Navigator with the defined parameter types
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack.Navigator>
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title:
             'Home', 
             headerShown: false, 
            }} // Set title for the Home screen
          
        />

        {/* Gratitude Screen */}
        <Stack.Screen
          name="GratitudeScreen"
          component={GratitudeScreen}
          options={{ title:
             'Gratitude Journal' }}
        />

        {/* Focus Screen */}
        <Stack.Screen
          name="FocusScreen"
          component={FocusScreen}
          options={{ title: 'Focus' }}
        />

        {/* Meditate Screen */}
        <Stack.Screen
          name="MeditateScreen"
          component={MeditateScreen}
          options={{ title: 'Meditation' }}
        />

        {/* Sleep Screen */}
        <Stack.Screen
          name="SleepScreen"
          component={SleepScreen}
          options={{ title: 'Sleep' }}
        />

        {/* Journal History Screen */}
        <Stack.Screen
          name="JournalHistoryScreen"
          component={JournalHistoryScreen}
          options={{ title: 'Journal History' }}
        />

        {/* Journal Detail Screen */}
        <Stack.Screen
          name="JournalDetailScreen"
          component={JournalDetailScreen}
          options={{ title: 'Journal Details' }}
        />

        {/* Meditation History Screen */}
        <Stack.Screen
          name="MeditationHistoryScreen"
          component={MeditationHistoryScreen}
          options={{ title: 'Meditation History' }}
        />

        {/* Meditation Detail Screen */}
        <Stack.Screen
          name="MeditationDetailScreen"
          component={MeditationDetailScreen}
          options={{ title: 'Meditation Details' }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStack;
