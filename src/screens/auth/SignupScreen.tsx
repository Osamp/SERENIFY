import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackgroundScreenWrapper from '@/src/components/BackgroundScreenWrapper';
import SerenifyText from '@/src/components/SerenifyText';
import SerenifyTextInput from '@/src/components/SerenifyTextInput';
import useAuthentication from '@/src/hooks/useAuthentication';

const backgroundImage = require('../../../assets/images/signup_bg.jpg');
const backgroundLogo = require('../../../assets/images/logo_light.png');

interface SignupScreenProps {
    navigation: NavigationProp<any>;
}

// Define the keys as a union type
type CredentialKeys = 'fullName' | 'email' | 'password';

const SignupScreen = ({ navigation }: SignupScreenProps) => {
    const [credentials, setCredentials] = React.useState<{
        fullName: string;
        email: string;
        password: string;
    }>({
        fullName: '',
        email: '',
        password: '',
    });

    const { register } = useAuthentication();

    // Handle signup process
    const handleSignup = async () => {
        try {
            // Trim inputs to remove any trailing spaces
            const trimmedFullName = credentials.fullName.trim();
            const trimmedEmail = credentials.email.trim();
            const trimmedPassword = credentials.password.trim();

            // Validate inputs before proceeding
            if (!trimmedFullName || !trimmedEmail || !trimmedPassword) {
                Alert.alert("Signup Error", "Please enter full name, email, and password.");
                return;
            }

            await register(trimmedFullName, trimmedEmail, trimmedPassword);
            Alert.alert("Signup successful");
            navigation.navigate('Login'); // Navigate to login screen after signup
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    console.log('credentials', credentials);

    return (
        <BackgroundScreenWrapper image={backgroundImage}>
            <View style={styles.container}>
                <Image source={backgroundLogo} style={styles.logo} />
                <View style={styles.inputsWrapper}>
                    <SerenifyText heading bold>Serenify</SerenifyText>
                    <SerenifyText>
                        Find a moment of Peace
                    </SerenifyText>
                    <View style={styles.inputWrapper}>
                        {(['fullName', 'email', 'password'] as CredentialKeys[]).map((key) => (
                            <SerenifyTextInput
                                key={key}
                                placeholder={
                                    key === 'fullName' ? 'Full Name' :
                                    key === 'email' ? 'Email' : 'Password'
                                }
                                secureTextEntry={key === 'password'} // Hide password input
                                value={credentials[key]} // Access the value correctly
                                onChangeText={(text) => setCredentials((prevState) => ({
                                    ...prevState,
                                    [key]: text.trim(), // Trim spaces from user input
                                }))}
                            />
                        ))}
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Button
                            title="Signup"
                            onPress={handleSignup} // Call handleSignup on button press
                            color="#841584" // You can adjust this color as needed
                        />
                    </View>
                    <View style={{ marginTop: 2 }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Login');
                            }}
                        >
                            <SerenifyText>Have an account? Login</SerenifyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BackgroundScreenWrapper>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputsWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    inputWrapper: {
        marginTop: 20,
    },
});
