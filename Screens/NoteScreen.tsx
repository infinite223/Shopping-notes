import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Octicons,  FontAwesome5 } from '@expo/vector-icons'; 


const NoteScreen = () => {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()

  const { note, editNote } = route.params;

  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`]}>
        <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", letterSpacing:1}]}>{note.title?note.title:<Text style={{color:"lightgray"}}>Title</Text>}</Text>
        <FlatList 
            style={[tw`mt-1`]}
            data={note.shops}
            keyExtractor={(shop)=>shop.nameShop}
            renderItem={(note)=>(
                <View style={[tw`pt-1`, {borderRadius:10}]}>
                    <Text style={{fontSize:16, fontWeight:"600", letterSpacing:.5}}>{note.item.nameShop}</Text>   
                    <FlatList 
                        style={[tw`mt-3`]}
                        data={note.item.data}
                        keyExtractor={(product)=>product.category}
                        renderItem={(product)=>(
                            <View style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3`, {borderRadius:8}]}>                               
                                <Text style={{fontWeight:"500"}}>{product.item.category}</Text>    
                                <FlatList 
                                  style={[tw`mt-3`]}
                                  data={product.item.products}
                                  keyExtractor={(product)=>product.name}
                                  renderItem={(product)=>(
                                      <TouchableOpacity onLongPress={(x)=>console.log(x)} style={[tw`bg-gray-100 mb-1 p-0 pl-0 pr-3 flex-row items-center`, {borderRadius:5}]}>                                                                
                                          <Octicons name="dot-fill" size={15} color="lightgreen" style={[tw`mr-2`]} />
                                          <Text>{product.item.name}</Text>                                       
                                      </TouchableOpacity>
                                  )}
                                />                                        
                            </View>
                        )}
                      />      
                </View>
            )}
            ListFooterComponent={()=>(
              <TouchableOpacity  onPress={()=>navigation.navigate("EditNoteScreen", {note:note, editNote:editNote})} style={[tw`bg-green-500 mt-1 p-2 pr-3 pl-3 flex-row justify-between`, {borderRadius:10}]}>
                  <Text style={{fontSize:16, color:"white"}}>New product</Text>
                  <FontAwesome5 name="plus" size={20} color="white" />
              </TouchableOpacity> 
            )}
        />
    </SafeAreaView>
  )
}

export default NoteScreen