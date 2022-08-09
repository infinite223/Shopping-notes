import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { note } from '../Helpers/types';


const NoteScreen = () => {
  const route = useRoute<any>()

  const { note } = route.params;
  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`]}>
        <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", fontFamily:`monospace`}]}>{note.title}</Text>
        <FlatList 
            style={[tw`mt-3`]}
            data={note.products}
            keyExtractor={(product)=>product.id}
            renderItem={(product)=>(
                <View style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3`, {borderRadius:10}]}>
                    <Text>{product.item.name}</Text>   
                    <Text>{product.item.category}</Text>      
                    <Text>{product.item.shop}</Text>            
                </View>
            )}
        />
    </SafeAreaView>
  )
}

export default NoteScreen