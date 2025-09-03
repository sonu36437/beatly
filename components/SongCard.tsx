import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useModalStore } from '../store/ModalStore';
import PopUpScreen from '../screens/PopUpScreen';
import { player } from '../player/Player';

interface SongCardProps {
  song: any;
  index?: number;
  onPlay?: (index: number, song: any) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, index = 0, onPlay }) => {
  const { openModal } = useModalStore();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => {
         player.playSingleAndGetSuggestions(song);
      }}
    >   
      <Image
        source={{ uri: song?.thumbnails ? song.thumbnails[song.thumbnails.length - 1]?.url : song?.artwork }}
        style={styles.artwork}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{song.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{song.artists}</Text>
      </View>

      <Pressable
        style={styles.optionsButton}
        onPress={() => openModal(<PopUpScreen track={song} />)}
      >
        <Text style={styles.optionsText}>•••</Text>
      </Pressable>
    </TouchableOpacity>
  );
};

export default React.memo(SongCard);

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: 'rgba(125, 125, 125, 0.3)',
    borderRadius: 12,
    margin: 8,
    padding: 8,
 
  },
  artwork: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Rubik-Medium',
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    marginTop: 2,
  },
  optionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
  },
  optionsText: {
    color: '#fefefeff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
