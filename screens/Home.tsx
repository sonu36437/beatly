import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SongCard from '../components/SongCard';
import { innertube } from '../index';
import { SearchResult } from 'onlynativetube/utils/parsers';
import LoadingIndicatior from '../components/LoadingIndicatior';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { query: "top bollywood songs", Title: "Bollwood Hits" },
  { query: "romantic songs", Title: "Romantic Songs" },
  { query: "workout songs", Title: "Workout Songs" },
   { query: "english songs", Title: "Top English Songs" },
];

interface SearchResponse {
  results: SearchResult[];
  continuationToken?: string;
}

export default function Home() {
  const [songs, setSongs] = useState<SearchResponse[]>([]);
  const [wish,setWish]=useState<String>("");
  const [error ,setError]=useState<String>("")
  const navigation= useNavigation();
const wishUser = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning 🌞";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon ☀️";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening 🌇";
  } else {
    return "Hey night owl sleep now⏰";
  }
};

  useEffect(() => {
    const fetchSongs = async () => {
      
      for (let cat of categories) {
        try {
          const response: SearchResponse = await innertube.search(cat.query);
           
            setSongs((prev)=>[...prev,response])
        } catch (err) {
          console.log("Error fetching:", cat.Title, err);
          setError(JSON.stringify(err));
        }
      }
      
  
    };
     setWish(wishUser())
    fetchSongs();
  }, []);

  const renderItem = ({ item, index }: { item: SearchResult, index: number }) => {
    return <SongCard song={item} />;
  };


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'rgba(53, 1, 27, 0.8)'}}>
    <View style={styles.container}>

      
      
      <ScrollView style={styles.scrollView} contentContainerStyle={
        {
          paddingBottom:200,
          paddingTop:20
        }
        
      } >
        <View style={{height:100,justifyContent:'center', paddingHorizontal:10 }}>
          <Text style={{fontFamily:"Rubik-Bold", fontSize:25,color:"white"}}>{wish}</Text>
        
          
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
             <LoadingIndicatior/>
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
    paddingTop:0,
    backgroundColor:'rgba(53, 1, 27, 0.8)'
  
   
  },
  scrollView: {
    flex: 1,
    
 
    
  },
  categoryContainer: {

    height:250,
    width:"100%"
     
  },
  categoryTitle: {
    fontSize: 18,
   fontFamily:"Rubik-Bold",
     paddingHorizontal:10,
    marginBottom: 10,
    color: '#ffffffff',
  },
  flatListContent: {
    paddingHorizontal: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontFamily:'Rubik-Bold',
    color:'white'
  
    
  },
});