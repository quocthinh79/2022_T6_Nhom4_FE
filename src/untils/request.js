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

export const getCity = async (path = '/weather/get-city', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/get-city`, option);
  return response.data;
};

export const thoiTietHienTai = async (cityId,path = '/weather/thoi-tiet-hien-tai', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-hien-tai/${cityId}`, option);
  return response.data[0];
};

export const thoiTietNgayMai = async (cityId,path = '/weather/thoi-tiet-ngay-mai', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-ngay-mai/${cityId}`, option);
  return response.data[0];
};

export const thoiTietNgayMot = async (cityId,path = '/weather/thoi-tiet-ngay-mot', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-ngay-mot/${cityId}`, option);
  return response.data[0];
};

export const thoiTietBaNgayToi = async (cityId,path = '/weather/thoi-tiet-ba-ngay-toi', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-ba-ngay-toi/${cityId}`, option);
  return response.data[0];
};

export const thoiTietBonNgayToi = async (cityId,path = '/weather/thoi-tiet-bon-ngay-toi', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-bon-ngay-toi/${cityId}`, option);
  return response.data[0];
};

export const thoiTietNamNgayToi = async (cityId,path = '/weather/thoi-tiet-nam-ngay-toi', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-nam-ngay-toi/${cityId}`, option);
  return response.data[0];
};

export const thoiTietSauNgayToi = async (cityId,path = '/weather/thoi-tiet-sau-ngay-toi', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-sau-ngay-toi/${cityId}`, option);
  return response.data[0];
};

export const thoiTietBayNgayToi = async (cityId,path = '/weather/thoi-tiet-bay-ngay-toi', option = {}) => {
  const response = await requestWeatherFromMySql.get(path = `/weather/thoi-tiet-bay-ngay-toi/${cityId}`, option);
  return response.data[0];
};
