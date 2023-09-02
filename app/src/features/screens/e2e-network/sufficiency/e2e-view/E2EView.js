import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import ChartWrapper from "../../../../wrapper/ChartWrapper.js";
import E2ECard from "../../../../e2e-card/E2ECard.js";
import GeoMapLegend from "../../../../geo-map-legend/GeoMapLegend";
import "./E2EView.scss";
import GeoMap from "../../../../geo-map/GeoMap.js";
import Filter from "../../../../filter/Filter.js";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import { fetchSourceGraph, fetchFulfillGraph, fetchMakeGraph, fetchInventoryByNodeGraph, fetchRevenueGrowthGraph } from './E2ESlice'
import { getE2eConnections, getE2eNodes } from "../../../../geo-map/GeoMapSlice";
import { setAPICall } from "../../../../filter/FilterSlice";
import RevenueGrowthBarChart from "./RevenueGrowthGraph"
import { Spin } from 'antd';
import {
  fetchSourceTooltip,
  fetchFulfillTooltip,
  fetchMakeTooltip,
} from "./../../../../geo-map/GeoMapSlice";
import { fetchGlobalFilterRequest } from "../../../../filter/FilterSlice"
import { fetchE2ECard } from "../../../../e2e-card/E2ECardSlice"
import { useSelector, useDispatch } from "react-redux";
import { numberConversion } from "../../../../app-utils/AppUtils.js";
import fonts from "../../../../style/variable.scss";



