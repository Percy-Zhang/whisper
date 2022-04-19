import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessageScreen from './screens/MessageScreen';
import ProfileScreen from './screens/ProfileScreen';



const MainStack = createNativeStackNavigator()

const Main = () => {
    return (
        <MainStack.Navigator>
            <MainStack.Screen name="Home" component={MessageScreen} />
            <MainStack.Screen name="Profile" component={ProfileScreen} />
        </MainStack.Navigator>
    )
}

export default function App() {
    return <Main />
}