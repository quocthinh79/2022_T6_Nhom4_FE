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

export const importDataFromCsvFile = async (fileName ,path = '/weather/import-data', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/import-data/${fileName}`, option);
  return response;
};

export const handleStaging = async (path = '/weather/handle-staging', option = {}) => {
  const response = await requestWeatherFromMySql.get(path, option);
  return response;
};

export const handleWarehouse = async (path = '/weather/handle-data-warehouse', option = {}) => {
  const response = await requestWeatherFromMySql.get(path, option);
  return response;
};

export const handleWriteLog = async (fileName, logDate, actionLog, status,path = '/filelog/handle-write-log', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/filelog/handle-write-log/${fileName}/${logDate}/${actionLog}/${status}`, option);
  return response;
};
