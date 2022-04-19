import { useState, useEffect } from 'react'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';

export default function useGetUserHook() {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState()
    const firebaseAuth = auth()

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => setUser(user))
        setLoading(false)

        return subscriber; // unsubscribe on unmount
    }, [])

    const showErrorMessage = error => {
        if (error.code === 'auth/email-already-in-use') {
            showMessage({
                message: 'That email address is already in use!',
                type: 'danger',
            })
        } else if (error.code === 'auth/invalid-email') {
            showMessage({
                message: 'That email address is invalid!',
                type: 'danger',
            })
        } else {
            showMessage({
                message: error.code,
                type: 'danger',
            })
        }
    }

    const getCurrentUser = () => {
        return firebaseAuth.currentUser
    }

    const getUsersInRoom = uidList => {
        return firestore().collection('users').where('uid','in',uidList)
    }

    const signup = async (
        username, 
        password,
    ) => {
        setLoading(true)
        try {
            const status = await firebaseAuth.createUserWithEmailAndPassword(username, password)
            await firestore()
                .collection('users')
                .doc(status.user.uid)
                .set({
                    email: status.user.email,
                    uid: status.user.uid,
                    created: new Date(),
                })
            showMessage({
                message: 'User account created & signed in!',
                type: 'success',
            })
        } catch (e) {
            showErrorMessage(e)
        }
        setLoading(false)
    }

    const login = async (
        username,
        password,
    ) => {
        setLoading(true)
        try {
            await firebaseAuth.signInWithEmailAndPassword(username, password)
            showMessage({
                message: 'User account logged in!',
                type: 'success',
            })
        } catch (e) {
            showErrorMessage(e)
        } 
        setLoading(false)
    }

    const signout = () => {
        setLoading(true)
        try {
            firebaseAuth.signOut()
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    const updateName = async (
        user, 
        newName,
    ) => {
        setLoading(true)
        try {
            await firebaseAuth.currentUser.updateProfile({
                displayName: newName
            })
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    displayName: newName
                })
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    return {
        loading,
        user,
        getCurrentUser,
        signup,
        login,
        signout,
        updateName,

        getUsersInRoom,
    }
}
