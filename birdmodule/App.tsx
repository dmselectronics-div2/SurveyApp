import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appearance, useColorScheme } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper'; // Updated to use MD3DarkTheme
import HomeScreen from './src/component/start-pages/home-screen';
import StartPageA from './src/component/start-pages/start-page-B';
import VerifyEmail from './src/component/register-page/veryfy-email';
import VerifyFingerPrint from './src/component/register-page/verify-fingerprint';
import SetPin from './src/component/register-page/pin-password';
import SelectResearchArea from './src/component/home-page/select-research-area';
import LoginPage from './src/component/login-page/login-page';
import AddPin from './src/component/login-page/addpin-page';
import Welcome from './src/component/welcome-page/welcome';
import StartPageB from './src/component/start-pages/start-page-B';
import BottomNav from './src/component/bottom-navpage/bottom-nav';
import AppBarPage from './src/component/appbar-page/appbar-page';
import New from './src/component/survey-form-page/new';
import RegisterPage from './src/component/register-page/register-page';
import ForgetPasswordPage from './src/component/login-page/forgot-pasword';
import LocationForm from './src/component/survey-form-page/datePicker';
import DisplayTable from './src/component/data-table/display-table';
import MainDashboardPage from './src/component/dashboard-page/dash-board';
import MyDataTable from './src/component/data-table/display-table';
import SelectLocation from './src/component/change-mode-offline/change-mode';
import SurveyFormPage from './src/component/Edit-Survey/Edit-survey';
import SelectEditMode from './src/component/Edit-Survey/Edit-permition';
import EditCount from './src/component/Edit-Survey/Edit-count';
import SearchPage from './src/component/Search-page/search-page';
import AlertPage from './src/component/custom-alert/alert-design';
import CountTable from './src/component/count-table/count-table';
import StartPage from './src/component/start-pages/start-page';
import StartPageC from './src/component/start-pages/start-page-C';
import PureSearchPage from './src/component/Search-page/search-by-date';
import SearchCount from './src/component/Search-page/search-count';
import DraftSurvey from './src/component/submitted-draft-survey/draft-page';
import AddName from './src/component/home-page/name-page';
import SearchOption from './src/component/Search-page/search-option';
import MainHomePage from './src/component/Main-page/main-home';
import EmailInput from './src/component/verifyemail/emailVerification';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CitizenForm from './src/component/survey-form-page/citizenSurvey';
import { useEffect, useState } from 'react';
import Test from './src/component/survey-form-page/survey-page';
import * as Keychain from 'react-native-keychain';
import GetUserName from './src/component/register-page/get-user-name';
import VerifyFPEmail from './src/component/login-page/veryfy-fogotPW-email';
import ResetPassword from './src/component/login-page/reset-password';
import ProfileImageChange from './src/component/dashboard-page/menu-page/change-profile-image';
import ProfileMenu from './src/component/dashboard-page/menu-page/profile-page';
import SetNewPin from './src/component/login-page/re-add-new-pin';
import PieChartModel from './src/component/dashboard-page/pie-charts/diversity-indices';
import PieChartModel1 from './src/component/dashboard-page/pie-charts/diversity-indices1';
import PieChartModel2 from './src/component/dashboard-page/pie-charts/diversity-indices2';
import PieChartModel3 from './src/component/dashboard-page/pie-charts/diversity indices3';
import FormBuilder from './src/component/bivalve-components/bivalve-form/bivalve-form';
import QuestionsScreen from './src/component/bivalve-components/bivalve-form/quessionarie';
// import PrivacyPolicy from './src/component/register-page/privacy-policy';
import FormTemp from './src/component/bivalve-components/bivalve-form-templates/bivalve-form-template';
import SurveyComponent from './src/component/survey-drafts/add-new-survey';
import SurveyPointData from './src/component/survey-drafts/survey-point-data';
import SurveyTeamData from './src/component/survey-drafts/team-members';
import TeamData from './src/component/survey-drafts/team-members';
import CommonData from './src/component/survey-drafts/common-data';
import CommonData1 from './src/component/survey-drafts/survey-select';
import BirdDataRecord from './src/component/survey-drafts/add-bird-data';
import Notepad from './src/component/survey-drafts/survey-select';
import PrivacyPolicy from './src/component/register-page/privacy-policy';
import GetAdminApprove from './src/component/register-page/get-verification-admin';

import SQLite from 'react-native-sqlite-storage';
import MyCitizenTable from './src/component/data-table/data-table-display';
import CitySearchPage from './src/component/Search-page/search-citizen';

