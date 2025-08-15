import { extractContinuationToken } from "./continuationTokenExtractor";
import{convertToSeconds} from './convetIntoSeconds'

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type SearchResult = {
  title: string;
  thumbnails: Thumbnail[];
  description: string;
  id: string;
  artists?: string;
  duration?:string
  durationText?:string
 durationInSeconds?:number

};

export async function searchResponseParser(response: any):Promise<{ results: SearchResult[], continuationToken?: string }> {
  const results: SearchResult[] = [];
  let  continuationToken: string | undefined;



  const sections = response.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    // const sections = response.contents?.sectionListRenderer?.contents || [];




  for (const section of sections) {
    const items = section.itemSectionRenderer?.contents || [];

    continuationToken=extractContinuationToken(response);
    for (const item of items) {
      const video = item.videoRenderer;
      // if (!video) continue;
      console.log("this is form the video " ,video);

      results.push({
        title: video.title?.runs?.[0]?.text || "",
        thumbnails: video.thumbnail?.thumbnails || [],
        description: video.descriptionSnippet?.runs?.map((r: any) => r.text).join(" ") || "",
        id: video.videoId,
        artists: video.ownerText?.runs?.[0]?.text || "",
        duration:video?.lengthText?.simpleText||"",
        durationText:video?.lengthText?.accessibility?.accessibilityData?.label||"" ,
        durationInSeconds:convertToSeconds(video?.lengthText?.simpleText)||0,
      });
    }
  }

  return {results, continuationToken};
}


export function searchContinuationParser(
  response: any
): { results: SearchResult[]; continuationToken?: string } {
  const results: SearchResult[] = [];


  const continuationItems =
    response.onResponseReceivedCommands?.[0]?.appendContinuationItemsAction?.continuationItems ||
    response.continuationContents?.sectionListContinuation?.contents ||
    [];



  for (const item of continuationItems[0]?.itemSectionRenderer?.contents) {
    const video = item.videoRenderer;
    if (video) {
      results.push({
        title: video.title?.runs?.[0]?.text || "",
        thumbnails: video.thumbnail?.thumbnails || [],
        description:
          video.descriptionSnippet?.runs?.map((r: any) => r.text).join(" ") || "",
        id: video.videoId,
        artists: video.ownerText?.runs?.[0]?.text || "",
        duration:video?.lengthText?.simpleText||"",
        durationText:video?.lengthText?.accessibility?.accessibilityData?.label||""  ,
        durationInSeconds:convertToSeconds(video?.lengthText?.simpleText)||0,
      });
    }
  }




  const continuationToken =extractContinuationToken(response);


  return { results, continuationToken };
}
