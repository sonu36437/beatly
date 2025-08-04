import { View, Text, Alert, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import SearchScreen from './screens/SearchScreen'
import TrackPlayer, { Capability } from 'react-native-track-player'
import MiniPlayer from './components/MiniPlayer'
import FullScreenPlayer from './components/FullScreenPlayer'
import { usePlayerStore } from './store/PlayerStore'

export default function App() {
  const {setTrack} =usePlayerStore();
  useEffect(()=>{
    async function setupPlayer(){
    try{
     await TrackPlayer.setupPlayer();
     console.log("setup up is done successfully");
     const currentTrack= await TrackPlayer.getActiveTrack();
     if(currentTrack){
      setTrack(currentTrack)
     }

     
     await TrackPlayer.updateOptions({
      capabilities:[
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        
      ]
     })

    }catch(e){
      Alert.alert("error while setting up the player")
    }
    
  }
  setupPlayer();

  },[])
  return (
    <>
<StatusBar backgroundColor='black'/>
 <SearchScreen/>
 <MiniPlayer />


 </>
  )
}