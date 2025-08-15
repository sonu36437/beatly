import TrackPlayer from "react-native-track-player";
import { innertube } from "..";


class Player{
  private queue=[];
  private currentIndex:number;
  public playingFromScreen:string;
  public currentSongId:string|undefined;
  private suggestedSongQueue=[]

  constructor(){
    this.currentIndex=-1;
    this.queue=[];
    this.suggestedSongQueue=[];
    this.playingFromScreen="";
  }
  public playSong(index:number,songId:string,screen:string,currentScreenAllSongs:[]){
    console.log("this is form playsong ",this.getItemFromParticularIndex(index));

    this.currentSongId!==songId?this.resetTheQueue() : null;
    this.playingFromScreen!==screen? this.resetTheQueue() : null;
    this.currentSongId=songId;
    this.currentIndex=index;
  if(this.getQueueLength()==0 || this.getQueueLength()<index){
    this.addToQueue(currentScreenAllSongs);
}
  this.resetAndPlay(songId);
    console.log("currentIndex ",this.currentIndex, " index ",index );

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
        artwork: song?.thumbnails?song?.thumbnails[0]?.url:song?.artwork,

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
