import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import * as request from "~/untils/request";

function CrawlWeatherData() {
  const dataSheet = [];
  const CITY_NUMBER = 63;
  function createArrayBigData(arrayNumber, array) {
    for (let i = 1; i <= arrayNumber; i++) {
      array.push({
        NhietDoHienTai: "",
        TinhThanhPho: "",
        MoTa: "",
        ChatLuongKhongKhi: "",
        DoAmHienTai: "",
        TamNhin: "",
        Gio: "",
        NgayMai: "",
        LuongMuaNgayMai: "",
        ThoiTietNgayMai: "",
        NhietDoNgayMai: "",
        NgayMot: "",
        LuongMuaNgayMot: "",
        ThoiTietNgayMot: "",
        NhietDoNgayMot: "",
        BaNgayToi: "",
        LuongMuaBaNgayToi: "",
        ThoiTietBaNgayToi: "",
        NhietDoBaNgayToi: "",
        BonNgayToi: "",
        LuongMuaBonNgayToi: "",
        ThoiTietBonNgayToi: "",
        NhietDoBonNgayToi: "",
        NamNgayToi: "",
        LuongMuaNamNgayToi: "",
        ThoiTietNamNgayToi: "",
        NhietDoNamNgayToi: "",
        SauNgayToi: "",
        LuongMuaSauNgayToi: "",
        ThoiTietSauNgayToi: "",
        NhietDoSauNgayToi: "",
        BayNgayToi: "",
        LuongMuaBayNgayToi: "",
        ThoiTietBayNgayToi: "",
        NhietDoBayNgayToi: "",
        NgayCapNhat: "",
      });
    }
  }
  createArrayBigData(CITY_NUMBER, dataSheet);
  const arrCity = [];

  const weatherDataFeed2 = async (href = "") => {
    try {
      const res = await request.getWeather(href);
      return res;
    } catch (error) {
      writeLog(`ThoiTietVN_${getToday()}`, getToday(), "Crawl data to CSV file", "ERROR");
    }
  };

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return (today = dd + "-" + mm + "-" + yyyy);
  }

  var BreakException = {}; // Break forEach

  function pushAttributeToObjectInArray(attribute, value) {
    try {
      dataSheet.forEach((element) => {
        if (
          element[attribute] === null ||
          element[attribute] === undefined ||
          element[attribute] === ""
        ) {
          element[attribute] = value;
          throw BreakException; // Break forEach
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e; // Break forEach
    }
  }

  let count = 0;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showDown, setShowDown] = useState(false);
  const [getCity, setGetCity] = useState(null);
  const getHref = async () => {
    const result = await weatherDataFeed2();
    const cheerio = require("cheerio");
    const $ = cheerio.load(result);

    $(".dropdown-menu.megamenu.rounded-0 li a").each(function (element) {
      let href = $(this).attr("href");
      arrCity.push(href);
    });
    arrCity.forEach(async (item) => {
      setLoading(true);
      const result = await weatherDataFeed2(item);
      const cheerio = require("cheerio");
      const $ = cheerio.load(result);

      const temperature = $("span.current-temperature").text();
      pushAttributeToObjectInArray("NhietDoHienTai", temperature);
      const city = $(`h1.location-name-main > a[href^="${item}"]`)
        .text()
        .trim()
        .replace("Dự báo thời tiết ", "");
      pushAttributeToObjectInArray("TinhThanhPho", city);
      const description = $(
        ".overview-caption-item.overview-caption-item-detail"
      ).text();
      pushAttributeToObjectInArray("MoTa", description);
      const air = $(".air-title")
        .text()
        .trim()
        .replace("Chất lượng không khí: ", "");
      pushAttributeToObjectInArray("ChatLuongKhongKhi", air);
      const updateTime = $("#timer").text().trim();
      pushAttributeToObjectInArray(
        "NgayCapNhat",
        updateTime.slice(updateTime.indexOf(" | ") + 3, updateTime.length)
      );

      const doAmHienTai = $(
        ".current-location .d-flex.flex-wrap.justify-content-between.weather-detail.mt-2 > .d-flex:nth-child(2) span.text-white.op-8.fw-bold"
      ).text();
      pushAttributeToObjectInArray("DoAmHienTai", doAmHienTai);

      const tamNhin = $(
        ".current-location .d-flex.flex-wrap.justify-content-between.weather-detail.mt-2 > .d-flex:nth-child(3) span.text-white.op-8.fw-bold"
      ).text();
      pushAttributeToObjectInArray("TamNhin", tamNhin);

      const gio = $(
        ".current-location .d-flex.flex-wrap.justify-content-between.weather-detail.mt-2 > .d-flex:nth-child(4) span.text-white.op-8.fw-bold"
      ).text();
      pushAttributeToObjectInArray("Gio", gio);

      // Ngày mai
      for (let i = 2; i <= 8; i++) {
        const currentDay = updateTime.slice(
          updateTime.indexOf(" | ") + 3,
          updateTime.length
        );
        const [day, month, year] = currentDay.split("/");
        const ngayToi = $(
          `.weather-feature .carousel-item.col-md-3:nth-child(${i}) .card-city-title`
        )
          .text()
          .trim();
        const luongMuaNgayToi = $(
          `.weather-feature .carousel-item.col-md-3:nth-child(${i}) .precipitation`
        )
          .text()
          .trim()
          .replace(" ", "");
        const moTaNgayToi = $(
          `.weather-feature .carousel-item.col-md-3:nth-child(${i}) p.mb-0`
        )
          .text()
          .trim();
        const nhietDoGiaoDongNgayToi = $(
          `.weather-feature .carousel-item.col-md-3:nth-child(${i}) .card-city-footer`
        )
          .text()
          .trim()
          .replaceAll(/[\n\r\s\t]+/g, " ");
        switch (i) {
          case 2:
            pushAttributeToObjectInArray(
              "NgayMai",
              `${parseInt(day) + 1}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaNgayMai", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietNgayMai", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoNgayMai",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 3:
            pushAttributeToObjectInArray(
              "NgayMot",
              `${parseInt(day) + 2}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaNgayMot", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietNgayMot", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoNgayMot",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 4:
            pushAttributeToObjectInArray(
              "BaNgayToi",
              `${parseInt(day) + 3}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaBaNgayToi", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietBaNgayToi", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoBaNgayToi",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 5:
            pushAttributeToObjectInArray(
              "BonNgayToi",
              `${parseInt(day) + 4}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaBonNgayToi", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietBonNgayToi", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoBonNgayToi",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 6:
            pushAttributeToObjectInArray(
              "NamNgayToi",
              `${parseInt(day) + 5}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaNamNgayToi", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietNamNgayToi", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoNamNgayToi",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 7:
            pushAttributeToObjectInArray(
              "SauNgayToi",
              `${parseInt(day) + 6}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaSauNgayToi", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietSauNgayToi", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoSauNgayToi",
              nhietDoGiaoDongNgayToi
            );
            break;
          case 8:
            pushAttributeToObjectInArray(
              "BayNgayToi",
              `${parseInt(day) + 7}/${month}/${year}`
            );
            pushAttributeToObjectInArray("LuongMuaBayNgayToi", luongMuaNgayToi);
            pushAttributeToObjectInArray("ThoiTietBayNgayToi", moTaNgayToi);
            pushAttributeToObjectInArray(
              "NhietDoBayNgayToi",
              nhietDoGiaoDongNgayToi
            );
            break;
        }
      }
      setData(dataSheet);
      count++;
      count < 63 ? setLoading(true) : setLoading(false);
      if (count === 63) {
        setShowDown(true);
      }
    });
  };

  const [download, setDownload] = useState(false);
  const [fileNameCsv, setFileNameCsv] = useState(null);
  const [crawlDate, setCrawlDate] = useState(null);

  const writeLog = async (fileName, crawlDate, actionLog, status) => {
    const handleWriteLog = await request.handleWriteLog(
      fileName,
      crawlDate,
      actionLog,
      status
    );
  };

  const handleExport = () => {
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    // var yyyy = today.getFullYear();
    // today = dd + "-" + mm + "-" + yyyy;
    setCrawlDate(getToday());
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, `ThoiTietVN_${getToday()}`);
    setFileNameCsv(`ThoiTietVN_${getToday()}`);
    XLSX.writeFile(wb, `ThoiTietVN_${getToday()}.csv`);
    setDownload(true);
    console.log("Download");
    writeLog(`ThoiTietVN_${getToday()}`, getToday(), "Crawl data to CSV file", "ER");
  };

  useEffect(() => {
    if (showDown) {
      handleExport();
      setShowDown(false);
    }
  }, [showDown]);

  const [importFile, setImportFile] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (download) {
        const res = await request
          .importDataFromCsvFile(fileNameCsv)
          .then(function (res) {
            setImportFile(true);
          })
          .catch(function (res) {});
        setDownload(false);
      }
    };
    getData();
  }, [download]);

  const [initStaging, setInitStaging] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (importFile) {
        const res = await request.handleStaging().then(function (res) {
          setInitStaging(true);
        });
        setImportFile(false);
      }
    };
    getData();
  }, [importFile]);

  useEffect(() => {
    const getData = async () => {
      if (initStaging) {
        const res = await request.handleWarehouse().then(function (res) {});
        setInitStaging(false);
      }
    };
    getData();
  }, [initStaging]);

  return (
    <>
      <button onClick={getHref}>Get new data</button>
      {/* {
        <button ref={btnRef} onClick={handleExport}>
          Download excel
        </button>
      } */}
      {loading && <h1>Loading data</h1>}
    </>
  );
}

export default CrawlWeatherData;
