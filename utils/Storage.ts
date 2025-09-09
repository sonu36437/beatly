import AsyncStorage from "@react-native-async-storage/async-storage";

interface CacheItem {
  data: any;
  expiry?: number;
}

interface CacheOptions {
  key: string;
  data: any;
  validity?: number; // in hours
}

export const CacheData = async ({ key, data, validity }: CacheOptions): Promise<void> => {
  try {
    if (!key) {
      throw new Error("Key is required for caching data");
    }
    
    let expiry: number | undefined;
    if (validity !== undefined) {
      expiry = Date.now() + (validity * 60 * 60 * 1000);
    }
    
    const item: CacheItem = {
      data,
      expiry
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error caching data:', error);
    throw error;
  }
};

export const HasValidCache = async (key: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) return false;
    const parsedData: CacheItem = JSON.parse(data);
    if (!parsedData.expiry) return true;
    if (Date.now() > parsedData.expiry) {
      await AsyncStorage.removeItem(key);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

export const GetCache = async (key: string): Promise<any | null> => {
  try {
    const isValid = await HasValidCache(key);
    if (!isValid) return null;
    
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    
    const parsedData: CacheItem = JSON.parse(data);
    return parsedData.data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};


export const RemoveCache = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing cached data:', error);
    throw error;
  }
};

export const GetAllCacheKeys = async (): Promise<string[]> => {
  try {
    const allkeys= await AsyncStorage.getAllKeys();
    return allkeys;
  } catch (error) {
    console.error('Error retrieving cache keys:', error);
    return [];
  }
};

export const ClearAllCache = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all cache:', error);
    throw error;
  }
};