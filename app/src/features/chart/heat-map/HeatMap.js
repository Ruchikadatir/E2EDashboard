import React, { useEffect, useRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataGrid from "../../data-grid/DataGrid";
import {
  updateHeatMapGrid,
} from "../../screens/e2e-network/sufficiency/make/MakeSlice.js";
import { Row, Col } from "antd";
import "./HeatMap.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ArrowDropDown } from "@mui/icons-material";
import { ArrowRight } from "@mui/icons-material";
import { numberConversion } from "../../app-utils/AppUtils"
const HeatMap = React.forwardRef((props, ref) => {
  const heatMapGridData = useSelector((state) => state.make.heatMap.heatMapGridData);
  const dispatch = useDispatch();
  const heatMapGridRef = useRef();

  const cellBgrColorObj = {
    Platform: "#d8dcff",
    Technology: "#e8e9ff",
    Plant: "#d5e9ff",
    Resource: "#e8f3ff",
  };

  useImperativeHandle(ref, () => ({
    heatMapGridDownload: () => {
      heatMapGridRef.current.gridDownload();
    },
  }));

  const cellStyleCategory = (params) => {
    const colors = cellBgrColorObj[params.data.Category];
    return { backgroundColor: colors };
  };
//logic for cellColorFY23,cellColorFY24,cellColorFY25 should be updated based on the FY changes
  const cellColorFY23 = (params) => {
    let DCFy23Technology;
    let DCFy23Plant;
    let DCFy23Resource;
    const gridObj = params.data.child;
    const DCFy23CellValue = params.data['2023_D_C'];
    const category = params.data.Category;

    if (gridObj) {
      gridObj.forEach((item) => {
        if (item.Category === "Technology") {
          DCFy23Technology = item['2023_D_C'];
        } else if (item.Category === "Plant") {
          DCFy23Plant = item['2023_D_C'];
        } else if (item.Category === "Resource") {
          DCFy23Resource = item['2023_D_C'];
        }
      });
    }

    if (
      category === "Platform" &&
      DCFy23CellValue < 75 &&
      DCFy23Technology > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Technology" &&
      DCFy23CellValue < 75 &&
      DCFy23Plant > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Plant" &&
      DCFy23CellValue < 75 &&
      DCFy23Resource > 75
    ) {
      return { background: "#FCAA54" };
    }

    if (DCFy23CellValue > 95) {
      return { backgroundColor: "#FF3F40" };
    } else if (DCFy23CellValue >= 75 && DCFy23CellValue <= 95) {
      return { background: "#FF6A6B" };
    } else if (DCFy23CellValue >= 50 && DCFy23CellValue < 75) {
      return { background: "#DEEDB2" };
    } else {
      return { background: "#9ED320" };
    }
  };
  const cellColorFY24 = (params) => {
    let DCFy24Technology;
    let DCFy24Plant;
    let DCFy24Resource;
    const gridObj = params.data.child;
    const DCFy24CellValue = params.data["2024_D_C"];
    const category = params.data.Category;

    if (gridObj) {
      gridObj.forEach((item) => {
        if (item.Category === "Technology") {
          DCFy24Technology = item["2024_D_C"];
        } else if (item.Category === "Plant") {
          DCFy24Plant = item["2024_D_C"];
        } else if (item.Category === "Resource") {
          DCFy24Resource = item["2024_D_C"];
        }
      });
    }
    if (
      category === "Platform" &&
      DCFy24CellValue < 75 &&
      DCFy24Technology > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Technology" &&
      DCFy24CellValue < 75 &&
      DCFy24Plant > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Plant" &&
      DCFy24CellValue < 75 &&
      DCFy24Resource > 75
    ) {
      return { background: "#FCAA54" };
    }

    if (DCFy24CellValue > 95) {
      return { backgroundColor: "#FF3F40" };
    } else if (DCFy24CellValue >= 75 && DCFy24CellValue <= 95) {
      return { background: "#FF6A6B" };
    } else if (DCFy24CellValue >= 50 && DCFy24CellValue <= 75) {
      return { background: "#DEEDB2" };
    } else if (DCFy24CellValue < 50) {
      return { background: "#9ED320" };
    }
  };
  const cellColorFY25 = (params) => {
    let DCFy25Technology;
    let DCFy25Plant;
    let DCFy25Resource;
    const gridObj = params.data.child;
    const DCFy25CellValue = params.data["2025_D_C"];
    const category = params.data.Category;

    if (gridObj) {
      gridObj.forEach((item) => {
        if (item.Category === "Technology") {
          DCFy25Technology = item["2025_D_C"];
        } else if (item.Category === "Plant") {
          DCFy25Plant = item["2025_D_C"]
        } else if (item.Category === "Resource") {
          DCFy25Resource = item["2025_D_C"];
        }
      });
    }
    if (
      category === "Platform" &&
      DCFy25CellValue < 75 &&
      DCFy25Technology > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Technology" &&
      DCFy25CellValue < 75 &&
      DCFy25Plant > 75
    ) {
      return { background: "#FCAA54" };
    } else if (
      category === "Plant" &&
      DCFy25CellValue < 75 &&
      DCFy25Resource > 75
    ) {
      return { background: "#FCAA54" };
    }

    if (DCFy25CellValue > 95) {
      return { backgroundColor: "#FF3F40" };
    } else if (DCFy25CellValue >= 75 && DCFy25CellValue <= 95) {
      return { background: "#FF6A6B" };
    } else if (DCFy25CellValue >= 50 && DCFy25CellValue <= 75) {
      return { background: "#DEEDB2" };
    } else {
      return { background: "#9ED320" };
    }
  };

  const dynamicRowCellRenderer = (params) => {
    let spanTag;

    if (params.data.child) {
      if (params.data.expanded) {
        spanTag = (
          <span
            className="item-position"
            onClick={() =>
              dispatch(updateHeatMapGrid({ id: params.data.id }))
            }
          >
            <ArrowDropDown />
            &nbsp; {params.value}
          </span>
        );
      } else {
        spanTag = (
          <span
            className="item-position"
            onClick={() =>
              dispatch(updateHeatMapGrid({ id: params.data.id }))
            }
          >
            <ArrowRight />
            &nbsp; {params.value}
          </span>
        );
      }
    } else {
      spanTag = (
        <span
          style={{
            paddingLeft: `${params.data.level}px`,
          }}
        >
          {" "}
          {params.value}
        </span>
      );
    }

    return spanTag;
  };


  const valueFormatter = (params) => {
    return params.value ? numberConversion(params.value) : " "
  };
  const cdValueFormatter = (params) => {
    return params.value ? params.value.toFixed(1) : " "
  }

// column Defs Should be updated based on fiscal year 
  const columnDefs = [
    {
      headerName: "",
      children: [
        {
          headerName: "",
          field: "categoryName",
          cellRenderer: dynamicRowCellRenderer,
          cellStyle: cellStyleCategory,
          minWidth: 450
        },
      ],
    },

    {
      headerName: "FY23",
      field: "fy23",
      height: 200,
      children: [
        { headerName: "Requirement", field: "2023_Production_Req", valueFormatter: valueFormatter, minWidth: 130 },
        { headerName: "Gap/Surplus", field: "2023_Gap", minWidth: 130 },
        {
          headerName: "C:D",
          field: "2023_C_D",
          cellStyle: cellColorFY23,
          valueFormatter: cdValueFormatter,
          minWidth: 90
        },
      ],
    },
    {
      headerName: "FY24",
      field: "fy24",
      children: [
        { headerName: "Requirement", field: "2024_Production_Req", valueFormatter: valueFormatter, minWidth: 130 },
        { headerName: "Gap/Surplus", field: "2024_Gap", minWidth: 130 },
        {
          headerName: "C:D",
          field: "2024_C_D",
          cellStyle: cellColorFY24,
          valueFormatter: cdValueFormatter,
          minWidth: 90

        },
      ],

    },
    {
      headerName: "FY25",
      field: "fy25",
      children: [
        { headerName: "Requirement", field: "2025_Production_Req", valueFormatter: valueFormatter, minWidth: 130 },
        { headerName: "Gap/Surplus", field: "2025_Gap", minWidth: 130 },
        {
          headerName: "C:D",
          field: "2025_C_D",
          cellStyle: cellColorFY25,
          valueFormatter: cdValueFormatter,
          minWidth: 90
        },
      ],
    },
  ];

  const defaultColDef = {
    width: 100,
    sortable: false,
  };

  const rowHeight = 30

  return (
    <>
      <Row gutter={[15, 30]} align="top">
        <Col sm={1.5}>
          <div className="block platform"></div>
          <span className="category-title">Platform</span>
        </Col>
        <Col sm={1.5}>
          <div className="block technology"></div>
          <span className="category-title">Technology</span>
        </Col>
        <Col sm={1.5}>
          <div className="block plant"> </div>
          <span className="category-title">Plant</span>
        </Col>
        <Col sm={4}>
          <div className="block resource"></div>
          <span className="category-title">Resource</span>
        </Col>

        <Col sm={2}>
          <div className="block above-95"></div>
          <span className="category-title">Global {">"} 95%</span>
        </Col>
        <Col sm={2}>
          <div className="block above-75"></div>
          <span className="category-title">Global {">"} 75%</span>
        </Col>
        <Col sm={4}>
          <div className="block between-75"> </div>
          <span className="category-title">
            {"Global < 75%, (1 or more plants >75%)"}
          </span>
        </Col>
        <Col sm={3}>
          <div className="block between-50-75"></div>
          <span className="category-title">
            {"Global 50-75%, (all sites <75%)"}
          </span>
        </Col>
        <Col sm={3}>
          <div className="block lesthan-50"></div>
          <span className="category-title">
            {"Global <50%, (all sites <75%)"}
          </span>
        </Col>
        <Col xs={24} sm={24}>
          <div className="heat-map-grid">
            <DataGrid
              rowData={heatMapGridData}
              columnDefs={columnDefs}
              ref={heatMapGridRef}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowHeight={rowHeight}
              fileName="Utilization Heat Map"
            />
          </div>
        </Col>
      </Row>
    </>
  );
});

export default HeatMap;
