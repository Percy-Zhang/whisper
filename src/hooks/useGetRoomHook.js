import { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import { formatId } from '../helpers';

export default function useGetRoomHook(roomName) {
    const [messages, setMessages] = useState()
    const room = firestore().collection('rooms').doc(roomName)
    
    useEffect(() => {
        const onResult = async (snapshot) => {
            setMessages(snapshot.docs)
        }
        const onError = (error) => {
            console.log('useGetMessagesHook:', error)
        }
        const unsubscribe = room.collection('messages').onSnapshot(onResult, onError)

        return () => unsubscribe()
    }, [])

    const getMessages = async () => {
        // returns array of messages in room
        try {
            const messageCollection = await room.collection('messages').get()
            setMessages(messageCollection.docs)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const addMessage = async (
        content, 
        sender, 
    ) => {
        try {
            const id = (await room.get()).data().nextMessageId

            const success = await room
                .collection('messages')
                .doc(formatId(id))
                .set({
                    content, 
                    sender,
                    timestamp: new Date(),
                })
            room.update({
                nextMessageId: id + 1
            })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const deleteMessage = async (id) => {
        // id must be formated as a string '0000000001'
        try {
            const success = await room
                .collection('messages')
                .doc(id)
                .delete()
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const getUsers = async () => {
        return (await room.get()).data().users
    }

    return {
        messages,
        getMessages,
        addMessage,
        deleteMessage,
        getUsers,
    }
}
