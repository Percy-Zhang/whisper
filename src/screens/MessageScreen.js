import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useGetUserHook from '../hooks/useGetUserHook';
import useGetRoomHook from '../hooks/useGetRoomHook';
import { theme } from '../config';
import MessageComponent from '../components/MessageComponent';

export default function MessageScreen({ navigation, route }) {
    const [focusId, setFocusId] = useState()
    const [content, setContent] = useState()
    const [users, setUsers] = useState()
    const { getCurrentUser, getUsersInRoom, signout } = useGetUserHook()
    const { messages, getUsers, addMessage, deleteMessage } = useGetRoomHook(route.params.id)

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        // get User info of users in room
        const uidList = await getUsers()
        const usersInRoom = (await getUsersInRoom(uidList).get()).docs
        const usersList = {}
        for (let i in usersInRoom) {
            const userInfo = usersInRoom[i].data()
            usersList[userInfo.uid] = userInfo.displayName
        }
        setUsers(usersList)
    }

    const sendMessage = async () => {
        if (!content) return
        setContent()
        const success = await addMessage(content, getCurrentUser().uid)    
    }

    const getDisplayName = sender => {
        return users ? users[sender] : 'Anonymous'
    }

    const Button = (props) => {
        return (
            <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <Text style={styles.loginText}>{props.label}</Text>
            </TouchableOpacity>
        )
    }

    const onPressMessage = (id) => {
        if (focusId != id) setFocusId(id)
        else setFocusId()
    }

    const onLongPressMessage = (id) => {
        Alert.alert(
            'Delete Message',
            'Are you sure?',
            [{
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Ok', 
                onPress: () => deleteMessage(id)
            }],
            {cancelable: false},
          )
    }

    const goToSettings = () => {
        console.log()
        navigation.navigate('MessagesSettings', {roomId:route.params.id})
    }

    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{route.params.id}</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                    <Icon name='cog' size={40} color={theme.buttonDark}/>
                </TouchableOpacity>
            </View>
            <FlatList 
                style={styles.body}
                fadingEdgeLength={100}
                showsVerticalScrollIndicator={false}
                inverted={true}
                data={messages ? [...messages].reverse() : messages}
                renderItem={({item}) => 
                    <MessageComponent 
                        key={item.id}
                        item={item}
                        getCurrentUser={getCurrentUser}
                        getDisplayName={getDisplayName}
                        focusId={focusId}
                        onPress={onPressMessage}
                        onLongPress={onLongPressMessage}
                    />
                }
            />


            <View style={styles.footer}>
                <TextInput 
                    style={styles.textInput} 
                    placeholder={'Your message...'}
                    value={content}
                    onChangeText={(value) => setContent(value)}
                />
                <Button label={'Send'} onPress={sendMessage} />
            </View>
            
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    header: {
        flexDirection: 'row',
        backgroundColor: theme.header,
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 10,
        zIndex: 2,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    settingsButton: {
        alignSelf: 'flex-end'
    },
    textInput: {
        flex: 1,
        paddingLeft: 5,
        borderBottomWidth: 1,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: theme.button,
    },
    loginText: {
        fontSize: 20,
    },
    body: {
        flex: 1,
        // flexDirection: 'column-reverse',
        margin: 15,
    },
    footer: {
        backgroundColor: theme.header,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopWidth: 1,
    },
})