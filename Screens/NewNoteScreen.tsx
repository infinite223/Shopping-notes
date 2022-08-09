import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons'; 

const NewNoteScreen = ({}) => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const [products, setProducts] = useState([{id:"0", category:"", name:"", shop:"" }])  
  const [title, setTitle] = useState("")
  const { createNote } :any = route.params;

  const editProduct = (id:string, name:string, category:string, shop:string) => {
    const allProducts = products 
    const findIndex = products.findIndex((product)=> product.id===id)
    allProducts[findIndex] = {id:id, name:name, category:category, shop:shop}
    setProducts(allProducts)
    console.log(category)
    console.log(products)
  } 

  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`]}>
      <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", fontFamily:`monospace`}]}>Create new shopping note</Text>
      <TextInput
        placeholder='Title Note'
        onChangeText={(title)=>setTitle(title)}
        style={[tw`bg-gray-100 mt-2 p-2 pl-3 pr-3`, {fontSize:17, borderRadius:10}]}      
      />
      <Text style={[tw`mt-3 mb-1 ml-1`, {fontSize:15}]}>Products:</Text>
      <FlatList 
        data={products}
        keyExtractor={(product)=>product.id}
        renderItem={(product)=>(
            <View style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3 flex-row justify-between items-center`, {borderRadius:10}]}>
                <View>
                    <TextInput
                        style={{fontSize:17}}
                        placeholder="Name"
                        onChangeText={(name)=>editProduct(product.item.id, name, product.item.category, product.item.shop)}
                    />
                    <TextInput
                        style={{fontSize:17}}
                        placeholder='Category'                       
                        onChangeText={(category)=>editProduct(product.item.id, product.item.name, category, product.item.shop)}
                    />
                     <TextInput
                        style={{fontSize:17}}
                        placeholder='Shop'                    
                        onChangeText={(shop)=>editProduct(product.item.id, product.item.name, product.item.category, shop)}
                    />
                </View>
                {product.item.id!=="0"&&
                <TouchableOpacity onPress={()=>setProducts(products.filter((item)=>item.id !== product.item.id ))}>
                       <FontAwesome5 name="trash" size={24} color="gray" />
                </TouchableOpacity>}
            </View>
        )}
        ListFooterComponent={()=>(
            <TouchableOpacity onPress={()=>setProducts([...products, {id:(parseInt(products[products.length-1].id)+1).toString(), name:"", category:"", shop:""}])} style={[tw`bg-green-500 p-2 pr-3 pl-3 flex-row justify-between`, {borderRadius:10}]}>
                <Text style={{fontSize:16, color:"white"}}>Next product</Text>
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity> 
        )}
      />
     
      <TouchableOpacity onPress={()=>(createNote(title, products), navigation.navigate("HomeScreen"))} style={[tw`bg-green-500 p-1 pl-5 pr-5 rounded-full flex-row items-center`, { zIndex: 1,  position:"absolute", right:20, bottom:20}]}>
            <Text style={[tw`mb-2`, {color:"white", fontSize:30}]}>create</Text>
            <FontAwesome name="chevron-right" size={24} color="white" style={[tw`ml-3`]} />
      </TouchableOpacity> 
    </SafeAreaView>
  )
}

export default NewNoteScreen