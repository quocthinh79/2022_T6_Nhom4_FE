import axios from "axios";

export const requestWeather = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: "https://thoitiet.vn/",
});

export const getWeather = async (path, option = {}) => {
  const response = await requestWeather.get(path, option);
  return response.data;
};

export const requestWeatherFromMySql = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: "http://localhost:9999",
});

export const getWeatherFromMySql = async (path = '/', option = {}) => {
  const response = await requestWeatherFromMySql.get(path, option);
  return response;
};
