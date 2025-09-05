
import React, { useEffect, useState } from 'react'
import { isSongDownloaded } from '../utils/ButtonsActions';
import { useRealm } from '@realm/react';

export default function useSongInDownload(song:any) {

    
   

    const [isInDownload,setIsInDownload]=useState(false);
    const realm=useRealm();
    const updateState=()=>{
 setIsInDownload(isSongDownloaded(realm,song?.id));

    }
 


    useEffect(()=>{
        updateState();
     
    },[isInDownload,song]);
    return [isInDownload,updateState];



}