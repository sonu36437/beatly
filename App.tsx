import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import SearchScreen from './screens/SearchScreen'
import TrackPlayer, { Capability } from 'react-native-track-player'

export default function App() {
  useEffect(()=>{
    async function setupPlayer(){
    try{
     await TrackPlayer.setupPlayer();
     console.log("setup up is done successfully");
     
     await TrackPlayer.updateOptions({
      capabilities:[
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
    
      ]
     })

    }catch(e){
      Alert.alert("error while setting up the player")
    }
    
  }
  setupPlayer();

  },[])
  return (
 <SearchScreen/>
  )
}