import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native'

import AppContext from '../components/AppContext';
import useGetUserHook from '../hooks/useGetUserHook';
import useGetRooms from '../hooks/useGetRooms';
import useGetRoomHook from '../hooks/useGetRoomHook';
import { theme } from '../config';


const Item = ({ item }) => {
    const userInfo = item.data()
    return (
        <Text style={styles.userName}>{userInfo.displayName}</Text>
    )
}


export default function MessagesSettingsScreen({ navigation, route }) {
    const [users, setusers] = useState()

    const { leaveRoom } = useGetRooms()
    const { getUsers } = useGetRoomHook(route.params.roomId)
    const { getUsersInRoom } = useGetUserHook()


    useEffect(() => {
        (async () => {
            const uidArray = await getUsers()
            const usersInfos = await getUsersInRoom(uidArray).get()
            setusers(usersInfos.docs)
        })()
    }, [])

    const leaveCurrentRoom = () => {
        navigation.popToTop()
        leaveRoom(route.params.roomId)
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.cardWrapper}>
                <Text style={styles.title}>Members</Text>
                <FlatList 
                    data={users}
                    renderItem={Item}
                />
            
            </View>

            

            <View style={{flex:1}} />

            <TouchableOpacity style={styles.button} onPress={leaveCurrentRoom}>
                <Text style={styles.loginText}>{'Leave Chat Room'}</Text>
            </TouchableOpacity>
         
                
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: theme.background,
    },
    cardWrapper: {
        // flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EDE',
        borderRadius: 20,
        marginTop: 20,
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        paddingBottom: 10,
        color: theme.buttonDark
    },
    userName: {
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        margin: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: theme.button,
    },
})