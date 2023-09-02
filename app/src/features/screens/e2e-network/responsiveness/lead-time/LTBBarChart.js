import ChartWrapper from "../../../../wrapper/ChartWrapper";
import { useEffect, useState } from "react";
import { Row, Col, Switch } from "antd";
import { useSelector } from "react-redux";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import fonts from "../../../../../features/style/variable.scss";

//E2E Leadtime Breakdown chart
const LTBBarChart = ({ activeBtn }) => {
  const isSuccess = useSelector((state) => state.leadtime.isSuccess);
  const breakdownGraphData =
    useSelector((state) => state.leadtime.breakdownGraphData) || {};
  const breakdownGraphState = useSelector((state) => state.leadtime.breakdownState);

  //Graph props here
  //xaxis
  const XAxis = ["Days"];


  //yaxis
  const breakdown_YAxisSet = ["Major Cat.", "Brand", "Sales Region"];
  const [breakdown_YAxis, setBreakdownYAxis] = useState(breakdown_YAxisSet[0]);

  //dataCategory for switch
  const dataCategorySet = ["Aggregated", "Detailed"];
  const [dataCategory, setDataCategory] = useState(dataCategorySet[0]);

  //scrollbar for E2E LTBBarChart Breakdown
  const breakdown_dataZoom = [
    {
      type: "slider",
      yAxisIndex: [0],
      filterMode: "filter",
      start: 100,
      end: 90,
      width: 8,
    },
  ];

  const MajorCatbreakdown_dataZoom = [
    {
      type: "slider",
      yAxisIndex: [0],
      filterMode: "filter",
      start: 100,
      end: 20,
      width: 8,
    },
  ];

  const breakdownAggregated_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#36C5E5",
      barWidth: "25%",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} LT :` + `<b>${params.value[1]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#294BE9",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} LT : ` + `<b>${params.value[2]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#9A5CEB",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} LT :` + `<b>${params.value[3]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
  ];
  const breakdownDetailed_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#36C5E5",
      barWidth: "25%",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} :` + `<b>${params.value[1]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#9FE2F1",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} :` + `<b>${params.value[2]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#68D0CB",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} :` + `<b>${params.value[3]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#294BE9",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} :` + `<b>${params.value[4]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#7EB2FF",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName} :` + `<b>${params.value[5]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#9A5CEB",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`${params.seriesName}:` + `<b>${params.value[6]} days</b>` + "<br/>"].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: fonts.fontSizeXsmall,
          color: "#0D1640",
        },
      }
    },
  ];



  //graphProps
  const [breakdown_graphChartProps, setBreakdown_graphChartProps] = useState({
    title: "leadtime",
    height: "342px",
    seriesData: breakdownAggregated_seriesData,
    source: [],
    xTitleSet: XAxis,
    yTitleSet: breakdown_YAxisSet,
    swap: true,
    isToolBoxNeeded: false,
    dataZoom: MajorCatbreakdown_dataZoom,
    chartMarginTop: "-2%",
    yAxisTitleWidth: 70
  });

  const [breakdownDetailed_graphChartProps, setBreakdownDetailed_graphChartProps] = useState({
    title: "leadtime",
    height: "342px",
    seriesData: breakdownDetailed_seriesData,
    source: [],
    xTitleSet: XAxis,
    yTitleSet: breakdown_YAxisSet,
    swap: true,
    isToolBoxNeeded: false,
    dataZoom: MajorCatbreakdown_dataZoom,
    chartMarginTop: "-2%",
    yAxisTitleWidth: 70
  });

  useEffect(() => {
    if (breakdownGraphState === "idle") {
      setBreakdownYAxis(breakdown_YAxisSet[0])
    }
  }, [breakdownGraphState])

  useEffect(() => {
    if (
      typeof Object.keys(breakdownGraphData) !== "undefined" &&
      Object.keys(breakdownGraphData)?.length > 0 && breakdownGraphState === "fulfilled"
    ) {

      let breakdownToggelValue = breakdown_YAxis === "Major Cat." ? "majorCategory" : breakdown_YAxis === "Brand" ? "brand" : breakdown_YAxis === "Sales Region" ? "salesRegion" : "majorCategory"

      setBreakdown_graphChartProps((prevState) => ({
        ...prevState,
        dataZoom: breakdown_YAxis !== "Brand" ? MajorCatbreakdown_dataZoom : breakdown_dataZoom,

        source: breakdownGraphData[activeBtn] !== undefined && breakdownGraphData[activeBtn]["aggregated"] !== undefined ? breakdownGraphData[activeBtn]["aggregated"][breakdownToggelValue] : [],
      }));

      setBreakdownDetailed_graphChartProps((prevState) => ({
        ...prevState,
        dataZoom: breakdown_YAxis !== "Brand" ? MajorCatbreakdown_dataZoom : breakdown_dataZoom,

        source: breakdownGraphData[activeBtn] !== undefined && breakdownGraphData[activeBtn]["detailed"] !== undefined ? breakdownGraphData[activeBtn]["detailed"][breakdownToggelValue] : [],
      }));
    }


  }, [
    breakdownGraphData,
    dataCategory, activeBtn, breakdownGraphState,
    breakdown_YAxis
  ]);

  //Event Handling
  const handleSwitchChange = (event) => {
    if (event) setDataCategory(dataCategorySet[1]);
    else {
      setDataCategory(dataCategorySet[0]);
    }
  };

  const handleBreakdownAggregatedYTitleRequest = (event) => {
    setBreakdownYAxis(event);
  };
  const handleBreakdownDetailedYTitleRequest = (event) => {
    setBreakdownYAxis(event);
  };



  return (
    <div className="LTBBarChart-container">
      <ChartWrapper title="E2E Leadtime Breakdown" cardLoading={breakdownGraphState === "pending"}
        chartDownloadData={dataCategory === "Aggregated" ? breakdown_graphChartProps.source : breakdownDetailed_graphChartProps.source}
        downloadType="chart" type="leadtimeBreakdown" >
        <Row justify="end" className="leadtimeBreakdownSwitch">
          <span className="switch">{dataCategorySet[0]} &nbsp;&nbsp; </span>
          <Switch size="medium" onChange={handleSwitchChange} />
          <span className="switch"> &nbsp;&nbsp;{dataCategorySet[1]}</span>
        </Row>
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={24} lg={24} xxl={24} height="20px">

            {dataCategory === "Aggregated" && breakdownGraphState !== "pending" && (
              <BarChartWrapper
                GraphChartProps={breakdown_graphChartProps}
                handleYTitleUpdate={handleBreakdownAggregatedYTitleRequest}
              />
            )}

            {dataCategory === "Detailed" && breakdownGraphState !== "pending" && (
              <BarChartWrapper
                GraphChartProps={breakdownDetailed_graphChartProps}
                handleYTitleUpdate={handleBreakdownDetailedYTitleRequest}
              />
            )}
          </Col>
        </Row>
      </ChartWrapper>
    </div>
  );
};

export default LTBBarChart;
