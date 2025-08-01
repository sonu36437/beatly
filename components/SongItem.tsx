import {View, Text, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import { player } from '../player/Player';

 function SongItem({song, index,handleAddToQueue}:{song:any,index:number,handleAddToQueue:()=>void}) {

    
const playThisSong=async()=>{

  if(player.getItemFromParticularIndex(index)?.id!==song.id){
    player.resetTheQueue();

  }
  handleAddToQueue();
  player.playSong(index);
 
}

  return (
    <TouchableOpacity
    onPress={playThisSong}
    >
    
   
      <View style={styles.container}>
        <Image
          source={{uri: song.thumbnails[0].url}}
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

        <TouchableOpacity style={styles.optionsButton}>
          <Text style={styles.optionsText}>•••</Text>
        </TouchableOpacity>
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
