import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function UserInfoGatherScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>UserInfoGatherScreen</Text>
      <TouchableOpacity onPress={()=>{
        navigation.navigate('nav');
      }}><Text>go to home</Text></TouchableOpacity>
    </View>
  )
}