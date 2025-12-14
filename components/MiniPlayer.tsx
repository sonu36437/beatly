import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Button,
    Alert,
    ActivityIndicator,
  } from 'react-native';
  import React, { useCallback, useEffect, useState } from 'react';
  import { BlurView } from '@react-native-community/blur';
  import { usePlayerStore } from '../store/PlayerStore';
  import TrackPlayer, { Event, State, usePlaybackState } from 'react-native-track-player';
  import FullScreenPlayer from './FullScreenPlayer';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingIndicatior from './LoadingIndicatior';
import LinearGradient from 'react-native-linear-gradient';
  
 export function PlayButton({size=30}:{size:number}) {

    return (
      <View style={{ backgroundColor: 'red', height: size, width: size }} />
    );
  }
  
  export function PauseButton({size=20}:{size:number}) {
    return (
      <View
        style={{
          backgroundColor: '#75fd71',
          height: size,
          width: size,
          borderRadius: 100,
        }}
      />
    );
  }
  
  export default function MiniPlayer({ song }: any) {
    const { isPlaying, currentTrack, setTrack, togglePlayPause } = usePlayerStore();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const inset= useSafeAreaInsets();
    const playerStatus= usePlaybackState();
  
    useEffect(() => {
      const listener = TrackPlayer.addEventListener(
        Event.PlaybackState,
        async event => {
          event.state === 'playing'
            ? togglePlayPause(true)
            : togglePlayPause(false);
        },
      );
      return () => {
        listener.remove();
      };
    }, [currentTrack]);
  
    return (
      <>
        <TouchableOpacity 
         onPress={()=>{
         setIsFullScreen(!isFullScreen)
            
         }}
          style={[styles.container,{bottom:72+inset.bottom}]}
        >
            <View style={[StyleSheet.absoluteFill,{flex:1}]}>
               <Image 
            source={
              currentTrack?.artwork 
                ? { uri: currentTrack.artwork }   
                : require("../logo.jpg")        
            } 
            style={StyleSheet.absoluteFill}
             
            blurRadius={50}
          />
            <LinearGradient
              colors={[
                 'rgba(0,0,0,0.8)', 
                 'rgba(0,0,0,0.7)',
                'rgba(0, 0, 0, 0.8)',  // bottom (dark)
                
                // top (transparent)
              ]}
              // start={{ x: 0.5, y: 1 }}
              // end={{ x: 0.5, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
                </View>
        
            <View style={styles.blurWrapper}>
            
     
              <View style={styles.content}>
                <Image
                  source={{ uri: currentTrack?.artwork  }}
                  style={styles.image}
                />
                <View style={{ width: '55%', marginRight: 15 }}>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {currentTrack?.title || 'Unknown Title'}
                  </Text>
                  <Text style={{color:'gray',fontFamily:'Rubik-Regular',fontSize:12}} numberOfLines={1}>
                    {currentTrack?.artist || currentTrack?.artists || 'Unknown Artist'}
                  </Text>
                </View>
          { playerStatus.state ==State.Buffering? <ActivityIndicator color="white" size={30}/>:
                 <TouchableOpacity
                  onPress={() => {
                    if (isPlaying) {
                      TrackPlayer.pause();
                    } else {
                      TrackPlayer.play();
                    }
                  }}
                  style={{padding:10,marginRight:20}}
                
                >
                  {isPlaying ? <MaterialCommunityIcons name="pause" size={30} color="white" /> : <MaterialCommunityIcons name="play" size={30} color="white"/>}
                </TouchableOpacity> }
                
              </View>
            </View>
      
        </TouchableOpacity>
        <Modal visible={isFullScreen} animationType='slide'  onRequestClose={()=>{
            setIsFullScreen(false)
        }} >
            <FullScreenPlayer currentTrack={currentTrack} visible={setIsFullScreen}/>
        </Modal>
      
     
        
         
    
      </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
   
      width: '100%',
      height: 90,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      zIndex: 1,
      elevation: 1, 
      // backgroundColor:"rgba(52, 2, 34, 0.4)"
      backgroundColor:'black'
    },
    blurWrapper: {
      flex: 1,
      borderRadius: 20,
      overflow: 'hidden',
      justifyContent: 'center',
      paddingHorizontal: 15,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 90,
      height: 60,
      borderRadius: 10,
      marginRight: 15,
    },
    text: {
      color: 'rgba(216, 246, 163, 1)',
      fontFamily: 'Rubik-SemiBold',
      fontSize: 12,
    },
  });
  