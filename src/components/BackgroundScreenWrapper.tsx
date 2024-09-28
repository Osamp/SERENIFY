import * as React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/CONST_LAYOUTS';

interface BackgroundScreenWrapperProps {
  image: ImageSourcePropType;
  children: React.ReactNode;
}

const BackgroundScreenWrapper = ({ image, children }: BackgroundScreenWrapperProps) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      {/* Using flex to ensure children are rendered on top of the image */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

export default BackgroundScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: -1, // Ensure the image is behind the content
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure children are rendered on top of the image
  },
});
