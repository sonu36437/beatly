import { Alert, BackHandler, Linking } from 'react-native';
import pkg from '../package.json'
import DeviceInfo from 'react-native-device-info';
export function getAppCurrentVersion() {
   const version= DeviceInfo.getVersion();

    return version;
}
export async function CheckForUpdate() {
    const url = "https://api.github.com/repos/sonu36437/beatly/releases/latest";

    const currentVersion = getAppCurrentVersion();
    const response = await fetch(url);
    const data = await response.json();
    let latestVersion = data.tag_name.replace(/^v/, "");
    const str = "sinu";

    const downloadUrl = "https://github.com/sonu36437/beatly/releases"
    const isMandatory = data.body?.includes("mandatory:true");
    const changesMessage = data?.body;
    if (currentVersion === latestVersion) {
        console.log("current version:", currentVersion);
        console.log("latest version:", latestVersion);
        return;
    }

    if (isMandatory) {
        Alert.alert(
            data.name ? data.name : 'new update',
            changesMessage,
            [
                {
                    text: "update",
                    onPress: () => {
                        Linking.openURL(downloadUrl);
                    }
                },
                {
                    text: "Exit",
                    style: "destructive",
                    onPress: () => BackHandler.exitApp(),
                },
            ],
            { cancelable: false }

        )
    }
    else {
        Alert.alert(
            data.name ? data.name : 'new update',

            changesMessage,

            [
                {
                    text: "update",
                    onPress: () => {
                        Linking.openURL(downloadUrl);
                    }

                },
                {
                    text: 'cancel',
                    onPress: () => {
                        return;

                    }
                }
            ]
        )
    }














}