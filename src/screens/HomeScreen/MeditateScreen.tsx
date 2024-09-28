
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface MeditateScreenProps {}

const MeditateScreen = (props: MeditateScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.status}>Sad</Text>
      <Text style={styles.title}>Meditate</Text>
      <Text style={styles.subtitle}>Meditation Guide Playlist</Text>
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

export default MeditateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8f3f8',
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
