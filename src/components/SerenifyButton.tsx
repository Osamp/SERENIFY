import * as React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from '../utils/CONST_LAYOUTS';
import COLORS from '../utils/COLORS';

interface SerenifyButtonProps {
  children?: React.ReactNode;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>; // Change `any` to `ViewStyle`
  onPress?: () => void; // Ensure onPress is correctly defined
}

const SerenifyButton: React.FC<SerenifyButtonProps> = ({ children, secondary, style, onPress }) => {
  let backgroundColor = COLORS.PRIMARY_COLOR;
  if (secondary) backgroundColor = COLORS.SECONDARY_COLOR;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress} // Pass the onPress function here
      style={[
        {
          backgroundColor,
          width: SCREEN_WIDTH * 0.6,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          margin: 10,
        },
        style, // Allow additional styles to be applied
      ]}
    >
      <Text 
        style={{
          color: COLORS.TEXT_COLOR,
          fontSize: 18,
          fontWeight: '600',
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default SerenifyButton;
