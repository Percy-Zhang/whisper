import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';

import AppContext from './components/AppContext';
import LoginScreen from './screens/LoginScreen';
import useGetUserHook from './hooks/useGetUserHook';

import Main from './router';

export default function App() {
    const { user } = useGetUserHook()

    return (
        <AppContext.Provider value={{user}}>
            <NavigationContainer>
                {!user ? <LoginScreen /> : <Main />}
                <FlashMessage position="top" />
            </NavigationContainer>
        </AppContext.Provider>
    )
}