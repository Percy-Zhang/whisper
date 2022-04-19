import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import useGetUserHook from '../hooks/useGetUserHook';
import useGetRoomHook from '../hooks/useGetRoomHook';
import { theme } from '../config';

export default function MessageScreen({ navigation }) {
    const [content, setContent] = useState()
    const [users, setUsers] = useState()
    const { getCurrentUser, getUsersInRoom, signout } = useGetUserHook()
    const { messages, getUsers, addMessage, deleteMessage } = useGetRoomHook('lobby')

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        // get User info of users in room
        const uidList = await getUsers()
        const usersInRoom = (await getUsersInRoom(uidList).get()).docs
        const usersList = {}
        console.log(usersInRoom)
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
    // getDisplayNameDict()
    const navigateProfile = () => {
        navigation.navigate('Profile', {init})
    }

    const getDisplayName = sender => {
        if (users == undefined) return 'Anonymous'
        if (Object.keys(users).length == 0) return 'Anonymous'
        if (users[sender] == "") return 'Anonymous'
        return users[sender]
    }

    const Button = (props) => {
        return (
            <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <Text style={styles.loginText}>{props.label}</Text>
            </TouchableOpacity>
        )
    }

    

    return (
        <View style={styles.container}>
            {/* <Text>{'Hi, ' + user.email}</Text> */}
            <ScrollView 
                style={styles.body}
                fadingEdgeLength={100}
                showsVerticalScrollIndicator={false}
            >
                {
                    messages && messages.map(item => {
                        const message = item.data()
                        const id = item.id
                        return (
                            <View key={id} style={message.sender == getCurrentUser()?.uid ? styles.right : styles.left}>
                                <Text>{getDisplayName(message.sender)}</Text>
                                <TouchableOpacity 
                                    style={styles.messageWrapper}
                                    onPress={() => deleteMessage(id)}
                                >
                                    <Text>{message.content}</Text>
                                </TouchableOpacity>
                            </View>
                            // return <Text key={item.id}>{JSON.stringify(item.id)}</Text>
                        )
                    })
                }
            </ScrollView>
            <View style={styles.footer}>
                <TextInput 
                    style={styles.textInput} 
                    placeholder={'Your message...'}
                    value={content}
                    onChangeText={(value) => setContent(value)}
                />
                <Button label={'Send'} onPress={sendMessage} />
            </View>
            
            <View style={{flexDirection:'row'}}>
                <Button label={'Log out'} onPress={signout} />
                <Button label={'Profile'} onPress={navigateProfile} />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    textInput: {
        flex: 1,
        paddingLeft: 5,
        // borderWidth: 1,
        borderBottomWidth: 1,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ccf',
    },
    right: {
        alignItems: 'flex-end'
    },
    left: {
        alignItems: 'flex-start'
    },
    messageWrapper: {
        maxWidth: '75%',
        backgroundColor: '#eee',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        // borderTopWidth: 1,
    },
})