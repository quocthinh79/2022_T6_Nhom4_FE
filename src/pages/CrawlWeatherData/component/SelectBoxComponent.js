import React, { useEffect, useState } from "react";
import * as request from "~/untils/request";
import "./style.css";

function SelectBoxComponent({ showDataFromDB, setCityId }) {
  const [city, setCity] = useState([]);
  const getCity = async () => {
    const res = await request.getCity().then(function (res) {
      setCity(res);
    });
  };
  getCity();

  const [selectedClient, setSelectedClient] = useState([]);

  function handleSelectChange(event) {
    setSelectedClient(event.target.value);
    showDataFromDB(event.target.value);
    setCityId(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div className="wrap">
      <select
        value={selectedClient}
        onChange={handleSelectChange}
        class="form-select"
        aria-label="Default select example"
      >
        <option value={-1} selected>
          Open this select menu
        </option>
        {city.map((item, index) => (
          <option value={`${item.TinhThanhPho}`}>{item.city_name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectBoxComponent;
