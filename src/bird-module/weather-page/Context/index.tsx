import React, { useContext, createContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';
import { Alert } from "react-native";

// Define interfaces
interface Weather {
  temp_c: number;
  humidity: number;
  temp_f: number;
  conditions: string;
  wind_mph: number;
  wind_kph: number;
}

interface Value {
  datetime: string;
  temp_c: number;
  temp_f: number;
  conditions: string;
}

interface StateContextType {
  weather: Weather;
  setPlace: React.Dispatch<React.SetStateAction<string>>;
  values: Value[];
  thisLocation: string;
  place: string;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const [weather, setWeather] = useState<Weather>({} as Weather);
  const [values, setValues] = useState<Value[]>([]);
  const [place, setPlace] = useState<string>('London');
  const [thisLocation, setLocation] = useState<string>('');

  // fetch api
  const fetchWeather = async () => {
    const options = {
      method: 'GET',
      url: `http://api.weatherapi.com/v1/current.json?key=3a034590502b4b4aabf104931243107&q=${place}&aqi=no`
    };

    try {
      const response = await axios.request(options);
      const thisData = response.data;

      setLocation(`${thisData.location.name}, ${thisData.location.region}`);
      setValues([
        {
          datetime: thisData.location.localtime,
          temp_c: thisData.current.temp_c,
          temp_f: thisData.current.temp_f,
          conditions: thisData.current.condition.text,
        }
      ]);
      setWeather({
        temp_c: thisData.current.temp_c,
        humidity: thisData.current.humidity,
        temp_f: thisData.current.temp_f,
        conditions: thisData.current.condition.text,
        wind_mph: thisData.current.wind_mph,
        wind_kph: thisData.current.wind_kph,
      });
    } catch (e) {
      console.error(e);
      Alert.alert('This place does not exist');
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [place]);

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <StateContext.Provider value={{ weather, setPlace, values, thisLocation, place }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};
