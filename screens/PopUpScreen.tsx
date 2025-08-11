import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import { BlurView } from '@react-native-community/blur'
import { useRealm } from '@realm/react'
import FavSong from '../databases/FavSongDb'
import { useModalStore } from '../store/ModalStore'

function PopUpScreen({ track }: any) {
  const realm = useRealm();
  const { closeModal } = useModalStore();
  const [isClosing, setIsClosing] = useState(false);
  
  // Create plain JS object from track data
  const trackData = useMemo(() => {
    if (!track) return null;
    return {
      id: track.id,
      title: track.title,
      artists: track.artists || "",
      artwork: track.artwork,
      thumbnail: track.thumbnails?.[0]?.url || track.artwork
    };
  }, [track]);


  const isLiked = useMemo(() => {
    if (!trackData?.id) return false;
    try {
      return realm.objectForPrimaryKey('FavSong', trackData.id) !== null;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [trackData?.id, realm]);

  const AddToFav = () => {
    if (!trackData) return;
    try {
      realm.write(() => {
        realm.create('FavSong', FavSong.generate(
          trackData.id,
          trackData.title,
          trackData.artists,
          trackData.thumbnail
        ));
      });
    } catch (e) {
      console.log(e);
    }
    finally{
      closeModal();
    }
  };

  const RemoveFromFav = () => {
    if (!trackData?.id) return;
    try {
      realm.write(() => {
        const song = realm.objectForPrimaryKey('FavSong', trackData.id);
        if (song) {
          realm.delete(song);
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
   
      setIsClosing(true);
    }
  };


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
          overlayColor=''
        />
        <View style={{alignItems:'center', padding:10}}>
          <Image 
            source={{ uri: trackData.thumbnail }} 
            height={80} 
            width={120} 
            style={{borderRadius:10}}
          />
        </View>
        <View style={{alignItems:'center',width:"100%",padding:10 ,gap:2}}>
          <Text style={{fontFamily:'Rubik-Bold' ,textAlign:'center' ,color:'white'}}>
            {trackData.artists}
          </Text>
          <Text style={{fontFamily:'Rubik-Bold' ,textAlign:'center',color:'rgba(255,255,255,0.7)'}}>
            {trackData.title}
          </Text>
        </View>
        <View style={{alignItems:'center',width:"100%",padding:10 ,gap:10}}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={isLiked ? RemoveFromFav : AddToFav}
          >
            <Text style={styles.buttonText}>
              {isLiked ? "Remove from fav" : 'Add to fav'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Play Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default PopUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  exit: {
    height: "50%",
    width: "100%",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    height: "50%",
    width: "100%",
    borderRadius: 10,
    overflow: 'hidden'
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 14, 
    borderRadius: 20,
    width: "50%"
  },
  buttonText: {
    color: 'white',
    textAlign: 'center', 
    fontFamily: 'Rubik-Bold'
  }
});