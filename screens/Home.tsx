import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { innertube } from '../index';
import { CheckForUpdate } from '../utils/CheckForUpdate';
import SongCard from '../components/SongCard';
import LoadingIndicator from '../components/LoadingIndicatior';
import UserPreference from './UserPreference';
import { usePreferenceStore } from '../store/userPrefStore';
import { SearchResult } from 'onlynativetube/utils/parsers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CacheData, GetCache, HasValidCache } from '../utils/Storage';
import Modal from '../components/Modal';
import SuggestionModel from '../components/SuggestionModel';

const DEFAULT_CATEGORIES = ["Trending songs","Top English","Bollywood Hits","Hollywood Hits"];


const Stack = createNativeStackNavigator();

interface SearchResponse {
  results: SearchResult[];
  continuationToken?: string;
}

export default function Home() {
  return (
    <Stack.Navigator initialRouteName="HomeFirst">
      <Stack.Screen
        name="HomeFirst"
        component={HomeFirst}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="userPref"
        component={UserPreference}
        options={{
          animation: 'slide_from_right',
          headerShown: true,
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: '#fff',
          headerTitle: 'Choose Preferences',
        }}
      />
    </Stack.Navigator>
  );
}

function HomeFirst() {
  const navigation = useNavigation();
  const { selectedCategories } = usePreferenceStore();
  const [songs, setSongs] = useState<SearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [wish, setWish] = useState('');
  const [modalVisible,setModalVisible]=useState(false);

  const wishUser = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning 🌞';
    if (hour >= 12 && hour < 17) return 'Good Afternoon ☀️';
    if (hour >= 17 && hour < 22) return 'Good Evening 🌇';
    return 'Hey night owl, sleep now ⏰';
  };

  const fetchSongs = async () => {
  setLoading(true);
  setSongs([]);
  const haveCache= await GetCache("homePageData");
  const isValid= await HasValidCache("homePageData")
  if(haveCache && isValid){
    console.log("using cache");
    
    setSongs(haveCache);
    return;

  }


  

  const activeCategories =
    selectedCategories.length > 0 ? selectedCategories : DEFAULT_CATEGORIES;
   

  try {
   
    const responses = await Promise.all(
      activeCategories.map(async (category) => {
        try {
          const res: SearchResponse = await innertube.search(category+" songs");
       
       
          return res;
        } catch (error) {
          console.log('Error fetching:', category, error);
          return { results: [] };
        }
      })
    );

 
    setSongs(responses);
    await CacheData({key:'homePageData',data:responses,validity:24*7});
  } catch (err) {
    console.log('Error in fetchSongs:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setWish(wishUser());
    if (Platform.OS === 'android') CheckForUpdate();
  }, []);

useEffect(()=>{
  console.log(selectedCategories.length);
  
 const checkModalTimeout = setTimeout(() => {
    if (selectedCategories.length <= 0) {
      setModalVisible(true);
    }
  }, 1000);
 const timeOut=setTimeout(() => {
  fetchSongs();
  
 }, 500);
 return()=>{
  clearTimeout(timeOut);
  clearTimeout(checkModalTimeout);
  
 }
},[selectedCategories])

  const renderItem = ({ item }: { item: SearchResult }) => (
    <SongCard song={item} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 200, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.headerRow}>
            <Text style={styles.greeting}>{wish}</Text>
            <TouchableOpacity
        
              onPress={() => navigation.navigate('userPref')}
            >
        <Ionicons name="settings" color="white" size={40}/>

            
            </TouchableOpacity>
          </View>

          {(selectedCategories.length > 0
            ? selectedCategories
            : DEFAULT_CATEGORIES
          ).map((category, index) => (
            <View key={index.toString()} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {loading && !songs[index]?.results ? (
                <LoadingIndicator />
              ) : (
                <FlatList
                  data={songs[index]?.results || []}
                  renderItem={renderItem}
                  keyExtractor={(item, idx) =>
                    item.id ? item.id.toString() : idx.toString()
                  }
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                />
              )}
            </View>
          ))}
        </ScrollView>
        <Modal visible={modalVisible} animationType='slide'>
          <SuggestionModel onClose={()=>{
            setModalVisible(!modalVisible)
            
          }}
          onSet={()=>{
            navigation.navigate('userPref')
          }}
          
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal:5
  },
  scrollView: {
    flex: 1,
  },
  headerRow: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    paddingTop:10,
   marginBottom:20,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  greeting: {
    fontFamily: 'Rubik-Bold',
    fontSize: 25,
    color: 'white',
  },
  prefButton: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  prefButtonText: {
    color: 'black',
    fontFamily: 'Rubik-Medium',
  },
  prefInfo: {
    color: '#1DB954',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryContainer: {
    height: 250,
    width: '100%',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Rubik-Bold',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
  flatListContent: {
    paddingHorizontal: 1,
  },
});
