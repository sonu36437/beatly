import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useCallback } from 'react'
import { useQuery } from '@realm/react'
import DownloadDB from '../databases/DownloadDb';
import SongItem from '../components/SongItem';
import { player } from '../player/Player';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Downloads() {
  const songs = useQuery(DownloadDB);
  console.log(songs);
  const handleSongItemClick = React.useCallback((index: number, item: any) => {
    player.playSong(index, item, "downloads", songs)
  }, [songs]);
  const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
    return (
      <SongItem song={item}
        clickedOne={() => {
          handleSongItemClick(index, item);
        }}
      />

    )

  }, [songs])
  if (songs.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 1)' }}>
        <Text style={{ color: 'white', fontFamily: 'Rubik-Bold' }}>No songs found</Text>
      </View>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: 'black' }}>
      <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 25, color: 'white', paddingHorizontal: 10, paddingTop: 15 }}>Downloads</Text>

      <View >
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index}
          initialNumToRender={30}
          maxToRenderPerBatch={5}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          removeClippedSubviews={true}
          overScrollMode='always'
          onEndReachedThreshold={0.8}
          contentContainerStyle={{ paddingBottom: 200, paddingTop: 20 }}

          getItemLayout={(item, index) => {
            return {
              length: 94,
              offset: 94 * index,
              index: index
            }
          }}
          bounces={true}
          bouncesZoom={true}

        />
      </View>


    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,

  }
})