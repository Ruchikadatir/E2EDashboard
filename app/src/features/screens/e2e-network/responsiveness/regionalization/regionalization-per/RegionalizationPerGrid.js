import React, { useState, useImperativeHandle, useRef } from "react";
import { Radio, Row, Col } from "antd";
import { useSelector } from "react-redux";
import DataGrid from "../../../../../data-grid/DataGrid.js";
import ProgressBar from "../../../../../progress-bar/ProgressBar.js";

import { numberConversion } from "../../../../../app-utils/AppUtils";
import "./RegionalizationPer.scss";

const RegionalizationPer = React.forwardRef(({ gridName }, ref) => {
  const makeIngredient = useSelector(
    (state) => state.regionalization.regionalizationPer.makeIngredient
  );
  const makeComponent = useSelector(
    (state) => state.regionalization.regionalizationPer.makeComponent
  );
  const salesRegion = useSelector(
    (state) => state.regionalization.regionalizationPer.salesRegion
  );



  const [salesRadioGroup, setSalesGroup] = useState("all");

  const regionalizationPerGridRef = useRef()
  useImperativeHandle(ref, () => ({
    regionalizationGridDownload: () => {
      regionalizationPerGridRef.current.gridDownload();
    },
  }));

  const renderProgressBar = ({ value }) => {

    const regPercentage = !isNaN(value) ? value : 0;

    if (regPercentage > 75) {
      return (
        <ProgressBar
          bgcolor="#9ED320"
          progress={regPercentage}
          height={regPercentage}
        />
      );
    } else if (regPercentage <= 75 && regPercentage >= 50) {
      return (
        <ProgressBar
          bgcolor="#FCAA54"
          progress={regPercentage}
          height={regPercentage}
        />
      );
    } else {
      return (
        <ProgressBar
          bgcolor="#FF6A6B"
          progress={regPercentage}
          height={regPercentage}
        />
      );
    }
  };
  const cellStyleAmericas = (params) => {
    if (params.data.region === "Americas" && (params.data["americas"] || params.data["americas"] === 0 || params.data["americas"] === null)) {
      return { backgroundColor: "#D6E1FF" };
    }
  };
  const cellStyleEurope = (params) => {


    if (params.data.region === "Europe" && (params.data["europe"] || params.data["europe"] === 0 || params.data["europe"] === null)) {

      return { backgroundColor: "#D6E1FF" };
    }
  };
  const cellStyleAsia = (params) => {
    if (params.data.region === "Asia" && (params.data["asia"] || params.data["asia"] === 0 || params.data["asia"] === null)) {
      return { backgroundColor: "#D6E1FF" };
    }
  };

  const valueFormatter = (params) => {
    return numberConversion(params.value);
  };

  const columnDefs = [
    { headerName: "", field: "region", minWidth: 100 },
    {
      headerName: "Americas",
      field: "americas",
      minWidth: 104,
      cellStyle: cellStyleAmericas,
      cellClass: "americas-cell",
      valueFormatter: valueFormatter,
    },
    {
      headerName: "Europe",
      field: "europe",
      minWidth: 87,
      cellStyle: cellStyleEurope,
      cellClass: "europe-cell",
      valueFormatter: valueFormatter,
    },
    {
      headerName: "Asia",
      field: "asia",
      minWidth: 73,
      cellStyle: cellStyleAsia,
      cellClass: "asia-cell",
      valueFormatter: valueFormatter,
    },
    {
      headerName: gridName == "sales-region" ? "Region Sale Units" : "Region Source Units",
      field: "regionSourceUnits",
      minWidth: 99,
      cellClass: "resource-units-cell",
      valueFormatter: valueFormatter,
    },
    {
      headerName: gridName == "sales-region" ? "Make to Sale Reg.%" : "Source to Make Reg %",
      field: "regPer",
      cellRenderer: renderProgressBar,
      cellClass: "source-to-make-cell",
      minWidth: 100,
    },
  ];

  const defaultColDef = {
    flex: 1,
    wrapText: true,
    sortable: false,
    resizable: false,
    filter: false,
  };
  const rowData =
    gridName === "make-ingredent"
      ? makeIngredient
      : gridName === "make-component"
        ? makeComponent
        : salesRegion[salesRadioGroup];

  const headerName =
    gridName === "make-ingredent"
      ? <span>Make Region&nbsp;<span className="format-text-color">(Ingredients)</span></span>
      : gridName === "make-component"
        ? <span>Make Region&nbsp;<span className="format-text-color">(Components)</span></span>
        : "Sales Region";

  const onChange = (e) => {
    const radioChangeValue = e.target.value;
    setSalesGroup(radioChangeValue);
  };



  return (
    <Row>
      <Col sm={24}>
        <div className={gridName == "sales-region" ? "sales-grid-name" : "grid-name"}>
          {headerName}
          {gridName === "sales-region" && (
            <Radio.Group onChange={onChange} value={salesRadioGroup}>
              <Radio value="all">ALL</Radio>
              <Radio value="halb">HALB</Radio>
              <Radio value="fert">FERT</Radio>
            </Radio.Group>
          )}
        </div>
      </Col>
      <Col sm={24}>
        <div className="reg-grid-container">
          <DataGrid
            ref={regionalizationPerGridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            fileName={headerName}

          />
        </div>
      </Col>
    </Row>
  );
});

export default RegionalizationPer;
