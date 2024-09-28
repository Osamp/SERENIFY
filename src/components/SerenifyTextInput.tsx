import * as React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { SCREEN_WIDTH } from '../utils/CONST_LAYOUTS';
import COLORS, { TEXT_COLOR } from '../utils/COLORS';



interface SerenifyTextInputProps extends TextInputProps {
  value: string;
}
const SerenifyTextInput: React.FC<SerenifyTextInputProps> = ({ value, ...restProps }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 50,
          width: SCREEN_WIDTH * .70,
          borderColor: 'gray',
          borderWidth: 1,
          backgroundColor:COLORS.SURFACE_COLOR,
          borderRadius:8,
          borderBlockColor:'transparent',
          color:COLORS.TEXT_COLOR,
          paddingHorizontal:10,
          marginBottom:10,
          marginTop:10,
         
        }}
        placeholderTextColor={TEXT_COLOR}
        
        {...restProps} 
      />
    </View>
  );
};

export default SerenifyTextInput;

const styles = StyleSheet.create({
  container: {
   
  },
});