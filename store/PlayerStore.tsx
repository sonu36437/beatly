import { create } from "zustand";


interface PlayerState {
  isPlaying: boolean;
  currentTrack: object | null;
  setTrack: (track: object) => void;
  togglePlayPause: (state:boolean) => void;

}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTrack: null,
  setTrack: (track) => set({ currentTrack: track }),
  togglePlayPause: (state) => set({isPlaying:state}),
}));
