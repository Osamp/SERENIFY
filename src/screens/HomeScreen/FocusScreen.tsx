import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Easing, Image } from 'react-native';
import { Audio } from 'expo-av';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from "@/app/Config/firebase";
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

const disc = require('../../../assets/images/disc.png'); // Path to your disc image

const FocusScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioFiles, setAudioFiles] = useState<{ name: string, url: string }[]>([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const spinValue = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      const storageRef = ref(storage, "gs://serenify-21975.appspot.com/");
      const result = await listAll(storageRef);
      const audioList = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const name = itemRef.name.replace(/\.[^/.]+$/, ''); // Remove extension from file name
        return { name, url };
      }));
      if (isMounted.current) setAudioFiles(audioList);
    };

    fetchAudioFiles();

    return () => {
      isMounted.current = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (audioUri: string) => {
    setIsLoading(true);
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    setSound(newSound);
    await newSound.setVolumeAsync(volume);
    setIsLoading(false);
    setIsPlaying(true);

    await newSound.playAsync();

    startSpinning(); // Start spinning the disc when playing
  };

  const onPlaybackStatusUpdate = (status: Audio.AudioStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);

      // Stop spinning if paused
      if (!status.isPlaying) {
        stopSpinning();
      }
    }
    if (status.error) {
      console.log(`Error during playback: ${status.error}`);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        stopSpinning();
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        startSpinning(); // Restart spinning when resuming playback
      }
    }
  };

  const handleNext = () => {
    const nextIndex = (currentAudioIndex + 1) % audioFiles.length;
    setCurrentAudioIndex(nextIndex);
    playSound(audioFiles[nextIndex].url);
  };

  const handlePrevious = () => {
    const prevIndex = (currentAudioIndex - 1 + audioFiles.length) % audioFiles.length;
    setCurrentAudioIndex(prevIndex);
    playSound(audioFiles[prevIndex].url);
  };

  const startSpinning = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinning = () => {
    spinValue.stopAnimation(); // Stop the disc from spinning
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (audioFiles.length > 0) {
      playSound(audioFiles[currentAudioIndex].url);
    }
  }, [audioFiles]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Now Playing</Text>
      <Text style={styles.audioTitle}>
        {audioFiles[currentAudioIndex]?.name || 'Loading...'}
      </Text>

      {/* Spinning disc */}
      <Animated.Image
        source={disc}
        style={[
          styles.disc,
          { transform: [{ rotate: spin }] },
        ]}
      />

      {isLoading || isBuffering ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          {/* Volume and audio control in the same line */}
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => setVolume(Math.max(volume - 0.1, 0))} style={styles.controlButton}>
              <Icon name="volume-down" size={30} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
              <Icon name="backward" size={40} color="00000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
              <Icon name={isPlaying ? "pause" : "play"} size={40} color="00000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
              <Icon name="forward" size={40} color="0000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVolume(Math.min(volume + 0.1, 1))} style={styles.controlButton}>
              <Icon name="volume-up" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Progress bar at the bottom */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={(value) => sound?.setPositionAsync(value)}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration - position)}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#79ded0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    color: '000',
  },
  audioTitle: {
    fontSize: 18,
    color: '#000', // Changed song title color to black
    marginBottom: 10,
  },
  disc: {
    width: 250, // Increased size of the disc
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  timeText: {
    color: '#000',
    fontSize: 14,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Space between controls and progress bar
  },
  controlButton: {
    paddingHorizontal: 10,
  },
});

export default FocusScreen;
