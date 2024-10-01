import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from "@/app/Config/firebase";
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const FocusScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [position, setPosition] = useState(0); // Current playback position
  const [duration, setDuration] = useState(0); // Total duration of the audio
  const [volume, setVolume] = useState(1); // Initial volume set to 1 (100%)
  const isMounted = useRef(true);

  useEffect(() => {
    // Fetch audio files from Firebase storage
    const fetchAudioFiles = async () => {
      const storageRef = ref(storage, "gs://serenify-21975.appspot.com/");
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
      if (isMounted.current) setAudioFiles(urls);
    };

    fetchAudioFiles();

    // Cleanup function to unload sound
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
      { shouldPlay: true }, // Automatically play the sound
      onPlaybackStatusUpdate
    );

    setSound(newSound);
    await newSound.setVolumeAsync(volume); // Set initial volume
    setIsLoading(false);
    setIsPlaying(true);

    await newSound.playAsync();
  };

  const onPlaybackStatusUpdate = (status: Audio.AudioStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
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
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = (currentAudioIndex + 1) % audioFiles.length;
    setCurrentAudioIndex(nextIndex);
    playSound(audioFiles[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentAudioIndex - 1 + audioFiles.length) % audioFiles.length;
    setCurrentAudioIndex(prevIndex);
    playSound(audioFiles[prevIndex]);
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSliderChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const increaseVolume = async () => {
    if (sound && volume < 1) {
      const newVolume = Math.min(volume + 0.1, 1); // Increase volume, max is 1 (100%)
      setVolume(newVolume);
      await sound.setVolumeAsync(newVolume);
    }
  };

  const decreaseVolume = async () => {
    if (sound && volume > 0) {
      const newVolume = Math.max(volume - 0.1, 0); // Decrease volume, min is 0 (mute)
      setVolume(newVolume);
      await sound.setVolumeAsync(newVolume);
    }
  };

  useEffect(() => {
    if (audioFiles.length > 0) {
      playSound(audioFiles[currentAudioIndex]);
    }
  }, [audioFiles]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Audio</Text>

      {/* Display ActivityIndicator when loading or buffering */}
      {isLoading || isBuffering ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          {/* Progress bar and time display */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={handleSliderChange}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration - position)}</Text>
            </View>
          </View>

          {/* Audio control using icons */}
          <View style={styles.audioControls}>
            <TouchableOpacity onPress={handlePrevious} style={styles.iconButton}>
              <Icon name="backward" size={40} color="#FFD700" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause} style={styles.iconButton}>
              <Icon name={isPlaying ? "pause" : "play"} size={40} color="#FFD700" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
              <Icon name="forward" size={40} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Volume control using icons */}
      <View style={styles.volumeControls}>
        <TouchableOpacity onPress={decreaseVolume} style={styles.volumeButton}>
          <Icon name="volume-down" size={30} color="#FFD700" />
        </TouchableOpacity>

        <TouchableOpacity onPress={increaseVolume} style={styles.volumeButton}>
          <Icon name="volume-up" size={30} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <Text style={styles.audioInfo}>
        {isLoading ? "Loading audio..." : isBuffering ? "Buffering..." : `Playing: Audio ${currentAudioIndex + 1}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#79ded0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  iconButton: {
    marginHorizontal: 20,
  },
  volumeControls: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  volumeButton: {
    marginHorizontal: 20,
    padding: 10,
  },
  audioInfo: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
});

export default FocusScreen;
