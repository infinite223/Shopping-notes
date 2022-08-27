import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "react-native-gesture-handler"
import HomeScreen from './Screens/HomeScreen';
import NewNoteScreen from './Screens/NewNoteScreen';
import NoteScreen from './Screens/NoteScreen';
import { YellowBox, StatusBar, View } from 'react-native'; 
import EditNoteScreen from './Screens/EditNoteScreen';
import { LogBox } from 'react-native';
import React, { useState, useEffect, useContext } from 'react'
import themeContext from './config/themeContext';
import { theme } from './config/theme';
import { EventRegister } from 'react-native-event-listeners';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  const Stack =  createNativeStackNavigator()
  const [mode, setMode] = useState(false)

  // const theme = useContext(themeContext)
  useEffect(()=>{
    let eventListener= EventRegister.addEventListener("changeTheme", (data)=>{setMode(data)})

    return () => {
      EventRegister.removeEventListener(eventListener);
    }

  }, [])

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])


  return (
    <themeContext.Provider value={mode?theme.dark:theme.light}>
      <NavigationContainer>
        <SafeAreaProvider>  
          <StatusBar backgroundColor={mode?"black":"white"} barStyle="light-content"/>
          <View style={{ 
              position: 'absolute',
              height: '100%', 
              width: '100%',  
              backgroundColor:mode?"black":"white"
          }}/>
          <Stack.Navigator>
            <Stack.Screen name='HomeScreen' component={HomeScreen}
              options={{headerShown:false,
                headerStyle: {
                  backgroundColor: theme.background
                },
              }            
            }
            />
            <Stack.Screen name='NewNoteScreen' component={NewNoteScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name='NoteScreen' component={NoteScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name='EditNoteScreen' component={EditNoteScreen}
              options={{headerShown:false}}
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </themeContext.Provider>
  );
}

