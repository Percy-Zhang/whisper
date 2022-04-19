import { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import { formatId } from '../helpers';
import { showMessage } from 'react-native-flash-message';
import useGetUserHook from './useGetUserHook';

export default function useGetRooms() {
    const [rooms, setRooms] = useState([])
    const roomCollection = firestore().collection('rooms')
    const { getCurrentUser } = useGetUserHook()
    
    useEffect(() => {
        const onResult = async (snapshot) => {
            setRooms(snapshot.docs)
        }
        const onError = (error) => {
            console.log('useGetRooms:', error)
        }
        const unsubscribe = roomCollection.onSnapshot(onResult, onError)

        return () => unsubscribe()
    }, [])

    const verifyRoomName = (room) => {
        if (room.length < 2) {
            showMessage({
                message: 'Room name must be at least 2 letters!',
                type: 'warning',
            })
            return false
        } else if (room.length > 15) {
            showMessage({
                message: 'Room name cannot be more than 15 letters!',
                type: 'warning',
            })
            return false
        } else if (!room.match(/^[a-zA-Z ]+$/)) {
            showMessage({
                message: 'Room name can only contain letters!',
                type: 'warning',
            })
            return false
        }
        return true
    }

    const getRooms = async () => {
        // returns array of messages in room
        try {
            const roomArray = await roomCollection.get()
            setRooms(roomArray.docs)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const addRoom = async (
        room, 
        users = [],
    ) => {
        try {
            if (!verifyRoomName(room)) return false
            const { uid } = getCurrentUser()
            for (let i in rooms) {
                if (rooms[i].id == room) {
                    showMessage({
                        message: 'That room name is already in use!',
                        type: 'warning',
                    })
                    return false
                }
            }
            const success = await roomCollection
                .doc(room)
                .set({
                    nextMessageId: 1,
                    users: firestore.FieldValue.arrayUnion.apply(this, [uid, ...users]),
                    owner: uid
                })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const joinRoom = async (room) => {
        if (!verifyRoomName(room)) return false
        for (let i in rooms) {
            if (rooms[i].id == room) {
                const { uid } = getCurrentUser()
                const success = await roomCollection
                .doc(room)
                .update({
                    users: firestore.FieldValue.arrayUnion(uid),
                })
                return true
            }
        }
        showMessage({
            message: 'That room does not exist! Why not create one instead?',
            type: 'warning',
        })
        return false
    }

    const leaveRoom = async (room) => {
        for (let i in rooms) {
            if (rooms[i].id == room) {
                const { uid } = getCurrentUser()
                const success = await roomCollection
                .doc(room)
                .update({
                    users: firestore.FieldValue.arrayRemove(uid),
                })
                return false
            }
        }
    }

    const deleteRoom = async (name) => {
        // id must be formated as a string '0000000001'
        try {
            const success = await roomCollection
                .doc(name)
                .delete()
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const getUsers = async (name) => {
        return (await roomCollection.doc(name).get()).data().users
    }

    return {
        rooms,
        getRooms,
        addRoom,
        joinRoom,
        leaveRoom,
        deleteRoom,
        getUsers,
    }
}
