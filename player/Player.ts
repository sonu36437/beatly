import TrackPlayer from "react-native-track-player";
import { innertube } from "..";
import { Alert } from "react-native";

class Player{
  private queue=[];
  private currentIndex:number;
  
  constructor(){
    this.currentIndex=-1;
  }
  public playSong(index:number,currentsongId?:string){

   this.currentIndex=index;
   const song= this.queue[index];
  
   this.resetAndPlay(song)

  }
  public getItemFromParticularIndex(index:number){
    return this.queue[index];
  }
  public resetTheQueue(){
    this.queue=[]
  }
  public async resetAndPlay(song:any){
    const response = await innertube.player(song.id);
    const audioOnlyLink=response.filter((item:any)=>{
        return item.mimeType.includes("audio/webm")

     })
    
   await TrackPlayer.reset()
     await TrackPlayer.add({
        id: song.id,
        url: audioOnlyLink[audioOnlyLink.length-1].url,
        title: song.title,
        artist: song.artists,
        artwork: song.thumbnails[0].url,
       
    });
   await TrackPlayer.play()
   return;

  }
  public addToQueue(songs:[]){
    console.log("called addtoquer:" + this.queue.length)
    const slicedSong=songs.slice(this.queue.length,songs.length)

    this.queue.push(...slicedSong);
  }
   
  public playNext(){
    console.log("called next");
    this.currentIndex=this.currentIndex+1;
    this.resetAndPlay(this.queue[this.currentIndex%this.queue.length])
  }
 
  public playPrevious(){
    this.currentIndex=this.currentIndex-1;
    console.log("called previous");
    
    this.resetAndPlay(this.queue[this.currentIndex%this.queue.length])
  }
  public getQueueLength(){
    return this.queue.length;
}
public getCurrentIndex(){
    return this.currentIndex;
}

}
export const player= new Player();