const E2EView = () => {
  const dispatch = useDispatch();

  const data = {
    kpi: "1233445",
    kpi1: "3456",
    kpi2: "456788",
    kpi3: "567890",
    region: "205%",
  };

  const revenueGrowthGraphDataState = useSelector((state) => state.e2e.revenueGrowthGraphDataState);
  const sourceGraphData = useSelector((state) => state.e2e.sourceGraphData);
  const sourceGraphDataState = useSelector((state) => state.e2e.sourceGraphDataState);
  const makeGraphData = useSelector((state) => state.e2e.makeGraphData);
  const makeGraphDataState = useSelector((state) => state.e2e.makeGraphDataState);
  const fulfillGraphData = useSelector((state) => state.e2e.fulfillGraphData);
  const fulfillGraphDataState = useSelector((state) => state.e2e.fulfillGraphDataState);
  const inventoryByNodeGraphData = useSelector((state) => state.e2e.inventoryByNodeGraphData);
  const inventoryByNodeGraphDataState = useSelector((state) => state.e2e.inventoryByNodeGraphDataState);
  const sourceTooltipDataState = useSelector((state) => state.geoMap.sourceTooltipDataState);
  const makeTooltipDataState = useSelector((state) => state.geoMap.makeTooltipDataState);
  const fulfillTooltipDataState = useSelector((state) => state.geoMap.fulfillTooltipDataState);

  const loading = useSelector((state) => state.e2e.loading);
  const sourceTooltipData = useSelector(
    (state) => state.geoMap.sourceTooltipData.data
  );
  const makeTooltipData = useSelector(
    (state) => state.geoMap.makeTooltipData.data
  );
  const fulfillTooltipData = useSelector(
    (state) => state.geoMap.fulfillTooltipData.data
  );
  const selectedSufficiencyGlobalFilters = useSelector(
    (state) => state.filter.selectedSufficiencyGlobalFilters
  );
  const e2eCardState = useSelector((state) => state.e2eCard.e2eCardState);
  const e2eAPICall = useSelector((state) => state.filter.e2eAPICall);
  const nodesState = useSelector((state) => state.geoMap.nodesState);
  const connectionsState = useSelector((state) => state.geoMap.connectionsState);
  let e2eTooltipData = { ...sourceTooltipData, ...makeTooltipData, ...fulfillTooltipData }



  const [pageLoaded, setPageLoaded] = useState(true);

  const source_dataCategorySet = ["Ingredients", "Components"];
  const [source_dataCategory, setSource_dataCategory] = useState(
    source_dataCategorySet[0]
  );
  const make_dataCategorySet = ["Compounding", "Fill", "Assembly"];
  const [make_dataCategory, setMake_dataCategory] = useState(
    make_dataCategorySet[0]
  );
  const inventory_dataCategorySet = ["All", "Internal Mfg.", "TPM", "DC"];
  const [inventory_dataCategory, setInventory_dataCategory] = useState(
    inventory_dataCategorySet[0]
  );
  //var viewBy
  const viewBySet = ["Big 5", "Fast 5", "All"];
  const [source_viewBy, setSource_viewBy] = useState(viewBySet[0]);
  const [make_viewBy, setMake_viewBy] = useState(viewBySet[0]);
  const make_xTitleSet = ["Plant", "Platform"];
  const [make_xTitle, setMake_xTitle] = useState(make_xTitleSet[0]);

  //Y Axis
  const inventory_yTitleSet = ["Inventory Units", "Inventory $"];
  const [inventory_yTitle, setInventory_yTitle] = useState(
    inventory_yTitleSet[0]
  );

  //scrollbar for E2E Inventory By Node Graph
  const dataZoom = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 10,
      height: 15,
    }
  ];

  const dataZoomRequirementGrowth = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 100,
      height: 10,
    },
  ];

  const dataZoomMakeAll = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 45,
      height: 10,
    }
  ]
  const dataZoomInternalMfg = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 80,
      height: 10,
    }
  ]


  const dataZoomDC = [
    {
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      show: true,
      start: 0,
      end: 60,
      height: 10,
    }
  ]

  //seriesData for Barchart

  var sourceSeriesData = [
    {
      type: "bar",
      color: "#21BEE1",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: ${numberConversion(params.value[1])}`
        },
        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      type: "bar",
      color: "#9FE2F1",
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = typeof (params.data[3]) == "number" ? Math.round(params.data[3]) : undefined;
          if (values !== undefined) {
            if (values < 0) {
              return `{a|  ${values}%}`;
            } else {
              return `{b|  ${values}%}`;
            }
          }
          else {
            return "";
          }
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
      },
      tooltip: {
        trigger: "item",
        formatter: function (param) {
          return [
            `${param.name}: <b>${numberConversion(param.value[2])}</b><br/>`,
            typeof (param.data[3]) == "number" ? "CAGR%: " + `<b>${Math.round(param.data[3])}%</b>` + "<br/>" : "",
          ].join("");
        },
        axisPointer: {
          type: "shadow",
        },
      },
      emphasis: {
        focus: "series",
      },
    },
  ];
  var makeSeriesData = [
    {
      type: "bar",
      color: "#011BE1",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {

          return `${params.name}: ${numberConversion(params.value[1])}`
        },

        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      type: "bar",
      color: "#6DB2FF",
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = typeof (params.data[3]) == "number" ? Math.round(params.data[3]) : undefined;
          if (values !== undefined) {
            if (values < 0) {
              return `{a|  ${values}%}`;
            } else {
              return `{b|  ${values}%}`;
            }
          }
          else {
            return "";
          }
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
      },
      tooltip: {
        trigger: "item",
        formatter: function (param) {
          return [
            `${param.name}: <b>${numberConversion(param.value[2])}</b><br/>`,
            typeof (param.data[3]) == "number" ? "CAGR%: " + `<b>${Math.round(param.data[3])}%</b>` + "<br/>" : "",
          ].join("");
        },
        axisPointer: {
          type: "shadow",
        },
      },
      emphasis: {
        focus: "series",
      },
    },
  ];
  var fulfillSeriesData = [
    {
      type: "bar",
      color: "#A454EB",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.name}: ${numberConversion(params.value[1])}`
        },

        axisPointer: {
          type: "shadow",
        },
      },
    },
    {
      type: "bar",
      color: "#D6BEEC",
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = typeof (params.data[3]) == "number" ? Math.round(params.data[3]) : undefined;
          if (values !== undefined) {
            if (values < 0) {
              return `{a|  ${values}%}`;
            } else {
              return `{b|  ${values}%}`;
            }
          }
          else {
            return "";
          }
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
      },
      tooltip: {
        trigger: "item",
        formatter: function (param) {
          return [
            `${param.name}: <b>${numberConversion(param.value[2])}</b><br/>`,
            typeof (param.data[3]) == "number" ? "CAGR%: " + `<b>${Math.round(param.data[3])}%</b>` + "<br/>" : "",
          ].join("");
        },
        axisPointer: {
          type: "shadow",
        },
      },
      emphasis: {
        focus: "series",
      },
    },
  ];
  const [inventory_seriesData, setInventory_seriesData] = useState([]);

  //var graph props
  const [source_graphChartProps, setSource_graphChartProps] = useState({
    height: "376px",
    width: "450px",
    seriesData: sourceSeriesData,
    source: [],
    xTitleSet: ["Material Group"],
    yTitleSet: ["Unit Requirement (M)"],
    swap: false,
    isToolBoxNeeded: false,
    gridLeftValue: 70,
    dataCategory: source_dataCategorySet,
    viewBySet: viewBySet,
    dataZoom: dataZoom
  });
  const [make_graphChartProps, setMake_graphChartProps] = useState({
    height: "362px",
    width: "335px",
    seriesData: makeSeriesData,
    source: [],
    xTitleSet: make_xTitleSet,
    yTitleSet: ["Unit Requirement (M)"],
    swap: false,
    isToolBoxNeeded: false,
    gridLeftValue: 70,
    dataCategory: make_dataCategorySet,
    viewBySet: viewBySet,
    dataZoom: dataZoom,
    xTitleSelected: make_xTitle,
    xAxisWidth: 60
  });
  const [fulfill_graphChartProps, setFulfill_graphChartProps] = useState({
    height: "310px",
    seriesData: fulfillSeriesData,
    source: [],
    xTitleSet: ["Region"],
    yTitleSet: ["Unit Requirement (M)"],
    swap: false,
    isToolBoxNeeded: false,
    gridLeftValue: 70,
    chartMarginTop: "36px",
  });
  const [inventory_graphChartProps, setInventory_graphChartProps] = useState({
    height: "300px",
    seriesData: inventory_seriesData,
    source: [],
    xTitleSet: ["Location Type"],
    yTitleSet: inventory_yTitleSet,
    dataCategory: inventory_dataCategorySet,
    swap: false,
    isToolBoxNeeded: false,
    dataZoom: dataZoom,
  });
  //Handle Chart Reponses

  useEffect(() => {
    dispatch(fetchGlobalFilterRequest(selectedSufficiencyGlobalFilters));
  }, []);
  useEffect(() => {
    if (e2eCardState === "pending" || revenueGrowthGraphDataState === "pending" || sourceGraphDataState === "pending" || makeGraphDataState === "pending" || fulfillGraphDataState === "pending" || inventoryByNodeGraphDataState === "pending" || sourceTooltipDataState === "pending" || makeTooltipDataState === "pending" || fulfillTooltipDataState === "pending" || connectionsState === "pending" || nodesState === "pending")
      setPageLoaded(false);
    else
      setPageLoaded(true)
    if (e2eCardState === "idle" || e2eAPICall) {
      dispatch(fetchE2ECard({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }

    if (revenueGrowthGraphDataState === 'idle' || e2eAPICall) {
      dispatch(fetchRevenueGrowthGraph({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }
    if (sourceGraphDataState === 'idle' || e2eAPICall) {
      dispatch(fetchSourceGraph({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }
    if (makeGraphDataState === 'idle' || e2eAPICall) {
      dispatch(fetchMakeGraph({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }
    if (fulfillGraphDataState === 'idle' || e2eAPICall) {
      dispatch(fetchFulfillGraph({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }
    if (inventoryByNodeGraphDataState === 'idle' || e2eAPICall) {
      dispatch(fetchInventoryByNodeGraph({ "globalFilter": selectedSufficiencyGlobalFilters }));
    }
    if (sourceTooltipDataState === 'idle' || e2eAPICall) {
      dispatch(fetchSourceTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
    if (makeTooltipDataState === 'idle' || e2eAPICall) {
      dispatch(fetchMakeTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
    if (fulfillTooltipDataState === 'idle' || e2eAPICall) {
      dispatch(fetchFulfillTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));

    }
    if (e2eAPICall) {
      dispatch(getE2eNodes({ globalFilter: selectedSufficiencyGlobalFilters }));
      dispatch(getE2eConnections({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
    dispatch(setAPICall("e2e"));
  }, [e2eAPICall, e2eCardState, revenueGrowthGraphDataState, sourceGraphDataState, makeGraphDataState, fulfillGraphDataState, inventoryByNodeGraphDataState, sourceTooltipDataState, makeTooltipDataState, fulfillTooltipDataState, connectionsState,
    nodesState]);
  useEffect(() => {
    let makeSourceData = makeGraphData[make_dataCategory.toLowerCase()] !== undefined && makeGraphData[make_dataCategory.toLowerCase()][
      make_viewBy.toLowerCase().replace(" ", "")
    ] !== undefined &&
      makeGraphData[make_dataCategory.toLowerCase()][
      make_viewBy.toLowerCase().replace(" ", "")
      ][make_xTitle.toLowerCase()] !== undefined &&

      Object.keys(makeGraphData[make_dataCategory.toLowerCase()][
        make_viewBy.toLowerCase().replace(" ", "")
      ][make_xTitle?.toLowerCase()])?.length > 0

      ? makeGraphData[make_dataCategory.toLowerCase()][
      make_viewBy.toLowerCase().replace(" ", "")
      ][make_xTitle.toLowerCase()] : [];
    let makeGrapheData = {}
    Object.entries(makeSourceData).forEach(([key, value]) => {
      if (key === "plant" || key === "platform") makeGrapheData["category"] = value;
      else
        makeGrapheData[key] = value;
    });
    const sourceViewBy = source_viewBy?.toLowerCase()?.replace(" ", "");
    if (
      sourceGraphData !== null && sourceGraphData !== undefined &&
      Object.keys(sourceGraphData).length > 0
    ) {
      setSource_graphChartProps((prevState) => ({
        ...prevState,
        source: sourceGraphData[source_dataCategory.toLowerCase()] != undefined && sourceGraphData[source_dataCategory.toLowerCase()] && sourceGraphData[source_dataCategory.toLowerCase()][sourceViewBy] !== undefined &&
          sourceGraphData[source_dataCategory.toLowerCase()][sourceViewBy] ? sourceGraphData[source_dataCategory.toLowerCase()][sourceViewBy] : [],
        dataZoom: sourceViewBy == "all" ? dataZoom : dataZoomRequirementGrowth,
      }));
    }

    const inventoryDataCategory =
      inventory_dataCategory === "All"
        ? "all"
        : inventory_dataCategory === "Internal Mfg."
          ? "internalMfg"
          : inventory_dataCategory === "TPM"
            ? "tpm"
            : inventory_dataCategory === "DC"
              ? "dc"
              : "all";

    const inventoryYTitle =
      inventory_yTitle === "Inventory Units"
        ? "inventoryUnits"
        : inventory_yTitle === "Inventory $"
          ? "inventory$"
          : "inventoryUnits";

    if (
      inventoryByNodeGraphData !== undefined &&
      Object.keys(inventoryByNodeGraphData).length > 0
    ) {
      setInventory_graphChartProps((prevState) => ({
        ...prevState,
        source:
          inventoryByNodeGraphData[inventoryDataCategory] !== undefined &&
            inventoryByNodeGraphData[inventoryDataCategory][inventoryYTitle] !==
            undefined &&
            Object.keys(
              inventoryByNodeGraphData[inventoryDataCategory][inventoryYTitle]
            )?.length > 0
            ? inventoryByNodeGraphData[inventoryDataCategory][inventoryYTitle]
            : [],
        seriesData: [
          {
            type: "bar",
            stack: "total",
            color: "#0038A8",
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (inventory_yTitle.includes("$"))
                  return `${params.name}: $${numberConversion(params.value[1])}`
                else
                  return `${params.name}: ${numberConversion(params.value[1])}`
              },


              axisPointer: {
                type: "shadow",
              },
            },

            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            stack: "total",
            color: "#7EB2FF",
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (inventory_yTitle.includes("$")) {
                  return `${params.name}: $${numberConversion(params.value[2])}`
                }
                else
                  return `${params.name}: ${numberConversion(params.value[2])}`
              },
              axisPointer: {
                type: "shadow",
              },
            },

            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            stack: "total",
            color: "#A55CC3",
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (inventory_yTitle.includes("$"))
                  return `${params.name}: $${numberConversion(params.value[3])}`
                else
                  return `${params.name}: ${numberConversion(params.value[3])}`
              },


              axisPointer: {
                type: "shadow",
              },
            },


            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            stack: "total",
            color: "#D60270",
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (inventory_yTitle.includes("$"))
                  return `${params.name}: $${numberConversion(params.value[4])}`
                else
                  return `${params.name}: ${numberConversion(params.value[4])}`
              },


              axisPointer: {
                type: "shadow",
              },
            },


            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            stack: "total",
            color: "#FFA24A",
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (inventory_yTitle.includes("$"))
                  return `${params.name}: $${numberConversion(params.value[5])}`
                else
                  return `${params.name}: ${numberConversion(params.value[5])}`
              },


              axisPointer: {
                type: "shadow",
              },
            },

            emphasis: {
              focus: "series",
            },
          },
        ],
        dataZoom: inventory_dataCategory === "Internal Mfg." ? dataZoomInternalMfg : inventory_dataCategory === "TPM" ? dataZoomInternalMfg : inventory_dataCategory === "DC" ? dataZoomDC : dataZoom
      }));
    }

    if (
      makeGrapheData !== undefined &&
      Object.keys(makeGrapheData).length > 0
    ) {
      setMake_graphChartProps((prevState) => ({
        ...prevState,
        source: makeGrapheData,
        xTitleSelected: make_xTitle,
        dataZoom: make_viewBy == "All" ? dataZoomMakeAll : dataZoomRequirementGrowth,
      }));
    }
    if (
      fulfillGraphData !== undefined &&
      Object.keys(fulfillGraphData).length > 0
    ) {
      setFulfill_graphChartProps((prevState) => ({
        ...prevState,
        source:
          Object.keys(fulfillGraphData)?.length > 0
            ? fulfillGraphData
            : [],
      }));
    }

  }, [
    sourceGraphData,
    source_dataCategory,
    source_viewBy,
    makeGraphData, make_dataCategory, make_viewBy, make_xTitle, fulfillGraphData,
    inventory_yTitle,
    inventory_dataCategory,
    inventoryByNodeGraphData,
  ]);


  const handleE2EInventoryNodeResponse = (event) => {
    setInventory_yTitle(event);
  };
  const handleRadioSelectionUpdate = (event) => {
    setInventory_dataCategory(event);
  };
  const handleSourceGrowthViewByResponse = (event) => {
    setSource_viewBy(event);
  };
  const handleSourceGraphRadioSelectionUpdate = (event) => {
    setSource_dataCategory(event);
  };
  const handleMakeGraphRadioSelectionUpdate = (event) => {
    setMake_dataCategory(event);
  };
  const handleMakeGrowthViewByResponse = (event) => {
    setMake_viewBy(event);
  };
  const handleMakeGraphXTitleResponse = (event) => {
    setMake_xTitle((prev) => {
      return event === null ? prev : event
    });
  };

  return (
    <div className="e2e-container">
      <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
        <div className="filter-container">
          <Filter
            enable={pageLoaded}
          />
        </div>
        <div className="legend-container">
          <GeoMapLegend type="e2e" />
        </div>

        <GeoMap type="e2e" tooltipData={e2eTooltipData} />

        <div className="card-container">
          <E2ECard type="source" cardData={data} />
          <E2ECard type="make" cardData={data} />
          <E2ECard type="fulfill" cardData={data} />
        </div>

        <Row gutter={[8]} className="row-container">
          <Col xs={24} sm={24} lg={24} xxl={24}>
            <RevenueGrowthBarChart />
          </Col>
          <Col xs={24} sm={24} lg={24} xxl={24}>
            <ChartWrapper
              title="Requirements and Growth"
              className="e2e-card"
            >
              <Row gutter={10} align="left">
                <Col xs={24} sm={8}>
                  <ChartWrapper
                    title="Source"
                    type="nested"
                    cardLoading={
                      sourceGraphDataState == "pending"
                    }

                    chartDownloadData={Object.keys(source_graphChartProps.source)?.length > 0 ? source_graphChartProps.source : []}
                    downloadType="chart"
                    className="right-col-border"
                  >
                    <BarChartWrapper
                      GraphChartProps={source_graphChartProps}
                      handleDataCategoryType={
                        handleSourceGraphRadioSelectionUpdate
                      }
                      handleViewByRequest={handleSourceGrowthViewByResponse}
                    />
                  </ChartWrapper>
                </Col>
                <Col xs={24} sm={8}>
                  <ChartWrapper
                    title="Make"
                    type="nested"
                    cardLoading={makeGraphDataState == "pending"}

                    chartDownloadData={Object.keys(make_graphChartProps.source)?.length > 0 ? make_graphChartProps.source : []}
                    downloadType="chart"
                    className="right-col-border"
                  >
                    <BarChartWrapper
                      GraphChartProps={make_graphChartProps}
                      handleDataCategoryType={handleMakeGraphRadioSelectionUpdate}
                      handleViewByRequest={handleMakeGrowthViewByResponse}
                      handleXTitleUpdate={handleMakeGraphXTitleResponse}

                    />
                  </ChartWrapper>
                </Col>
                <Col xs={24} sm={8}>
                  <ChartWrapper
                    title="Fulfill"
                    type="nested"
                    cardLoading={fulfillGraphDataState == "pending"}
                    chartDownloadData={
                      Object.keys(fulfill_graphChartProps.source)?.length > 0
                        ? fulfill_graphChartProps.source
                        : []
                    }
                    downloadType="chart"
                    className="fulfill-chart"
                  >
                    <BarChartWrapper GraphChartProps={fulfill_graphChartProps} />
                  </ChartWrapper>
                </Col>
              </Row>
            </ChartWrapper>
          </Col>
          <Col xs={24} sm={24} lg={24} xxl={24}>
            <ChartWrapper
              className="e2e-card e2eInventory"
              title="E2E Inventory by Node"
              cardLoading={inventoryByNodeGraphDataState == "pending"}
              chartDownloadData={Object.keys(inventory_graphChartProps.source)?.length > 0 ? inventory_graphChartProps.source : []}
              downloadType="chart"
            >
              <div className="chart-spacing">
                <BarChartWrapper
                  GraphChartProps={inventory_graphChartProps}
                  handleYTitleUpdate={handleE2EInventoryNodeResponse}
                  handleDataCategoryType={handleRadioSelectionUpdate}
                />
              </div>
            </ChartWrapper>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default E2EView;
