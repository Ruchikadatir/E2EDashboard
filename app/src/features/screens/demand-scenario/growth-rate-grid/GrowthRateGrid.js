import DataGrid from "../../../data-grid/DataGrid";
import { useSelector } from "react-redux";
import { useRef } from "react";
import ChartWrapper from "../../../wrapper/ChartWrapper";
import "./GrowthRateGrid.scss";
const GrowthRateGrid = ({ activeBtn }) => {

  const growthRateRef = useRef();
  const growthRateGrid = useSelector(
    (state) => state.demandScenario.growthRateGrid
  );

  const growthRateState = useSelector(
    (state) => state.demandScenario.growthRateState
  );


  const growthRateGridDownload = () => {
    growthRateRef.current.gridDownload();
  };
  const valueFormatter = (params) => {
    return params.value !== undefined ? `${(Number(params.value)).toFixed(1)}%` : " ";
  };
// column Defs Should be updated based on fiscal year 
  const columnDefs = [
    {
      headerName: "Region",
      field: "region",
      minWidth: 105,
      cellClass: "region-header",
    },
    {
    headerName: "FY23",
      children: [
        {
          headerName: "Brand Ambition",
          field: "brandAmbitionFY23",
          valueFormatter: valueFormatter,
          minWidth: 105,
        },
        { headerName: "CDP", field: "cdpFY23", valueFormatter: valueFormatter, minWidth: 100 },
      ],
    },
    {
      headerName: "FY24",
      children: [
        {
          headerName: "Brand Ambition",
          field: "brandAmbitionFY24",
          valueFormatter: valueFormatter,
          minWidth: 105,
        },
        { headerName: "CDP", field: "cdpFY24", valueFormatter: valueFormatter,minWidth: 100  },
      ],
    },
    {
      headerName: "FY25",
      children: [
        {
          headerName: "Brand Ambition",
          field: "brandAmbitionFY25",
          valueFormatter: valueFormatter,
          minWidth: 105,
        },
        { headerName: "CDP", field: "cdpFY25", valueFormatter: valueFormatter,minWidth: 100  },
      ],
    },
  ];

  const defaultColDef = {
    minWidth: 105,
    sortable: false,
    resizable: false,
    filter: false,
  };
  return (
    <ChartWrapper
      title="Growth Rate Reconciliation"
      downloadType="grid"
      downloadCsv={growthRateGridDownload}
      cardLoading={growthRateState === "pending"}>
      <div className="growth-reconciliation">
        <DataGrid
          ref={growthRateRef}
          rowData={growthRateGrid[activeBtn]}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          fileName="Growth Rate Reconciliation"
        />
      </div>
    </ChartWrapper>
  );
};

export default GrowthRateGrid;
