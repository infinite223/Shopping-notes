import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import { LogBox } from 'react-native';
import { note, product } from '../Helpers/types';
const NewNoteScreen = ({}) => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const [products, setProducts] = useState([{category:"", name:"", shop:"" }])  
  const [title, setTitle] = useState("")
  const { createNote } :any = route.params;

  const editProduct = (id:number, value:string, type:string) => {
    const allProducts = products 
    switch (type) {
        case "Name":
             allProducts[id].name = value;
            break;
        case "Category":
            allProducts[id].category = value;
            break;
        case "Shop":
            allProducts[id].shop = value;
            break;
        default:
            break;
    } 
    setProducts(allProducts)
  } 
  
  useEffect(() => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])

  const groupAllData = () => {
    let shops:Array<{nameShop:string, data:Array<{name:string, category:string}>}> = [];
    let groupedProductsInShops: Array<{nameShop:string, data:Array<{category:string, products:Array<{name:string}>}>}> = [];
    
    const groupByShops = () => {
      products.forEach((product:product)=>{
        if(!shops.find((shop)=>shop.nameShop===product.shop)){
          shops.push({nameShop:product.shop, data:[]})
          groupedProductsInShops.push({nameShop:product.shop, data:[]})
        }
      })

      products.forEach((product:product)=>{
        shops.forEach(({nameShop, data}, i)=>{
          if(nameShop===product.shop){
            if(!data.find((item)=>item.name===product.name)){
              shops[i].data.push({name:product.name, category:product.category})
            }
          }
        })
      })  
    }
    groupByShops()

    const groupByCategory = () => {    
      shops.forEach(({nameShop,data}, i)=> {
        data.forEach((item)=>{
          if(!groupedProductsInShops[i].data.find((data)=>data.category===item.category)){
            groupedProductsInShops[i].data.push({category:item.category, products:[]})
          }
        })
      })

      shops.forEach(({nameShop, data}, i)=>{
        data.forEach(({category, name})=>{
          groupedProductsInShops[i].data.forEach((item, j)=>{
            if(category===item.category){
              groupedProductsInShops[i].data[j].products.push({name:name})
            }
          })
        })
      })
    }
    groupByCategory()
    createNote(title, groupedProductsInShops)
  }

  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`, {flex:1}]}>
      <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", letterSpacing:.5}]}>Create new shopping note</Text>
      <TextInput
        placeholder='Title Note'
        onChangeText={(title)=>setTitle(title)}
        style={[tw`bg-gray-100 mt-2 p-2 pl-3 pr-3`, {fontSize:17, borderRadius:10}]}      
      />
      <Text style={[tw`mt-3 mb-1 ml-1`, {fontSize:15, fontWeight:"600"}]}>Products:</Text>
      <KeyboardAwareScrollView>
        <KeyboardAwareFlatList 
          style={{flex: 1}}
          data={products}
          keyExtractor={(product, index)=> index.toString()}
          renderItem={(product)=>(
              <View style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3 flex-row justify-between items-center`, {flex:1, borderRadius:10}]}>
                  <View>
                      <TextInput
                          style={{fontSize:17}}
                          placeholder="Name"
                          onChangeText={(value)=>editProduct(product.index, value, "Name")}
                      />
                      <TextInput
                          style={{fontSize:17}}
                          placeholder='Category'                       
                          onChangeText={(value)=>editProduct(product.index, value, "Category")}
                      />
                      <TextInput
                          style={{fontSize:17}}
                          placeholder='Shop'                    
                          onChangeText={(value)=>editProduct(product.index, value, "Shop")}
                      />
                  </View>
                  {product.index!==0&&
                  <TouchableOpacity onPress={()=>setProducts(products.filter((item, i)=>i !== product.index))}>
                        <FontAwesome5 name="trash" size={20} style={[tw`p-2`]} color="gray" />
                  </TouchableOpacity>}
              </View>
          )}
          ListFooterComponent={()=>(
              <TouchableOpacity onPress={()=>setProducts([...products, {name:"", category:"", shop:""}])} style={[tw`bg-green-500 mt-2 p-2 pr-3 pl-3 flex-row justify-between`, {borderRadius:10}]}>                
                    <Text style={{fontSize:16, color:"white"}}>Next product</Text>
                    <FontAwesome5 name="plus" size={20} color="white" />          
              </TouchableOpacity> 
          )}
        />
      </KeyboardAwareScrollView>
     
      <TouchableOpacity onPress={()=>(groupAllData(), navigation.navigate("HomeScreen"))} style={[tw`bg-green-600 p-1 pl-5 pr-5 rounded-full flex-row items-center`, { zIndex: 1,  position:"absolute", right:20, bottom:20}]}>
            <Text style={[tw`mb-1`, {color:"white", fontSize:22, fontFamily:`monospace`}]}>Create</Text>
            <FontAwesome name="chevron-right" size={20} color="white" style={[tw`ml-3`]} />
      </TouchableOpacity> 
    </SafeAreaView>
  )
}

export default NewNoteScreen