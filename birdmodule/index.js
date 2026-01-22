/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const GOOGLE_WEB_CLIENT_ID: string = '532310046514-217fr842olbptie78ubtgi4mkq84ljo8.apps.googleusercontent.com';
// const GOOGLE_ANDROID_CLIENT_ID: string = '532310046514-9c13pu3kgf7sqo1latjgrodclq1kl2m9.apps.googleusercontent.com';


GoogleSignin.configure({
	webClientId: GOOGLE_WEB_CLIENT_ID,
	// androidClientId: GOOGLE_ANDROID_CLIENT_ID,
	// iosClientId: GOOGLE_IOS_CLIENT_ID,
	scopes: ['profile', 'email'],
});

AppRegistry.registerComponent(appName, () => App);
