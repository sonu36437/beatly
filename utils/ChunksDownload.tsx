import axios from "axios";
import RNFS from "react-native-fs";
import { fromByteArray } from "base64-js";
import { innertube } from "..";
import { ToastAndroid } from "react-native";
import notifee from '@notifee/react-native';
import Realm from "realm";
import DownloadDB from "../databases/DownloadDb";
type range = {
    start: number,
    end: number,
}
function formatThumnail(song: any) {

    if (song.thumbnails) {
        return song.thumbnails[song.thumbnails.length - 1].url;
    }
    if (song.thumbnail) {
        return song.thumbnail[song.thumbnail.length - 1].url;
    }
    return song.artwork;

}




export const deleteParticularSong = async (realm:Realm,song:any) => {
  
 const songPath = `${RNFS.DocumentDirectoryPath}/${song.id}.mp3`;
const thumbnailPath = `${RNFS.DocumentDirectoryPath}/${song.id}.jpg}`
 const isDownloaded = await RNFS.exists(songPath);
 const isThumbnailDownloaded = await RNFS.exists(thumbnailPath);
 if(isDownloaded && isThumbnailDownloaded){
    realm.beginTransaction();
    realm.delete(song);
    realm.commitTransaction();
    await RNFS.unlink(songPath);
    await RNFS.unlink(thumbnailPath);

    
 }



  

};



async function getFileSize(url: string): Promise<number> {
    const response = await axios.head(url);
    const size = response.headers["content-length"];
    if (!size) {
        throw new Error("Could not determine file size");
    }
    return parseInt(size, 10);
}

//download chunnk function 
async function downloadChunks({ url, totalFileSize, tempDowloadLocation, ranges, onProgress }: { url: string, totalFileSize: number, tempDowloadLocation: string, ranges: range[], onProgress?: (progress: number, downloaded: string) => void }): Promise<string[]> {

    const chunksLoactionArray = [];
    let downloadedChunks = 0;

    for (let i = 0; i < ranges.length; i++) {
        const res = await axios.get(url, {
            headers: { Range: `bytes=${ranges[i].start}-${ranges[i].end}` },
            responseType: "arraybuffer",
        });
        const chunkPath = `${tempDowloadLocation}/chunk${i}`;
        const base64String = fromByteArray(new Uint8Array(res.data));
        await RNFS.writeFile(chunkPath, base64String, { encoding: "base64" });
        chunksLoactionArray.push(chunkPath);
        console.log(chunkPath);
        downloadedChunks += ranges[i].end - ranges[i].start + 1;
        const progress = Math.min((downloadedChunks / totalFileSize) * 100, 100);
        const downloadedInMb = (downloadedChunks / 1024 / 1024).toFixed(2);



        if (onProgress) {
            onProgress(progress, downloadedInMb);
        }

    }
    return chunksLoactionArray;

}

async function songCompleteWalaNotification(song: any,channelId:any) {
    console.log("download complete notification");
    
    await notifee.displayNotification({
        id: song.id,
        title: 'Download Complete',
        body: `Successfully downloaded ${song.title}`,
        android: {
            channelId: channelId,
            smallIcon: 'ic_launcher',
            largeIcon: formatThumnail(song),
        },
    });


}
/// mergeChunks function
async function mergeChunks(
    outputPath: string,
    chunks: string[]
): Promise<void> {

    await RNFS.writeFile(outputPath, "", "base64");
    for (const chunk of chunks) {
        const chunkData = await RNFS.readFile(chunk, "base64");
        await RNFS.appendFile(outputPath, chunkData, "base64");
    }
    console.log("Merged into:", outputPath);
}

//download songs
export async function downloadSong({ song, chunkSize = 500 * 1024 }: { song: any, chunkSize?: number }) {


    const songThumnail = formatThumnail(song);
    console.log(songThumnail);
    // return;

    console.log("downlaod song", song)
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
        id: 'download',
        name: "download channel",

    })

    const outputPath = `${RNFS.DocumentDirectoryPath}/${song.id}.mp3`;
    const thumbnailLoacation = `${RNFS.DocumentDirectoryPath}/${song.id}.jpg}`

    if (await RNFS.exists(outputPath)) {
        ToastAndroid.show("song already downloaded", ToastAndroid.SHORT);
        return;
    }


    const response = await innertube.player(song.id);
    const audioOnlyLink = response.filter((item: any) => {
        return item.mimeType.includes("audio/webm")

    })
    const songUrl: string = audioOnlyLink[audioOnlyLink.length - 1].url;
    let totalFileSize = await getFileSize(songUrl);
    const totalSizeInMb = (totalFileSize / 1024 / 1024).toFixed(2);

    console.log(totalFileSize);
    const ranges: range[] = [];
    const tempDownloadLocation = `${RNFS.TemporaryDirectoryPath}/${song.id}`;
    await RNFS.mkdir(tempDownloadLocation);
    for (let start = 0; start < totalFileSize; start += chunkSize) {
        let end = Math.min(start + chunkSize - 1, totalFileSize - 1);
        ranges.push({ start, end });
    }


    const chunks = await downloadChunks({
        url: songUrl,
        totalFileSize,
        tempDowloadLocation: tempDownloadLocation,
        ranges,
        onProgress(progress, downloaded) {
            notifee.displayNotification({
                id: song.id,
                title: song?.title,
                body: `${downloaded}/${totalSizeInMb} MB}`,
                android: {
                    channelId,
                    ongoing: true,
                    onlyAlertOnce: true,
                    progress: {
                        max: 100,
                       current:progress
                    },
                
                }

            })

        },


    });

    //mergeChunks

    await mergeChunks(outputPath, chunks);

    const thumbnail = formatThumnail(song);
    const thumbnailDownload = RNFS.downloadFile({
        fromUrl: thumbnail,
        toFile: thumbnailLoacation,
    });
    const thumbnailResult = await thumbnailDownload.promise;
    console.log("Thumbnail downloaded:", thumbnailResult);

    const songMetaData = {
        id: song.id,
        title: song.title,
        artist: song.artist,
        thumbnail: `file://${thumbnailLoacation}`,
        url: `file://${outputPath}`,


    }

    console.log("mergeing done ");

    try {
        await RNFS.unlink(tempDownloadLocation);
    } catch (e) {
        console.log(e);

    }
    console.log("delete temp file")
    await songCompleteWalaNotification(song,channelId);
    return songMetaData



}