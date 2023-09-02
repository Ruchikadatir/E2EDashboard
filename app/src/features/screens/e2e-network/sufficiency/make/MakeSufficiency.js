import E2ECard from "../../../../e2e-card/E2ECard";
import "./MakeSufficiency.scss";
import GeoMap from "../../../../geo-map/GeoMap.js";
import Filter from "../../../../filter/Filter.js";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChartWrapper from "../../../../wrapper/ChartWrapper";
import { Row, Col } from "antd";
import {
  fetchMakeBarGraph, fetchManlocGrid, fetchDonutChart, fetchProductionPOs, fetchHeatMap
} from "./MakeSlice.js";
import MakeChartFilter from "../../../../filter/bar-chart-filter/MakeChartFilter";
import GeoMapLegend from "../../../../geo-map-legend/GeoMapLegend";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import DonutChart from "../../../../chart/donut-chart/DonutChart";
import HeatMap from "../../../../chart/heat-map/HeatMap.js";
import ProductionPosGrid from "./production-pos-grid/ProductionPosGrid";
import ManlocGrid from "./manloc-grid/ManlocGrid";
import { getE2eNodes, getE2eConnections } from "./../../../../geo-map/GeoMapSlice";
import { setAPICall, setChartFilterRefreshState } from "../../../../filter/FilterSlice"
import { fetchE2ECard } from "../../../../e2e-card/E2ECardSlice"
import { numberConversion } from "../../../../app-utils/AppUtils";
import fonts from "../../../../style/variable.scss";
import {
  fetchMakeTooltip,
} from "./../../../../geo-map/GeoMapSlice";
import { Spin } from 'antd';
//PPUnitCapacity: Projected Production Units vs. Capacity

