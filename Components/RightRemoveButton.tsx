import { TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import React from 'react'

import { FontAwesome5, } from '@expo/vector-icons'; 
import { SwipeButtonsContainer } from 'react-native-swipe-item';

export const RightRemoveButton = (
    <SwipeButtonsContainer
        style={{
            alignSelf: 'center',
            aspectRatio: 1,
            flexDirection: 'column',
            padding: 10,
        }}         
    >
        <TouchableOpacity
            onPress={() => console.log('left button clicked')}
        >
            <FontAwesome5 name="trash" size={20} style={[tw`p-0`]} color="gray" />
        </TouchableOpacity>
    </SwipeButtonsContainer>
);