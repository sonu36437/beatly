// services/FavoritesService.ts
import { Realm } from '@realm/react';
import FavSong from '../databases/FavSongDb';
import DownloadDB from '../databases/DownloadDb';
import { Alert, ToastAndroid } from 'react-native';



export const addToFavorites = (realm: Realm, track: {
  id: string;
  title: string;
  artists: string|"unknown";
  thumbnail: string;
},setState?:()=>void) => {
  console.log(track);
  try {
    realm.write(() => {
      realm.create(
        'FavSong',
        FavSong.generate(track.id, track.title, track.artists, track.thumbnail),
        Realm.UpdateMode.Modified 
      );
    });
    ToastAndroid.show('Added to favorites', ToastAndroid.SHORT);
setState?.();
    return true;
  } catch (e) {
    console.error("Error adding to favorites:", e);
    return false;
  }
};
export const pushToDownloads=(realm: Realm,track:any)=>{
  if(!track.artist){
    track.artist="unknown";

  }
  try{
    realm.write(()=>{
      realm.create(
        'DownloadDB',
        DownloadDB.generate(track.id,track.title,track.artist,track.thumbnail,track.url),
        Realm.UpdateMode.Modified 

      )
    })
  }
  catch (e) {
    console.error("Error pushing db:", e);
  
  }
}


export const removeFromFavorites = (realm: Realm, trackId: string,setState?:()=>void) => {
  try {
    realm.write(() => {
      const song = realm.objectForPrimaryKey('FavSong', trackId);
      if (song) {
        realm.delete(song);
      }
    });
    ToastAndroid.show('removed from favorites', ToastAndroid.SHORT);
   setTimeout(()=>{
       setState?.();
   },100)
    return true;
  } catch (e) {
    console.error("Error removing from favorites:", e);
    return false;
  }
};


export const isFavorite = (realm: Realm, trackId: string): boolean => {
  try {
    return realm.objectForPrimaryKey('FavSong', trackId) !== null;
  } catch (e) {
    console.error("Error checking favorites:", e);
    return false;
  }
};
export const isSongDownloaded=(realm:Realm,trackId:string):boolean=>{
  try{
    return realm.objectForPrimaryKey('DownloadDB',trackId) !== null;

 
  }catch(e){
    console.log(e);

  }
  return false;
}


export const getAllFavorites = (realm: Realm) => {
  try {
    return realm.objects('FavSong');
  } catch (e) {
    console.error("Error fetching favorites:", e);
    return [];
  }
};
