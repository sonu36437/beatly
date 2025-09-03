import notifee from '@notifee/react-native';
import RNFS from 'react-native-fs';
import { innertube } from '..';
import { Alert, ToastAndroid } from 'react-native';
import { pushToDownloads } from './ButtonsActions';


const downloadLocation = `${RNFS.DocumentDirectoryPath}/downloads`
const tempDowloadLocation=`${RNFS.TemporaryDirectoryPath}`
let currentDownloadId = null;
function formatThumnail(song: any) {

  if (song.thumbnails) {
    return song.thumbnails[song.thumbnails.length - 1].url;
  }
  if (song.thumbnail) {
    return song.thumbnail[song.thumbnail.length - 1].url;
  }
  return song.artwork;

}

async function isDirectoryExists() {
  const exists = await RNFS.exists(downloadLocation);



  if (!exists) {
    await RNFS.mkdir(downloadLocation);
    console.log("create directory");
    return;

  }
  console.log("already exists");

}


export default async function Download(song: any) {


  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'downloads',
    name: 'Downloads Channel',
  });
  try {
    await isDirectoryExists();
    const response = await innertube.player(song.id);
    const audioOnlyLink = response.filter((item: any) => {
      return item.mimeType.includes("audio/webm")

    })
    const songUrl = audioOnlyLink[audioOnlyLink.length - 1].url;
    const songFilePath = `${downloadLocation}/${song.id}.mp3`
    const thumbnailPath = `${downloadLocation}/${song.id}_.jpg`
    const title = song.title;
    const songExists = await RNFS.exists(songFilePath);

    if (songExists) {
      console.log(`Song already exists: ${songFilePath}`);
      ToastAndroid.show("song Already Downloaded", ToastAndroid.SHORT)
      return;
    }
    const songDownload = RNFS.downloadFile({
      fromUrl: songUrl,
      toFile: songFilePath,
      background: true,
      progressDivider: 5,
      begin: () => {
        currentDownloadId = songDownload.jobId;
      },
      progress: async (res) => {
        const percentage = ((res.bytesWritten / res.contentLength) * 100).toFixed(0);
        const downloadedMB = (res.bytesWritten / 1048576).toFixed(2);
        const totalMB = (res.contentLength / 1048576).toFixed(2);

        await notifee.displayNotification({
          id: song.id,
          title: song.title,
          body: `${downloadedMB}MB / ${totalMB}MB (${percentage}%)`,
          android: {
            channelId,
            ongoing: true,
            onlyAlertOnce: true,
            progress: {
              max: 100,
              current: parseInt(percentage),
            },
            smallIcon: '@mipmap/ic_launcher',
          },

        })

      }

    })
    const result = songDownload.promise;
    const isSuccessfull = await result;
    if (isSuccessfull.statusCode !== 200) {
      ToastAndroid.show("Download failed", ToastAndroid.SHORT)
      currentDownloadId = null;
      await notifee.displayNotification({
        id: song.id,
        title: 'Download Failed',
        body: `Failed to download ${song.title}`,
        android: {
          channelId: 'downloads',
          smallIcon: 'ic_launcher',
        },
      })

    }
    else{
       
            await notifee.displayNotification({
                id: song.id,
                title: 'Download Complete',
                body: `Successfully downloaded ${song.title}`,
                android: {
                    channelId: 'downloads',
                    smallIcon: 'ic_launcher',
                    largeIcon: formatThumnail(song),
                },
            });
         
          
            currentDownloadId = null;
        }

        //thumnaild download
        const thumbnail=formatThumnail(song);
          const thumbnailDownload = RNFS.downloadFile({
            fromUrl: thumbnail,
            toFile: thumbnailPath,
        });
         const thumbnailResult = await thumbnailDownload.promise;

      
         const songMetaData={
          id:song.id,
          title:song.title,
          artist:song.artist,
          thumbnail:`file://${thumbnailPath}`,
          url:`file://${songFilePath}`,


         }

         return songMetaData;

  }catch(e){
    console.log(e);
    currentDownloadId = null;
  }


}

   

     


    
    



