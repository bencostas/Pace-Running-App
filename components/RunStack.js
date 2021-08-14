import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TimeRun from './TimeRun';
import Run from './Run';

const Stack = createStackNavigator();

export default function RunStack({route, navigation}) {
    return(
        <Stack.Navigator
        initialRouteName='Run'
        screenOptions={{
            headerShown: false,
            gestureEnabled: false
        }}>
            <Stack.Screen
            name="Run"
            component={Run}/>
            <Stack.Screen
            name="TimeRun"
            component={TimeRun}/>
        </Stack.Navigator>
    );
}