import { useState, useCallback, useEffect } from "react";
import dayjs from 'dayjs';

const useWeatherApi = (currentLocation) =>{
  const { locationName, cityName } = currentLocation;
    const [weatherElements, setWeatherElements] = useState({
        observationTime: dayjs(),
        locationName: "",
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        description: "",
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: "",
        moment:"",
        isLoading:true,
      });
  
  
  const handleCurrentWather = (locationName) => {
    const weatherUrl =
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4&locationName=${locationName}`;
    return fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {       
        const locationData = data.records.location[0] || alert('您所搜尋的區域並未有資料');
        let weatherData  ={}
        if(locationData){
          weatherData = locationData.weatherElement.reduce((acc, item) => {
              if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
              acc[item.elementName] = item.elementValue;
              }
              return acc;
          });
          return {
              observationTime: locationData.time.obsTime,
              locationName: locationData.locationName,
              temperature: weatherData.TEMP,
              windSpeed: weatherData.WDSD,
              humid: weatherData.HUMD
          };
        }
        return false;
        });
    };
    const handleForcastWather = (cityName) => {
      const forecastUrl =
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4&locationName=${cityName}`;
    return fetch(forecastUrl)
        .then((res) => res.json())
        .then((data) => {
          const locationData = data.records.location[0];
        const weatherData = {};
        locationData.weatherElement.forEach((item, index) => {
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            weatherData[`${item.elementName}`] = item.time[0].parameter;
            }
        });
        return {
            description: weatherData.Wx.parameterName,
            weatherCode: weatherData.Wx.parameterValue,
            rainPossibility: weatherData.PoP.parameterName,
            comfortability: weatherData.CI.parameterName
        };
        });
    };
    const fetchData = useCallback(() => {
      const fetchingData = async () => {
        setWeatherElements(prevState =>({
          ...prevState,
          isLoading:true,
        }))
        const [currentWeather, forCastWeather] = await Promise.all([
          handleCurrentWather(locationName),
          handleForcastWather(cityName),        
        ]);
      
        setWeatherElements(() =>({
          ...currentWeather,
          ...forCastWeather,
          isLoading :false,
        }));  
      };
      fetchingData();
      }, [locationName, cityName]);
    
      useEffect(() => {
        fetchData();
      }, [fetchData]);
      return [fetchData, weatherElements]
}
export default useWeatherApi;