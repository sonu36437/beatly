import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ToastAndroid, Dimensions } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { BlurView } from '@react-native-community/blur';
import { useRealm } from '@realm/react';
import { useModalStore } from '../store/ModalStore';
import { Height, Width } from '../constants/ScreenProportion';
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  pushToDownloads,
  isSongDownloaded,
} from "../utils/ButtonsActions"
import { wrapMigration } from 'realm';
import Download from '../utils/Download';
import { downloadFile } from 'react-native-fs';
import { deleteParticularSong, downloadSong } from '../utils/ChunksDownload';
import useIsSongLiked from '../hooks/UseIsSongLiked';
import useSongInDownload from '../hooks/UseSongInDownload';
import { player } from '../player/Player';

function PopUpScreen({ track }: any) {
  const realm = useRealm();
  const { closeModal } = useModalStore();

  const trackData = useMemo(() => {
    if (!track) return null;
    return {
      id: track.id,
      title: track.title,
      artists: track.artists || '',
      artwork: track.artwork,
      thumbnail: track.thumbnails?.[0]?.url || track.artwork,
    };
  }, [track]);

  const [liked, toggleFav] = useIsSongLiked(track);
  const [isInDownload] = useSongInDownload(track);

  const handleFavToggle = () => {
    toggleFav();
     setTimeout(()=>{
      closeModal();

     },60)
  };

  const handleDownload = async () => {
    if (isInDownload) {
      deleteParticularSong(realm, track);
    }
     closeModal();
    
    const res = await downloadSong({ song: track });
     
    if (res) {
      pushToDownloads(realm, res);
    }
  
  }

  if (!trackData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.exit}
        onPress={closeModal}
      />

      <View style={styles.content}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurAmount={10}
          blurRadius={20}
          overlayColor=""
        />

        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: trackData.thumbnail }}
            style={{ height: Height*0.1, width: 120, borderRadius: 10 }}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <Text
            style={{
              fontFamily: 'Rubik-Bold',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {trackData.artists}
          </Text>
          <Text
            style={{
              fontFamily: 'Rubik-Bold',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 1)',
              fontSize:Dimensions.get("screen").fontScale*14
            }}
          >
            {trackData.title}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            padding: 10,
            gap: 10,
          }}
        >
          <TouchableOpacity style={styles.actionButton} onPress={handleFavToggle}>
            <Text style={[styles.buttonText, { color: liked ? "red" : "green" }]}>
              {liked ? 'Remove from fav' : 'Add to fav'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Text style={styles.buttonText}>{isInDownload ? "Delete" : "Download"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}
            onPress={() => {
              player.setPlayNext(track);
              ToastAndroid.show("will be played next", ToastAndroid.SHORT);
              closeModal();
            }}
          >
            <Text style={styles.buttonText}>Play Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default React.memo(PopUpScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  exit: {
    height: '50%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    height: Height * 0.5,
    width: Width * 1,
    paddingTop: Height * 0.01,
    borderRadius: 10,
    
   
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent:'center',
    borderRadius: 20,
    width: '60%',
    height:"20%",
    
  },
  buttonText: {
    color: "black",
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
    fontSize:Dimensions.get("screen").fontScale*12
  },
});