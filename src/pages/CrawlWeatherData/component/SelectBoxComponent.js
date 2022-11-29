import React, { useEffect, useState } from "react";
import * as request from "~/untils/request";
import './style.css'
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";

function SelectBoxComponent({ showDataFromDB }) {
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
    console.log(event.target.value)
  }

  return (
    <div className="wrap">
      <select
        value={selectedClient}
        onChange={handleSelectChange}
        class="form-select"
        aria-label="Default select example"
      >
        <option selected>Open this select menu</option>
        {city.map((item, index) => (
          <option value={`${item.TinhThanhPho}`}>{item.city_name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectBoxComponent;
