import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import NewExpenseScreen from './screens/NewExpenseScreen'
import ItemEditScreen from './screens/ItemEditScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer >
      <StatusBar></StatusBar>
         <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{headerShown: false}}>
          <Stack.Screen name='HomeScreen' component={HomeScreen} ></Stack.Screen>
          <Stack.Screen name='NewExpenseScreen' component={NewExpenseScreen} ></Stack.Screen>
          <Stack.Screen name='ItemEditScreen' component={ItemEditScreen} ></Stack.Screen>

        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
