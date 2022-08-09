import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "react-native-gesture-handler"
import HomeScreen from './Screens/HomeScreen';
import NewNoteScreen from './Screens/NewNoteScreen';
import NoteScreen from './Screens/NoteScreen';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  const Stack =  createNativeStackNavigator()

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen name='HomeScreen' component={HomeScreen}
            options={{headerShown:false}}
          />
          <Stack.Screen name='NewNoteScreen' component={NewNoteScreen}
            options={{headerShown:false}}
          />
           <Stack.Screen name='NoteScreen' component={NoteScreen}
            options={{headerShown:false}}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

