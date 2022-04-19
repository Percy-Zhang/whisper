import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessageScreen from './screens/MessageScreen';
import ProfileScreen from './screens/ProfileScreen';
import RoomsScreen from './screens/RoomsScreen';
import RoomsSettingsScreen from './screens/RoomsSettingsScreen';
import MessagesSettingsScreen from './screens/MessagesSettingsScreen';



const MainStack = createNativeStackNavigator()

const Main = () => {
    return (
        <MainStack.Navigator screenOptions={{headerShown:false}}>
            <MainStack.Screen name="Rooms" component={RoomsScreen} />
            <MainStack.Screen name="RoomsSettings" component={RoomsSettingsScreen} />
            <MainStack.Screen name="Messages" component={MessageScreen} />
            <MainStack.Screen name="MessagesSettings" component={MessagesSettingsScreen} />
            <MainStack.Screen name="Profile" component={ProfileScreen} />
        </MainStack.Navigator>
    )
}

export default function App() {
    return <Main />
}