export interface YouTubeRequestPayload {
  clickTracking?: {
    clickTrackingParams: string;
  };
  client: {
    hl: string;
    gl: string;
    remoteHost: string;
    deviceMake: string;
    deviceModel: string;
    browserName: string;
    browserVersion: string;
    clientFormFactor: string;
    clientName: string;
    clientScreen: string;
    clientVersion: string;
    acceptHeader: string;
    configInfo?: Record<string, unknown>;
    deviceExperimentId?: string;

    memoryTotalKbytes?: string;
    originalUrl?: string;
    osName: string;
    osVersion: string;
    platform: string;
    playerType: string;
    rolloutToken?: string;
    screenDensityFloat?: number;
    screenHeightPoints?: number;
    screenPixelDensity?: number;
    screenWidthPoints?: number;
    timeZone?: string;
    userAgent: string;
    userInterfaceTheme?: string;
    utcOffsetMinutes?: number;
    visitorData: string;
  };
  request?: {
    useSsl?: boolean;
    internalExperimentFlags?: unknown[];
    consistencyTokenJars?: unknown[];
  };
  user?: {
    lockedSafetyMode?: boolean;
  };
  playbackContext?: Record<string, unknown>;
  contentPlaybackContext?: {
    currentUrl: string;
    vis?: number;
    splay?: boolean;
    autoCaptionsDefaultOn?: boolean;
  };
  devicePlaybackCapabilities?: {
    supportsVp9Encoding?: boolean;
    supportXhr?: boolean;
  };
  racyCheckOk?: boolean;
  serviceIntegrityDimensions?: Record<string, unknown>;
  videoId?: string;
}
