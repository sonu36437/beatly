import { useObject, useRealm } from "@realm/react";
import { addToFavorites, isFavorite, removeFromFavorites } from "../utils/ButtonsActions";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useIsSongLiked(song: any) {
  const realm = useRealm();
  const [isLiked, setIsLiked] = useState(false);
  const trackData = useMemo(() => {
        if (!song) return null;
        return {
          id: song.id,
          title: song.title,
          artists: song.artists || '',
          artwork: song.artwork,
          thumbnail: song.thumbnails?.[0]?.url || song.artwork,
        };
      }, [song]);



  useEffect(() => {
    if (!song?.id) {
      setTimeout(()=>{
        setIsLiked(false);
      })
      return;
    }
   
    setIsLiked(isFavorite(realm, song.id));
   
  }, [song?.id, realm]);
  const toggleFav=()=>{

    
    if(isLiked){
        removeFromFavorites(realm,trackData.id,()=>{
          
            setTimeout(()=>{
                setIsLiked(false)

            },100)
        
        })
    }
    else{
        addToFavorites(realm,trackData,()=>{
            setIsLiked(true);
        })
    }

  }
  return [isLiked,toggleFav];
}

