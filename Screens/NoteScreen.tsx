import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { note, product } from '../Helpers/types';
import groupBy from 'lodash/groupBy';


const NoteScreen = () => {
  const route = useRoute<any>()

  const { note } = route.params;

  let shops:Array<{nameShop:string, data:Array<{name:string, category:string}>}> = [];
  let groupedProductsInShops: Array<{nameShop:string, data:Array<{name:string, category:string}>}> =[];
  const sortByShop = note.products.sort();
  
  const groupByShops = () => {
    note.products.forEach((product:product)=>{
      if(!shops.find((shop)=>shop.nameShop===product.shop)){
        shops.push({nameShop:product.shop, data:[]})
      }
    })

    note.products.forEach((product:product)=>{
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

    function compare( a:{category:string, name:string}, b:{category:string, name:string} ) {
      if ( a.category < b.category ){
        return -1;
      }
      if ( a.category > b.category ){
        return 1;
      }
      return 0;
    }
    
    shops.forEach(({nameShop,data})=> {
      groupedProductsInShops.push({nameShop:nameShop, data:data.sort(compare)})
    })
  }
  groupByCategory()
  console.log(groupedProductsInShops)
  
  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white`]}>
        <Text style={[tw`text-green-500`, {fontSize:20, fontWeight:"bold", letterSpacing:1}]}>{note.title}</Text>
        <FlatList 
            style={[tw`mt-3`]}
            data={groupedProductsInShops}
            keyExtractor={(groupedProductsInShops)=>groupedProductsInShops.nameShop}
            renderItem={(groupedProductsInShops)=>(
                <View style={[tw`pt-1`, {borderRadius:10}]}>
                    <Text style={{fontSize:16, fontWeight:"600"}}>{groupedProductsInShops.item.nameShop}</Text>   
                    <FlatList 
                        style={[tw`mt-3`]}
                        data={groupedProductsInShops.item.data}
                        keyExtractor={(product)=>product.category}
                        renderItem={(product)=>(
                            <TouchableOpacity onLongPress={(x)=>console.log(x)} style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3`, {borderLeftWidth:4, borderColor:"lightgreen", borderRadius:5}]}>
                                <Text>{product.item.name}</Text>  
                                <Text>{product.item.category}</Text>                                       
                            </TouchableOpacity>
                        )}
                      />      
                </View>
            )}
        />
    </SafeAreaView>
  )
}

export default NoteScreen