import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackgroundScreenWrapper from '@/src/components/BackgroundScreenWrapper';
import SerenifyText from '@/src/components/SerenifyText';
import SerenifyTextInput from '@/src/components/SerenifyTextInput';
import useAuthentication from '@/src/hooks/useAuthentication';

// Replace these imports with your actual assets or paths
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

    const handleLogin = async () => {
        console.log("Trying to login with:", credentials);
        try {
            await login(credentials.email, credentials.password);
            Alert.alert("Login successful");
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert("Login failed");
        }
    };        

    return (
        <BackgroundScreenWrapper image={backgroundImage}>
            <View style={styles.container}>
                <View style={styles.inputsWrapper}>
                    {/* Ensure images are correctly rendered */}
                    <Image source={backgroundLogo} style={styles.logo} />
                    
                    {/* Proper use of SerenifyText component */}
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
                        {/* Ensure Button is not causing the issue */}
                        <Button
                            title="Login"
                            onPress={() => {
                                console.log('Button Pressed');
                                handleLogin();
                            }}
                        />
                    </View>
                    
                    <View style={{ marginTop: 15 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                        >
                            {/* Wrap text content inside SerenifyText or Text component */}
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
    textTitle: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold'
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
