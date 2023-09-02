import React, { useEffect, useState } from "react";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import { useSelector } from "react-redux";
import ChartWrapper from "../../../../wrapper/ChartWrapper.js";
import { Row, Col } from "antd";
import { Switch } from "antd";
import Alert from '@mui/material/Alert';
import { numberConversion } from "../../../../app-utils/AppUtils.js";

const RevenueGrowthBarChart = () => {
  const revenueGrowthGraphData = useSelector((state) => state.e2e.revenueGrowthGraphData);
  const revenueGrowthGraphDataState = useSelector((state) => state.e2e.revenueGrowthGraphDataState);
  const revenueGrowth_XAxisSet = ["Quarterly", "Yearly"];
  const revenueGrowth_YAxisSet = ["Revenue"];

  const revenueGrowth_SeriesData = [
    {
      name: "Skincare",
      type: "line",
      color: "#0038A8",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[1])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      name: "Makeup",
      type: "line",
      color: "#7EB2FF",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[2])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      name: "Fragrance",
      type: "line",
      color: "#A55CC3",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[3])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      name: "Haircare",
      type: "line",
      color: "#D60270",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[4])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      name: "Others",
      type: "line",
      color: "#3CCCDF",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[5])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
  ];

  const revenueGrowth_TotalSeriesData = [
    {
      name: "Total",
      type: "line",
      color: "#FFA24A",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: $${numberConversion(params.value[1])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
  ];


  const [revenueGrowth_XAxis, setRevenueGrowth_XAxis] = useState(
    revenueGrowth_XAxisSet[0]
  );

  const switchData = ["Category", "Total"];

  const [selectedSwitch, setSelectedSwitch] = useState(
    switchData[0]
  );

  const [revenueGrowth_graphChartProps, setRevenueGrowth_graphChartProps] =
    useState({
      height: "300px",
      title: "Revenue Growth ",
      seriesData: revenueGrowth_SeriesData,
      source: [],
      xTitleSet: revenueGrowth_XAxisSet,
      yTitleSet: revenueGrowth_YAxisSet,
      xTitleSelected: revenueGrowth_XAxis,
      swap: false,
      isToolBoxNeeded: false,
      add$: true,
    });
  const [revenueGrowthTotal_graphChartProps, setRevenueGrowthTotal_graphChartProps] =
    useState({
      height: "300px",
      title: "Revenue Growth ",
      seriesData: revenueGrowth_TotalSeriesData,
      source: [],
      xTitleSet: revenueGrowth_XAxisSet,
      yTitleSet: revenueGrowth_YAxisSet,
      xTitleSelected: revenueGrowth_XAxis,
      swap: false,
      isToolBoxNeeded: false,
      add$: true,
    });
  const handleRevenueGrowthXTitleUpdateResponse = (event) => {

    setRevenueGrowth_XAxis(event);
  }

  const handleSwitchData = (event) => {
    setSelectedSwitch(event ? "Total" : "Category");
  };

  useEffect(() => {
    let revenueGrowthData = revenueGrowthGraphData["category"];
    let revenueGrowthTotaldata = revenueGrowthGraphData["total"];
    if (Object.values(revenueGrowthGraphData)[0]) {
      let sourceData = {}
      let sourceDataTotal = {}
      if (revenueGrowth_XAxis === "Yearly") {

        Object.entries(revenueGrowthData['yearly']).forEach(([key, value]) => {
          if (key === "years") sourceData["category"] = value;
          else
            sourceData[key] = value;
        });
        setRevenueGrowth_graphChartProps((prevState) => ({
          ...prevState,
          source: sourceData,
          xTitleSelected: revenueGrowth_XAxis,
        }));
        Object.entries(revenueGrowthTotaldata['yearly']).forEach(([key, value]) => {

          if (key === "years") sourceDataTotal["category"] = value;
          else
            sourceDataTotal[key] = value;
        });
        setRevenueGrowthTotal_graphChartProps((prevState) => ({
          ...prevState,
          source: sourceDataTotal,
          xTitleSelected: revenueGrowth_XAxis,
        }));
      }
      else {
        Object.entries(revenueGrowthData['quarterly']).forEach(([key, value]) => {
          if (key === "quarters") sourceData["category"] = value;
          else
            sourceData[key] = value;
        });
        setRevenueGrowth_graphChartProps((prevState) => ({
          ...prevState,
          source: sourceData,
          xTitleSelected: revenueGrowth_XAxis,
        }));
        Object.entries(revenueGrowthTotaldata['quarterly']).forEach(([key, value]) => {
          if (key === "quarters") sourceDataTotal["category"] = value;
          else
            sourceDataTotal[key] = value;
        });
        setRevenueGrowthTotal_graphChartProps((prevState) => ({
          ...prevState,
          source: sourceDataTotal,
          xTitleSelected: revenueGrowth_XAxis,
        }));
      }

    }
  }, [revenueGrowthGraphData, revenueGrowth_XAxis, selectedSwitch])

  return (

    <div>
      <ChartWrapper
        className="e2e-card revenue-growth-card"
        title="Revenue Growth"
        cardLoading={
          revenueGrowthGraphDataState == "pending"
        }

        chartDownloadData={Object.keys(revenueGrowth_graphChartProps.source)?.length > 0 ? revenueGrowth_graphChartProps.source : []}
        downloadType="chart"

      >
        {!Object.values(revenueGrowth_graphChartProps.source)?.length > 0 && (<Alert severity="warning">No Data Found for Revenue Growth Graph !</Alert>)}

        {Object.values(revenueGrowth_graphChartProps.source)?.length > 0 && (
          <div>
            <div id="revenueGrowthCategoryTotal">
              <Row justify="end">
                <span className="switch">{switchData[0]} &nbsp;&nbsp; </span>
                <Switch size="medium" onChange={handleSwitchData} />
                <span className="switch"> &nbsp;&nbsp;{switchData[1]}</span>
              </Row>
            </div>
            <Row gutter={[12, 16]}>

              <Col xs={24} sm={24} lg={24} xxl={24} >

                {selectedSwitch === "Category" && (<div>
                  <BarChartWrapper
                    GraphChartProps={revenueGrowth_graphChartProps}
                    handleXTitleUpdate={handleRevenueGrowthXTitleUpdateResponse}
                  />
                </div>)}
                {selectedSwitch === "Total" && (<div>
                  <BarChartWrapper
                    GraphChartProps={revenueGrowthTotal_graphChartProps}
                    handleXTitleUpdate={handleRevenueGrowthXTitleUpdateResponse}
                  />
                </div>)}
              </Col>
            </Row>
          </div>
        )}
      </ChartWrapper>

    </div>


  );
}
export default RevenueGrowthBarChart;