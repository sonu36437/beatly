import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SongCard from '../components/SongCard';
import { innertube } from '../index';
import { SearchResult } from 'onlynativetube/utils/parsers';
import LoadingIndicatior from '../components/LoadingIndicatior';
import { useNavigation } from '@react-navigation/native';
import { CacheData, GetAllCacheKeys, GetCache, HasValidCache, RemoveCache } from '../utils/Storage';
import { CheckForUpdate, getAppCurrentVersion } from '../utils/CheckForUpdate';

const categories = [
  { query: "top bollywood songs", Title: "Bollwood Hits" },
  { query: "romantic songs", Title: "Romantic Songs" },
  { query: "workout songs", Title: "Workout Songs" },
  { query: "english", Title: "Top English Songs" },
];

interface SearchResponse {
  results: SearchResult[];
  continuationToken?: string;
}

export default function Home() {
  const [songs, setSongs] = useState<SearchResponse[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [wish, setWish] = useState<String>("");
  const [error, setError] = useState<String>("")
  const navigation = useNavigation();
  const wishUser = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning 🌞";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon ☀️";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening 🌇";
    } else {
      return "Hey night owl sleep now⏰";
    }
  };

  let allsongs: SearchResponse[] = [];
  const handleRefresh = async () => {
    setRefresh(true);
    setSongs([]);
    allsongs = [];
    await RemoveCache("homePageData");
    await fetchSongs();
    setRefresh(false);
  }
  const fetchSongs = async () => {
    const haveCache= await GetCache("homePageData");
    const isCacheValid= await HasValidCache("homePageData");
    console.log(isCacheValid);
    if (haveCache.length>0 && isCacheValid) {
      console.log("using cache data");
      console.log(haveCache);
      
      
      setSongs(haveCache);
      return;

    }

    for (let cat of categories) {
      try {
        const response: SearchResponse = (await innertube.search(cat.query));
        allsongs.push(response);
        setSongs((prev) => [...prev, response])
      } catch (err) {
        console.log("Error fetching:", cat.Title, err);
        setError(JSON.stringify(err));
      }
    }
    await CacheData({ key: 'homePageData', data: allsongs, validity: 24 * 7 });


  };


  useEffect(() => {
    setWish(wishUser())
   Platform.OS==='android' && CheckForUpdate();
    fetchSongs();
  }, [])

  const renderItem = ({ item, index }: { item: SearchResult, index: number }) => {
    return <SongCard song={item} />;
  };


  return (
    <SafeAreaView style={{
      flex: 1,
      // backgroundColor:'rgba(74, 8, 41, 0.8)'
      backgroundColor: 'black'
    }
    }>
      <View style={styles.container}>



        <ScrollView style={styles.scrollView} contentContainerStyle={
          {
            paddingBottom: 200,
            paddingTop: 20
          }

        }
          overScrollMode='always'
          bounces={true}
          bouncesZoom={true}
          showsVerticalScrollIndicator={false}
          

        >
          <View style={{ height: 50,width:"100%", flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10}}>
            <Text style={{ fontFamily: "Rubik-Bold", fontSize: 25, color: "white" }}>{wish}</Text>
            {/* <TouchableOpacity style={{height:40,width:20,backgroundColor:'red'}} 
            onPress={()=>{
              CheckForUpdate()
            }}
            
            ></TouchableOpacity> */}
        


          </View>
          {categories.map((item, index) => (
            <View key={index} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{item.Title}</Text>
              {songs[index]?.results && songs[index].results.length > 0 ? (
                <FlatList
                  data={songs[index].results}
                  renderItem={renderItem}
                  keyExtractor={(item, itemIndex) => item.id + itemIndex}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                />
              ) : (
                <LoadingIndicatior />
              )}

            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    // backgroundColor:'rgba(53, 1, 27, 0.8)'
    backgroundColor: 'black'


  },
  scrollView: {
    flex: 1,



  },
  categoryContainer: {

    height: 250,
    width: "100%"

  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: "Rubik-Bold",
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#ffffffff',
  },
  flatListContent: {
    paddingHorizontal: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
    color: 'white'


  },
});