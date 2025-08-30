import { create } from "zustand";


interface PlayerState {
  isPlaying: boolean;
  currentTrack: object | null;
  setTrack: (track: object) => void;
  togglePlayPause: (state:boolean) => void;
  isBuffering:boolean;
  setIsBuffering:(state:boolean)=>void;

}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isBuffering:true,
  currentTrack: null,
  setTrack: (track) => set({ currentTrack: track }),
  togglePlayPause: (state) => set({isPlaying:state}),
  setIsBuffering:(state)=>set({isBuffering:state})
}));
