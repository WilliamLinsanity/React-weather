import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import WeatherIcon from "./WeatherIcon";
import { ReactComponent as FlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

const Container = styled.div`
  background: #ededed;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  /* padding: 30px 15px; */
`;

const Location = styled.div`
  text-align: center;
  font-size: 30px;
  padding: 5px 0;
  color: #3c3838;
  background-color: #5e5e5e;
  width: 100%;
`;
const Description = styled.div`
  font-size: 20px;
  padding: 0 0 0 5px;
  color: #d36868;
  background-color: #dfa9a9;
`;

const Content = styled.div`
  background-color: #a6c1dd;
  display: flex;
  padding: 0 10px;
`;
const Temperature = styled.div`
  background-color: #c7ec9b;
  display: flex;
  align-items: center;
  justify-items: space-between;
`;
const TemperatureNumber = styled.div`
  font-size: 50px;
`;
const TemperatureStanard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AirFlow = styled.div`
  background-color: #e8b182;
  font-size: 20px;
`;

const Flow = styled(FlowIcon)`
  width: 20px;
  height: 20px;
`;

const Rain = styled.div`
  background-color: #82e8e4;
  font-size: 20px;
`;
const RNIcon = styled(RainIcon)`
  width: 20px;
  height: 20px;
`;
const LastRecord = styled.div`
  text-align: right;
  display: flex;
  height:100%;
  justify-content: flex-end;
  align-items: center;
  font-size: 20px;
  background-color: #9b82e8;

  svg{
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({isLoading}) =>(isLoading ? '1.5s' : '0s')};
    
    @keyframes rotate {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }
  }
`;
const weatherUrl =
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4&locationName=%E8%87%BA%E5%8C%97";
const forecastUrl =
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4&locationName=%E8%87%BA%E5%8C%97%E5%B8%82";
const sunUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-88D06302-5081-4A40-BD5D-2CCD4CDBEDF4&locationName=%E8%87%BA%E5%8C%97%E5%B8%82';
const handleCurrentWather = () => {
  return fetch(weatherUrl)
    .then((res) => res.json())
    .then((data) => {
      const locactionData = data.records.location[0];
      const weatherData = locactionData.weatherElement.reduce((acc, item) => {
        if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
          acc[item.elementName] = item.elementValue;
        }
        return acc;
      });
      return {
        observationTime: locactionData.time.obsTime,
        locationName: locactionData.locationName,
        description: "多雲時晴",
        temperature: weatherData.TEMP,
        windSpeed: weatherData.WDSD,
        humid: weatherData.HUMD
      };
    });
};
const handleForcastWather = () => {
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

const handleSunRiseAndSunset = (observationTime) =>{
  return fetch(sunUrl).then(res=>res.json())
  .then(data=>{
    const sunData = data.records.locations.location[0]  
  // 取得當前時間
  const now = new Date();
  // 今天日期
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');
  let sunRiseAndSunsetData = sunData.time.filter((item)=>{
      if(new Date(item.dataTime).getTime() >= new Date(nowDate).getTime()){
        return item
      }
  })
  sunRiseAndSunsetData = Object.values(sunRiseAndSunsetData).map(data=>({
      ...data,
      sunRise: Object.values(data.parameter).filter(item=> item.parameterName === '日出時刻')[0],
      sunSet: Object.values(data.parameter).filter(item=> item.parameterName === '日沒時刻')[0]
  }))
    //找出今天日期
    const todayDate = sunRiseAndSunsetData.filter(item=>item.dataTime === nowDate )[0] || []       
   return new Date(observationTime).getTime() >= new Date(`${todayDate.dataTime} ${todayDate.sunRise.parameterValue}`) 
    &&  new Date(observationTime).getTime() <= new Date(`${todayDate.dataTime} ${todayDate.sunSet.parameterValue}`)
       ?{moment:'day'}:{moment:'night'}
    
  })
}

const WeatherApp = () => {
  const [weatherElements, setWeatherElements] = useState({
    observationTime: new Date(),
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
  const fetchingData = async () => {
    console.log('123');
    setWeatherElements(prevState =>({
      ...prevState,
      isLoading:true,
    }))
    const [currentWeather, forCastWeather,currentSunData] = await Promise.all([
      handleCurrentWather(),
      handleForcastWather(),
      handleSunRiseAndSunset(weatherElements.observationTime)
    ]);
    setWeatherElements(() =>({
      ...currentWeather,
      ...forCastWeather,
      ...currentSunData,
      isLoading :false,
    }));
  };
  const fetchData = useCallback(() => {
    fetchingData();
  }, []);

  // const moment = useMemo(()=>handleSunRiseAndSunset(weatherElements.observationTime)
  // ,[weatherElements.observationTime,]);
  // TODO 不知道為什麼moment回傳的值是那樣
  // const moment = useMemo(() => handleSunRiseAndSunset(weatherElements.observationTime), [
  //   weatherElements.observationTime,
  // ]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      {console.log('render, isLoading: ', weatherElements.isLoading)}
      <WeatherCard>
        <Location>{weatherElements.locationName}</Location>
        <Description>{weatherElements.description}</Description>
        <Content>
          <Temperature>
            <TemperatureNumber>
              {Math.round(weatherElements.temperature)}
            </TemperatureNumber>
            <TemperatureStanard>°C</TemperatureStanard>
            <WeatherIcon
              currentWeatherCode={weatherElements.weatherCode}
              moment={weatherElements.moment || 'day'}
            />
          </Temperature>
        </Content>
        <AirFlow>
          <Flow />
          {weatherElements.windSpeed}m/h
        </AirFlow>
        <Rain>
          <RNIcon />
          {weatherElements.rainPossibility}%
        </Rain>
        <LastRecord onClick={fetchingData} isLoading={weatherElements.isLoading}>
          最後觀測時間:
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric"
          }).format(new Date(weatherElements.observationTime))}{" "}
         {(weatherElements.isLoading? <LoadingIcon/> : <RefreshIcon/>)}
        </LastRecord>
      </WeatherCard>
    </Container>
  );
};
export default WeatherApp;
