import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { innertube } from '..';
import TrackPlayer from 'react-native-track-player';

export default function SongItem({song, index}: any) {
const playThisSong=async()=>{
    const songId:string=song.id;
    const response=await innertube.player(songId);
     const audioOnlyLink=response.filter((item:any)=>{
        return item.mimeType.includes("audio/webm")

     })
     console.log(audioOnlyLink[audioOnlyLink.length-1].url);
     

    await TrackPlayer.reset();
     await TrackPlayer.add({
        id: song.id,
        url: audioOnlyLink[audioOnlyLink.length-1].url,
        title: song.title,
        artist: song.artists,
        artwork: song.thumbnails[0].url,
       
    });
    await TrackPlayer.play();
     
     
   
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
          <Text style={styles.title} numberOfLines={1}>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  artwork: {
    width: 100,
    height: 55,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  artist: {
    color: '#a0a0a0',
    fontSize: 10,
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
