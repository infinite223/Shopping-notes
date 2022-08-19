import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Octicons,  FontAwesome5 } from '@expo/vector-icons'; 
import themeContext from '../config/themeContext';


const NoteScreen = () => {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const [statusProducts, setStatusProducts] = useState<Array<string>>([])

  const { note, editNote, changeStatusProduct } = route.params;
  const theme:any = useContext(themeContext)  

  const [mode, setMode] = useState(false)

  useEffect(()=>{
    if(theme.background==="white"){
      setMode(true)
    }
    else {
      setMode(false)
    }
  },[theme])

  const setStatus = (name:string) => {
    const findStatusProduct = statusProducts.find((_name)=>_name===name)
    if(findStatusProduct){
      setStatusProducts(statusProducts.filter((_name)=>_name!==name))
    }
    else {
      setStatusProducts([...statusProducts, name])
    }
  }

  useEffect(()=> {
    note.shops.forEach((shop:{nameShop:string, data:Array<{category:string, products:Array<{name:string, status:boolean}>}>}) => {
      shop.data.forEach((category)=> {
        category.products.forEach((product)=>{
          if(product.status){
            setStatusProducts([...statusProducts, product.name])
          }
        })
      })
    });
  },[])
  
  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`, {backgroundColor:theme.background}]}>
        <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", letterSpacing:1}]}>{note.title?note.title:<Text style={{color:"lightgray"}}>Title</Text>}</Text>
        <FlatList 
            style={[tw`mt-1`]}
            data={note.shops}
            keyExtractor={(shop)=>shop.nameShop}
            renderItem={(shop)=>(
                <View style={[tw`pt-1`, {borderRadius:10}]}>
                    <Text style={{fontSize:16, color:theme.color, fontWeight:"600", letterSpacing:.5}}>{shop.item.nameShop}</Text>   
                    <FlatList 
                        style={[tw`mt-3`]}
                        data={shop.item.data}
                        keyExtractor={(product)=>product.category}
                        renderItem={(data)=>(
                            <View style={[tw`${mode?'bg-gray-100':'bg-gray-700'}  mb-2 p-2 pl-3 pr-3`, {borderRadius:8}]}>                               
                                <Text style={{fontWeight:"500", color:theme.color}}>{data.item.category}</Text>    
                                <FlatList 
                                  style={[tw`mt-3`]}
                                  data={data.item.products}
                                  keyExtractor={(product)=>product.name}
                                  renderItem={(product)=>(
                                    // changeStatusProduct(note.title, shop.index, data.index, product.index)
                                      <TouchableOpacity onPress={(x)=>(changeStatusProduct(note.title, shop.index, data.index, product.index), setStatus(product.item.name))}
                                       style={[tw`${mode?'bg-gray-100':'bg-gray-700'}  mb-1 p-0 pl-0 pr-3 flex-row items-center`, {borderRadius:5}]}>                                                                
                                          <Octicons name="dot-fill" size={15} color="lightgreen" style={[tw`mr-2`]} />
                                          <Text style={[{color:theme.color}, statusProducts.find((_name)=>_name===product.item.name)?{textDecorationLine:"line-through"}:{}]}>{product.item.name}</Text>                                       
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