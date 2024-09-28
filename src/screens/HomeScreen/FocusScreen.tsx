
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface FocusScreenProps {}

const FocusScreen = (props: FocusScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus</Text>
      <Text style={styles.subtitle}>Meditation Playlist</Text>
      <View style={styles.playerContainer}>
        <Text style={styles.player}>02:00</Text>
        <Text style={styles.player}>...</Text>
        <Text style={styles.player}>◄ ▮ ►</Text>
        <Text style={styles.player}>🔍</Text>
        <Text style={styles.player}>05:10</Text>
      </View>
    </View>
  );
};

export default FocusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8f3f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
  },
  playerContainer: {
    width: '90%',
    height: 200,
    backgroundColor: '#6ec6ca',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  player: {
    fontSize: 20,
    marginBottom: 10,
  },
});
