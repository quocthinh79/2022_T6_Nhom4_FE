import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import * as request from "~/untils/request";
import SelectBoxComponent from "./component/SelectBoxComponent";
import "./style.css";

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
      writeLog(
        `ThoiTietVN_${getToday()}`,
        getToday(),
        "Crawl data to CSV file",
        "ERROR"
      );
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
  const [updateTime, setUpdateTime] = useState(null);
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
      setUpdateTime(updateTime);
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
          .trim()
          .split(" ")[2];
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
              `${parseInt(ngayToi)}/${month}/${year}`
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
      } else {
        setShowDown(false);
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
    writeLog(
      `ThoiTietVN_${getToday()}`,
      getToday(),
      "Crawl data to CSV file",
      "ER"
    );
  };

  useEffect(() => {
    if (showDown) {
      handleExport();
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
            setShowDown(false);
          })
          .catch(function (res) {});
        setDownload(false);
        setTimeout(() => {
          res();
        }, 5000);
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

  const [done, setDone] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (initStaging) {
        const res = await request.handleWarehouse().then(function (res) {
          request.deleteFile(fileNameCsv).then(function (res) {
            setDone(true);
          });
        });
        setInitStaging(false);
      }
    };
    getData();
  }, [initStaging]);

  const [thoiTietHienTai, setThoiTietHienTai] = useState([]);
  const [thoiTietNgayMai, setThoiTietNgayMai] = useState([]);
  const [thoiTietNgayMot, setThoiTietNgayMot] = useState([]);
  const [thoiTietBaNgayToi, setThoiTietBaNgayToi] = useState([]);
  const [thoiTietBonNgayToi, setThoiTietBonNgayToi] = useState([]);
  const [thoiTietNamNgayToi, setThoiTietNamNgayToi] = useState([]);
  const [thoiTietSauNgayToi, setThoiTietSauNgayToi] = useState([]);
  const [thoiTietBayNgayToi, setThoiTietBayNgayToi] = useState([]);

  const showDataFromDB = (cityId) => {
    const getData = async () => {
      await request.thoiTietHienTai(cityId).then(function (res) {
        setThoiTietHienTai(res);
      });
      await request.thoiTietNgayMai(cityId).then(function (res) {
        setThoiTietNgayMai(res);
      });
      await request.thoiTietNgayMot(cityId).then(function (res) {
        setThoiTietNgayMot(res);
      });
      await request.thoiTietBaNgayToi(cityId).then(function (res) {
        setThoiTietBaNgayToi(res);
      });
      await request.thoiTietBonNgayToi(cityId).then(function (res) {
        setThoiTietBonNgayToi(res);
      });
      await request.thoiTietNamNgayToi(cityId).then(function (res) {
        setThoiTietNamNgayToi(res);
      });
      await request.thoiTietSauNgayToi(cityId).then(function (res) {
        setThoiTietSauNgayToi(res);
      });
      await request.thoiTietBayNgayToi(cityId).then(function (res) {
        setThoiTietBayNgayToi(res);
      });
    };
    getData();
  };

  const [cityId, setCityId] = useState(-1);

  useEffect(() => {
    setTimeout(() => {
      if (done) {
        showDataFromDB(cityId);
        setDone(false);
      } else {
        getHref();
      }
    }, 60000 * 5);
  }, [done]);

  return (
    <div className="container-fluid">
      {/* <button onClick={getHref}>Get new data</button>
      {loading && <h1>Loading data</h1>} */}
      <div class=" px-1 px-sm-3 py-5 mx-auto">
        <SelectBoxComponent
          showDataFromDB={showDataFromDB}
          setCityId={setCityId}
        />
        <div class="row d-flex justify-content-center">
          <div class="row card0">
            <div class="card1 col-lg-8 col-md-7">
              {/* <small>the.weather</small> */}
              <div class="text-center">
                <img class="image mt-5" src="https://i.imgur.com/M8VyA2h.png" />
              </div>
              <div class="row px-3 mt-3 mb-3">
                <h1 class="large-font mr-3">
                  {thoiTietHienTai[0]?.temperature}
                </h1>
                <div class="d-flex flex-column mr-3">
                  <h2 class="mt-3 mb-0">{thoiTietHienTai[0]?.city_name}</h2>
                  <small>{thoiTietHienTai[0]?.full_date}</small>
                </div>
              </div>
            </div>
            <div class="card2 col-lg-4 col-md-5">
              <div class="mr-5">
                <div class="line my-5"></div>
                <p>Chi tiết</p>
                <div class="row px-3">
                  <p class="light-text">Gió</p>
                  <p class="ml-auto">{thoiTietHienTai[0]?.wind_speed}</p>
                </div>
                <div class="row px-3">
                  <p class="light-text">Mô tả</p>
                  <p class="ml-auto">{thoiTietHienTai[0]?.describe}</p>
                </div>
                <div class="row px-3">
                  <p class="light-text">Tầm nhìn</p>
                  <p class="ml-auto">{thoiTietHienTai[0]?.vision}</p>
                </div>
                <div class="row px-3">
                  <p class="light-text">Độ ẩm hiện tại</p>
                  <p class="ml-auto">{thoiTietHienTai[0]?.percent}</p>
                </div>
                <div class="row px-3">
                  <p class="light-text">Chất lượng không khí</p>
                  <p class="ml-auto">{thoiTietHienTai[0]?.quality}</p>
                </div>
                <div class="line mt-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container d-flex ">
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietNgayMai[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietNgayMai[0]?.NhietDoNgayMai}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNgayMai[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietNgayMai[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNgayMai[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietNgayMai[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietNgayMot[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietNgayMot[0]?.NhietDoNgayMot}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNgayMot[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietNgayMot[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNgayMot[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietNgayMot[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietBaNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietBaNgayToi[0]?.NhietDoBaNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBaNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietBaNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBaNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietBaNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietBonNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietBonNgayToi[0]?.NhietDoBonNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBonNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietBonNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBonNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietBonNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietNamNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietNamNgayToi[0]?.NhietDoNamNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNamNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietNamNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNamNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietNamNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietNamNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietNamNgayToi[0]?.NhietDoNamNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNamNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietNamNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietNamNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietNamNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietSauNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietSauNgayToi[0]?.NhietDoSauNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietSauNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietSauNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietSauNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietSauNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <span class="icon"></span>
          <div class="title">
            <p>{thoiTietBayNgayToi[0]?.full_date}</p>
          </div>
          <div class="temp">{thoiTietBayNgayToi[0]?.NhietDoBayNgayToi}</div>
          <div class="row">
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBayNgayToi[0] && <div class="header">Thời tiết</div>}
              <div class="value">{thoiTietBayNgayToi[0]?.describe}</div>
            </div>
            <div class="col-6 px-1" style={{ width: `100px` }}>
              {thoiTietBayNgayToi[0] && <div class="header">Lượng mưa</div>}
              <div class="value">{thoiTietBayNgayToi[0]?.percent}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrawlWeatherData;
