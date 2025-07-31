import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import SongItem from '../components/SongItem';
  import {innertube} from '../index';
  
  const renderItem = ({item,index}: any) => {
    return (
   
        <SongItem song={item} index={index}/>
   
    );
  };
  
  export default function SearchScreen() {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<any>([]);
    const [paginationToken, setPaginationToken] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMore, setIsMore] = useState(false);
  
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
        const result = await innertube.search(input);
        setResult(result.results);
        setPaginationToken(result.continuationToken);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const searchContinuation = async () => {
      if (isMore || !paginationToken || result.length === 0) return;
      setIsMore(true);
      try {
        const response = await innertube.fectchSearchContinuation(paginationToken);
        setResult((prev:any)=> [...prev, ...response.results]);
        setPaginationToken(response.continuationToken);
      } catch (e) {
        Alert.alert('some issue occurred');
      } finally {
        setIsMore(false);
      }
    };
  
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
              keyExtractor={item => item.id}
              contentContainerStyle={{paddingBottom: 100, paddingTop: 20}}
              onEndReached={searchContinuation}
              onEndReachedThreshold={0.5}
              bounces={true}
              bouncesZoom={true}
              ListFooterComponent={isMore ? <ActivityIndicator color="white" /> : null}
            />
          </View>
        )}
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
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
    },
    input: {
      color: 'white',
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 8,
      padding: 15,
      textAlign: 'left',
      width: '100%',
      marginTop: 10,
      backgroundColor: '#1c1c1c',
    },
  });
  