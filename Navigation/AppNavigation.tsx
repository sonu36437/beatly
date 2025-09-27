import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import Downloads from '../screens/Downloads';
import PopUpScreen from '../screens/PopUpScreen';
import { usePlayerStore } from '../store/PlayerStore';
import MiniPlayer from '../components/MiniPlayer';
import Fav from '../screens/Fav';
import Modal from '../components/Modal';
import { useModalStore } from '../store/ModalStore';
import TrackPlayer from 'react-native-track-player';
import { SafeAreaView ,useSafeAreaInsets} from 'react-native-safe-area-context';
import { Height } from '../constants/ScreenProportion';
import Search from '../screens/Search';


const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }:{state:any,descriptors:any,navigation:any}) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();


  return (

  <View style={styles.container}>
      {/* <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={15}
        reducedTransparencyFallbackColor="orange"
        blurRadius={20}
        overlayColor=''
      /> */}
      <View style={styles.tabContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            console.log(route);
            
            const event = navigation.emit({
               
                
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          
          let iconName;
          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'search') {
            iconName = isFocused ? 'magnify' : 'magnify';
          } else if (route.name === 'Downloads') {
            iconName = isFocused ? 'download' : 'download-outline';
          } else if (route.name === 'Fav') {
            iconName = isFocused ? 'heart' : 'heart-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={isFocused ? 'white' : 'gray'}
              />
              <Text style={{ color: isFocused ? 'white' : 'gray', fontSize: 12,fontFamily:"Rubik-Bold" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
 
   
  );
}

export default function MyTabs() {
  const{currentTrack}= usePlayerStore();
  const {isModalOpen,content ,closeModal}=useModalStore();
      const insets = useSafeAreaInsets();
  return (
  
    <View style={[ { paddingBottom: insets.bottom,flex:1,
    // backgroundColor:'rgba(52, 2, 34, 0.4)'
    backgroundColor:'black'
     }]}>

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'shift',
        }}
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={Home} />
        {/* <Tab.Screen name="search" component={SearchScreen} /> */}
          <Tab.Screen name="search" component={Search} />
        
        <Tab.Screen name="Fav"
  component={Fav}
  options={{
    headerShown: true,
    headerTransparent:true,
    

   
    
    headerTitle: 'Favourite songs',
    headerTitleStyle: {
      color: 'white',
      fontFamily: 'Rubik-Bold',
    },
    headerBackground: () => (
      <BlurView
        style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(0, 0, 0, 0.5)'}]}
        blurType="dark"
        blurAmount={20}
        blurRadius={20}
        overlayColor=""
      />
    ),
  }}
/>

          

        <Tab.Screen name="Downloads" component={Downloads} />
        
      </Tab.Navigator>

    
      {TrackPlayer.getActiveTrack() !== null && <MiniPlayer />}
      <Modal children={content} visible={isModalOpen} animationType='slide' onRequestClose={closeModal}   transparent={true} statusBarTranslucent={true}/>
    </View>

  
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 70,
   borderTopEndRadius:20,
   borderTopStartRadius:20,
    overflow: 'hidden',
    
    width:"100%",
    alignSelf:'center',
    // backgroundColor: 'rgba(52, 2, 34, 0.4)',
    backgroundColor:'black',
 
  },
  tabContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
