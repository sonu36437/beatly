
import React, { useEffect, useState } from 'react'
import { Alert, ToastAndroid } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

export default function useRepeatMode() {
    const [isRepeat,setIsRepeat]=useState<boolean>(false);
    async function checkRepeatMode(){
        
   
    const mode= await TrackPlayer.getRepeatMode()
     if(mode===0){
        setIsRepeat(false)
     }
     else if(mode===1){
        setIsRepeat(true)
        
     }
    
    
       
         
         
    }
    useEffect(()=>{
        checkRepeatMode();
     
        

        
    },[isRepeat])
    
   async  function repeat(repeat:boolean){
        if(repeat){
          
            
            await TrackPlayer.setRepeatMode(RepeatMode.Track);
            setIsRepeat(true);
            ToastAndroid.show("Repeat ON",ToastAndroid.SHORT);
            
        }else{
            await TrackPlayer.setRepeatMode(RepeatMode.Off);
         
            
            setIsRepeat(false);
              ToastAndroid.show("Repeat OFF",ToastAndroid.SHORT);


        }

    }
    return [isRepeat,repeat];




  
}