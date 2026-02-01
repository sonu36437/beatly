import TrackPlayer from "react-native-track-player";
import { innertube } from "..";



class Player {
  private queue = [];
  private currentIndex: number;
  public playingFromScreen: string;
  public currentSongId: string | undefined;
  private suggestedSongQueue: any = []
  private playNextActive: any;

  constructor() {
    this.currentIndex = -1;
    this.queue = [];
    this.suggestedSongQueue = [];
    this.playingFromScreen = "";
  }
  public playSong(index: number, songId: string, screen: string, currentScreenAllSongs: []) {
    console.log("this is form playsong ", this.getItemFromParticularIndex(index));

    this.currentSongId !== songId ? this.resetTheQueue() : null;
    this.playingFromScreen !== screen ? this.resetTheQueue() : null;
    this.currentSongId = songId;
    this.suggestedSongQueue = [];
    this.playingFromScreen = screen;
    this.currentIndex = index;
    if (this.getQueueLength() == 0 || this.getQueueLength() < index) {
      this.addToQueue(currentScreenAllSongs);
    }

    this.resetAndPlay(songId);
    console.log("currentIndex ", this.currentIndex, " index ", index);

  }

  public async playSingleAndGetSuggestions(song: any) {
    this.resetAndPlay(song);
    const videoId: string = song.id;
    const playlistId: string = song.playlistId;
    const suggestions = await innertube.fetchSimilarSongsOrPlaylist(videoId, playlistId);

    this.currentIndex = 0;
    this.suggestedSongQueue = suggestions;

    return;

  }
  private formatThumnail(song: any) {

    if (song.thumbnails) {
      return song.thumbnails[song.thumbnails.length - 1].url;
    }
    if (song.thumbnail) {
      return song.thumbnail[song.thumbnail.length - 1].url;
    }
    return song.artwork;

  }

  public getItemFromParticularIndex(index: number) {
    return this.queue[index];
  }
  public resetTheQueue() {
    this.queue = []
  }
  public async resetAndPlay(song: any) {
    console.log(song);

    const response = !song?.url ? await innertube.player(song.id) : song?.url;
    let audioOnlyLink;

    if (!song?.url) {
      audioOnlyLink = response.filter((item: any) => {
      return item.mimeType.includes("audio/mp4")
      });
    }
    await TrackPlayer.reset()
    await TrackPlayer.add({
      id: song.id,
      url: song.url ? song.url : audioOnlyLink[audioOnlyLink.length - 1]?.url,
      title: song.title,
      artist: song.artists,
      // artwork: song?.thumbnails?song?.thumbnails[0]?.url:song?.artwork,
      artwork: this.formatThumnail(song)


    });
    await TrackPlayer.play()
    return;

  }
  public setPlayNext(song: any) {
    this.playNextActive = song;
  }
  public addToQueue(songs: []) {
    console.log("called addtoquer:" + this.queue.length)
    const slicedSong = songs.slice(this.queue.length, songs.length)

    this.queue.push(...slicedSong);
  }

  public playNext() {
    console.log("called next");
    // if(this.playNextActive){
    //   this.resetAndPlay(this.playNext);
    //   this.playNextActive=null;
    //   return;
    // }
    if (this.suggestedSongQueue.length > 0) {
      this.currentIndex++;
      this.resetAndPlay(this.suggestedSongQueue[this.currentIndex % this.suggestedSongQueue.length])
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    this.resetAndPlay(this.queue[this.currentIndex % this.queue.length])
  }

  public playPrevious() {
    if (this.suggestedSongQueue.length > 0) {
      this.currentIndex--;
      this.resetAndPlay(this.suggestedSongQueue[this.currentIndex % this.suggestedSongQueue.length])
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    console.log("called previous");

    this.resetAndPlay(this.queue[this.currentIndex % this.queue.length])
  }
  public getQueueLength() {
    return this.queue.length;
  }
  public getCurrentIndex() {
    return this.currentIndex;
  }

}
export const player = new Player();
