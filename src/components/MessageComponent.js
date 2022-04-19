import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MessageComponent(props) {
    const message = props.item.data()
    const id = props.item.id
    const date = new Date(message.timestamp.toDate())
    const formattedDate = date.toLocaleDateString() + ', ' + date.toLocaleTimeString()
    const isSenderCurrentUser = message.sender == props.getCurrentUser()?.uid

    const onPress = () => {
        props.onPress(id)
    }

    const onLongPress = () => {
        if (isSenderCurrentUser) props.onLongPress(id)
    }
       
    return (
        <View style={isSenderCurrentUser ? styles.right : styles.left}>
            <Text>{props.getDisplayName(message.sender)}</Text>
            <TouchableOpacity 
                style={styles.messageWrapper}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <Text>{message.content}</Text>
            </TouchableOpacity>
            {
                props.focusId == id && 
                <Text>{formattedDate}</Text>
            }
        </View>
        // return <Text key={item.id}>{JSON.stringify(item.id)}</Text>
    )
}

const styles = StyleSheet.create({
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
})