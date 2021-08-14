import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import colors from './colors';

function Run({route, navigation}) {
    return (
        <View style={styles.container}>
            <Image
            style = {styles.image}
            source={require('../assets/blob.png')}/>
            <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate("TimeRun")}>
                <Text style={styles.text}>START</Text>
            </TouchableOpacity>
        </View>
    );    
}
export default Run;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: colors.grey,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        bottom: 0,
    },
    text: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 20,
        top: 10,
    },
    startButton: {
        width: 150,
        height: 50,
        borderColor: colors.white,
        borderWidth: 1,
    }
  });
