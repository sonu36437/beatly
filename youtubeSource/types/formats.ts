export type YouTubeFormat = {
  itag: number;
  url: string;
  mimeType: string;
  bitrate?: number;
  averageBitrate?: number;
  width?: number;
  height?: number;
  fps?: number;
  quality?: string;
  qualityLabel?: string;
  projectionType?: string;
  audioQuality?: string;
  audioSampleRate?: string;
  audioChannels?: number;
  contentLength?: string;
  approxDurationMs?: string;
  lastModified?: string;
  container?: string; 
  codecs?: string;    
  hasVideo: boolean;
  hasAudio: boolean;
  isAdaptive: boolean;
  ismuxed?: boolean;


};