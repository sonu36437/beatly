import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Button,
    Alert,
  } from 'react-native';
  import React, { useCallback, useEffect, useState } from 'react';
  import { BlurView } from '@react-native-community/blur';
  import { usePlayerStore } from '../store/PlayerStore';
  import TrackPlayer, { Event } from 'react-native-track-player';
  import FullScreenPlayer from './FullScreenPlayer';
  
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
  
    useEffect(() => {
      const listener = TrackPlayer.addEventListener(
        Event.PlaybackActiveTrackChanged,
        async event => {
          setTrack(event.track);
        },
      );
      return () => {
        listener.remove();
      };
    }, []);
  
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
    }, []);
  
    return (
      <>
        <TouchableOpacity 
         onPress={()=>{
         setIsFullScreen(!isFullScreen)
            
         }}
          style={styles.container}
        >
        
            <View style={styles.blurWrapper}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurRadius={20}
                blurAmount={4}
                overlayColor=""
                reducedTransparencyFallbackColor="white"
              />
              <View style={styles.content}>
                <Image
                  source={{ uri: currentTrack?.artwork }}
                  style={styles.image}
                />
                <View style={{ width: '60%', marginRight: 15 }}>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {currentTrack?.title || 'Unknown Title'}
                  </Text>
                </View>
  
                <TouchableOpacity
                  onPress={() => {
                    if (isPlaying) {
                      TrackPlayer.pause();
                    } else {
                      TrackPlayer.play();
                    }
                  }}
                >
                  {isPlaying ? <PauseButton /> : <PlayButton />}
                </TouchableOpacity>
              </View>
            </View>
      
        </TouchableOpacity>
        <Modal visible={isFullScreen} animationType='slide'  onRequestClose={()=>{
            setIsFullScreen(false)
        }}>
            <FullScreenPlayer currentTrack={currentTrack}/>
        </Modal>
      
     
        
         
    
      </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 10,
      width: '100%',
      height: 90,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 20,
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
      color: 'white',
      fontFamily: 'Rubik-SemiBold',
      fontSize: 12,
    },
  });
  