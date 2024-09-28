import * as React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface SerenifyTextProps {
  headingL?: boolean;
  heading?: boolean;
  bodyS?: boolean;
  centre?: boolean;
  bold?: boolean;
  color?: string;
  style?: TextStyle; // Accept the style prop
  children?: React.ReactNode;
}

const SerenifyText: React.FC<SerenifyTextProps> = ({
  headingL,
  heading,
  bodyS,
  centre = false,
  bold,
  color,
  style, // Add style prop here
  children,
}) => {
  let fontSize = 14;
  if (headingL) {
    fontSize = 40;
  }
  if (heading) {
    fontSize = 34;
  }
  if (bodyS) {
    fontSize = 14;
  }

  // Combine custom styles with default styles
  return (
    <Text
      style={[
        {
          fontSize,
          alignSelf: centre ? 'center' : 'auto',
          fontWeight: bold ? '800' : '400',
          color: color ? color : '#fff',
        },
        style, // Apply custom styles
      ]}
    >
      {children}
    </Text>
  );
};

export default SerenifyText;

const styles = StyleSheet.create({
  container: {},
});
