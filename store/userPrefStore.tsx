import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Alert, ToastAndroid } from 'react-native';
import {RemoveCache} from '../utils/Storage'




type PreferenceStore = {
  categories: string[];
  artists: [key:string][];
  selectedCategories: string[];
  selectedArtists: string[];
  loading: boolean;
  error: string | null;
  selectionCount:number;
  fetchPreferences: () => Promise<void>;
  toggleCategory: (pref:string ) => void;
  // toggleArtist: (pref:string) => void;
};

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set, get) => ({
      categories: [],
      artists: [],
      selectedCategories: [],
      selectedArtists: [],
      loading: false,
      selectionCount:0,
      
      error: null,

   
      fetchPreferences: async () => {
        try {
          set({ loading: true, error: null });

          const response = await fetch(
            'https://raw.githubusercontent.com/sonu36437/UserSongPref/refs/heads/main/pref.json'
          );

          const data = await response.json();

          set({
            categories: data.categories || [],
            artists: data.artists || [],
         
          });
        } catch (error) {
          console.error('Failed to fetch preferences:', error);
          set({ error: 'Failed to fetch preferences' });
        } finally {
          set({ loading: false });
        }
      },

    
       toggleCategory: (pref) => {
        const { selectedCategories, selectionCount } = get();
        const exists = selectedCategories.includes(pref);

        if (exists) {
          set({
            selectedCategories: selectedCategories.filter((p) => p !== pref),
           selectionCount: Math.max(selectionCount - 1, 0),
             
          });
          RemoveCache("homePageData");
        } else {
          if(selectionCount>=10){
         ToastAndroid.show('Not more than 10 items', ToastAndroid.SHORT);
            return;
          };
          RemoveCache("homePageData");
          set({
            selectedCategories: [...selectedCategories, pref],
            selectionCount: selectionCount + 1,
            
          });
        }
      },

      
      //   toggleArtist: (pref) => {
      //   const { selectedArtists, selectionCount } = get();
      //   const exists = selectedArtists.includes(pref);

      //   if (exists) {
      //     set({
      //     selectedCategories: selectedCategories.filter((p) => p !== pref),
      //       selectionCount: Math.max(selectionCount - 1, 0),
      //     });
      //   } else {
      //      if(selectionCount>=2)return;
      //     set({
      //       selectedArtists: [...selectedArtists, pref],
      //       selectionCount: selectionCount + 1,
      //     });
      //   }
      // },
    }),
    {
      name: 'user-preference-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        selectedArtists: state.selectedArtists,
      }),
    }
  )
);
