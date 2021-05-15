import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from '@emotion/react';
import WeatherCard from "./WeatherCard";
import useWeatherApi from './useWeatherApi'
import WeatherSetting from "./WeatherSetting";
import { findLocation } from './utils';
import dayjs from 'dayjs';

const theme ={
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
}

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const sunUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4';


const getMoment = (locationName) =>{ 
     return fetch(sunUrl).then(res=>res.json())
      .then(data=>{
          const location = data.records.locations.location.find(
            (data) => data.locationName === locationName
          );

          if (!location) return null;
      // 取得當前時間
      const now = dayjs();
      // 今天日期
      const nowDate = Intl.DateTimeFormat('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
      })
          .format(now)
          .replace(/\//g, '-');

      let sunriseAndSunsetData = location.time.filter((item)=>{
          if(dayjs(item.dataTime).unix() >= dayjs(nowDate).unix()){
              return item
          }
          return false
      })    

      sunriseAndSunsetData = Object.values(sunriseAndSunsetData).map(data=>({
          ...data,
          sunrise: Object.values(data.parameter).filter(item=> item.parameterName === '日出時刻')[0],
          sunset: Object.values(data.parameter).filter(item=> item.parameterName === '日沒時刻')[0]
      }))
    
      //找出今天日期
      const todayDate = sunriseAndSunsetData.filter(item=>item.dataTime === nowDate )[0] || []       
      
      const sunriseTimestamp = dayjs(
        `${todayDate.dataTime} ${todayDate.sunrise.parameterValue}`
      ).unix();

      const sunsetTimestamp = dayjs(
        `${todayDate.dataTime} ${todayDate.sunset.parameterValue}`
      ).unix();

      const nowTimeStamp = now.unix();   
        
     return nowTimeStamp >= sunriseTimestamp 
          && nowTimeStamp <= sunsetTimestamp 
          ?'day':'night'
  })
}
const WeatherApp = () => {
  // 找尋現在使用者所設定的城市
  const storageCity = localStorage.getItem('cityName');
  const [ currentCity, setCurrentCity ] = useState(storageCity || '臺北市');
  const currentLocation = findLocation(currentCity) || {};

  const [ fetchData, weatherElements ]= useWeatherApi(currentLocation);
  const [ currentTheme, setCurrentTheme ] = useState('light');
  const [ currentPage, setCurrentPage ] = useState('WeatherCard');
  const [momentElement, setMoment] = useState('')

  //step1:在畫面渲染完之後去判斷現在是白天或晚上
   useMemo(() => {
    const fetchingData = async () => {
      const [currentMoment] = await Promise.all([
        getMoment(currentLocation.cityName),
      ]);
      setMoment(currentMoment);
    }      
    fetchingData()
  },[currentLocation.cityName])

    useEffect(() => {
      localStorage.setItem('cityName', currentCity);
    }, [currentCity]);
    
  // step2:讓theme知道現在要採用哪種樣式
  useEffect(() =>{   
    setCurrentTheme(momentElement === 'day'? 'light' : 'dark');
  },[momentElement]); 

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard 
          weatherElements={weatherElements}
          cityName={currentLocation.cityName}
          //step3:塞入現在的moment
          moment={momentElement}
          fetchData={fetchData} 
          setCurrentPage={setCurrentPage}
          /> 
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting 
          cityName={currentLocation.cityName}
          setCurrentCity={setCurrentCity}
          setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};
export default WeatherApp;
