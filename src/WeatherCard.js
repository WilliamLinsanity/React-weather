import React from "react";
import styled from "@emotion/styled";
import WeatherIcon from "./WeatherIcon";
import { ReactComponent as FlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";
import dayjs from "dayjs";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 0 10px;
`;

const Cog = styled(CogIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Location = styled.div`
  color: ${({ theme }) => theme.titleColor};
  font-size: 30px;
  font-weight: 800;
  padding: 5px 0;
  width: 100%;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.titleColor};
  font-weight: 600;
  font-size: 20px;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Temperature = styled.div`
  display: flex;
`;

const TemperatureNumber = styled.div`
  font-size: 100px;
`;

const TemperatureStanard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 40px;
`;

const AirFlow = styled.div`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  font-size: 20px;
  margin: 10px 0;
`;

const Flow = styled(FlowIcon)`
  width: 20px;
  height: 20px;
  margin-right: 20px;
`;

const Rain = styled.div`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  font-size: 20px;
  margin: 10px 0;
`;

const RNIcon = styled(RainIcon)`
  width: 20px;
  height: 20px;
  margin-right: 20px;
`;

const LastRecord = styled.div`
  color: ${({ theme }) => theme.textColor};
  text-align: right;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  font-size: 20px;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};

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

const WeatherCard = (props) => {
  const { weatherElements, moment, cityName, fetchingData, setCurrentPage } = props;
  return (
    <WeatherCardWrapper>
      <Cog onClick={() => setCurrentPage("WeatherSetting")}></Cog>
      <Location>{cityName}</Location>
      <Description>{weatherElements.description}</Description>
      <Content>
        <Temperature>
          <TemperatureNumber>{Math.round(weatherElements.temperature)}</TemperatureNumber>
          <TemperatureStanard>°C</TemperatureStanard>
        </Temperature>
        <WeatherIcon currentWeatherCode={weatherElements.weatherCode} moment={moment || "day"} />
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
          minute: "numeric",
        }).format(dayjs(weatherElements.observationTime))}{" "}
        {weatherElements.isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </LastRecord>
    </WeatherCardWrapper>
  );
};
export default WeatherCard;
