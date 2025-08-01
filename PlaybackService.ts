import TrackPlayer, {Event} from 'react-native-track-player'
import { player } from './player/Player';
import { Alert } from 'react-native';
export const PlaybackService= async function(){
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () =>   player.playNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => player.playPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));
  
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () =>player.playNext());
  
    


}