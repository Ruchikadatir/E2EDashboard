import ChartWrapper from "../../../wrapper/ChartWrapper";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { Row, Col } from "antd";
import DataGrid from "../../../data-grid/DataGrid";
import { numberConversion } from "../../../app-utils/AppUtils";
import "./TopPrioritySubcat.scss";


const TopPrioritySubcat = ({ activeBtn }) => {
  const topPrioritySubcatGrid = useSelector(
    (state) => state.demandScenario.topPrioritySubcatGrid
  );

  const topPrioritySubcatState = useSelector(
    (state) => state.demandScenario.topPrioritySubcatState
  );
  const upsideGridRef = useRef();
  const downsideGridRef = useRef();
  const topPrioritySubcatGridDownload = () => {
    upsideGridRef.current.gridDownload();
    downsideGridRef.current.gridDownload();
  };

  const renderUpsideContainer = (params) => {

    const parentDiv = {
      height: 30,
      width: `${params.data.barPercent}%`,
      background: "#DEEDB2",
      borderRadius: "4px 4px 0px 0px",
    };
    const upsideValue = params.value && activeBtn ==="units" ?  numberConversion((Math.abs(params.value))) : params.value && activeBtn ==="revenue" ?  `$${numberConversion((Math.abs(params.value)))}`:""
    return (
      <div style={parentDiv}>
        <div className="upside-cell-value">{upsideValue}</div>
      </div>
    );
  };

  const renderDownsideContainer = (params) => {

    const parentDiv = {
      height: 30,
      width: `${params.data.barPercent}%`,
      background: "#FF8E8F",
      borderRadius: "4px 4px 0px 0px",
    };
    const donwsideValue = params.value && activeBtn ==="units" ?  numberConversion((Math.abs(params.value))) : params.value && activeBtn ==="revenue" ?  `$${numberConversion((Math.abs(params.value)))}`:""
    return (

      <div style={parentDiv}>
        <div className="downside-cell-value">({donwsideValue})</div>
        </div>


    );
  };

  const upSideColumnDefs = [
    {
      headerName: "CDP Upside vs. Brand Ambition (CDP > BA)",
      children: [
        {
          headerName: "Priority Subcategory",
          field: "prioritySubCat",
          minWidth: 80,
        },
        { headerName: "Brand", field: "brand", minWidth: 60 },
        { headerName: "Region", field: "region", minWidth: 60 },
        {
          headerName: "Upside",
          field: "upside",
          minWidth: 300,
          cellRenderer: renderUpsideContainer,
        },
      ],
    },
  ];
  const downSideColumnDefs = [
    {
      headerName: "CDP Downside vs. Brand Ambition (CDP < BA)",
      children: [
        {
          headerName: "Priority Subcategory",
          field: "prioritySubCat",

          minWidth: 80,
        },
        { headerName: "Brand", field: "brand", minWidth: 60 },
        { headerName: "Region", field: "region", minWidth: 60 },
        {
          headerName: "Downside",
          field: "downside",
          minWidth: 300,
          cellClass: "downside-cell",
          cellRenderer: renderDownsideContainer,
        },
      ],
    },
  ];

  const defaultColDef = {
    sortable: false,
    resizable: false,
    filter: false,
  };

  return (
    <ChartWrapper
      title="Top Priority Subcategory / Brand/ Region  CDP vs. Brand Ambition Deviations"
      downloadType="grid"
      downloadCsv={topPrioritySubcatGridDownload}
      cardLoading={topPrioritySubcatState === "pending"}
    >
      <Row gutter={[12]}>
        <Col xs={12}>
          <div className="top-priority-grid">
            <DataGrid
              rowData={topPrioritySubcatGrid !== null && Object.keys(topPrioritySubcatGrid).length ? topPrioritySubcatGrid[activeBtn]["upside"] : []}
              ref={upsideGridRef}
              columnDefs={upSideColumnDefs}
              defaultColDef={defaultColDef}
              fileName="CDP Upside Brand Ambition"
            />
          </div>
        </Col>
        <Col xs={12}>
          <div className="top-priority-grid">
            <DataGrid
              rowData={topPrioritySubcatGrid !== null && Object.keys(topPrioritySubcatGrid).length ? topPrioritySubcatGrid[activeBtn]["downside"] : []}
              ref={downsideGridRef}
              columnDefs={downSideColumnDefs}
              defaultColDef={defaultColDef}
              fileName="CDP Downside Brand Ambition"
            />
          </div>
        </Col>
      </Row>
    </ChartWrapper>
  );
};

export default TopPrioritySubcat;
