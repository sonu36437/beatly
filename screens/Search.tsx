
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontScale } from "../constants/ScreenProportion";
import { CacheData, GetCache } from "../utils/Storage";
import { index } from "realm";
import SongItem from "../components/SongItem";
import { player } from "../player/Player";
import { innertube } from "..";
const ITEM_HEIGHT = 94;


const Stack = createNativeStackNavigator();



export default function Search() {

    return (


        <Stack.Navigator screenOptions={{ freezeOnBlur: true, headerShown: false }}>
            <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{ animation: 'slide_from_left' }}
            />
            <Stack.Screen
                name="SearchResult"
                component={SearchResult}
                options={{ animation: 'slide_from_right' }}
            />

        </Stack.Navigator>

    )
}
function SearchScreen() {
    const navigation = useNavigation();
    const inset = useSafeAreaInsets();
    const [input, setInput] = useState<string>("");
    const route = useRoute();
    const query=route.params;



    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    // const recentSearchArray=["helo","jldjaf"]

    useEffect(() => {
        async function getCacheRecentSearches() {
            const res: [] = await GetCache("recentSearches");
            console.log([...res]);
            setRecentSearches(res)
        }
        getCacheRecentSearches();
        if(query){
            setInput(query.query)
        }

    }, [])

    async function handleSearchClick() {
        if (!input.trim()) return;

        const recentSearchArray: string[] = (await GetCache("recentSearches")) || [];
        setInput("")
        if (!recentSearchArray.includes(input)) {
            const updatedArray = [input, ...recentSearchArray];
            await CacheData({ key: "recentSearches", data: updatedArray, validity: 30 * 24 });
            setRecentSearches(updatedArray);
        }


    }

    async function handleRemove(removingIndex: number) {
        const recentSearchArray: string[] = await GetCache("recentSearches") || [];

        const updatedArray = recentSearchArray.filter((_, i) => i !== removingIndex);
        console.log(removingIndex, updatedArray);

        await CacheData({ key: "recentSearches", data: updatedArray, validity: 30 * 24 });
        setRecentSearches(updatedArray);
    }

    return (
        <View style={{ flex: 1, backgroundColor: "black", paddingTop: inset.top + 10, paddingHorizontal: 16 }}>
            <Text style={{ textAlign: 'center', fontSize: 25 * FontScale, color: 'white', fontFamily: 'Rubik-Bold' }}>Search for songs</Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1c1c1c",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginVertical: 10,
                }}
            >

                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={input}
                    onChangeText={text => setInput(text)}
                    onSubmitEditing={() => {
                        navigation.navigate("SearchResult", { query: input })
                        handleSearchClick();

                    }}
                    returnKeyType="search"
                    returnKeyLabel="search"
                    style={{
                        flex: 1,
                        color: "white",
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />


                <TouchableOpacity onPress={() => {
                    handleSearchClick()
                     navigation.navigate("SearchResult", { query: input })
                    
                }}>
                    <Ionicons name="search" size={24} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
            </View>
            <Text style={{ color: "white", fontSize: 15, fontFamily: 'Rubik-Medium', marginBottom: 10 }}>
                Recent Searches
            </Text>


            <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: "#1c1c1c",
                        padding: 10,
                        borderRadius: 20,
                        margin: 2
                    }}>
                        <TouchableOpacity
                            style={{ width: "90%" }}
                            onPress={() => {
                                console.log(item);


                                navigation.navigate("SearchResult", { query: item });
                            }}
                        >
                            <Text style={{ color: "white", fontFamily: 'Rubik-Regular' }}>{item}</Text>
                        </TouchableOpacity>
                        <View style={{ paddingRight: 10 }}>
                            <TouchableOpacity onPress={() => {
                                handleRemove(index)
                            }}>
                                <Ionicons name="close-circle-outline" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>

                )}
            />


            <TouchableOpacity
                style={{
                    backgroundColor: "gray",
                    padding: 16,
                    borderRadius: 8,
                    marginTop: 20,
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate("SearchResult")}
            >
                <Text style={{ color: "white", fontWeight: "600" }}>Go to Search Result</Text>
            </TouchableOpacity>
        </View>
    );
}

function SearchResult() {
  const navigation = useNavigation();
  const route = useRoute();
  const { query } = route.params;
  const [result, setResult] = useState<any[]>([]);
  const [paginationToken, setPaginationToken] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (query) search(query);
  }, [query]);

  const search = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const cleanedInput = searchQuery
        .replace(/\bsongs?\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      const result = await innertube.search(cleanedInput.toLowerCase() + ' song ');
      const filtered = result.results.filter((item: any) => item?.durationInSeconds > 60);

      setResult(filtered);
      setPaginationToken(result.continuationToken);
    } catch (e: any) {
      console.log(e);
      setError(e.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const searchContinuation = async () => {
    if (isMore || !paginationToken || result.length === 0) return;
    setIsMore(true);
    try {
      const response = await innertube.fectchSearchContinuation(paginationToken);
      const filtered = response.results.filter((item: any) => item?.durationInSeconds > 60);
      setResult(prev => [...prev, ...filtered]);
      setPaginationToken(response.continuationToken);
    } catch (e) {
      console.log(e);
    } finally {
      setIsMore(false);
    }
  };

  const handleSongItemClick = useCallback((item: any) => {
    player.playSingleAndGetSuggestions(item);
  }, []);

  const renderItem = ({ item }: any) => {
    if (!item?.id || !item?.title) return null;
    return (
      <SongItem
        song={item}
        clickedOne={() => handleSongItemClick(item)}
      />
    );
  };

  if (result.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="musical-notes-outline" size={70} color="gray" />
        <Text style={styles.emptyText}>No Songs Found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <View style={styles.queryContainer}>
          <Text style={styles.queryText} numberOfLines={1}>
            {query}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen', { query })}
          style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="white" size="large" />
          <Text style={styles.loadingText}>Searching songs...</Text>
        </View>
      ) : (
        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index}
          contentContainerStyle={styles.listContent}
          onEndReached={searchContinuation}
          onEndReachedThreshold={0.8}
          ListFooterComponent={
            isMore ? (
              <ActivityIndicator color="white" size="small" style={{ marginVertical: 20 }} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    justifyContent: 'space-between',
  },
  backIcon: {
    padding: 8,
  },
  queryContainer: {
    flex: 1,
    alignItems: 'center',
  },
  queryText: {
    color: 'white',
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
  },
  searchIcon: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 50,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontFamily: 'Rubik-Bold',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'gray',
    fontFamily: 'Rubik-Bold',
    marginTop: 10,
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#222',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backText: {
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Rubik-Bold',
  },
});