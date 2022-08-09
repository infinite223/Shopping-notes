import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { note, product } from '../Helpers/types';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons'; 

const initialData = [{
    id:"1",
    title:"My first note",
    date: new Date(),
    products: [
      {
        id:"1",
        category:"Pieczywo",
        name:"Bułka",
        shop:"Biedronka"
      },
      {
        id:"2",
        category:"Warzywa",
        name:"Pietruszka",
        shop:"Biedronka"
      }
    ]
  }]

const HomeScreen = () => {
    const navigation = useNavigation<any>()
    const [notes, setNotes] = useState<Array<note>>(initialData)

    const createNote = (title:string, products:Array<product>) => {
        setNotes([...notes, {id:(parseInt(notes[notes.length-1].id)+1).toString(), title:title, date:new Date(), products:products }])
    }

  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white` ]}>
        <Text style={[tw`text-green-500`, {fontWeight:"bold", fontSize:30, fontFamily:`monospace`}]}>Shopping notes</Text>
        <FlatList
            style={[tw`mt-3`]}
            data={notes}
            keyExtractor={(item:note)=>item.id}
            renderItem={({ item })=> (
                <TouchableOpacity onPress={()=>navigation.navigate('NoteScreen', {note:item})} style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3`, {borderRadius:10}]}>
                    <View style={[tw`flex-row justify-between`]}>
                        <Text style={{fontSize:17}}>{item.title}</Text>
                        <Text style={[tw`text-green-600`]}> 0{item.date.getDay()} - 0{item.date.getMonth()} - {item.date.getFullYear()}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />

        <TouchableOpacity onPress={()=>navigation.navigate('NewNoteScreen', {createNote:createNote})} style={[tw`bg-green-500 p-5 pr-6 pl-6 rounded-full`, { zIndex: 1,position:"absolute", right:20, bottom:20}]}>
            <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity> 
    </SafeAreaView>
  )
}

export default HomeScreen