import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress, Event, usePlaybackState, State, RepeatMode } from 'react-native-track-player';
import { usePlayerStore } from '../store/PlayerStore';
import { player } from '../player/Player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Height, Width } from '../constants/ScreenProportion';
import { deleteParticularSong, downloadSong } from '../utils/ChunksDownload';
import { addToFavorites, isFavorite, isSongDownloaded, pushToDownloads, removeFromFavorites } from '../utils/ButtonsActions';
import { useRealm } from '@realm/react';
import useIsSongLiked from '../hooks/UseIsSongLiked';
import useSongInDownload from '../hooks/UseSongInDownload';
import useRepeatMode from '../hooks/useRepeatMode';
import localImageLink from '.././images/first'
import { play } from 'react-native-track-player/lib/src/trackPlayer';
import { useNavigation } from '@react-navigation/native';
import Modal from './Modal';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

export default function FullScreenPlayer({ currentTrack ,visible }: any) {

  const realm = useRealm();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [repeatMode, repeat] = useRepeatMode()
  const [isSongLiked, toggleFav] = useIsSongLiked(currentTrack);
  const trackData = useMemo(() => {
    if (!currentTrack) return null;
    return {
      id: currentTrack.id,
      title: currentTrack.title,
      artists: currentTrack.artists || '',
      artwork: currentTrack.artwork,
      thumbnail: currentTrack.thumbnails?.[0]?.url || currentTrack.artwork,
    };
  }, [currentTrack]);

  const { isPlaying, togglePlayPause } = usePlayerStore();
  const [isInDownload, updateState] = useSongInDownload(trackData);
  const navigation =useNavigation();

const handlePlayPause= async()=>{
   isPlaying?await TrackPlayer.pause():
   await TrackPlayer.play();
}


  const handleRepeatMode = async () => {

    // await repeat(!repeat);
    await repeat(!repeatMode);




  }

  const handleDownload = async () => {

    console.log("form handleDownload button ", currentTrack)
    if (isInDownload) {
      deleteParticularSong(realm, currentTrack);
    }
    const res = await downloadSong({ song: currentTrack });
    if (res) {
      pushToDownloads(realm, res);
      ToastAndroid.show("Downloaded", ToastAndroid.SHORT);
      updateState();

    }

  }
  const handleFavToggle = () => {

    toggleFav();

  };


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
    { Platform.OS=== "ios" && <TouchableOpacity style={{backgroundColor:'red',height:20,width:20, padding:40}} onPress={()=>{
       visible()
      }}>
         <Text>click me</Text>
      </TouchableOpacity>}

      <View style={styles.content}>
<Image 
  source={
    currentTrack?.artwork 
      ? { uri: currentTrack.artwork }   
      : require("../logo.jpg")        
  } 
  style={styles.img} 
/>

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
            <MaterialCommunityIcons name="skip-previous" size={70} color="white" />
          </TouchableOpacity>

      
{
   playbackState.state==State.Buffering?
   <ActivityIndicator color="white" size={40}/>:
          <TouchableOpacity onPress={handlePlayPause}>
            {
          isPlaying?
                <MaterialCommunityIcons name="pause" size={70} color="white" />
                :
                 <MaterialCommunityIcons name="play" size={70} color="white" />
                
            }
          </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => player.playNext()}

          >
            <MaterialCommunityIcons name="skip-next" size={70} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}
            onPress={() => {
              if (isInDownload) {
                ToastAndroid.show("already in download", ToastAndroid.SHORT);
                return;
              }
              handleDownload();

            }}
          >
            <MaterialCommunityIcons name="download" size={24} color={isInDownload ? "rgba(78, 77, 77, 1)" : "rgba(94, 255, 0, 1)"} />
            <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 10 }}>{isInDownload ? "Downloaded" : "Download"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => { handleFavToggle() }}>
            <MaterialCommunityIcons name="heart" size={24} color={isSongLiked ? "red" : "white"} />
            <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 10 }}>{isSongLiked ? "Liked" : "Like"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleRepeatMode}>
            <MaterialCommunityIcons name="repeat" size={24} color={repeatMode ? "rgba(94, 255, 0, 1)" : "white"} />
            <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 10 }}>{repeatMode ? "Repeat on" : "Repeat off"}</Text>
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
    // backgroundColor: 'rgba(52, 2, 34, 0.4)', 
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: Height * 0.01,

  },
  img: {
    height: 0.28 * Height,
    width: 0.98 * Width,
    borderRadius: 20,
    marginBottom: 20,

  },
  title: {
    color: 'white',
    fontSize: Dimensions.get("screen").fontScale * 18,
    height:Height*0.08,
    fontFamily: 'Rubik-Bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sliderWrapper: {
    width: Width * 0.90,
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
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 2

  },
  actionButton: {
    // backgroundColor: 'rgba(255,255,255,0.1)',
    height: 60,
    width: 100,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    fontFamily: 'Rubik-Bold'
  },
  actionText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Rubik-Bold'
  },
});       