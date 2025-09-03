import {View, Text, Image, StyleSheet, TouchableOpacity, Alert, Pressable} from 'react-native';
import React from 'react';
import { player } from '../player/Player';
import { useNavigation ,useRoute} from '@react-navigation/native';
import { useModalStore } from '../store/ModalStore';
import PopUpScreen from '../screens/PopUpScreen';
function formatThumnail(song:any){

   if(song.thumbnails){
    return song.thumbnails[song.thumbnails.length-1].url;
   }
   if(song.thumbnail){
    return song.thumbnail[song.thumbnail.length-1].url;
   }
   return song.artwork;

  }

 function SongItem({song,clickedOne}:{song:any,clickedOne?:()=>void}) {

const {openModal} = useModalStore();
  return (
    <TouchableOpacity
    onPress={clickedOne}
    >


      <View style={styles.container}>
        <Image
          // source={{uri: song?.thumbnails?song?.thumbnails[song.thumbnails.length-1]?.url:song?.artwork}}
          source={{uri: formatThumnail(song)}}
          style={styles.artwork}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artists}
          </Text>
        </View>

        <Pressable style={styles.optionsButton} onPress={()=>{
            console.log(song)
          openModal(<PopUpScreen track={song}/>)

        }} >
          <Text style={styles.optionsText}>•••</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}
  export default React.memo(SongItem);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height:70,
    padding: 2,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor:'rbga(89,255,255,0.8)'

  },
  artwork: {
    width: 90,
    height: 70,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    color: 'white',

    fontSize: 13,
  fontFamily:'Rubik-Medium'
  },
  artist: {
    color: 'gra',
    fontSize: 10,
    fontFamily:'Rubik-SemiBoldItalic',
    marginTop: 4,
  },
  optionsButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  optionsText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
