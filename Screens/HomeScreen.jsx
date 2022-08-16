import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';

import {SwipeListView} from 'react-native-swipe-list-view';
import tw from 'tailwind-react-native-classnames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialData = [{
  title:"My first note",
  date: new Date(),
  shops: [
    {
      nameShop:"Biedronka",
      data:[
        {category:"Warzywo", products:[{name:"Pietruszka"}, {name:"Marchew", status:false}]},
        {category:"Pieczywo", products:[{name:"Chleb"}, {name:"Bułka", status:false}]}
      ]
    },
    {
      nameShop:"Sedal",
      data:[
        {category:"Mięso", products:[{name:"Salami"}, {name:"Kiełbasa", status:false}]},
        {category:"Picie", products:[{name:"Woda"}, {name:"Cola", status:false}]}
      ]
    },  
  ]
}]


const HomeScreen = () => {
  const [notes, setNotes] = useState(initialData);
  const navigation = useNavigation()

  const storeData = async () => {
    // if(notes.length>0){
      try {
        await AsyncStorage.setItem(
          '@storage_Key',
          JSON.stringify(notes)
        ).then(()=>console.log("x", notes));
      } catch (e) {
      }
    // }
  }

  const createNote = async (title, groupedProductsInShops) => { 
     setNotes([...notes, { title:title, date:new Date(), shops:groupedProductsInShops }])
  }

  useEffect(()=>{  
    //if(notes.length<1) {setNotes(initialData)}  
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        console.log(jsonValue)
        setNotes(jsonValue ? JSON.parse(jsonValue):{}) 
      } catch(e) {
      }
    }
    getData()
  },[])

  const editNote = ({title, newNote}) => {
    const newNotes = notes;
    const foundNote = newNotes.findIndex((note)=>note.title===title)
    if(foundNote>=0){
      newNotes[foundNote].shops = newNote;
      setNotes(newNotes)
      storeData()   
    }
  }

  
  useEffect(()=>{
    storeData()   
  },[notes, editNote])

  const changeStatusProduct = (title, shopIndex, categoryIndex, productIndex) => {
    const findNoteIndex = notes.findIndex((note)=>note.title === title)
    const newNotes = notes
    if(findNoteIndex>=0){
       const status = newNotes[findNoteIndex].shops[shopIndex].data[categoryIndex].products[productIndex].status;
       newNotes[findNoteIndex].shops[shopIndex].data[categoryIndex].products[productIndex].status = !status
       setNotes(newNotes)
    }
  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (title) => {
    setNotes(notes.filter((note)=>note.title !==title));
  };


  const VisibleItem = props => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, {height: rowHeightAnimatedValue}]}>
        <TouchableHighlight
          onPress={()=>navigation.navigate('NoteScreen', {note:data.item, editNote:editNote, changeStatusProduct:changeStatusProduct})} style={[tw`bg-gray-100 mb-2 p-2 pl-3 pr-3 justify-center`, {height:50, borderRadius:7}]}
          underlayColor={'#aaa'}>
          <View style={[tw`flex-row justify-between items-center`]}>
            <Text style={{fontSize:17, letterSpacing:.5}} numberOfLines={1}>
              {data.item.title}
            </Text>
            <Text style={[tw`text-green-600`, {fontSize:12}]}>
              {/* 0{data.item.date.getDay()} -  0{data.item.date.getMonth()} - {data.item.date.getFullYear()} */}
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(data.item.title)}
      />
    );
  };

  const HiddenItemWithActions = props => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 85,
        useNativeDriver: false
      }).start();
    }

    return (
      <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}>
            <TouchableOpacity
              onPress={onDelete}>
              <Animated.View
                style={[
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-70, -45],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}>
                <FontAwesome5 name="trash" size={30} style={[tw`p-0`]} color="gray" />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(data.item.title)}
      />
    );
  };

  return (
    <SafeAreaView style={[tw`p-5 h-full bg-white` ]}>
      <Text style={[tw`text-green-500 mb-3`, {fontWeight:"bold", fontSize:30, fontFamily:`monospace`}]}>Shopping notes</Text>
      <SwipeListView
        data={notes}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={85}
        rightOpenValue={-65}
        disableRightSwipe
        leftActivationValue={100}
        rightActivationValue={-250}
        leftActionValue={0}
        rightActionValue={-500}
      />

    <TouchableOpacity onPress={()=>navigation.navigate('NewNoteScreen', {createNote:createNote})} style={[tw`bg-green-500 p-5 pr-6 pl-6 rounded-full`, { zIndex: 1,position:"absolute", right:20, bottom:20}]}>
            <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity> 
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    borderRadius: 7,
    height: 50,
    margin: 5,
    marginBottom: 1,
  },
  rowFrontVisible: {
    borderRadius: 7,
    height: 45,
    padding: 0,
    marginBottom: 15,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 55,
    paddingRight: 17,
  },
    backRightBtnRight: {
    backgroundColor: 'white',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
