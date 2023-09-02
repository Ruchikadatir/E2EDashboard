import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoadingState,
  fetchFinishedGood,
  fetchFinishedGoodBOM,
  fetchRegMaterial,
  fetchProductionSitesGraph,
  fetchRegionalizationGraph,
  fetchRegionalizationPer
} from "./RegionalizationSlice";
import ChartWrapper from "../../../../wrapper/ChartWrapper.js";
import DataGrid from "../../../../data-grid/DataGrid";
import RegSubFilter from "../../../../filter/reg-sub-filter/RegSubFilter.js";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import { Row, Col } from "antd";
import RegionalizationPer from "./regionalization-per/RegionalizationPer.js";
import "./Regionalization.scss";
import GeoMap from "../../../../geo-map/GeoMap";
import GeoMapLegend from "../../../../geo-map-legend/GeoMapLegend";
import Filter from "../../../../filter/Filter"
import FinishedGoodBOMGrid from "./finished-good-bom/FinishedGoodBOMGrid.js";
import RegionalizationByMaterialGrid from "./regionalization-by-material-grid/RegionalizationByMaterialGrid";
import RegionalizationByFinishedGoodGrid from "./regionalization-by-finished-good-grid/RegionalizationByFinishedGoodGrid";
import {
  fetchSourceTooltip,
  fetchFulfillTooltip,
  fetchMakeTooltip,
} from "./../../../../geo-map/GeoMapSlice";
import { getE2eConnections, getE2eNodes } from "../../../../geo-map/GeoMapSlice";
import { numberConversion } from "../../../../app-utils/AppUtils";
import { Spin } from 'antd';

const defaultSelectedValue = "source-to-make";

