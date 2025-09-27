
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



    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    // const recentSearchArray=["helo","jldjaf"]

    useEffect(() => {
        async function getCacheRecentSearches() {
            const res: [] = await GetCache("recentSearches");
            console.log([...res]);


            setRecentSearches(res)
        }
        getCacheRecentSearches();

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
            <Text style={{ textAlign: 'center', fontSize: 30 * FontScale, color: 'white', fontFamily: 'Rubik-Bold' }}>Search for songs</Text>
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
    const [paginationToken, setPaginationToken] = useState<string | undefined>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (query) {
            search(query);
        }
    }, [query]);

    const search = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const cleanedInput = searchQuery
                .replace(/\bsongs?\b/gi, "")
                .replace(/\s+/g, " ")
                .trim();

            const result = await innertube.search(cleanedInput.toLowerCase() + " song ");

            const videoGreaterThanSeventySeconds = result.results.filter(
                (item: any) => item?.durationInSeconds > 60
            );
            setResult(videoGreaterThanSeventySeconds);
            setPaginationToken(result.continuationToken);
        } catch (e: any) {
            console.log(e);
            setError(e.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const searchContinuation = async () => {
        if (isMore || !paginationToken || result.length === 0) return;
        setIsMore(true);
        try {
            const response = await innertube.fectchSearchContinuation(paginationToken);
            const videoGreaterThanSeventySeconds = response.results.filter(
                (item: any) => item?.durationInSeconds > 60
            );
            setResult((prev) => [...prev, ...videoGreaterThanSeventySeconds]);
            setPaginationToken(response.continuationToken);
        } catch (e) {
            return;
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
                clickedOne={() => {
                    handleSongItemClick(item);
                }}
            />
        );
    };
    if(result.length==0 && !isLoading){
        return (
            <View style={{flex:1, backgroundColor:"black",justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontFamily:"Rubik-Bold",color:'white'}}>No Items found</Text>

            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <View style={styles.container}>
                <View style={{flexDirection:"row" ,justifyContent:"space-between",alignItems:'center' ,paddingHorizontal:20}}>
                    <View style={{width:"80%"}}>
                        <Text style={styles.title} numberOfLines={1}>{query}</Text>
                    </View>

                  <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                
                  }} style={{backgroundColor:"white", padding:5,borderRadius:50}}>
                      <Ionicons name="search" size={30} color="black"/>
                  </TouchableOpacity>
                </View>

                {isLoading ? (
                    <ActivityIndicator color="white" size="large" />
                ) : (
                    <FlatList
                        data={result}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.id + index}
                        initialNumToRender={30}
                        maxToRenderPerBatch={5}
                        contentContainerStyle={{ paddingBottom: 200, paddingTop: 20 }}
                        onEndReached={searchContinuation}
                        onEndReachedThreshold={0.8}
                        windowSize={10}
                        getItemLayout={(_, index) => ({
                            length: ITEM_HEIGHT,
                            offset: ITEM_HEIGHT * index,
                            index,
                        })}
                        ListFooterComponent={
                            isMore ? <ActivityIndicator color="white" /> : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    paddingHorizontal:10,
        paddingTop: 30,
    },
    title: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "Rubik-Bold",

        marginVertical: 10,
    },
});
