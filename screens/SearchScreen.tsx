import {
    View,
    Text,
    StyleSheet,
    TextInput,

    FlatList,
    ActivityIndicator,


    Alert
  } from 'react-native';
const ITEM_HEIGHT = 94;

  import React, {useEffect, useRef, useState} from 'react';
  import SongItem from '../components/SongItem';
  import {innertube} from '../index';
import { player } from '../player/Player';

import {  useIsFocused } from '@react-navigation/native';




  export default function SearchScreen() {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<any>([]);
    const [paginationToken, setPaginationToken] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [error ,setError]=useState("");
    const [isFocus, setIsFocus] = useState(false);
    const isSreenOnFocus = useIsFocused()
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {

      const timer = setTimeout(() => {
        if (input !== '') {
          search();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }, [input]);

    useEffect(()=>{
      if(!isSreenOnFocus){
     inputRef.current?.blur();
      }
    },[isSreenOnFocus])



    const search = async () => {
      setIsLoading(true);
      try {
        if(input.length<=3){
          return;
        }
        const cleanedInput=input
        .replace(/\bsongs?\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
        console.log("searching things ", cleanedInput);

        const result = await innertube.search(cleanedInput.toLowerCase() + " song ");

        console.log("this is from fresult ",result.results[0].thumbnails);

        const videoGreaterThanSeventySeconds=result.results.filter((item:any)=>{
         return item?.durationInSeconds>60
        })
        setResult(videoGreaterThanSeventySeconds);
        setPaginationToken(result.continuationToken);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const searchContinuation = async () => {
      if (isMore || !paginationToken || result.length === 0) return;
      setIsMore(true);
      try {
        const response = await innertube.fectchSearchContinuation(paginationToken);


        const videoGreaterThanSeventySeconds=response.results.filter((item:any)=>{
          return item?.durationInSeconds>60
         })
        setResult((prev:any)=> [...prev, ...videoGreaterThanSeventySeconds]);
        setPaginationToken(response.continuationToken);
      } catch (e) {
        Alert.alert('some issue occurred');
      } finally {
        setIsMore(false);
      }
    };
      const handleSongItemClick = React.useCallback((item:any) => {
          // player.playSong(index,item,"search",result)
          // it will going to push suggested songs in suggestedQueue in player object
          player.playSingleAndGetSuggestions(item);
      },[]);

    const renderItem = ({item, index}: any) => {
      if (!item?.id || !item?.title) return null;
      return (
        <SongItem
          song={item}
          clickedOne={()=>{
              handleSongItemClick(item);
          }}

        />
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search for songs</Text>
        <TextInput
        ref={inputRef}

          placeholder="Search for songs here"
          placeholderTextColor="#888"
          style={styles.input}
          onChangeText={text => setInput(text)}
          onFocus={()=>setIsFocus(true)}
          onBlur={()=>setIsFocus(false)}
        />
        {isLoading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={result}
              renderItem={renderItem}
              keyExtractor={(item,index)=> item.id + index}
              initialNumToRender={30}
              maxToRenderPerBatch={5}
              contentContainerStyle={{paddingBottom: 200, paddingTop: 40}}
              onEndReached={searchContinuation}
              onEndReachedThreshold={0.8}
              windowSize={10}
              getItemLayout={(_, index) => ({
                length:  ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              // bounces={true}
              // bouncesZoom={true}
              ListFooterComponent={isMore ? <ActivityIndicator color="white" /> : null}
            />
          </View>
        )}
        {/* <Modal
         visible={isModalVisible}
         onRequestClose={()=>setIsModalVisible(false)}
         animationType="fade"
         children={<PopUpScreen track={clickedTrack}/>}
         transparent={true}
         statusBarTranslucent={true}

          /> */}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      paddingHorizontal: 10,
    },
    title: {
      color: '#DB7093',
      fontSize: 25,
      fontFamily:'Rubik-Bold',
      textAlign: 'center',
      marginTop: 20,
    },
    input: {
      color: 'black',
      fontSize: 12,


      borderRadius: 50,
      fontFamily:'Rubik-Bold',
      padding: 15,
      textAlign: 'left',
      width: '100%',
      marginTop: 10,
      backgroundColor: 'white',
    },
  });
