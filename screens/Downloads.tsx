import React, {useMemo} from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const CountItem = React.memo(({ item }: { item: any }) => {
  return (
    <View
      style={{
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}
    >
      <Text style={{ fontSize: 16 }}>{item}</Text>
    </View>
  );
});



export default function Downloads() {
  const renderItem = ({item,index}:{item:any,index:number}) => {
    return(
      <CountItem item={item}/>
    )
  }

  const numbers = React.useMemo(() => Array.from({ length: 10000 }, (_, i) => i + 1), []);
  return (
    <View style={{flex:1, backgroundColor:"red"}}>
      <FlatList data={numbers} renderItem={renderItem}
                initialNumToRender={30}
                maxToRenderPerBatch={10}
                getItemLayout={(numbers, index) => ({
                  length: 50,              // row height
                  offset: 50 * index,      // position from top
                  index,                   // row index
                })}

      />

    </View>
  )


}
