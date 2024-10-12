import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackgroundScreenWrapper from '@/src/components/BackgroundScreenWrapper';
import SerenifyText from '@/src/components/SerenifyText';
import SerenifyTextInput from '@/src/components/SerenifyTextInput';
import useAuthentication from '@/src/hooks/useAuthentication';
import { auth } from "@/app/Config/firebase"; // Import Firebase Auth to manage sessions

const backgroundImage = require('../../../assets/images/login_bg.jpg');
const backgroundLogo = require('../../../assets/images/logo_light.png');

interface LoginScreenProps {
    navigation: NavigationProp<any>;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const { login } = useAuthentication();
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
    });

    // Check if a user is already logged in (session management)
    React.useEffect(() => {
        const currentUser = auth.currentUser; // This will return the current user if they are logged in
        if (currentUser) {
            Alert.alert('User already logged in', 'Redirecting to Home screen');
            navigation.navigate('Home'); // Automatically redirect logged-in users
        }
    }, []);

    const handleLogin = async () => {
        console.log("Trying to login with:", credentials);
        try {
            const userCredential = await login(credentials.email, credentials.password);
            console.log('Login successful:', userCredential);
            Alert.alert("Login successful");
            navigation.navigate('Home'); // Navigate to the home screen after login
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert("Login failed", 'An error occurred while logging in.');
        }
    };        

    return (
        <BackgroundScreenWrapper image={backgroundImage}>
            <View style={styles.container}>
                <View style={styles.inputsWrapper}>
                    <Image source={backgroundLogo} style={styles.logo} />
                    <SerenifyText heading bold>Serenify</SerenifyText>
                    <SerenifyText>find a moment of Peace</SerenifyText>
                    
                    <View style={styles.inputWrapper}>
                        <SerenifyTextInput
                            placeholder="Email"
                            value={credentials.email}
                            onChangeText={(text) =>
                                setCredentials((prevState) => ({
                                    ...prevState,
                                    email: text.trim(),
                                }))
                            }
                        />
                        <SerenifyTextInput
                            placeholder="Password"
                            secureTextEntry
                            value={credentials.password}
                            onChangeText={(text) =>
                                setCredentials((prevState) => ({
                                    ...prevState,
                                    password: text,
                                }))
                            }
                        />
                    </View>
                    
                    <View style={{ marginTop: 15 }}>
                        <Button
                            title="Login"
                            onPress={() => {
                                console.log('Button Pressed');
                                handleLogin();
                            }}
                        />
                    </View>
                    
                    <View style={{ marginTop: 15 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <SerenifyText>Don't have an account? Signup</SerenifyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BackgroundScreenWrapper>
    );
};

export default LoginScreen;

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
        marginBottom: 50,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10
    },
    inputWrapper: {
        marginTop: 15,
    }
});
