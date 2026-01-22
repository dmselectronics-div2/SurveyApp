// Unified Configuration for SurveyApp
// All module API endpoints and shared configuration

export const API_KEY = '3a034590502b4b4aabf104931243107';

// Module-specific API endpoints
export const API_URLS = {
  BIRD: 'http://82.180.155.215:5001',
  CITIZEN: 'http://172.20.10.7:5000/api',
  MANGROVE: 'http://172.20.8.74:6001',
};

// For backward compatibility with existing components
export const API_URL = API_URLS.BIRD; // Default to bird module API

// Google Sign-In Configuration
export const GOOGLE_WEB_CLIENT_ID = '532310046514-217fr842olbptie78ubtgi4mkq84ljo8.apps.googleusercontent.com';

// Module identifiers
export enum ModuleType {
  BIRD = 'BIRD',
  CITIZEN = 'CITIZEN',
  MANGROVE = 'MANGROVE',
}

// Get API URL by module type
export const getApiUrl = (moduleType: ModuleType): string => {
  return API_URLS[moduleType];
};
