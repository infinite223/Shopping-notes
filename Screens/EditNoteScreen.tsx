import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome} from '@expo/vector-icons'; 
import themeContext from '../config/themeContext';

import SelectList from 'react-native-dropdown-select-list';
import { categories } from '../Helpers/constants';

const EditNoteScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const [product, setProduct] = useState({category:"", name:"", shop:"" })  

  const { note, editNote } = route.params;
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

  const addProduct = () => {
    const newNote:Array<{nameShop:string, data:Array<{category:string, products:Array<{name:string, status:boolean}>}>}> = note.shops;
      const foundShop = newNote.findIndex((shop)=>shop.nameShop ===product.shop)
      if(foundShop>=0){
        const foundCategory = newNote[foundShop].data.findIndex((data)=>data.category===product.category)
        if(foundCategory>=0){
          newNote[foundShop].data[foundCategory].products.push({name:product.name, status:false})
          editNote({title:note.title, newNote:newNote})
          navigation.navigate("HomeScreen")        
        }
        else{
            newNote[foundShop].data.push({category:product.category, products:[{name:product.name, status:false}]})
            editNote({title:note.title, newNote:newNote})
            navigation.navigate("HomeScreen")  
        }
      }
      else {
        newNote.push({nameShop:product.shop, data:[{category:product.category, products:[{name:product.name, status:false}]}]})
        editNote({title:note.title, newNote:newNote})
        // navigation.navigate("HomeScreen")      
        navigation.goBack()   
      }
    }  


  return (
    <SafeAreaView style={[tw`p-5 h-full`, {backgroundColor:theme.background, flex:1}]}>
      <Text style={[tw`text-green-500 mb-2`, {fontSize:20, fontWeight:"bold", letterSpacing:.5}]}>New product to "{note.title}"</Text>

      <TextInput
        style={[tw`${mode?'bg-gray-100':'bg-gray-700'}  mt-2 p-2 pl-3 pr-3`, {color:!mode?"white":"black", fontSize:17, borderRadius:10}]}    
        placeholder="Name"
        placeholderTextColor={!mode?"#bbb":"#aaa"}
        onChangeText={(value)=>setProduct({category:product.category, name:value, shop:product.shop})}
      />
      <SelectList 
        boxStyles={[tw`pl-3 mt-3 text-gray-500 ${mode?'bg-gray-100':'bg-gray-700'}`, {borderWidth:0}]} 
        searchicon={<View><Text style={{color:!mode?"#bbb":"#aaa"}}>Categories </Text></View>} 
        placeholder="Category" 
        data={categories} 
        setSelected={(value:string)=>setProduct({category:categories[parseInt(value)-1].value, name:product.name, shop:product.shop})}
        dropdownStyles={[tw`p-0 mb-1 mt-2`, {borderColor:!mode?"black":"white"}]} 
        dropdownTextStyles={{color:!mode?"white":"black"}}
        inputStyles={{color:!mode?"white":"black"}}
      />
      <TextInput
        style={[tw`${mode?'bg-gray-100':'bg-gray-700'}  mt-3 p-2 pl-3 pr-3`, {color:!mode?"white":"black", fontSize:17, borderRadius:10}]}    
        placeholder='Shop'          
        placeholderTextColor={!mode?"#bbb":"#aaa"}          
        onChangeText={(value)=>setProduct({category:product.category, name:product.name, shop:value})}
      />              
     
      <TouchableOpacity onPress={()=>addProduct()} style={[tw`bg-green-600 p-1 pl-5 pr-5 rounded-full flex-row items-center`, { zIndex: 1,  position:"absolute", right:20, bottom:20}]}>
            <Text style={[tw`mb-1`, {color:"white", fontSize:22, fontFamily:`monospace`}]}>Save</Text>
            <FontAwesome name="chevron-right" size={20} color="white" style={[tw`ml-3`]} />
      </TouchableOpacity> 
    </SafeAreaView>
  )
}

export default EditNoteScreen