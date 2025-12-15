import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";
import Ionicons from "react-native-vector-icons/Ionicons";
import BatteryOptimizationCheck from 'react-native-battery-optimization-check'
import { isBatteryOptimizationEnabled, openBatteryOptimizationSettings } from "../utils/disableBatteryOptimization";





  


export default function InfoScreen() {
  const openGitHub = () => {
    Linking.openURL("https://github.com/sonu36437/beatly");
  };
  

  const openLicense = () => {
    Linking.openURL("https://opensource.org/licenses/MIT");
  };

  const openLinkedIn = () => {
    Linking.openURL("https://in.linkedin.com/in/sonu-kumar-11b789245"); 
  };

  const openFeedback = () => {
    Linking.openURL("mailto:sonu36437@gmail.com");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView contentContainerStyle={styles.container}>
       
        <View style={styles.header}>
          <Image source={require("../logo.jpg")} style={styles.logo} />
          <Text style={styles.appName}>Beatly</Text>
        </View>

    
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.row}>
            <Ionicons name="apps-outline" size={20} color="#ccc" />
            <Text style={styles.text}>Version: {DeviceInfo.getVersion()}</Text>
          </View>
          
        </View>

    
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Community</Text>
          <TouchableOpacity onPress={openGitHub} style={styles.rowButton}>
            <Ionicons name="logo-github" size={22} color="white" />
            <Text style={styles.link}>Star on GitHub</Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity onPress={openLicense} style={styles.rowButton}>
            <Ionicons name="document-text-outline" size={22} color="white" />
            <Text style={styles.link}>MIT License</Text>
          </TouchableOpacity>
        </View>

     
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <View style={styles.row}>
            <Ionicons name="person-circle-outline" size={22} color="#ccc" />
            <Text style={styles.text}>Sonu Kumar</Text>
          </View>

          <TouchableOpacity onPress={openLinkedIn} style={styles.rowButton}>
            <Ionicons name="logo-linkedin" size={22} color="#0a66c2" />
            <Text style={styles.link}>LinkedIn</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openFeedback} style={styles.rowButton}>
            <Ionicons name="mail-outline" size={22} color="#ff4c4c" />
            <Text style={styles.link}>Send Feedback</Text>
          </TouchableOpacity>
           <TouchableOpacity onPress={
            async()=>{
            await isBatteryOptimizationEnabled();
            }} style={styles.rowButton}>
            <Ionicons name="mail-outline" size={22} color="#ff4c4c" />
            <Text style={styles.link}>check batteryopt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 200,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  appName: {
    fontFamily: "Rubik-Bold",
    color: "white",
    fontSize: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Rubik-Bold",
    color: "white",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  rowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
  },
  link: {
    color: "white",
    fontSize: 15,
    fontFamily: "Rubik-Bold",
  },
});