// Google Client Configuration
const GOOGLE_WEB_CLIENT_ID: string = '532310046514-217fr842olbptie78ubtgi4mkq84ljo8.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

// Custom Light and Dark Themes
const lightTheme = {
  ...MD3LightTheme, // Consistent use of MD3LightTheme
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    background: '#FFFFFF',
    text: '#000000',
  },
};

const darkTheme = {
  ...MD3DarkTheme, // Consistent use of MD3DarkTheme for dark mode
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    background: '#121212',
    text: '#FFFFFF',
  },
};

// Create the Stack Navigator
const Stack = createNativeStackNavigator();

const customAnimation = {
  animationEnabled: true,
  gestureEnabled: true,
  cardStyleInterpolator: ({
    current,
  }: {
    current: { progress: { interpolate: Function } };
  }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1000, 0],
          }),
        },
      ],
    },
  }),
};

const App = () => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme === 'dark' ? darkTheme : lightTheme);

  const [initialRoute, setInitialRoute] = useState(null); 

  // Open the SQLite database
    const db = SQLite.openDatabase(
      {name: 'user_db.db', location: 'default'},
      () => {
        console.log('Database opened successfully');
      },
      error => {
        console.error('Error opening database: ', error);
      },
    );

  // Function to retrieve email securely
  const retrieveEmailSecurely = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT email FROM LoginData',
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows.item(0).email);
            } else {
              resolve(null);
            }
          },
          error => {
            console.log('Error querying Users table: ' + error.message);
            resolve(null);
          }
        );
      });
    });
  };
  

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });
    return () => listener.remove();
  }, []);

   // UseEffect to set the initial route based on whether email exists
   useEffect(() => {
    const checkForEmail = async () => {
      const email = await retrieveEmailSecurely();
      setInitialRoute(email ? 'LoginPage' : 'StartPage');
    };
    checkForEmail();
  }, []);
  

   // Return null or a loader until the initial route is determined
   if (!initialRoute) {
    return null; // or add a loading screen here if you want
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}  // Dynamically set initial route
          screenOptions={{
            headerShown: false,
            ...customAnimation,
          }}>
          <Stack.Screen
            name="MyCitizenTable"   //MyCitizenTable
            component={MyCitizenTable}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="CommonData"   //BirdDataRecord
            component={CommonData}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="CitySearchPage"   //CitySearchPage
            component={CitySearchPage}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="BirdDataRecord"   //CommonData
            component={BirdDataRecord}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="TeamData"   //SurveyTeamData
            component={TeamData}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="SurveyComponent"   //SurveyComponent
            component={SurveyComponent}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="CitizenForm"
            component={CitizenForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DraftSurvey"
            component={DraftSurvey}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchOption"  
            component={SearchOption}
            options={{ headerShown: false }}
          />
              <Stack.Screen
            name="PrivacyPolicy"   
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EmailInput"
            component={EmailInput}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchCount"
            component={SearchCount}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PureSearchPage"
            component={PureSearchPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StartPage"
            component={StartPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StartPageC"
            component={StartPageC}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditCount"
            component={EditCount}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="SurveyPointData"
            component={SurveyPointData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchPage"
            component={SearchPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectEditMode"
            component={SelectEditMode}
            options={{ headerShown: false }}
          />
        
          <Stack.Screen
            name="SurveyFormPage"
            component={SurveyFormPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddName"
            component={AddName}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="New"
            component={New}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectLocation"
            component={SelectLocation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StartPageA"
            component={StartPageA}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LocationForm"
            component={LocationForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GetAdminApprove"
            component={GetAdminApprove}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgetPasswordPage"
            component={ForgetPasswordPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppBarPage"
            component={AppBarPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomNav"
            component={BottomNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StartPageB"
            component={StartPageB}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPin"
            component={AddPin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterPage"
            component={RegisterPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyFingerPrint"
            component={VerifyFingerPrint}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetPin"
            component={SetPin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainDashboardPage"
            component={MainDashboardPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectResearchArea"
            component={SelectResearchArea}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GetUserName"
            component={GetUserName}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="FormTemp"
            component={FormTemp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyFPEmail"
            component={VerifyFPEmail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileImageChange"
            component={ProfileImageChange}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileMenu"
            component={ProfileMenu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetNewPin"
            component={SetNewPin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PieChartModel"
            component={PieChartModel}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="PieChartModel1"
            component={PieChartModel1}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="PieChartModel2"
            component={PieChartModel2}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="PieChartModel3"
            component={PieChartModel3}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="QuestionsScreen"
            component={QuestionsScreen}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="FormBuilder"
            component={FormBuilder}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
