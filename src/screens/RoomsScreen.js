import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { showMessage } from 'react-native-flash-message';

import useGetUserHook from '../hooks/useGetUserHook';
import useGetRooms from '../hooks/useGetRooms';
import useGetRoomHook from '../hooks/useGetRoomHook';
import { theme } from '../config';


const Separator = () => <View style={styles.separator} />

const Empty = () => <Text style={styles.empty}>Get a room code and start chatting!</Text>

const Room = ({ item, onPress }) => {
    const goToRoom = () => {
        onPress(item)
    }

    return (
        <TouchableOpacity style={styles.roomRow} onPress={goToRoom}>
            <Text style={styles.roomName}>{item.id}</Text>
        </TouchableOpacity>
    )
}

export default function RoomsScreen({ navigation }) {
    const [name, setName] = useState('')
    const { rooms, addRoom, joinRoom } = useGetRooms()
    const { getCurrentUser } = useGetUserHook()

    const createRoom = () => {
        name && addRoom(name)
        setName('')
    }

    const joinExistingRoom = () => {
        name && joinRoom(name)
        setName('')
    }

    const goToRoom = (item) => {
        navigation.navigate('Messages', item)
    }

    const goToSettings = (item) => {
        navigation.navigate('RoomsSettings')
    }

    const isUserInRoom = room => {
        return room.data().users.includes(getCurrentUser().uid)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                    <Icon name='account' size={40} color={theme.buttonDark}/>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={rooms.filter(room => isUserInRoom(room))}
                renderItem={({item}) => <Room item={item} onPress={goToRoom} />}
                ItemSeparatorComponent={Separator}
                ListEmptyComponent={Empty}
            />
            <View style={styles.footer} >
                <TextInput 
                    style={styles.textInput}
                    value={name}
                    onChangeText={value => setName(value)}
                    placeholder={'Room code'}
                />
                <TouchableOpacity style={styles.button} onPress={createRoom}>
                    <Text>New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={joinExistingRoom}>
                    <Text>Join</Text>
                </TouchableOpacity>
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    empty: {
        alignSelf: 'center',
        paddingTop: 100,
    },
    header: {
        backgroundColor: theme.header,
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 10,
        zIndex: 2,
    },
    settingsButton: {
        alignSelf: 'flex-start',
    },
    roomRow: {
        padding: 15,
        backgroundColor: theme.button
    },
    roomName: {
        fontSize: 20,
        fontFamily: 'times'
    },
    separator: {
        borderBottomWidth: 1
    },
    footer: {
        flexDirection: 'row',
        padding: 15,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderRadius: 20,
        color: 'black'
    },
    button: {
        backgroundColor: theme.button,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        // padding: 10,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 22
    },
})