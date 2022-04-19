import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

import EmailPasswordBox from '../components/EmailPasswordBox';
import useGetUserHook from '../hooks/useGetUserHook';
import { theme } from '../config';

// phonemyatkyawnew@gmail.com

export default function LoginScreen() {
    const [username, setUsername] = useState('phonemyatkyawnew@gmail.com');
    const [password, setPassword] = useState('password');
    const { loading, signup, login } = useGetUserHook()

    const onPressSignup = () => {
        if (username && password) signup(username, password)
    }

    const onPressLogin = () => {
        if (username && password) login(username, password)
    }

    const Button = (props) => {
        return (
            <TouchableOpacity style={styles.button} onPress={props.onPress} disabled={loading}>
                {
                    loading ?
                    <ActivityIndicator size="large" color="white" />
                    :
                    <Text style={styles.loginText}>{props.label}</Text>
                }
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Whisper</Text>
            </View>
            <EmailPasswordBox 
                numFields={2}
                labels={['Email', 'Password']}
                values={[username, password]}
                onChangeText={[setUsername, setPassword]}
            />
            <View style={styles.buttonsWrapper}>
                {/* <Button label={'Sign up'} onPress={onPressSignup} /> */}
                <Button label={'Log in'} onPress={onPressLogin} />
                {/* <Button label={'Debug'} onPress={void(0)} /> */}
            </View>
            
        </View>
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: theme.background,
    },
    titleWrapper: {
        height: '40%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        fontFamily: 'cursive',
        color: '#f33',
    },
    textInput: {
        margin: 5,
        borderBottomWidth: 1,
        minWidth: '80%',
    },
    buttonsWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        flex: 1,
        margin: 15,
        paddingHorizontal: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: theme.button,
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%'
    },
    loginText: {
        fontSize: 20,
    },
    loading: {
        opacity: 0.5
    },
})