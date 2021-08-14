import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import colors from './colors';
import './globals';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class History extends React.Component{
    updateTable = async () => { // add to table
        const jsonValue = await AsyncStorage.getItem('@storage_Key'); // retrieve data from local storage
        if (jsonValue === null) {
            global.tableValues = [];
        }
        else {
            global.tableValues = JSON.parse(jsonValue); // parse values to string
        }
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var todaysDate = month + "/" + date + "/" + year;
        var data = "DATE: " + todaysDate + "    TIME: " + global.dur + "   DISTANCE: " + global.dis + " KM";
        if (global.dur !== "" && global.dis !== "") {
            global.tableValues.push(data);
        }
        global.dur = "";
        global.dis = "";
        const updatedJsonValue = JSON.stringify(global.tableValues) // set new values
        await AsyncStorage.setItem('@storage_Key', updatedJsonValue) // send to async storage
        this.forceUpdate();
    }

    componentDidMount() {
        this.updateTable();
    }

    clearAllData() {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys));
        Alert.alert("History Cleared! Press 'Refresh'");
    }

    render() {
        const ListItem = ({title}) => (
            <View>
                <Text style={styles.tableData}>{title}</Text>
            </View>
        );
        return (
            <View style={styles.container}>
                <Image
                style = {styles.image}
                source={require('../assets/flippedblob.png')}/>
                <View style={styles.logContainer}>
                    <FlatList
                    data={global.tableValues}
                    keyExtractor={item=>item}
                    renderItem={({item}) => (
                        <ListItem title={item}/>
                    )}
                    />
                </View>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={styles.clearHistory}onPress={() => this.clearAllData()}>
                        <Text style={styles.clearHistoryText}>CLEAR HISTORY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refresh}onPress={() => this.updateTable()}>
                        <Text style={styles.refreshText}>REFRESH</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: colors.grey
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
    tableHeader: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        paddingTop: 20,
    },
    tableData: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'left',
        paddingTop: 20,
        left: 10,
    },
    logContainer: {
        height: 675,
        width: 370,
        backgroundColor: colors.grey,
        borderRadius: 30,
        borderColor: colors.white,
        borderWidth: 1,
    },
    clearHistory: {
        width: 120,
        height: 30,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 50,
        position: 'absolute',
        bottom: -12,
        backgroundColor: "#c96b6e",
        right: 40,
    },
    clearHistoryText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        marginTop: 5,
    },
    refresh: {
        width: 80,
        height: 30,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 50,
        position: 'absolute',
        bottom: -12,
        backgroundColor: "#454c57",
        left: 70,
    },
    refreshText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        marginTop: 5,
    }
  });
