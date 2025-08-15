import { View, Text, Touchable, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useQuery, useRealm } from '@realm/react'
import FavSong from '../databases/FavSongDb'
import SongItem from '../components/SongItem'
import { player } from '../player/Player'

export default function Fav() {
  const songs= useQuery(FavSong)
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
        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'black'}}>
            <Text style={{color:'white',fontFamily:'Rubik-Bold'}}>No songs found</Text>
        </View>
    )
 }

  return (
    <>
    <View style={{flex:1,paddingHorizontal:10}}>

       <FlatList
                   data={songs}
                   renderItem={renderItem}
                   keyExtractor={(item,index)=> item.id+index}
                   initialNumToRender={50}
                   maxToRenderPerBatch={50}
                   contentContainerStyle={{paddingBottom: 200, paddingTop: 80}}
                   getItemLayout={(item,index)=>{
                     return{
                       length:100,
                       offset:100*index,
                       index:index
                     }
                   }}


                   bounces={true}
                   bouncesZoom={true}

                 />
      </View>


    </>

  )
}
