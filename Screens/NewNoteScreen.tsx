import { View, Text, TextInput, TouchableOpacity, Alert, Animated,  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,} from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import SelectList from 'react-native-dropdown-select-list';
import { LogBox } from 'react-native';
import { product } from '../Helpers/types';
import themeContext from '../config/themeContext';
import { categories } from '../Helpers/constants';

const NewNoteScreen = ({}) => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const [products, setProducts] = useState([{category:"", name:"", shop:"" }])  
  const [title, setTitle] = useState("")
  const { createNote } :any = route.params;
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
    if(title.length<3){
      createTwoButtonAlert()
    }
    else {
      let shops:Array<{nameShop:string, data:Array<{name:string, category:string}>}> = [];
      let groupedProductsInShops: Array<{nameShop:string, data:Array<{category:string, products:Array<{name:string, status:boolean}>}>}> = [];
      
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
        shops.forEach(({data}, i)=> {
          data.forEach((item)=>{
            if(!groupedProductsInShops[i].data.find((data)=>data.category===item.category)){
              groupedProductsInShops[i].data.push({category:item.category, products:[]})
            }
          })
        })

        shops.forEach(({data}, i)=>{
          data.forEach(({category, name})=>{
            groupedProductsInShops[i].data.forEach((item, j)=>{
              if(category===item.category){
                groupedProductsInShops[i].data[j].products.push({name:name, status:false})
              }
            })
          })
        })
      }
      groupByCategory()
      createNote(title, groupedProductsInShops)
      navigation.navigate("HomeScreen")
    }
  }

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Somthing wrong",
      "Title of the note must be more than 3 letters",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]
    );

    const { width } = Dimensions.get('window');

    const layoutAnimConfig = {
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut, 
      },
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

  return (
    <SafeAreaView style={[tw`p-5 h-full`, {backgroundColor:theme.background, flex:1}]}>
      <Text style={[tw`text-green-500 mb-2`, {fontSize:22, fontWeight:"bold", letterSpacing:.5}]}>Create new shopping note</Text>
      <TextInput
        placeholder='Title Note'
        onChangeText={(title)=>setTitle(title)}
        placeholderTextColor={!mode?"#bbb":"#aaa"}
        style={[tw`${mode?'bg-gray-100':'bg-gray-700'} mt-2 p-2 pl-3 pr-3`, {color:!mode?"white":"black", fontSize:17, borderRadius:10}]}      
      />
      <Text style={[tw`mt-3 mb-1 ml-1`, {fontSize:15, color:theme.color, fontWeight:"600"}]}>Products:</Text>
      <KeyboardAwareScrollView>
        <KeyboardAwareFlatList 
          style={{flex: 1}}
          data={products}
          keyExtractor={(product, index)=> index.toString()}
          renderItem={(product)=>(
              <Animated.View style={[tw`${mode?'bg-gray-100':'bg-gray-700'} mb-3 p-2 pl-3 pr-3 flex-row justify-between items-center`, {flex:1, borderRadius:10}]}>
                  <View>
                      <TextInput
                          style={{color:!mode?"white":"black", fontSize:17}}
                          placeholder="Name"
                          placeholderTextColor={!mode?"#bbb":"#aaa"}
                          onChangeText={(value)=>editProduct(product.index, value, "Name")}
                      />
                      <SelectList 
                        boxStyles={[tw`pl-0 text-gray-500`, {borderWidth:0}]} 
                        searchicon={<View><Text style={{color:!mode?"#bbb":"#aaa"}}>Categories </Text></View>} 
                        placeholder="Category" 
                        data={categories} 
                        setSelected={(value:string)=>editProduct(product.index, categories[parseInt(value)-1].value, "Category")}
                        dropdownStyles={[tw`p-0 mb-1 mt-0 mr-3`, {borderWidth:0}]} 
                        dropdownTextStyles={{color:!mode?"white":"black"}}
                        dropdownItemStyles={[tw`pl-0 ml-0`]}
                        inputStyles={{color:!mode?"#bbb":"#aaa"}}
                      />
                      <TextInput
                          style={{color:!mode?"white":"black", fontSize:17}}
                          placeholder='Shop'            
                          placeholderTextColor={!mode?"#bbb":"#aaa"}        
                          onChangeText={(value)=>editProduct(product.index, value, "Shop")}
                      />
                  </View>
                  {product.index!==0&&
                  <TouchableOpacity onPress={()=>(setProducts(products.filter((item, i)=>i !== product.index)), LayoutAnimation.configureNext(layoutAnimConfig))}>
                        <FontAwesome5 name="trash" size={20} style={[tw`p-2`]} color="gray" />
                  </TouchableOpacity>}
              </Animated.View>        
          )}
          ListFooterComponent={()=>(
              <TouchableOpacity onPress={()=>(setProducts([...products, {name:"", category:"", shop:""}]), LayoutAnimation.configureNext(layoutAnimConfig))} style={[tw`bg-green-500 mt-2 p-2 pr-3 pl-3 flex-row justify-between items-center`, {borderRadius:10}]}>                
                    <Text style={{fontSize:16, color:"white"}}>Next product</Text>
                    <FontAwesome5 name="plus" size={17  } color="white" />          
              </TouchableOpacity> 
          )}
        />
      </KeyboardAwareScrollView>
     
      <TouchableOpacity onPress={()=>groupAllData()} style={[tw`bg-green-500 p-1 pl-5 pr-5 rounded-full flex-row items-center`, {elevation:3, zIndex: 1,  position:"absolute", right:20, bottom:20}]}>
            <Text style={[tw`mb-1`, {color:"white", fontSize:22, fontFamily:`monospace`}]}>Create</Text>
            <FontAwesome name="chevron-right" size={20} color="white" style={[tw`ml-3`]} />
      </TouchableOpacity> 
    </SafeAreaView>
  )
}

export default NewNoteScreen