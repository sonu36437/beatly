import { View, Text, Alert, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import SearchScreen from './screens/SearchScreen'
import TrackPlayer, { AppKilledPlaybackBehavior, Capability,Event } from 'react-native-track-player'
import MiniPlayer from './components/MiniPlayer'
import FullScreenPlayer from './components/FullScreenPlayer'
import { usePlayerStore } from './store/PlayerStore'
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
 import { createNativeStackNavigator } from '@react-navigation/native-stack'
 


const Stack= createNativeStackNavigator();

import MyTabs from './Navigation/AppNavigation'
import PopUpScreen from './screens/PopUpScreen'
import { RealmProvider } from '@realm/react'
import FavSong from './databases/FavSongDb'



export default function App() {
  const {setTrack,currentTrack} =usePlayerStore();

  useEffect(()=>{
    SystemNavigationBar.setNavigationColor('black');
    
    async function setupPlayer(){
    try{
     await TrackPlayer.setupPlayer();
     console.log("setup up is done successfully")
     await TrackPlayer.updateOptions({
      android:{
        appKilledPlaybackBehavior:AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification

      },
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
  useEffect(()=>{
   
    const listener= TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged,(event)=>{
      console.log(event.track);
      
      setTrack(event.track)
    })
    return ()=>{
      listener.remove();
    }
   
  },[])
  return (
    <>
    <RealmProvider schema={[FavSong]} schemaVersion={5}>
<StatusBar backgroundColor='black'/>
 {/* <SearchScreen/> */}
 <NavigationContainer theme={DarkTheme}>
 <Stack.Navigator screenOptions={{headerShown:false}}>
<Stack.Screen name="nav" component={MyTabs}/>

 </Stack.Navigator>
 </NavigationContainer>
 </RealmProvider>





 </>
  )
}