import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { API_URL, API_TIMEOUT } from '../config';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  details: string;
}

export interface APIStatus {
  isReachable: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
}

/**
 * Check the device's network connectivity status
 */
export const checkNetworkStatus = async (): Promise<NetworkStatus> => {
  try {
    const netInfo = await NetInfo.fetch();
    const details = `${netInfo.type}${netInfo.isConnected ? ' (connected)' : ' (disconnected)'}`;
    
    console.log(`[Network] Status: ${details}`);
    
    return {
      isConnected: netInfo.isConnected ?? false,
      isInternetReachable: netInfo.isInternetReachable ?? false,
      type: netInfo.type || 'unknown',
      details,
    };
  } catch (error: any) {
    console.error('[Network] Error checking status:', error.message);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      details: 'Unable to determine network status',
    };
  }
};

/**
 * Check if the backend API is reachable
 */
export const checkAPIReachability = async (): Promise<APIStatus> => {
  const startTime = Date.now();
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: API_TIMEOUT,
    });
    
    const responseTime = Date.now() - startTime;
    const isReachable = response.status === 200;
    
    if (isReachable) {
      console.log(`[API] Reachable in ${responseTime}ms at ${API_URL}`);
    } else {
      console.warn(`[API] Unexpected status ${response.status} from ${API_URL}`);
    }
    
    return {
      isReachable,
      responseTime,
      statusCode: response.status,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const errorMsg = error.message || 'Unknown error';
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn(`[API] Timeout (${responseTime}ms) reaching ${API_URL}`);
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      console.warn(`[API] Connection refused to ${API_URL} - server may not be running`);
    } else if (error.message.includes('Network Error')) {
      console.warn(`[API] Network error reaching ${API_URL}`);
    } else {
      console.warn(`[API] Error reaching ${API_URL}: ${errorMsg}`);
    }
    
    return {
      isReachable: false,
      responseTime,
      error: errorMsg,
    };
  }
};

/**
 * Perform comprehensive network diagnostics
 */
export const runNetworkDiagnostics = async (): Promise<{
  network: NetworkStatus;
  api: APIStatus;
  summary: string;
}> => {
  console.log('[Diagnostics] Starting network diagnostics...');
  
  const network = await checkNetworkStatus();
  const api = await checkAPIReachability();
  
  let summary = '';
  if (!network.isConnected) {
    summary = 'Device is not connected to any network';
  } else if (!network.isInternetReachable) {
    summary = 'Device is connected but internet is not reachable';
  } else if (!api.isReachable) {
    summary = `Backend API at ${API_URL} is not reachable`;
  } else {
    summary = 'All systems operational';
  }
  
  console.log(`[Diagnostics] Summary: ${summary}`);
  
  return { network, api, summary };
};

/**
 * Wrapper for API calls with better error handling and logging
 */
export const makeAPICall = async (
  endpoint: string,
  options: any = {},
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const url = `${API_URL}${endpoint}`;
    const startTime = Date.now();
    
    const response = await axios.get(url, {
      timeout: API_TIMEOUT,
      ...options,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[API] ${endpoint} completed in ${duration}ms`);
    
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error(`[API] ${endpoint} failed:`, errorMsg);
    
    return { success: false, error: errorMsg };
  }
};
