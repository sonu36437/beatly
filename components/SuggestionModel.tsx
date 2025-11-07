import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Height } from '../constants/ScreenProportion';

export default function SuggestionModel({ onClose, onSet }: { onClose: () => void; onSet: () => void }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
       
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Set Your Preferences</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close-circle" size={28} color="#FF4C4C" />
          </TouchableOpacity>
        </View>

   
        <View style={styles.content}>
          <Ionicons name="musical-notes" size={45} color="#1DB954" />
          <Text style={styles.title}>Personalize Your Experience 🎧</Text>
          <Text style={styles.subtitle}>
            Please select your favorite music preferences to get better song recommendations.
          </Text>
        </View>


        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.setBtn} onPress={onSet}>
            <Text style={styles.setText}>Set Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(210, 26, 26, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    height: Height * 0.35,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Rubik-Bold',
  },
  closeIcon: {
    padding: 5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Rubik-Bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Rubik-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: 'Rubik-Medium',
    color: '#000',
    fontSize: 15,
  },
  setBtn: {
    flex: 1,
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  setText: {
    fontFamily: 'Rubik-Medium',
    color: 'white',
    fontSize: 15,
  },
});
