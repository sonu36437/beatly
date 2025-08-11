import {
    View,
    Text,
    StyleSheet,
    TextInput,
 
    FlatList,
    ActivityIndicator,

    Alert
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import SongItem from '../components/SongItem';
  import {innertube} from '../index';
import { player } from '../player/Player';
import Modal from '../components/Modal';
import PopUpScreen from './PopUpScreen';

  
 
  
  export default function SearchScreen() {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<any>([]);
    const [paginationToken, setPaginationToken] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [error ,setError]=useState("");
    const [clickedTrack,setClickedTrack]=useState<any>(null);
    const [isModalVisible,setIsModalVisible]=useState(false);
    
  
    useEffect(() => {
      const timer = setTimeout(() => {
        if (input !== '') {
          search();
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [input]);



  
    const search = async () => {
      setIsLoading(true);
      try {
     
        const result = await innertube.search(input+" song");
        console.log(result);
    
        const videoGreaterThanSeventySeconds=result.results.filter((item:any)=>{
         return item?.durationInSeconds>70
        })
      

        setResult(videoGreaterThanSeventySeconds);
        setPaginationToken(result.continuationToken);
      } catch (error) {
        console.log(error.message);
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
          return item?.durationInSeconds>70
         })
        setResult((prev:any)=> [...prev, ...videoGreaterThanSeventySeconds]);
        setPaginationToken(response.continuationToken);
      } catch (e) {
        Alert.alert('some issue occurred');
      } finally {
        setIsMore(false);
      }
    };
   
    const renderItem = ({item,index}: any) => {
        return (
       
            <SongItem song={item} index={index}
            // clickedOne={()=>{
            //   setClickedTrack(item)
            //   setIsModalVisible(true);
            // }}
            totalsongs={result}
            playingFromScreen="search"
            />
       
        );
      };
      if(error){
       Alert.alert(error.message);
       setError("");
      }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search for songs</Text>
        <TextInput
          placeholder="Search for songs here"
          placeholderTextColor="#888"
          style={styles.input}
          onChangeText={text => setInput(text)}
        />
        {isLoading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={result}
              renderItem={renderItem}
              keyExtractor={(item,index)=> item.id+index}
              initialNumToRender={50}
              maxToRenderPerBatch={50}
              contentContainerStyle={{paddingBottom: 200, paddingTop: 40}}
              onEndReached={searchContinuation}
              onEndReachedThreshold={0.8}
              getItemLayout={(item,index)=>{
                return{     
                  length:70,
                  offset:70*index,
                  index:index
                }
              }}
             
            
              bounces={true}
              bouncesZoom={true}
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
  