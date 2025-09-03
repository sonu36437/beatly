import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress, Event, usePlaybackState, State} from 'react-native-track-player';
import {usePlayerStore} from '../store/PlayerStore';
import {player} from '../player/Player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Height, Width } from '../constants/ScreenProportion';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

export default function FullScreenPlayer({currentTrack}: any) {
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const {isPlaying, togglePlayPause} = usePlayerStore();
  

  const handlePlayPause = useCallback(async () => {
    try {
      if (playbackState.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }

      togglePlayPause(playbackState.state !== State.Playing);
    } catch (error) {
      console.error('Play/Pause error:', error);
    }
  }, [playbackState.state, togglePlayPause]);


  useEffect(() => {
    const subscription = TrackPlayer.addEventListener(
      Event.PlaybackState,
      async (event) => {
  
        if ((event.state === State.Playing) !== isPlaying) {
          togglePlayPause(event.state === State.Playing);
        }
      }
    );
    
    return () => subscription.remove();
  }, [isPlaying, togglePlayPause]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurRadius={20}
        blurAmount={10}
        overlayColor=""
      />
     
      <View style={styles.content}>
        <Image source={{ uri: currentTrack?.artwork }} style={styles.img} />
        
        <Text style={styles.title} numberOfLines={3}>
          {currentTrack?.title}
        </Text>
  
        <View style={styles.sliderWrapper}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.position}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#666"
            thumbTintColor="#fff"
            onSlidingComplete={value => {
              TrackPlayer.seekTo(value);
            }}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
            <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
          </View>
        </View>
  
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={() => player.playPrevious()} 
            style={styles.roundButton}
          >
            <MaterialCommunityIcons name="skip-previous" size={40} color="white" />
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={handlePlayPause}
            style={[styles.roundButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          >
            {playbackState.state === State.Buffering ? (
              <ActivityIndicator color="white" size="large" />
            ) : playbackState.state === State.Playing ? (
              <MaterialCommunityIcons name="pause" size={40} color="white" />
            ) : (
              <MaterialCommunityIcons name="play" size={40} color="white" />
            )}
          </TouchableOpacity>
  
          <TouchableOpacity 
            onPress={() => player.playNext()} 
            style={styles.roundButton}
          >
            <MaterialCommunityIcons name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="download" size={24} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="heart" size={24} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="repeat" size={24} color="white"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(52, 2, 34, 0.4)', 
      paddingTop:Height*0.01,
      
    },
    img: {
      height: 0.28*Height,
      width: 0.98*Width,
      borderRadius: 20,
      marginBottom: 20,
     
    },
    title: {
      color: 'white',
      fontSize: Dimensions.get("screen").fontScale*18,
      fontFamily: 'Rubik-Bold',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    sliderWrapper: {
      width:Width*0.90,
      alignItems: 'center',
      marginBottom: 30,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: -10,
    },
    timeText: {
      color: '#eee',
      fontSize: 14,
      fontFamily: 'Rubik-Bold',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '60%',
      alignItems: 'center',
      marginBottom: 40,
    },
    roundButton: {
      flexDirection:'row',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
    },
    prevTriangle: {
      borderRightWidth: 14,
      borderTopWidth: 10,
      borderBottomWidth: 10,
      borderRightColor: '#fefefeff',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    nextTriangle: {
      width: 0,
      height: 0,
      borderLeftWidth: 14,
      borderTopWidth: 10,
      borderBottomWidth: 10,
      borderLeftColor: '#fff',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    actionButtons: {
      width: '100%',
      paddingHorizontal: 20,
     position:'absolute',
     flexDirection:'row',
     justifyContent:'space-between',
     alignItems:'center',
     bottom:2
      
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 15,
      alignItems: 'center',
      marginBottom: 10,
      fontFamily:'Rubik-Bold'
    },
    actionText: {
      fontSize: 14,
      color: 'white',
      fontFamily:'Rubik-Bold'
    },
  });       