import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress, Event} from 'react-native-track-player';
import {usePlayerStore} from '../store/PlayerStore';
import {PauseButton, PlayButton} from './MiniPlayer';
import {player} from '../player/Player';
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

export default function FullScreenPlayer({currentTrack}: any) {
  const progress = useProgress();
  const {togglePlayPause, isPlaying} = usePlayerStore();
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
        
        <Text style={styles.title} numberOfLines={2}>
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
          <TouchableOpacity onPress={() => player.playPrevious()} style={styles.roundButton}>
            <View style={styles.prevTriangle} />
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => {
              isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
            }}
            style={[styles.roundButton, { backgroundColor: '#fff' }]}
          >
            {isPlaying ? <PauseButton size={40} /> : <PlayButton size={40} />}
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => player.playNext()} style={styles.roundButton}>
            <View style={styles.nextTriangle} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Favourite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}> Repeat</Text>
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
      paddingTop: 60,
    },
    img: {
      height: 280,
      width: 400,
      borderRadius: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
    },
    title: {
      color: 'white',
      fontSize: 22,
      fontFamily: 'Rubik-Bold',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    sliderWrapper: {
      width: '90%',
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
      fontFamily: 'Rubik-Regular',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '60%',
      alignItems: 'center',
      marginBottom: 40,
    },
    roundButton: {
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
      width: 0,
      height: 0,
      borderRightWidth: 14,
      borderTopWidth: 10,
      borderBottomWidth: 10,
      borderRightColor: '#fff',
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
      paddingHorizontal: 10,
      marginBottom:10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
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