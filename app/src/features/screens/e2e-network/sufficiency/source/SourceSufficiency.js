import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import E2ECard from "../../../../e2e-card/E2ECard";
import GeoMap from "../../../../geo-map/GeoMap.js";
import Filter from "../../../../filter/Filter.js";
import ChartWrapper from "../../../../wrapper/ChartWrapper";
import { Spin } from 'antd';
import {
  fetchMaterialGroupGraphData,
  fetchMaterialNameGraphData, fetchSupplierMixGraphData, fetchPMRGraphData,
  fetchMaterialPOs,
  fetchGraphDataGridAsync
} from "./SourceSlice.js";
import { getE2eConnections, getE2eNodes } from "../../../../geo-map/GeoMapSlice";
import { setAPICall, setChartFilterRefreshState } from "../../../../filter/FilterSlice"
import "./SourceSufficiency.scss";
import { Row, Col } from "antd";
import GeoMapLegend from "../../../../geo-map-legend/GeoMapLegend.js";
import SourceChartFilter from "../../../../filter/bar-chart-filter/SourceChartFilter";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import PMRBarChart from "../../../../chart/bar-chart/PMRBarChart";
import MaterialPosGrid from "./material-pos-grid/MaterialPosGrid";
import WhereUsedGrid from "./where-used-grid/WhereUsedGrid";
import { fetchE2ECard } from "../../../../e2e-card/E2ECardSlice"
import { numberConversion } from "../../../../app-utils/AppUtils";
import {
  fetchSourceTooltip
} from "./../../../../geo-map/GeoMapSlice";
import fonts from "../../../../style/variable.scss";


