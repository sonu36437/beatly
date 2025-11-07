import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreferenceStore } from '../store/userPrefStore';

export default function UserPreference() {
  const {
    fetchPreferences,
    loading,
    error,
    categories,
    artists,
    selectedCategories,

    selectionCount,
    toggleCategory,
   
  } = usePreferenceStore();

  useEffect(() => {
    fetchPreferences();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPreferenceList = (

    title: string,
    data: any[],
    selected: any[],
    onToggle: (item: any) => void
  ) => (
    

    <>
    {console.log(data)
    }
   
   

      <Text style={styles.sectionTitle}>{title}</Text>
     

   
      <View style={styles.prefGrid}>
        {data.length > 0 ? (
          data.map((item, index) => {
         
            
            const isSelected = selected.some((p) => p=== item);
            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => onToggle(item)}
              >
                <View
                  style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.center}>
            <Text style={styles.noDataText}>No {title.toLowerCase()} found</Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderPreferenceList(
          'Categories',
          categories,
          selectedCategories,
          toggleCategory
        )}

        {
          artists.map((item)=>{
              const key:string= Object.keys(item)[0]; 
           
    
          
            return(
              renderPreferenceList(
                key,
                item[key],
                selectedCategories,
                toggleCategory)
      
            )
          })
        }
       
         
    
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
   paddingHorizontal:15,
    paddingBottom:150
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
  
    marginBottom: 10,
    fontFamily:'Rubik-Bold',
    marginTop: 20,
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedCard: {
    backgroundColor: '#fcfffdff',
    borderColor: '#a4a6a5ff',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
       fontFamily:'Rubik-Medium',
  },
  selectedText: {
    color: 'black',
    fontWeight: '700',
       fontFamily:'Rubik-Bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataText: {
    color: '#888',
    fontSize: 14,
  },
});
