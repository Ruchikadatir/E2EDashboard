import ChartWrapper from "../../../../wrapper/ChartWrapper.js";
import { useEffect, useState } from "react";
import { Row, Col, Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLeadtimeBreakdownGraphData,
  fetchLeadtimeDistributionGraphData,
  fetchPrioritySubcategoryGraphData,
  fetchSalesRegionGraphData,
  fetchDistributionByBrandGraphData,
  fetchFinishedGood,
  fetchSourceLeadtime
} from "./LeadTimeSlice";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import NodeChart from "../../../../node-chart/NodeChart";
import { getAllNodesAndConnections } from "../../../../node-chart/NodeChartSlice";
import "./LeadTime.scss";
import SourceLeadTimeOpportunitiesByMaterial from "./SourceLeadTimeOpportunitiesByMaterial";
import E2EWtAvgLeadTimeByFinishedGood from "./E2EWtAvgLeadTimeByFinishedGood.jsx";
import BoxPlotChart from "../../../../chart/boxplot-chart/BoxPlot";
import Filter from "../../../../filter/Filter"
import { fetchGlobalFilterRequest } from "../../../../filter/FilterSlice"
import LeadTimeCalFilter from "../../../../filter/leadtime-cal-filter/LeadTimeCalFilter.js";
import { Spin } from 'antd';
import LTBBarChart from "./LTBBarChart.js"; //E2E Leadtime Breakdown chart
import fonts from "../../../../style/variable.scss"
import NodeChartFilter from "../../../../filter/node-chart-filter/NodeChartFilter.js";
import NodeChartLegend from "../../../../../features/node-chart-legend/NodeChartLegend"
const LeadTime = () => {
  const isSuccess = useSelector((state) => state.leadtime.isSuccess);
  const selectedResponsivenessGlobalFilters = useSelector((state) => state.filter.selectedResponsivenessGlobalFilters);
  const breakdownGraphData =
    useSelector((state) => state.leadtime.breakdownGraphData) || {};
  const distributionGraphData =
    useSelector((state) => state.leadtime.distributionGraphData) || {};
  const priorityGraphData =
    useSelector((state) => state.leadtime.priorityGraphData) || {};
  const getAllNodesAndConnections =
    useSelector((state) => state.leadtime.getAllNodesAndConnections) || {};
  const salesRegionGraphData =
    useSelector((state) => state.leadtime.salesRegionGraphData) || {};
  const distributionByBrandGraphData =
    useSelector((state) => state.leadtime.distributionByBrandGraphData) || {};
  const distributionState = useSelector((state) => state.leadtime.distributionState)
  const priorityState = useSelector((state) => state.leadtime.priorityState)
  const breakdownGraphState = useSelector((state) => state.leadtime.breakdownState);
  const distributionByBrandState = useSelector((state) => state.leadtime.distributionByBrandState)
  const salesRegionState = useSelector((state) => state.leadtime.salesRegionState);
  const nodeChartState = useSelector((state) => state.leadtime.nodeChartState);
  const finishedGoodGridState = useSelector((state) => state.leadtime.finishedGoodGridState)
  const sourceLeadtimeState = useSelector((state) => state.leadtime.sourceLeadtimeState)


  //Graph props here
  //xaxis
  const XAxis = ["Days"];
  const salesRegion_XAxis = ["Sales Region"];
  const salesRegion_YAxis = ["Days"];
  const distributionByBrand_XAxis = ["Brand"];
  const distributionByBrand_YAxis = ["Days"];

  //yaxis
  const breakdown_YAxisSet = ["Major Cat.", "Brand", "Sales Region"];
  const [breakdown_YAxis, setBreakdownYAxis] = useState(breakdown_YAxisSet[0]);
  const distribution_YAxis = ["Frequency (# of 9-Digit SKU)"];
  const priority_YAxis = ["Days"];
  const priority_XAxis = ["Priority Subcategory"];
  const [pageLoaded, setPageLoaded] = useState(true);
  //dataCategory for switch
  const dataCategorySet = ["Aggregated", "Detailed"];
  const [dataCategory, setDataCategory] = useState(dataCategorySet[0]);
  const dispatch = useDispatch();
  const defaultSelectedValue = "units";
  const [activeBtn, setActiveBtn] = useState(defaultSelectedValue);

  //scrollbar for E2E LeadTime Distribution
  const distribution_dataZoom = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      height: 10,
    },

  ];


  const priority_dataZoom = [
    {
      type: 'inside',
      start: 0,
      end: 10,
    },
    {
      type: 'slider',
      height: 10,
      bottom: "20%"
    }
  ];

  const distributionByBrandDataZoom = [
    {
      type: 'inside',
      start: 0,
      end: 50,
    },
    {
      type: 'slider',
      height: 10,
    }
  ]
  //seriesData for charts

  const breakdownAggregated_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#36C5E5",

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
  const distribution_seriesData = [
    {
      type: "bar",
      color: "#4170CD",
      barWidth: 50,
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [`Frequency(# of 9-Digit SKU):<br/>` +
            `${params.value[0]} :  <b> ${params.value[1]} </b>` + "<br/>"].join("");
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

  const priority_seriesData = [
    {
      name: "boxplot",
      type: "boxplot",
      datasetId: "leadTime_aggregate",
      itemStyle: {
        color: "#4170CD",
        borderWidth: 1,
        borderColor: "#0038A8",
        borderRadius: "15",
      },

      encode: {
        y: "e2eLt",
        x: "category",
        itemName: ["category"],
        tooltip: ["min", "Q1", "median", "Q3", "max"],
      },
    },
    {
      name: "outlier",
      type: "scatter",
      symbolSize: 6,
      encode: {
        y: "e2eLt",
        x: "category",
        tooltip: ["min", "Q1", "median"],
      },
      itemStyle: {
        color: "#4170CD",
        borderColor: "#0038A8",
        borderWidth: 1,
        borderRadius: "2",
      },
    },
  ];

  const salesRegion_seriesData = [
    {
      name: "boxplot",
      type: "boxplot",
      datasetId: "leadTime_aggregate",
      itemStyle: {
        color: "#BD8CD1",
        borderWidth: 1,
        borderColor: "#A55CC3",
        borderRadius: "5",
      },

      encode: {
        y: "e2eLt",
        x: "category",
        itemName: ["category"],
        tooltip: ["min", "Q1", "median", "Q3", "max"],
      },
    },
    {
      name: "outlier",
      type: "scatter",
      symbolSize: 6,
      encode: {
        y: "e2eLt",
        x: "category",
        tooltip: ["min", "Q1", "median"],
      },
      itemStyle: {
        color: "#BD8CD1",
        borderColor: "#A55CC3",
        borderWidth: 1,
        borderRadius: "2",
      },
    },
  ];

  const distributionByBrand_seriesData = [
    {
      name: "boxplot",
      type: "boxplot",
      datasetId: "leadTime_aggregate",
      itemStyle: {
        color: "#A7CAFF",
        borderWidth: 1,
        borderColor: "#7EB2FF",
        borderRadius: "5",
      },

      encode: {
        y: "e2eLt",
        x: "category",
        itemName: ["category"],
        tooltip: ["min", "Q1", "median", "Q3", "max"],
      },
    },
    {
      name: "outlier",
      type: "scatter",
      symbolSize: 6,
      encode: {
        y: "e2eLt",
        x: "category",
        tooltip: ["min", "Q1", "median"],
      },
      itemStyle: {
        borderColor: "#7EB2FF",
        color: "#A7CAFF",
        borderWidth: 1,
        borderRadius: "2",
      },
    },
  ];

  const [distribution_graphChartProps, setDistribution_graphChartProps] =
    useState({
      title: "distribution",
      height: "420px",
      seriesData: distribution_seriesData,
      source: distributionGraphData?.length > 0 ? distributionGraphData : [],
      xTitleSet: XAxis,
      yTitleSet: distribution_YAxis,
      swap: false,
      isToolBoxNeeded: false,
      dataZoom: distribution_dataZoom,
      rightSpace: 90,
      chartMarginTop: "-9%"
    });

  const [priority_graphChartProps, setPriority_graphChartProps] = useState({
    height: "450px",
    width: "110%",
    seriesData: priority_seriesData,
    source: priorityGraphData?.length > 0 ? priorityGraphData : [],
    xTitle: priority_XAxis,
    yTitle: priority_YAxis,
    swap: false,
    isToolBoxNeeded: false,
    dataZoom: priority_dataZoom,
    rightSpace: 100,
    chartMarginTop: "-6%",
    chartMarginLeft: "-3%",
    chartName: "Priority Subcategory"
  });

  const [salesRegion_graphChartProps, setSalesRegion_graphChartProps] =
    useState({
      height: "350px",
      width: "110%",
      seriesData: salesRegion_seriesData,
      source: salesRegionGraphData?.length > 0 ? salesRegionGraphData : [],
      xTitle: salesRegion_XAxis,
      yTitle: salesRegion_YAxis,
      swap: false,
      isToolBoxNeeded: false,
      rightSpace: 100,
      chartMarginTop: "-2%",
      chartMarginLeft: "-3%",
      chartName: "Sales Region"
    });

  const [
    distributionByBrand_graphChartProps,
    setDistributionByBrand_graphChartProps,
  ] = useState({
    height: "400px",
    width: "112%",
    seriesData: distributionByBrand_seriesData,
    source: distributionByBrandGraphData?.length > 0 ? distributionByBrandGraphData : [],
    xTitle: distributionByBrand_XAxis,
    yTitle: distributionByBrand_YAxis,
    swap: false,
    isToolBoxNeeded: false,
    dataZoom: distributionByBrandDataZoom,
    rightSpace: 280,
    chartMarginTop: "-4%",
    chartMarginLeft: "-8%",
    chartName: "Brand"
  });

  useEffect(() => {
    dispatch(fetchGlobalFilterRequest(selectedResponsivenessGlobalFilters));
  }, [selectedResponsivenessGlobalFilters])

  useEffect(() => {
    if (distributionState === "pending" || breakdownGraphState === "pending" || priorityState === "pending" || salesRegionState === "pending" || distributionByBrandState === "pending" || nodeChartState == "pending" || finishedGoodGridState === "pending" || sourceLeadtimeState === "pending")
      setPageLoaded(false);
    else
      setPageLoaded(true)
    if (priorityState === "idle") {
      dispatch(
        fetchPrioritySubcategoryGraphData({
          globalFilter: selectedResponsivenessGlobalFilters
        })
      );
    }
    if (salesRegionState === "idle") {
      dispatch(
        fetchSalesRegionGraphData({
          globalFilter: selectedResponsivenessGlobalFilters
        })
      );
    }
    if (nodeChartState === "idle") {
      dispatch(
        getAllNodesAndConnections({
          globalFilter: selectedResponsivenessGlobalFilters
        })
      );
    }
    if (distributionByBrandState === "idle") {
      dispatch(
        fetchDistributionByBrandGraphData({
          globalFilter: selectedResponsivenessGlobalFilters
        })
      );
    }

    if (distributionState === "idle") {
      dispatch(
        fetchLeadtimeDistributionGraphData({
          globalFilter: selectedResponsivenessGlobalFilters
        })
      );
    }
    if (breakdownGraphState === "idle") {
      dispatch(
        fetchLeadtimeBreakdownGraphData({
          globalFilter: selectedResponsivenessGlobalFilters

        })
      );
    }
    if (finishedGoodGridState === "idle") {
      dispatch(fetchFinishedGood(
        { globalFilter: selectedResponsivenessGlobalFilters }
      ))
    }
    if (sourceLeadtimeState === "idle") {
      dispatch(fetchSourceLeadtime({ globalFilter: selectedResponsivenessGlobalFilters }))
    }
  }, [selectedResponsivenessGlobalFilters, distributionState, finishedGoodGridState, sourceLeadtimeState, salesRegionState, breakdownGraphState, priorityState, distributionByBrandState, nodeChartState]);



  useEffect(() => {
    if (
      typeof Object.keys(distributionGraphData) !== "undefined" &&
      Object.keys(distributionGraphData)?.length > 0
    ) {
      setDistribution_graphChartProps((prevState) => ({
        ...prevState,
        source: distributionGraphData[activeBtn] !== undefined ? distributionGraphData[activeBtn] : [],
      }));
    }
    if (
      typeof Object.keys(priorityGraphData) !== "undefined" &&
      Object.keys(priorityGraphData)?.length > 0
    ) {
      setPriority_graphChartProps((prevState) => ({
        ...prevState,
        source: priorityGraphData[activeBtn] !== undefined ? priorityGraphData[activeBtn] : [],
      }));
    }

    if (
      typeof Object.keys(salesRegionGraphData) !== "undefined" &&
      Object.keys(salesRegionGraphData)?.length > 0
    ) {
      setSalesRegion_graphChartProps((prevState) => ({
        ...prevState,
        source: salesRegionGraphData[activeBtn] !== undefined ? salesRegionGraphData[activeBtn] : [],
      }));
    }

    if (
      typeof Object.keys(distributionByBrandGraphData) !== "undefined" &&
      Object.keys(distributionByBrandGraphData)?.length > 0
    ) {
      setDistributionByBrand_graphChartProps((prevState) => ({
        ...prevState,
        source: distributionByBrandGraphData[activeBtn] !== undefined ? distributionByBrandGraphData[activeBtn] : {},
      }));
    }
  }, [
    distributionGraphData,
    activeBtn,
    priorityGraphData,
    salesRegionGraphData,
    dataCategory,
    distributionByBrandGraphData,
  ]);

  //Event Handling


  const onToggleBtnChange = (btnValue) => {
    setActiveBtn(prev => btnValue == null ? prev : btnValue);
  };

  return (
    <div className="lead-time-container">
      <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
        <NodeChartFilter />
        <NodeChartLegend />
        <NodeChart type="e2e" />


        <Row gutter={[6, 12]}>
          <Col xs={23}>
            <div className="filter-container">
              <Filter enable={pageLoaded} />
            </div >
          </Col>
          <Col xs={24}>
            <LeadTimeCalFilter
              selectedValue={defaultSelectedValue}
              toggleBtn={onToggleBtnChange}

            />
          </Col>
          <Col xs={12} sm={12} xxl={12}>
            {/* E2E Leadtime Breakdown chart */}
            <LTBBarChart activeBtn={activeBtn} />
          </Col>
          <Col xs={12} sm={12} xxl={12}>
            <ChartWrapper title="E2E Leadtime Distribution"
              cardLoading={distributionByBrandState === "pending"}
              chartDownloadData={Object.keys(distribution_graphChartProps.source)?.length > 0 ? distribution_graphChartProps.source : []}
              downloadType="chart"
              type="distribution"

            >
              <BarChartWrapper GraphChartProps={distribution_graphChartProps} />
            </ChartWrapper>
          </Col>

          <Col xs={12} sm={12} xxl={12}>
            <ChartWrapper title="Wt. Average Leadtime Distribution by Priority Subcategory"
              chartDownloadData={Object.keys(priorityGraphData)?.length > 0 ? activeBtn == "units" ? priorityGraphData?.download?.units : priorityGraphData?.download?.revenue : []}

              downloadType="chart"
              type="prioritySubcategory"
            >
              <BoxPlotChart GraphChartProps={priority_graphChartProps}

              />
            </ChartWrapper>
          </Col>
          <Col xs={12} sm={12} xxl={12}>
            <ChartWrapper title="Wt. Average Leadtime Distribution by Sales Region"
              chartDownloadData={Object.keys(salesRegionGraphData)?.length > 0 ? activeBtn == "units" ? salesRegionGraphData?.download?.units : salesRegionGraphData?.download?.revenue : []}

              downloadType="chart"
              type="salesRegion">
              <BoxPlotChart GraphChartProps={salesRegion_graphChartProps} />
            </ChartWrapper>
          </Col>
          <Col xs={24} sm={24} xxl={24}>
            <ChartWrapper title="Wt. Average Leadtime Distribution by Brand"
              cardLoading={distributionByBrandState === "pending"}
              chartDownloadData={Object.keys(distributionByBrandGraphData)?.length > 0 ? activeBtn == "units" ? distributionByBrandGraphData?.download?.units : distributionByBrandGraphData?.download?.revenue : []}

              downloadType="chart"
              className="distribution-brand-card"
              type="distributionBrand"
            >
              <BoxPlotChart
                GraphChartProps={distributionByBrand_graphChartProps}
              />
            </ChartWrapper>
          </Col>
          <Col xs={24} sm={24} xxl={24}>

            <E2EWtAvgLeadTimeByFinishedGood activeBtn={activeBtn} />

          </Col>
          <Col xs={24} sm={24} xxl={24}>

            <SourceLeadTimeOpportunitiesByMaterial />

          </Col>
        </Row>
      </Spin >
    </div >
  );
};

export default LeadTime;
