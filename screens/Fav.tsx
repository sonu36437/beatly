import { View, Text, Touchable, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { useQuery, useRealm } from '@realm/react'
import FavSong from '../databases/FavSongDb'
import SongItem from '../components/SongItem'
import { player } from '../player/Player'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Fav() {
  const songs= useQuery(FavSong).sorted("createdAt",true)
  const realm= useRealm();


  const handleSongItemClick = React.useCallback((index: number,item:any) => {
    player.playSong(index,item,"fav",songs)
  }, [songs]);



 const renderItem= ({item,index}:any)=>{
    return(
             <SongItem song={item}
                  clickedOne={()=>{
                    handleSongItemClick(index,item);
                  }}
        />

    )
 }
 if(songs.length===0){
    return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0, 0, 0, 0.8)'}}>
            <Text style={{color:'white',fontFamily:'Rubik-Bold'}}>No songs found</Text>
        </View>
    )
 }

  return (
    <SafeAreaView style={{flex:1,paddingHorizontal:10,
    // backgroundColor:'rgba(53, 1, 27, 0.8)'
    backgroundColor:'black'
    }}>
      
    <View >
       <FlatList
                   data={songs}
                   renderItem={renderItem}
                   keyExtractor={(item,index)=> item.id+index}
                  initialNumToRender={30}
              maxToRenderPerBatch={5}
                   windowSize={10}
                   removeClippedSubviews={true}
                   onEndReachedThreshold={0.8}
                   contentContainerStyle={{paddingBottom: 200}}
                   
                   getItemLayout={(item,index)=>{
                     return{
                       length:94,
                       offset:94*index,
                       index:index
                     }
                   }}
                   bounces={true}
                   bouncesZoom={true}

                 />
      </View>
 

   </SafeAreaView>

  )
}
