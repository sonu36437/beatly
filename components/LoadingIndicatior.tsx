import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function LoadingIndicatior({size=24,color="white"}) {
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator color={color} size={size} animating={true}/>  
        <Text style={{color:color,fontFamily:'Rubik-Bold',fontSize:20}}>Loading....</Text>

    </View>
  )
}
