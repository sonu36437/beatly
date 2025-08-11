import  axios from 'axios';

import { YouTubeFormat } from './types/formats';

import { mobileHeader } from './constants';
import { YouTubeRequestPayload } from './types/context';
import { httpClient } from "./httpclient"
import { searchContinuationParser, searchResponseParser } from "./parsers"
import { extractContinuationToken } from './continuationTokenExtractor';

class InnertubeSession {
    private static instance: InnertubeSession | null = null;
    private context!: YouTubeRequestPayload;

    private constructor() { }

    private static extractInnertubeContext(html: string) {
        const start = html.indexOf('"INNERTUBE_CONTEXT"');
        if (start === -1) return null;

        const firstBrace = html.indexOf('{', start);
        let depth = 0;
        let end = firstBrace;

        for (; end < html.length; end++) {
            if (html[end] === '{') depth++;
            else if (html[end] === '}') depth--;
            if (depth === 0) break;
        }

        const jsonStr = html.slice(firstBrace, end + 1);
        return JSON.parse(jsonStr);
    }

    private static async fetchInnertubeContext(): Promise<YouTubeRequestPayload> {
        try {
            const res= await fetch("https://youtube.com/")
            const html = await res.text();

            const context: YouTubeRequestPayload = InnertubeSession.extractInnertubeContext(html);
            console.log(context);
            
            if (!context) {
                throw new Error("INNERTUBE_CONTEXT not found");
            }

            return context;
        } catch (e) {
            if (e instanceof Error) {

                throw new Error(`Failed to fetch Innertube context: ${e.message}`);
            } else {

                throw new Error(`Failed to fetch Innertube context: ${String(e)}`);
            }
        }
    }


    public static async getInstance(): Promise<InnertubeSession> {
        if (!InnertubeSession.instance) {
            console.log("generating the seession");

            const instance = new InnertubeSession();
            instance.context = await this.fetchInnertubeContext();
            InnertubeSession.instance = instance;
        }

        return InnertubeSession.instance;
    }

    public getContext() {
        return this.context;
    }
    public async searchQuery(query: string) {


        const response = await httpClient("search", {
            query: query
        }, this.context);
        return await searchResponseParser(response);
    }

    public async fetchStreamingUrl(videoId: string): Promise<YouTubeFormat[]> {
        const response = await httpClient("player",
            { videoId: videoId },
            this.context);


        const responseItemsWithMuxedVideoAndAudio = response.streamingData.formats;
        const responseItemsWithoutMuxedVideoAndAudio = response.streamingData.adaptiveFormats;

        const results: YouTubeFormat[] = [];

        for (const item of responseItemsWithMuxedVideoAndAudio) {
            const data: YouTubeFormat = {
                ...item,
                ismuxed: true,
            };

            results.push(data);
        }
        for (const item of responseItemsWithoutMuxedVideoAndAudio) {
            const data: YouTubeFormat = {
                ...item,
                ismuxed: false
            }
            results.push(data);

        }
       

        return results;

    }
    
    public async fetchSearchContinuation(token: string) {
        const response = await httpClient("search", { continuation: token }, this.context

        );


        const results = searchContinuationParser(response);

        const continuation = extractContinuationToken(response);
        return results;

    }

}

export default InnertubeSession;
