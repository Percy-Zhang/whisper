import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, RefreshControl } from 'react-native'

import AppContext from '../components/AppContext';
import useGetUserHook from '../hooks/useGetUserHook';
import { theme } from '../config';




export default function RoomsSettingsScreen({ navigation, route }) {
    const [name, setName] = useState()
    const [refresh, setRefresh] = useState(false)
    const { getCurrentUser, updateName, signout } = useGetUserHook()
    const { user } = React.useContext(AppContext)

    const onUpdateName = async () => {
        await updateName(user, name)
        route.params.init()
        setRefresh(!refresh)
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardWrapper}>
                <View style={styles.profilePicture}>
                    <Text>Profile</Text>
                </View>
                <View>
                    <TouchableOpacity>
                        <Text>{getCurrentUser().displayName ?? 'Nameless Individual'}</Text>
                    </TouchableOpacity>
                    <Text>{user.email}</Text>
                </View>
            
            </View>

            <View style={{flexDirection: 'row', padding: 20,}}>
                <TextInput 
                    style={styles.editName}
                    value={name}
                    onChangeText={(value) => setName(value)}
                />
                <TouchableOpacity onPress={onUpdateName} style={{borderWidth: 1, borderRadius: 10, backgroundColor: theme.button, padding: 5, marginHorizontal: 10}}>
                    <Text>Edit Name</Text>
                </TouchableOpacity>
            </View>

            <View style={{flex:1}} />

            <TouchableOpacity style={styles.button} onPress={signout}>
                <Text style={styles.loginText}>{'Log out'}</Text>
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
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EDE',
        marginTop: 20,
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: 'white',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    editName: {
        flex: 1,
        borderBottomWidth: 1
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