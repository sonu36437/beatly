import { Alert, Linking, Platform } from "react-native";
import { BatteryOptEnabled,} from "react-native-battery-optimization-check";

export function openBatteryOptimizationSettings() {
  if (Platform.OS !== "android") return;

  Alert.alert(
    "Disable Battery Optimization",
    "For uninterrupted background playback, allow this app to ignore battery optimizations.",
    [
      { text: "Not now", style: "cancel" },
      {
        text: "Allow",
        onPress: async () => {
          try {
            await Linking.openURL(
              "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"
            );
          } catch {
            Linking.openSettings(); 
          }
        },
      },
    ]
  );
}
export async function isBatteryOptimizationEnabled() {
 const isEnabled=await BatteryOptEnabled()
 return isEnabled;
}