const Regionalization = () => {
  const [activeBtn, setActiveBtn] = useState(defaultSelectedValue);
  const [pageLoaded, setPageLoaded] = useState(true);
  const [selectedDropdownFilterValue, setSelectedDropdownFilterValue] = useState("ingredients")
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.regionalization.loading);
  const finishedGoodState = useSelector((state) => state.regionalization.finishedGoodState);
  const regMaterialState = useSelector((state) => state.regionalization.regMaterialState);
  const finishedGoodBOMState = useSelector((state) => state.regionalization.finishedGoodBOMState);
  const productionSitesState = useSelector((state) => state.regionalization.productionSitesState);
  const regionalizationMaterialGroupState = useSelector((state) => state.regionalization.regionalizationMaterialGroupState)
  const regionalizationPerState = useSelector(state => state.regionalization.regionalizationPerState)

  const sourceTooltipData = useSelector(
    (state) => state.geoMap.sourceTooltipData.data
  );
  const makeTooltipData = useSelector(
    (state) => state.geoMap.makeTooltipData.data
  );
  const fulfillTooltipData = useSelector(
    (state) => state.geoMap.fulfillTooltipData.data
  );
  const productionSitesSource =
    useSelector(
      (state) => state.regionalization.productionSitesSource
    ) || {};
  const regionalizationMaterialGroup =
    useSelector((state) => state.regionalization.regionalizationMaterialGroup) || {}
  const regionalizationPsc =
    useSelector((state) => state.regionalization.regionalizationPsc) ||
    {};
  const productionSitesSale =
    useSelector(
      (state) => state.regionalization.productionSitesSale
    ) || {};


  const selectedResponsivenessGlobalFilters = useSelector(
    (state) => state.filter.selectedResponsivenessGlobalFilters
  );
  const geoMapAPICalls = useSelector((state) => state.regionalization.geoMapAPICalls)

  let e2eTooltipData = { ...sourceTooltipData, ...makeTooltipData, ...fulfillTooltipData }
  //Graph Variable setup
  const productionSites_YAxisSet = ["Units", "FG $"];
  const [productionSites_YAxis, setProductionSites_YAxis] = useState(
    productionSites_YAxisSet[0]
  );
  const viewBySet = ["All", "Asia", "Europe", "Americas"];
  const regionalization_viewBySet = ["All", "<50%", "50-75%", ">75%"];
  const [regionalization_viewBy, setRegionalization_viewBy] = useState(
    regionalization_viewBySet[0]
  );



  const [viewBy, setViewBy] = useState(viewBySet[0]);
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
      end: 20,
      height: 15,
    }
  ];
  const dataZoomMaterialGroup = [
    {
      type: 'inside',
      start: 65,
      end: 100,
      yAxisIndex: 0,
    },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 0,
      end: 45,
      width: 20,
      height: '80%',
      left: '97%'
    }
  ];
  const dataZoomMaterialGroupAll = [
    {
      type: 'inside',
      start: 90,
      end: 100,
      yAxisIndex: 0,
    },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 100,
      end: 100,
      width: 20,
      height: '80%',
      left: '97%'
    }
  ];
  const productionSiteDataZoom = [

    {
      type: 'inside',
      start: 0,
      end: 50,
    },
    {
      type: 'slider',
      height: 20,
    }

  ]

  const productionSiteDataZoomAll = [
    {
      type: 'inside',
      start: 0,
      end: 15,
    },
    {
      type: 'slider',
      height: 20,
    }
  ]

  const title = selectedDropdownFilterValue === "ingredients" ? "Ingredients" : selectedDropdownFilterValue === "components" ? "Components" : "Ingredients";
  const regionalization_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#68D0CB",
      barWidth: "25%",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [
            `<b>${params.name}</b> <br/>`,
            `%Regionalized: <b>${numberConversion(params.data[3])}%</b><br/>`,
            `%Non-Regionalized: <b>${numberConversion(params.data[4])}%</b><br/>`
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640",
        },
      }
    },
    {
      type: "bar",
      stack: "total",
      color: "#AAE7E4",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [
            `<b>${params.name}</b> <br/>`,
            `%Regionalized: <b>${numberConversion(params.data[3])}%</b><br/>`,
            `%Non-Regionalized: <b>${numberConversion(params.data[4])}%</b><br/>`,
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640",
        },
      }
    },
  ];
  const regionalizationPsc_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#0038A8",
      barWidth: "25%",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [
            `<b>${params.name}</b> <br/>`,
            `%Regionalized: <b>${numberConversion(params.data[3])}%</b><br/>`,
            `%Non-Regionalized: <b>${numberConversion(params.data[4])}%</b><br/>`,
          ].join("");

        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
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
          return [
            `<b>${params.name}</b> <br/>`,
            `%Regionalized: <b>${numberConversion(params.data[3])}%</b><br/>`,
            `%Non-Regionalized: <b>${numberConversion(params.data[4])}%</b><br/>`,
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640",
        },
      }
    },
  ];
  const productionSites_seriesData = [
    {
      type: "bar",
      stack: "total",
      color: "#0038A8",

      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return [
            "Units: " + `<b>${numberConversion(params.data[1])}</b>` + "<br/>",
            `Source Region: <b>${(params.seriesName)}</b><br/>`,

          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
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
          return [
            "Units: " + `<b>${numberConversion(params.data[2])}</b>` + "<br/>",
            `Source Region: <b>${(params.seriesName)}</b><br/>`,

          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640",
        },
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
          return [
            "Units: " + `<b>${numberConversion(params.data[3])}</b>` + "<br/>",
            `Source Region: <b>${(params.seriesName)}</b><br/>`,

          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640",
        },
      }
    },
  ];

  const [regionalization_graphChartProps, setRegionalization_GraphChartProps] =
    useState({
      height: "370px",
      seriesData: regionalization_seriesData,
      source:
        regionalizationMaterialGroup?.length > 0
          ? regionalizationMaterialGroup["All"]
          : [],
      xTitleSet: ["Units"],
      yTitleSet: ["Material Group"],
      viewBySet: regionalization_viewBySet,
      viewByTitle: "Filter by :",
      dataZoom: regionalization_viewBy === "All" ? dataZoomMaterialGroupAll : dataZoomMaterialGroup,
      swap: true,
      isToolBoxNeeded: false,
      chartMarginTop: "-5%",
      yAxisTitleWidth: 100
    });
  const [productionSites_graphChartProps, setProductionSites_GraphChartProps] =
    useState({
      height: "355px",
      seriesData: [],
      source:
        productionSitesSource?.length > 0
          ? productionSitesSource.PSRSales.All["FG $"]
          : [],
      xTitleSet: ["Plant"],
      yTitleSet: productionSites_YAxisSet,
      viewBySet: viewBySet,
      viewByTitle: "View Plant region by:",
      dataZoom: viewBy === "All" ? productionSiteDataZoomAll : productionSiteDataZoom,
      swap: false,
      isToolBoxNeeded: false,
      chartMarginTop: "-10%"
    });

  const onToggleBtnChange = (btnValue) => {
    setActiveBtn(btnValue);
  };




  const finishedGoodRef = useRef();

  useEffect(() => {
    if (regMaterialState === "pending" || regionalizationPerState === "pending" || regionalizationMaterialGroupState === "pending" || finishedGoodState === "pending" || finishedGoodBOMState === "pending")
      setPageLoaded(false);
    else
      setPageLoaded(true)
    if (loading && regMaterialState !== "pending" && regionalizationPerState !== "pending" && regionalizationMaterialGroupState !== "pending" || finishedGoodState !== "pending" || finishedGoodBOMState !== "pending") {

      dispatch(setLoadingState(true));
    }
    if (!loading) {

      if (regMaterialState === "idle") {
        dispatch(fetchRegMaterial({ globalFilter: selectedResponsivenessGlobalFilters }));
      }
      if (productionSitesState === "idle")
        dispatch(fetchProductionSitesGraph({ globalFilter: selectedResponsivenessGlobalFilters }));
      if (regionalizationMaterialGroupState === "idle") {
        dispatch(fetchRegionalizationGraph({ globalFilter: selectedResponsivenessGlobalFilters }));
      }
      if (regionalizationPerState === "idle") {
        dispatch(fetchRegionalizationPer({ globalFilter: selectedResponsivenessGlobalFilters }))
      }
      if (finishedGoodState === "idle") {
        dispatch(fetchFinishedGood({ globalFilter: selectedResponsivenessGlobalFilters }))
      }
      if (finishedGoodBOMState === "idle") {
        dispatch(fetchFinishedGoodBOM({ globalFilter: selectedResponsivenessGlobalFilters }))
      }
      if (geoMapAPICalls) {
        dispatch(fetchSourceTooltip({ globalFilter: selectedResponsivenessGlobalFilters }));
        dispatch(fetchMakeTooltip({ globalFilter: selectedResponsivenessGlobalFilters }));
        dispatch(fetchFulfillTooltip({ globalFilter: selectedResponsivenessGlobalFilters }));
        dispatch(getE2eNodes({ globalFilter: selectedResponsivenessGlobalFilters }));
        dispatch(getE2eConnections({ globalFilter: selectedResponsivenessGlobalFilters }));

      }
    }

  }, [selectedResponsivenessGlobalFilters, loading,
    regMaterialState,
    productionSitesState,
    regionalizationPerState,
    regionalizationMaterialGroupState, geoMapAPICalls, finishedGoodState, finishedGoodBOMState]);

  useEffect(() => {

    if (
      typeof Object.keys(productionSitesSource) !== "undefined" &&
      Object.keys(productionSitesSource).length > 0
    ) {
      setProductionSites_GraphChartProps((prevState) => ({
        ...prevState,
        source:
          activeBtn === "source-to-make"
            ? (productionSitesSource[selectedDropdownFilterValue] !== undefined && productionSitesSource[selectedDropdownFilterValue][viewBy][productionSites_YAxis] !== undefined ? productionSitesSource[selectedDropdownFilterValue][viewBy][productionSites_YAxis] : [])
            : (productionSitesSale[selectedDropdownFilterValue] !== undefined && productionSitesSale[selectedDropdownFilterValue][viewBy][productionSites_YAxis] !== undefined ? productionSitesSale[selectedDropdownFilterValue][viewBy][productionSites_YAxis] : []),
        dataZoom: viewBy == "All" ? productionSiteDataZoomAll : productionSiteDataZoom,
        seriesData: [
          {
            type: "bar",
            stack: "total",
            color: "#0038A8",
            barWidth: "40%",
            emphasis: {
              focus: "series",
            },
            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (productionSites_YAxis === productionSites_YAxisSet[1]) {
                  return [
                    "FG$: " + `<b>$${numberConversion(params.data[1])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
                else {
                  return [
                    "Units: " + `<b>${numberConversion(params.data[1])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
              },
              textStyle: {
                fontFamily: "noto-sans-light",
                fontWeight: 350,
                fontSize: 12,
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
                if (productionSites_YAxis === productionSites_YAxisSet[1]) {
                  return [
                    "FG$: " + `<b>$${numberConversion(params.data[2])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
                else {
                  return [
                    "Units: " + `<b>${numberConversion(params.data[2])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
              },
              textStyle: {
                fontFamily: "noto-sans-light",
                fontWeight: 350,
                fontSize: 12,
                color: "#0D1640",
              },
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
                if (productionSites_YAxis === productionSites_YAxisSet[1]) {
                  return [
                    "FG$: " + `<b>$${numberConversion(params.data[3])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
                else {
                  return [
                    "Units: " + `<b>${numberConversion(params.data[3])}</b>` + "<br/>",
                    `Source Region: <b>${(params.seriesName)}</b><br/>`,

                  ].join("");
                }
              },
              textStyle: {
                fontFamily: "noto-sans-light",
                fontWeight: 350,
                fontSize: 12,
                color: "#0D1640",
              },
            }
          },
        ]
      }));
    }
    if (
      typeof Object.keys(regionalizationMaterialGroup) !== "undefined" &&
      Object.keys(regionalizationMaterialGroup).length > 0
    ) {

      setRegionalization_GraphChartProps((prevState) => ({
        ...prevState,
        yTitleSet:
          activeBtn === "source-to-make"
            ? ["Material Group"]
            : ["Priority Subcategory"],
        seriesData:
          activeBtn === "source-to-make"
            ? regionalization_seriesData
            : regionalizationPsc_seriesData,
        source:
          activeBtn === "source-to-make"
            ? (regionalizationMaterialGroup[selectedDropdownFilterValue] !== undefined && regionalizationMaterialGroup[selectedDropdownFilterValue][regionalization_viewBy] !== undefined ? regionalizationMaterialGroup[selectedDropdownFilterValue][regionalization_viewBy] : [])
            : (regionalizationPsc[selectedDropdownFilterValue] !== undefined && regionalizationPsc[selectedDropdownFilterValue][regionalization_viewBy] !== undefined) ? regionalizationPsc[selectedDropdownFilterValue][regionalization_viewBy] : [],
        dataZoom: regionalization_viewBy === "All" ? dataZoomMaterialGroupAll : dataZoomMaterialGroup,
      }));
    }
  }, [
    productionSitesSource, productionSitesSale,
    regionalizationMaterialGroup,
    activeBtn,
    viewBy,
    productionSites_YAxis,
    regionalizationPsc,
    selectedDropdownFilterValue,
    regionalization_viewBy,
  ]);
  const finishGoodGridDownload = () => {
    finishedGoodRef.current.gridDownload();
  };


  //Event Handling

  const handleProductionSiteYTitleResponse = (event) => {

    setProductionSites_YAxis(event);
  };
  const handleProductionSiteViewByResponse = (event) => {
    setViewBy(event);

  };

  const handleRegionalizationViewByResponse = (event) => {
    setRegionalization_viewBy(event);

  };
  const handleSubChartFilterDropdownValue = (event) => {
    setSelectedDropdownFilterValue(event.toLowerCase())
  }

  return (
    <div className="regionalization-container">
      <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
        <div className="filter-container">
          <Filter enable={pageLoaded} />
        </div>
        <div className="legend-container">
          <GeoMapLegend type="e2e" />
        </div>

        <GeoMap type="e2e" tooltipData={e2eTooltipData} />

        <Row gutter={[6, 12]} className="regionalizational-charts">
          <Col xs={24} sm={24} xxl={24}>
            <RegionalizationPer />
          </Col>
          <Col sm={24}>
            <RegSubFilter
              defaultSelectedValue={defaultSelectedValue}

              toggleBtn={onToggleBtnChange}
              handleSubChartFilterDropdownValue={handleSubChartFilterDropdownValue}
            />
          </Col>
          <Col xs={12} sm={12} xxl={12}>
            <ChartWrapper
              title={
                activeBtn === "source-to-make"
                  ? `Regionalization by Material Group (${title})`
                  : "Regionalization by Priority Subcategory"
              }
              cardLoading={regionalizationMaterialGroupState === "pending"}
              chartDownloadData={Object.keys(regionalization_graphChartProps.source)?.length > 0 ? regionalization_graphChartProps.source : []}
              downloadType="chart"
              type="regionalization"
            >

              <BarChartWrapper
                GraphChartProps={regionalization_graphChartProps}
                handleViewByRequest={handleRegionalizationViewByResponse}
              />

            </ChartWrapper>
          </Col>
          <Col xs={12} sm={12} xxl={12}>
            <ChartWrapper
              title={
                activeBtn === "source-to-make"
                  ? `Production Sites by Region of Source (${title})`
                  : "Production Sites by Region of Sales"
              }
              cardLoading={productionSitesState === "pending"}
              chartDownloadData={Object.keys(productionSites_graphChartProps.source)?.length > 0 ? productionSites_graphChartProps.source : []}
              downloadType="chart"
              type="regionalizationProduction"
            >
              <div className="graph-container">

                <BarChartWrapper
                  GraphChartProps={productionSites_graphChartProps}
                  handleYTitleUpdate={handleProductionSiteYTitleResponse}
                  handleViewByRequest={handleProductionSiteViewByResponse}
                />

              </div>
            </ChartWrapper>
          </Col>

          <Col xs={24} sm={24} xxl={24}>
            {activeBtn === "source-to-make" ? <RegionalizationByMaterialGrid selectedDropdownFilterValue={selectedDropdownFilterValue} /> :
              <RegionalizationByFinishedGoodGrid selectedDropdownFilterValue={selectedDropdownFilterValue} />}
          </Col>
          <Col xs={24} sm={24} xxl={24}>
            <FinishedGoodBOMGrid />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Regionalization;
