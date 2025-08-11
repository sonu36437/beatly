import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Modal from '../components/Modal';

export default function Downloads() {
  const navigation = useNavigation();
  const [isModalVisible,setIsModalVisible]=useState(false);
  async function fetchYou(){
    const res= await fetch("https://youtube.com/")
  const html= await res.text();
  console.log(html);
  
    
  }

  return (
     <View style={{flex:1,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
         <Text style={{color:'white'}}>Downloads</Text>
         <TouchableOpacity style={{height:50,width:100,backgroundColor:'black'}} onPress={()=>{

          setIsModalVisible(true);
         }}></TouchableOpacity>
         <Modal visible={isModalVisible} children={<View style={{backgroundColor:"yellow",height:50,width:100}}></View>}transparent={true}
         onRequestClose={()=>setIsModalVisible(false)}
         animationType="slide"/>
         
       </View>
  )
}