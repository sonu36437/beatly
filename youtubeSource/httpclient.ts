import axios from "axios";
import { urls ,apiKey,YoutubeClientContext,YoutubeAndroidClientContext} from "./constants";
import { YouTubeRequestPayload } from "./types/context";


interface QueryData {
  videoId?:string,
  query?:string,
  continuation?:string

}


export async function httpClient(endpoint:string, data:QueryData,context:YouTubeRequestPayload){
 const url = `${urls.Baseurl}/${endpoint}?prettyPrint=false`
 console.log(context);
 
 
 

  if(endpoint==='search' && data.query){
    console.log(context);
    
    let formattedQuery = data?.query.trim().split(" ").filter(Boolean).join("+");
    context.client.clientName="WEB"
    context.client.clientVersion="2.20250710.09.00"
    context.client.originalUrl=`https://www.youtube.com/results?search_query=${formattedQuery}`
  }
  if(endpoint==='player'){
    context.client.clientName="ANDROID"
    context.client.clientVersion="19.35.36"
  }
  console.log("this is the context from http client ",context);
  
 console.log(url);
    const body= {
        context,
        ...data
    };
    console.log(body);
    
    const res=await axios.post(url,body,{
        headers:{
            "Content-Type":"application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36"
        },
        
        
    });
    
    return res.data;
 


}