import React from "react";
import { StyleSheet} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import color from './components/colors';

import RunStack from './components/RunStack';
import History from './components/History';
import colors from "./components/colors";

const Tab = createMaterialTopTabNavigator();

function MyTabs({route, navigation}) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="RunScreen"
      screenOptions = {
        {
          "tabBarActiveTintColor": colors.white,
          "tabBarInactiveTintColor": colors.grey,
          "tabBarLabelStyle" : {
            "fontSize": 12
          },
          "tabBarIndicatorStyle": {
            "backgroundColor": colors.grey,
            "height" : "100%",
            "borderTopLeftRadius": 30,
            "borderTopRightRadius": 30
          },
          "tabBarStyle": {
            "backgroundColor": colors.purple,
            "marginTop":47
          }
        }
      }
    >
      <Tab.Screen
        name="RunScreen"
        component={RunStack}
        options={{ tabBarLabel: 'Run' }}
      />
      <Tab.Screen
        name="RunLogScreen"
        component={History}
        options={{ tabBarLabel: 'History' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: color.grey
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
});

export default function MainMenu() {
  return(
    <SafeAreaProvider style={{backgroundColor: color.purple}}>
      <NavigationContainer>
        <MyTabs/>
      </NavigationContainer>
    </SafeAreaProvider>
  )
};