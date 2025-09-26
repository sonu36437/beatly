import { View, Text, Alert, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import SearchScreen from './screens/SearchScreen'
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event } from 'react-native-track-player'
import MiniPlayer from './components/MiniPlayer'
import FullScreenPlayer from './components/FullScreenPlayer'
import { usePlayerStore } from './store/PlayerStore'
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'



const Stack = createNativeStackNavigator();

import MyTabs from './Navigation/AppNavigation'
import PopUpScreen from './screens/PopUpScreen'
import { RealmProvider } from '@realm/react'
import FavSong from './databases/FavSongDb'
import { SafeAreaView } from 'react-native-safe-area-context'
import UserInfoGatherScreen from './screens/UserInfoGatherScreen'
import DownloadDB from './databases/DownloadDb'



export default function App() {
  const { setTrack, currentTrack } = usePlayerStore();

  useEffect(() => {


    async function setupPlayer() {
      try {
        await TrackPlayer.setupPlayer({ autoHandleInterruptions: true,   maxCacheSize: 1024 * 100,
                waitForBuffer: true,});
        console.log("setup up is done successfully")
        await TrackPlayer.updateOptions({
          android: {
            
            alwaysPauseOnInterruption:true,
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
            

          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,


          ]
          

        })

      } catch (e) {
        console.log("some error occoured");

      }

    }
    setupPlayer();

  }, [])
  useEffect(() => {

    const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
      console.log(event.track);

      console.log(event.track);

      setTrack(event.track)
    })
    return () => {
      listener.remove();
    }

  }, [])
  return (
    <>




      <RealmProvider schema={[FavSong, DownloadDB]} schemaVersion={6}>



        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>


            <Stack.Screen name="nav" component={MyTabs} options={{
              contentStyle: { backgroundColor: 'black' }
            }} />




          </Stack.Navigator>
        </NavigationContainer>

      </RealmProvider>







    </>
  )
}