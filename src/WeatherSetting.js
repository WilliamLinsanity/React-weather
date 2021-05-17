import React, { useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "./utils";

const WeatherSettingWrapper = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-width: 360px;
  padding: 5px 10px;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.titleColor};
  font-size: 30px;
  font-weight: 800;
`;

const LocationLabel = styled.div`
  color: ${({ theme }) => theme.textColor};
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const SelectList = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const CancelBtn = styled.button`
  && {
    border-color: ${({ theme }) => theme.textColor};
    color: ${({ theme }) => theme.textColor};
  }
`;

const ConfirmBtn = styled.button`
  && {
    background-color: #40a9f3;
    color: #ffffff;
  }
`;

const locations = availableLocations.map((location) => location.cityName);

const WeatherSetting = (props) => {
  const { setCurrentPage, cityName, setCurrentCity } = props;
  const [locationName, setLocationName] = useState(cityName);
  const handleSave = () => {
    if (locations.includes(locationName)) {
      setCurrentPage("WeatherCard");
      setCurrentCity(locationName);
    } else {
      alert(`您輸入的${locationName}並不是有效地區`);
    }
  };

  const handleChange = (e) => {
    setLocationName(e.target.value);
  };
  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <LocationLabel>地區</LocationLabel>
      <SelectList id="location" name="location" onChange={handleChange} value={locationName}>
        {locations.map((location) => (
          <option value={location} key={location}>
            {location}
          </option>
        ))}
      </SelectList>
      <Footer>
        <CancelBtn onClick={() => setCurrentPage("WeatherCard")}>返回</CancelBtn>
        <ConfirmBtn onClick={() => handleSave()}>儲存</ConfirmBtn>
      </Footer>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