const SourceSufficiency = () => {
  const [height, setHeight] = useState("350px");

  const XAxisSet = ["Volume: M", "Revenue: $", "Spend"];
  const MaterialGroup_YAxisSet = ["Material Group"];
  const MaterialName_YAxisSet = ["Material Name"];
  const SupplierMix_YAxisSet = ["Supplier"];

  const viewBySet = ["Big 5", "Fast 5", "All"];

  const sourceTooltipData = useSelector(
    (state) => state.geoMap.sourceTooltipData.data
  );

  const selectedSufficiencyGlobalFilters = useSelector(
    (state) => state.filter.selectedSufficiencyGlobalFilters
  );

  const sourceAPICall = useSelector((state) => state.filter.sourceAPICall)
  const PMRGraphData = useSelector((state) => state.source.PMRGraphData);
  const PMRGraphDataState = useSelector((state) => state.source.PMRGraphDataState);
  const supplierMixGraphData = useSelector((state) => state.source.supplierMixGraphData);
  const supplierMixGraphDataState = useSelector((state) => state.source.supplierMixGraphDataState);
  const materialGroupGraphData = useSelector((state) => state.source.materialGroupGraphData);
  const materialGroupGraphDataState = useSelector((state) => state.source.materialGroupGraphDataState);
  const materialNameGraphData = useSelector((state) => state.source.materialNameGraphData);
  const materialNameGraphDataState = useSelector((state) => state.source.materialNameGraphDataState);
  const sourceChartFilterRefresh = useSelector((state) => ((state.filter.sourceChartFilterRefresh)));
  const selectedSourceChartFilters = useSelector((state) => ((state.filter.selectedSourceChartFilters)));
  const nodesState = useSelector((state) => state.geoMap.nodesState);
  const connectionsState = useSelector((state) => state.geoMap.connectionsState);

  const materialPosSate = useSelector((state) => state.source.materialPOsDataState)
  const gridDataState = useSelector((state) => state.source.gridDataState)
  const dataZoom = [
    {
      type: 'inside',
      start: 0,
      end: 100,
      yAxisIndex: 0,
    },
    {
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 0,
      end: 45,
      width: 20,
      height: '80%',
      left: '96%'
    }
  ];

  const dataZoomAll = [
    {
      type: 'inside',
      start: 0,
      end: 2,
      yAxisIndex: 0,
    },
    {
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 0,
      end: 45,
      width: 20,
      height: '80%',
      left: '93%'
    }
  ];

  const dataZoomMaterialGroupAll = [
    {
      type: 'inside',
      start: 0,
      end: 10,
      yAxisIndex: 0,
    },
    {
      show: true,

      filterMode: 'empty',
      start: 0,
      end: 45,
      width: 20,
      height: '80%',
      left: '93%'
    }
  ];

  const dataZoomSupplierMixAll = [
    {
      type: 'inside',
      start: 100,
      end: 96.5,
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



  const dataZoomMaterialNameAll = [
    {
      type: 'inside',
      start: 100,
      end: 98.5,
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


  const dataZoomMaterialGroupChartAll = [
    {
      type: 'inside',
      start: 80,
      end: 100,
      yAxisIndex: 0,
    },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 100,
      height: '80%',
      left: '97%'
    }
  ];


  const [pageLoaded, setPageLoaded] = useState(true);
  const [PMRGraphRequest, setPMRGraphRequest] = useState("Volume: M");

  const [materialName_viewBy, setMaterialName_viewBy] = useState(viewBySet[0]);
  const [materialGroup_viewBy, setMaterialGroup_viewBy] = useState(
    viewBySet[0]
  );
  const [supplierMix_viewBy, setSupplierMix_viewBy] = useState(viewBySet[0]);

  const [materialName_XAxis, setMaterialName_XAxis] = useState(XAxisSet[0]);
  const [materialGroup_XAxis, setMaterialGroup_XAxis] = useState(XAxisSet[0]);
  const [supplierMix_XAxis, setSupplierMix_XAxis] = useState(XAxisSet[0]);

  const [materialGroup_graphChartProps, setMaterialGroup_GraphChartProps] =
    useState({
      height: height,
      seriesData: [],
      source: [],
      xTitleSet: XAxisSet,
      yTitleSet: MaterialGroup_YAxisSet,
      viewBySet: viewBySet,
      swap: true,
      isToolBoxNeeded: false,
      dataZoom: dataZoom,
      yAxisTitleWidth: 100,
      chartMarginTop: "-8%"
    });
  const [materialName_graphChartProps, setMaterialName_GraphChartProps] =
    useState({
      height: height,
      seriesData: [],
      source: [],
      xTitleSet: XAxisSet,
      yTitleSet: MaterialName_YAxisSet,
      viewBySet: viewBySet,
      swap: true,
      isToolBoxNeeded: false,
      dataZoom: dataZoom,
      yAxisTitleWidth: 110,
      chartMarginTop: "-8%"
    });
  const [supplierMix_graphChartProps, setSupplierMix_GraphChartProps] =
    useState({
      height: "360px",
      seriesData: [],
      source: [],
      xTitleSet: XAxisSet,
      yTitleSet: SupplierMix_YAxisSet,
      viewBySet: viewBySet,
      swap: true,
      isToolBoxNeeded: false,
      dataZoom: dataZoom,
      yAxisTitleWidth: 110,
      chartMarginTop: "-8%"
    });



  const dispatch = useDispatch();


  useEffect(() => {

    if (PMRGraphDataState === "pending" || supplierMixGraphDataState === "pending" || materialGroupGraphDataState === "pending" || materialNameGraphDataState === "pending" || nodesState === "pending" || connectionsState === "pending" || gridDataState === "pending")
      setPageLoaded(false);
    else

      setPageLoaded(true)
    if (PMRGraphDataState === 'idle') {
      dispatch(
        fetchPMRGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
    }
    if (materialGroupGraphDataState === 'idle') {
      dispatch(
        fetchMaterialGroupGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
    }
    if (materialNameGraphDataState === 'idle') {
      dispatch(
        fetchMaterialNameGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
    }
    if (supplierMixGraphDataState === 'idle') {
      dispatch(
        fetchSupplierMixGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
    }
    if (gridDataState === "idle") {

      dispatch(fetchGraphDataGridAsync({
        globalFilter: selectedSufficiencyGlobalFilters,
        sourceChartFilter: selectedSourceChartFilters,
      }))
    }



    if (sourceAPICall || sourceChartFilterRefresh) {
      if (sourceAPICall) {
        dispatch(fetchE2ECard({ globalFilter: selectedSufficiencyGlobalFilters }));
        dispatch(fetchSourceTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));
      }

      setMaterialName_viewBy(viewBySet[0])
      setMaterialGroup_viewBy(viewBySet[0])
      setSupplierMix_viewBy(viewBySet[0])
      setMaterialName_XAxis(XAxisSet[0])
      setMaterialGroup_XAxis(XAxisSet[0])
      setSupplierMix_XAxis(XAxisSet[0])
      dispatch(getE2eNodes({ globalFilter: selectedSufficiencyGlobalFilters }));
      dispatch(getE2eConnections({ globalFilter: selectedSufficiencyGlobalFilters }));

      dispatch(
        fetchPMRGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
      dispatch(
        fetchMaterialGroupGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
      dispatch(
        fetchMaterialNameGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );
      dispatch(
        fetchSupplierMixGraphData({
          globalFilter: selectedSufficiencyGlobalFilters,
          sourceChartFilter: selectedSourceChartFilters,
        })
      );

      dispatch(fetchGraphDataGridAsync({
        globalFilter: selectedSufficiencyGlobalFilters,
        sourceChartFilter: selectedSourceChartFilters,
      }))
      dispatch(setAPICall("source"));
      dispatch(setChartFilterRefreshState("source"));
    }
    if (materialPosSate === "idle") { dispatch(fetchMaterialPOs()) }


  }, [sourceAPICall, sourceChartFilterRefresh, pageLoaded, PMRGraphDataState, supplierMixGraphDataState, materialGroupGraphDataState, materialNameGraphDataState, nodesState, connectionsState, gridDataState]);


  useEffect(() => {
    const materialNameXTitle =
      materialName_XAxis?.toLowerCase() == "spend"
        ? "spent"
        : materialName_XAxis?.split(":")[0]?.toLowerCase();

    const materialNameSortBy = materialName_viewBy
      ?.replace(" ", "")
      ?.toLowerCase();
    if (
      materialNameGraphData !== undefined &&
      materialNameGraphData !== null &&
      Object.keys(materialNameGraphData)?.length > 0
    ) {
      setMaterialName_GraphChartProps((prevState) => ({
        ...prevState,
        source:
          materialNameGraphData[materialNameXTitle] !== undefined &&
            materialNameGraphData[materialNameXTitle][materialNameSortBy] !==
            undefined &&
            Object.keys(
              materialNameGraphData[materialNameXTitle][materialNameSortBy]
            )?.length > 0
            ? materialNameGraphData[materialNameXTitle][materialNameSortBy]
            : [],
        dataZoom: materialNameSortBy == "all" ? dataZoomMaterialNameAll : dataZoom,
        add$: materialName_XAxis.includes("Spend") ? true : false,
        seriesData: [
          {
            type: "bar",
            color: "#21BEE1",
            label: {
              show: true,
              position: "right",
              formatter: function (params) {
                let values = typeof (params.data[2]) == "number" ? Math.round(params.data[2]) : "";
                if (typeof (values) == "number") {
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

            emphasis: {
              focus: "series",
              label: {
                show: true,
                position: "right",
                formatter: function (params) {
                  let values = params.data[2] ? Math.round(params.data[2]) : undefined;
                  if (!isNaN(values)) {
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
            },

            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (materialName_XAxis.includes("Revenue") || materialName_XAxis.includes("$") || materialName_XAxis.includes("Spend")) {
                  return [
                    `${params.name}: <b>$${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");
                }
                else {
                  return [
                    `${params.name}: <b>${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");
                }
              },

              axisPointer: {
                type: "shadow",
              },
            },
          },],
      }));
    }

    const supplierMixXTitle =
      supplierMix_XAxis?.toLowerCase() == "spend"
        ? "spent"
        : supplierMix_XAxis?.split(":")[0]?.toLowerCase();

    const supplierMixSortBy = supplierMix_viewBy
      ?.replace(" ", "")
      ?.toLowerCase();

    if (
      supplierMixGraphData !== undefined &&
      Object.keys(supplierMixGraphData)?.length > 0
    ) {
      setSupplierMix_GraphChartProps((prevState) => ({
        ...prevState,
        add$: supplierMix_XAxis.includes("Spend") ? true : false,
        source:
          supplierMixGraphData[supplierMixXTitle] !== undefined &&
            supplierMixGraphData[supplierMixXTitle][supplierMixSortBy] !==
            undefined &&
            Object.keys(
              supplierMixGraphData[supplierMixXTitle][supplierMixSortBy]
            )?.length > 0
            ? supplierMixGraphData[supplierMixXTitle][supplierMixSortBy]
            : [],
        dataZoom: supplierMixSortBy == "all" ? dataZoomSupplierMixAll : dataZoom,
        seriesData: [
          {
            type: "bar",
            color: "#21BEE1",
            label: {
              show: true,
              position: "right",
              formatter: function (params) {
                let values = typeof (params.data[2]) == "number" ? Math.round(params.data[2]) : "";
                if (typeof (values) == "number") {
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

            emphasis: {
              focus: "series",
              label: {
                show: true,
                position: "right",
                formatter: function (params) {
                  let values = params.data[2] ? Math.round(params.data[2]) : undefined;
                  if (!isNaN(values)) {
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
            },

            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (supplierMix_XAxis.includes("Revenue") || supplierMix_XAxis.includes("$") || supplierMix_XAxis.includes("Spend")) {
                  return [
                    `${params.name}: <b>$${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");
                }
                else {
                  return [
                    `${params.name}: <b>${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");

                }
              },

              axisPointer: {
                type: "shadow",
              },
            },
          },]
      }));
    }

    const materialGroupXTitle =
      materialGroup_XAxis?.toLowerCase() == "spend"
        ? "spent"
        : materialGroup_XAxis?.split(":")[0]?.toLowerCase();

    const materialGroupSortBy = materialGroup_viewBy
      ?.replace(" ", "")
      ?.toLowerCase();

    if (
      materialGroupGraphData !== undefined &&
      Object.keys(materialGroupGraphData)?.length > 0
    ) {
      setMaterialGroup_GraphChartProps((prevState) => ({
        ...prevState,
        add$: materialGroup_XAxis.includes("Spend") ? true : false,
        source:
          materialGroupGraphData[materialGroupXTitle] !== undefined &&
            materialGroupGraphData[materialGroupXTitle][materialGroupSortBy] !==
            undefined &&
            Object.keys(
              materialGroupGraphData[materialGroupXTitle][materialGroupSortBy]
            )?.length > 0
            ? materialGroupGraphData[materialGroupXTitle][materialGroupSortBy]
            : [],
        dataZoom: materialGroupSortBy == "all" ? dataZoomMaterialGroupChartAll : dataZoom,
        seriesData: [
          {
            type: "bar",
            color: "#21BEE1",
            label: {
              show: true,
              position: "right",
              formatter: function (params) {
                let values = typeof (params.data[2]) == "number" ? Math.round(params.data[2]) : "";
                if (typeof (values) == "number") {
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

            emphasis: {
              focus: "series",
              label: {
                show: true,
                position: "right",
                formatter: function (params) {
                  let values = params.data[2] ? Math.round(params.data[2]) : undefined;
                  if (!isNaN(values)) {
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
            },

            tooltip: {
              trigger: "item",
              formatter: function (params) {
                if (materialGroup_XAxis.includes("Revenue") || materialGroup_XAxis.includes("$") || materialGroup_XAxis.includes("Spend")) {
                  return [
                    `${params.name}: <b>$${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");
                }
                else {
                  return [
                    `${params.name}: <b>${numberConversion(params.value[1])}</b><br/>`,
                    typeof (params.data[2]) == "number" ? ("CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>") : "",
                  ].join("");
                }
              },

              axisPointer: {
                type: "shadow",
              },
            },
          },],
      }));
    }
  }, [
    materialName_XAxis,
    materialGroup_XAxis,
    supplierMix_XAxis,
    materialName_viewBy,
    materialGroup_viewBy,
    supplierMix_viewBy,
    materialGroupGraphData,
    materialNameGraphData,
    supplierMixGraphData,
  ]);
  //Axis Click Response Handling
  const handleSupplierMixXTitleResponse = (event) => {
    setSupplierMix_XAxis((prev) => {
      return event === null ? prev : event;
    });
  };
  const handleMaterialGroupXTitleResponse = (event) => {
    setMaterialGroup_XAxis((prev) => {
      return event === null ? prev : event;
    });
  };
  const handleMaterialNameXTitleResponse = (event) => {
    setMaterialName_XAxis((prev) => {
      return event === null ? prev : event;
    });
  };
  const handlePMRYTitleResponse = (event) => {
    setPMRGraphRequest((prev) => {
      return event === null ? prev : event;
    });
  };

  //ViewBy Click Response Handling
  const handleMaterialGroupViewByResponse = (event) => {
    setMaterialGroup_viewBy(event);
  };
  const handleMaterialNameViewByResponse = (event) => {
    setMaterialName_viewBy(event);
  };
  const handleSupplierMixViewByResponse = (event) => {
    setSupplierMix_viewBy(event);
  };
  //Barchart FilterResponse Handling



  return (
    <div className="source-container">
      <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
        <div className="filter-container">
          <Filter enable={pageLoaded} />
        </div>
        <div className="legend-container">
          <GeoMapLegend type="source" />
        </div>
        <GeoMap type="source" tooltipData={sourceTooltipData} />
        <E2ECard type="source" />
        <Row gutter={[12]} className="row-container">
          <Col xs={24}>

            <SourceChartFilter
              enable={pageLoaded}

            />
          </Col>
          <Col xs={24} xl={12} sm={12}>
            <PMRBarChart />

          </Col>
          <Col xs={24} xl={12} sm={12} xxl={12}>
            <ChartWrapper
              type="source"
              title="Supplier Mix"
              chartDownloadData={
                Object.keys(supplierMix_graphChartProps.source)?.length > 0
                  ? supplierMix_graphChartProps.source
                  : []
              }
              cardLoading={supplierMixGraphDataState === 'pending'}
              downloadType="chart"
            >
              <BarChartWrapper
                GraphChartProps={supplierMix_graphChartProps}
                handleXTitleUpdate={handleSupplierMixXTitleResponse}
                handleViewByRequest={handleSupplierMixViewByResponse}
              />
            </ChartWrapper>
          </Col>
          <Col xs={24} xl={12} sm={12} xxl={12}>
            <ChartWrapper
              type="source"
              title="Material Group"
              chartDownloadData={
                Object.keys(materialGroup_graphChartProps.source)?.length > 0
                  ? materialGroup_graphChartProps.source
                  : []
              }
              downloadType="chart"
              cardLoading={materialGroupGraphDataState === 'pending'}
            >
              <BarChartWrapper
                GraphChartProps={materialGroup_graphChartProps}
                handleXTitleUpdate={handleMaterialGroupXTitleResponse}
                handleViewByRequest={handleMaterialGroupViewByResponse}
              />
            </ChartWrapper>
          </Col>
          <Col xs={24} xl={12} sm={12} xxl={12}>
            <ChartWrapper
              type="source"
              title="Material Name"
              chartDownloadData={
                Object.keys(materialName_graphChartProps.source)?.length > 0
                  ? materialName_graphChartProps.source
                  : []
              }
              downloadType="chart"
              cardLoading={materialNameGraphDataState === 'pending'}
            >
              <BarChartWrapper
                GraphChartProps={materialName_graphChartProps}
                handleXTitleUpdate={handleMaterialNameXTitleResponse}
                handleViewByRequest={handleMaterialNameViewByResponse}
              />
            </ChartWrapper>
          </Col>
          <Col xs={24} xl={24} sm={24} xxl={24}>
            <WhereUsedGrid
              selectedSourceChartFilters={selectedSourceChartFilters}
              selectedSufficiencyGlobalFilters={selectedSufficiencyGlobalFilters}
            />
          </Col>
          <Col xs={24} xl={24} sm={24} xxl={24}>
            <MaterialPosGrid />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default SourceSufficiency;
