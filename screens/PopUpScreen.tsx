import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
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
} from "../utils/ButtonsActions"
import { wrapMigration } from 'realm';
import Download from '../utils/Download';
import { downloadFile } from 'react-native-fs';
import { deleteAllDownloads, downloadSong } from '../utils/ChunksDownload';

function PopUpScreen({ track }: any) {
  const realm = useRealm();
  const { closeModal } = useModalStore();
  const [isClosing, setIsClosing] = useState(false);


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


  const liked = useMemo(() => {
    if (!trackData?.id) return false;
    return isFavorite(realm, trackData.id);
  }, [trackData?.id, realm]);


  const handleFavToggle = () => {
    if (!trackData) return;
    if (liked) {
      removeFromFavorites(realm, trackData.id);
      setTimeout(() => {
        closeModal();

        
      }, 100);
      
    } else {
      addToFavorites(realm, trackData);
       closeModal();
    }
   
  };
 const handleDownload=async ()=>{
  closeModal();
  console.log("form handleDownload button ",track)
const res= await  downloadSong({song:track});

 if (res){
    pushToDownloads(realm,res); 
 }
  
 }
  useEffect(() => {
    if (isClosing) {
      closeModal();
    }
  }, [isClosing]);

  if (!trackData || isClosing) {
    return null;
  }

  return (
    
    <View style={styles.container}>
      <StatusBar hidden={true}/>

   
      <TouchableOpacity
        style={styles.exit}
        onPress={() => {
          setIsClosing(true);
        }}
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
            height={80}
            width={120}
            style={{ borderRadius: 10 }}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            gap: 2,
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
              color: 'rgba(255,255,255,0.7)',
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
            <Text style={styles.buttonText}>
              {liked ? 'Remove from fav' : 'Add to fav'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={()=>{
             handleDownload(track)
          }}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} 
          onPress={()=>{
            deleteAllDownloads(realm);
          }}
          >
            <Text style={styles.buttonText}>Play Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default PopUpScreen;

const styles = StyleSheet.create({
  container: {
   width: "100%",
   height: "100%"
    
  },
  exit: {
    height: '50%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    height: Height * 0.5,
    width: Width * 1,
    paddingTop: Height * 0.03,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionButton: {
    backgroundColor: 'rgba(193, 38, 38, 0.5)',
    padding: '3%',
    borderRadius: 20,
    width: '50%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
  },
});
