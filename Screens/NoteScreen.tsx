import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { note, product } from '../Helpers/types';
import { FontAwesome,Octicons,  FontAwesome5, AntDesign } from '@expo/vector-icons'; 


const NoteScreen = () => {
  const route = useRoute<any>()

  const { note } = route.params;
  console.log(note)

  // let shops:Array<{nameShop:string, data:Array<{name:string, category:string}>}> = [];
  // let groupedProductsInShops: Array<{nameShop:string, data:Array<{category:string, products:Array<{name:string}>}>}> = [];
  // const sortByShop = note.products.sort();
  
  // const groupByShops = () => {
  //   note.products.forEach((product:product)=>{
  //     if(!shops.find((shop)=>shop.nameShop===product.shop)){
  //       shops.push({nameShop:product.shop, data:[]})
  //       groupedProductsInShops.push({nameShop:product.shop, data:[]})
  //     }
  //   })

  //   note.products.forEach((product:product)=>{
  //     shops.forEach(({nameShop, data}, i)=>{
  //       if(nameShop===product.shop){
  //         if(!data.find((item)=>item.name===product.name)){
  //           shops[i].data.push({name:product.name, category:product.category})
  //         }
  //       }
  //     })
  //   })  
  // }
  // groupByShops()




  // const groupByCategory = () => {    
  //   shops.forEach(({nameShop,data}, i)=> {
  //     data.forEach((item)=>{
  //       if(!groupedProductsInShops[i].data.find((data)=>data.category===item.category)){
  //         groupedProductsInShops[i].data.push({category:item.category, products:[]})
  //       }
  //     })
  //   })

  //   shops.forEach(({nameShop, data}, i)=>{
  //     data.forEach(({category, name})=>{
  //       groupedProductsInShops[i].data.forEach((item, j)=>{
  //         if(category===item.category){
  //           groupedProductsInShops[i].data[j].products.push({name:name})
  //         }
  //       })
  //     })
  //   })
  // }
  // groupByCategory()

  
  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`]}>
        <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", letterSpacing:1}]}>{note.title?note.title:<Text style={{color:"lightgray"}}>Title</Text>}</Text>
        <FlatList 
            style={[tw`mt-3`]}
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
              <TouchableOpacity  style={[tw`bg-green-500 mt-1 p-2 pr-3 pl-3 flex-row justify-between`, {borderRadius:10}]}>
                  <Text style={{fontSize:16, color:"white"}}>New product</Text>
                  <FontAwesome5 name="plus" size={20} color="white" />
              </TouchableOpacity> 
            )}
        />
    </SafeAreaView>
  )
}

export default NoteScreen