const MakeSufficiency = () => {

  const [pageLoaded, setPageLoaded] = useState(true);

  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const selectedMakeChartFilters = useSelector((state) => state.filter.selectedMakeChartFilters);
  const loading = useSelector((state) => state.make.loading);
  const [prodReqViewState, setProdReqViewState] = useState("top10");


  const heatMapLoading = useSelector(
    (state) => state.make.heatMap.heatMapLoading
  );


  const makeTooltipData = useSelector(
    (state) => state.geoMap.makeTooltipData.data
  );
  const dataZoom = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 100,
      height: 15,
    },
  ];

  const dataZoomAll = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 10,
      height: 15,
    },
  ];

  const heatMapGridRef = useRef();

  const PPUnitCapacity_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#0038A8",
      barWidth: 100,
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[1])}`

        }
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
          return `${params.name} : ${numberConversion(params.value[2])}`

        }
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#A55CC3",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[3])}`

        }
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#BAB8FF",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[4])}`

        }
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#D60270",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[5])}`

        }
      }
    },
    {
      type: "line",
      color: "#FFA24A",
      tooltip: {
        trigger: "item",
        confine: true,
        extraCssText: "background: #FFFFFF;",
        formatter: function (params) {
          return [
            `Year: <b>${(params.data[0])}</b><br/>`,
            "Volume: " + `<b>${numberConversion(params.data[6])}</b>` + "<br/>",
            typeof (params.data[7]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[7])}%</>` + "<br/>") : "",
          ].join("");
        },
        rich: {
          a: {
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "red",
          },
          b: {
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "green",
          },
        },
        textStyle: {
          fontFamily: "noto-sans-bold",
          fontWeight: 400,
          fontSize: 12,
          color: "#0D1640CC",
        },
      },

      emphasis: {
        focus: "series",
        label: {
          show: true,
          position: "top",
          formatter: function (params) {
            let values = Math.round(params.data[7]);
            if (values < 0) {
              return `{a|  ${values}}`;
            } else {
              return `{b|  ${values}}`;
            }
          },
          rich: {
            a: {
              fontSize: 9,
              fontWeight: "bold",
              color: "red",
            },
            b: {
              fontSize: 9,
              fontWeight: "bold",
              color: "green",
            },
          },
        },
      },
    },
  ];
  const productionRequirement_seriesData = [
    {
      name: "Skincare",
      type: "bar",
      stack: "total",
      color: "#0038A8",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[1])}`

        }
      }
    },
    {
      name: "Makeup",
      type: "bar",
      stack: "total",
      color: "#7EB2FF",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[2])}`

        }
      }
    },
    {
      name: "Fragrance",
      type: "bar",
      stack: "total",
      color: "#A55CC3",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[3])}`

        }
      }
    },
    {
      name: "Haircare",
      type: "bar",
      stack: "total",
      color: "#8380EB",
      emphasis: {
        focus: "series",
      },

      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[4])}`

        }
      }

    },
    {
      name: "Others",
      type: "bar",
      stack: "total",
      color: "#BAB8FF",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name} : ${numberConversion(params.value[1])}`

        }
      }
    },

  ];
  const PPUnitCapacityGraphData = useSelector((state) => state.make.PPUnitCapacityGraphData);
  const PPUnitCapacityGraphDataState = useSelector((state) => state.make.PPUnitCapacityGraphDataState);
  const productionRequirementGraphData = useSelector((state) => state.make.productionRequirementGraphData);
  const productionRequirementGraphDataState = useSelector((state) => state.make.productionRequirementGraphDataState);
  const mixDonutChartData = useSelector((state) => state.make.mixDonutChartData);
  const mixDonutChartDataState = useSelector((state) => state.make.mixDonutChartDataState);
  const heatMapState = useSelector((state) => state.make.heatMapState);
  const makeAPICall = useSelector((state) => state.filter.makeAPICall)
  const makeChartFilterRefresh = useSelector((state) => state.filter.makeChartFilterRefresh)
  const nodesState = useSelector((state) => state.geoMap.nodesState);
  const connectionsState = useSelector((state) => state.geoMap.connectionsState);
  const productionPosGridState = useSelector((state) => state.make.productionPOsGridDataState)
  const manlocGridState = useSelector((state) => state.make.manlocGridDataState)
  const productionRequirement_viewBySet = ["Top 10", "All"];
  const [PPUnitCapacity_graphChartProps, setPPUnitCapacityGraphChartProps] =
    useState({
      height: "350px",
      seriesData: PPUnitCapacity_seriesData,
      source: [],
      xTitleSet: ["Fiscal Year"],
      yTitleSet: ["Volume"],
      chartMarginTop: "-2%",
      loading: loading,
      swap: false,
      isToolBoxNeeded: false,
    });

  const [
    productionRequirement_graphChartProps,
    setProductionRequirementGraphChartProps,
  ] = useState({
    height: "450px",
    seriesData: productionRequirement_seriesData,
    source: [],
    xTitleSet: ["Plant & Resource"],
    yTitleSet: ["Volume"],
    viewBySet: productionRequirement_viewBySet,
    loading: loading,
    swap: false,
    isToolBoxNeeded: false,
    dataZoom: dataZoom,
    chartMarginTop: "-5%",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (PPUnitCapacityGraphDataState === "pending" || productionRequirementGraphDataState === "pending" || manlocGridState === "pending" || heatMapState === "pending" || mixDonutChartDataState === "pending" || makeChartFilterRefresh === "pending" || nodesState === "pending" || connectionsState === "pending")
      setPageLoaded(false);
    else
      setPageLoaded(true)

    if (PPUnitCapacityGraphDataState === "idle" && productionRequirementGraphDataState === "idle") {
      dispatch(fetchMakeBarGraph({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));
    }

    if (heatMapState === "idle") {
      dispatch(fetchHeatMap({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }))
    }
    if (manlocGridState === "idle") {
      dispatch(fetchManlocGrid({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }))
    }

    if (mixDonutChartDataState === "idle") {
      dispatch(fetchDonutChart({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));
    }

    if (makeChartFilterRefresh || makeAPICall) {
      dispatch(fetchMakeBarGraph({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));
      dispatch(fetchHeatMap({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));
      dispatch(fetchDonutChart({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));
      dispatch(fetchManlocGrid({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": selectedMakeChartFilters }));

      if (makeAPICall) {
        dispatch(fetchE2ECard({ globalFilter: selectedSufficiencyGlobalFilters }));
        dispatch(getE2eNodes({ globalFilter: selectedSufficiencyGlobalFilters }));
        dispatch(getE2eConnections({ globalFilter: selectedSufficiencyGlobalFilters }));
        dispatch(fetchMakeTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));
      }
      dispatch(setAPICall("make"));
      dispatch(setChartFilterRefreshState("make"));
    }
    if (productionPosGridState === "idle") { dispatch(fetchProductionPOs()) }
  }, [PPUnitCapacityGraphDataState, productionRequirementGraphDataState, manlocGridState, heatMapState, mixDonutChartDataState, makeChartFilterRefresh, nodesState, connectionsState, makeAPICall]);
  useEffect(() => {
    const viewBy =
      prodReqViewState === "Top 10"
        ? "top10"
        : prodReqViewState === "All"
          ? "all"
          : "top10";

    setPPUnitCapacityGraphChartProps((prevState) => ({
      ...prevState,
      source:
        PPUnitCapacityGraphData !== null &&
          PPUnitCapacityGraphData !== undefined
          ? PPUnitCapacityGraphData
          : [],
    }));

    setProductionRequirementGraphChartProps((prevState) => ({
      ...prevState,
      source:
        productionRequirementGraphData !== null &&
          PPUnitCapacityGraphData !== undefined &&
          productionRequirementGraphData[viewBy] !== undefined
          ? productionRequirementGraphData[viewBy]
          : [],
      dataZoom: viewBy == "all" ? dataZoomAll : dataZoom,
    }));
  }, [
    PPUnitCapacityGraphData,
    prodReqViewState,
    productionRequirementGraphData,
  ]);




  const heatMapGridDownload = () => {
    heatMapGridRef.current.heatMapGridDownload();
  };


  //ViewBy Click Response Handling
  const handleProductionRequirementViewByResponse = (event) => {
    setProdReqViewState(event);
  };
  //bar chart filter response


  return (
    <div className="make-container">
      <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
        <div className="filter-container">
          <Filter enable={pageLoaded} />
        </div>
        <div className="legend-container">
          <GeoMapLegend type="make" />
        </div>

        <GeoMap type="make" tooltipData={makeTooltipData} />

        <E2ECard type="make" />
        <Row className="row-container">
          <Col xs={24}>
            <MakeChartFilter
              enable={pageLoaded}

            />
          </Col>
          <Col xs={24}>
            <ChartWrapper
              type="make"
              title="Projected Production Units vs Capacity"

              cardLoading={PPUnitCapacityGraphDataState === "pending"}
              chartDownloadData={Object.keys(PPUnitCapacity_graphChartProps.source)?.length > 0 ? PPUnitCapacity_graphChartProps.source : []}
              downloadType="chart"
            >

              <BarChartWrapper
                GraphChartProps={PPUnitCapacity_graphChartProps}
              />

            </ChartWrapper>
          </Col>
          <Col xs={24}>
            <ChartWrapper
              type="make"
              title="Utilization Heat Map"
              cardLoading={heatMapState === "pending"}
              downloadCsv={heatMapGridDownload}
              downloadType="grid"
            >
              <HeatMap ref={heatMapGridRef} />
            </ChartWrapper>
          </Col>
          <Col xs={24}>
            <ChartWrapper type="make" title="MANLOC" className="manloc-comp">
              <Row gutter={10} align="left">
                <Col xs={24} sm={14}>
                  <ChartWrapper
                    title="Production Requirements"
                    type="nested"
                    cardLoading={productionRequirementGraphDataState === "pending"}
                    chartDownloadData={
                      Object.keys(productionRequirement_graphChartProps.source)?.length > 0 ? productionRequirement_graphChartProps.source : []
                    }
                    downloadType="chart"
                    className="right-col-border"
                  >
                    <div className="chart-spacing">
                      <BarChartWrapper
                        GraphChartProps={productionRequirement_graphChartProps}
                        handleViewByRequest={
                          handleProductionRequirementViewByResponse
                        }
                      />
                    </div>
                  </ChartWrapper>
                </Col>
                <Col xs={24} sm={10}>
                  <ChartWrapper
                    title="Mix"
                    type="nested"
                    cardLoading={
                      mixDonutChartData !== undefined && mixDonutChartData !== null && Object.keys(mixDonutChartData).length > 0 ? false : true
                    }
                    chartDownloadData={Object.keys(mixDonutChartData)?.length > 0 ? [...mixDonutChartData.regionalMix, ...mixDonutChartData.i_e, ...mixDonutChartData.promoMix] : []}
                    downloadType="chart"
                    className="extraPadding"
                  >
                    <DonutChart
                      height="320px"
                      title={`Regional\n\nMix`}
                      chartData={mixDonutChartData}
                    />
                  </ChartWrapper>
                </Col>
                <Col xs={24} sm={24} xxl={24}>
                  <ManlocGrid />
                </Col>
              </Row>
            </ChartWrapper>
          </Col>

          <Col xs={24} sm={24} xxl={24}>
            <ProductionPosGrid />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default MakeSufficiency;
