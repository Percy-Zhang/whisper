import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';


const width = Dimensions.get('window').width

export default function EmailPasswordBox(props) {
    const [value, setValue] = useState()
    const indexList = Array(props.numFields).fill().map((value, index) => index)
    

    return (
        <View style={styles.container}>
            <View>
                {indexList.map((i) => (
                    <View key={i} style={styles.row}>
                        <TextInput
                            style={styles.labelText} 
                            value={props.labels[i]}
                            editable={false}
                        />
                        <TextInput
                            style={styles.textInput} 
                            placeholder={props.placeholder && props.placeholder[i]}
                            value={props.values[i]}
                            onChangeText={(value) => props.onChangeText[i](value)}
                        />
                    </View>
                ))}
            </View>   
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    row: {
        paddingBottom: 20
    },
    labelText: {
        width: width * 0.25,
        color: 'black',
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        marginRight: 5,
    },
    textInput: {
        color: '#444',
        borderBottomWidth: 1,
        width: width * 0.85,
    },
})