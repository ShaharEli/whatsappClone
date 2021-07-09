import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chats from '../screens/Chats/Chats';
import Chat from '../screens/Chat/Chat';

const Stack = createStackNavigator();

const noHeader = () => ({headerShown: false});

export default function ChatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={Chats} options={noHeader} />
      <Stack.Screen name="Chat" component={Chat} options={noHeader} />
    </Stack.Navigator>
  );
}
