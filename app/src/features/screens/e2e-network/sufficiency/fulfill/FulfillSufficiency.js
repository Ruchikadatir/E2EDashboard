import { useEffect, useState } from "react";
import E2ECard from "../../../../e2e-card/E2ECard";
import ChartWrapper from "../../../../wrapper/ChartWrapper";
import GeoMap from "../../../../geo-map/GeoMap.js";
import Filter from "../../../../filter/Filter.js";
import { Row, Col } from "antd";
import GeoMapLegend from "../../../../geo-map-legend/GeoMapLegend";
import "./FulfillSufficiency.scss";
import { fetchRSRGraphData } from "./FulfillSlice.js";
import { useSelector, useDispatch } from "react-redux";
import BarChartWrapper from "../../../../chart/bar-chart/BarChartWrapper";
import {
  globalFilter
} from "../../../../../variables";
import { getE2eNodes, getE2eConnections } from "./../../../../geo-map/GeoMapSlice";
import Alert from '@mui/material/Alert';
import { setAPICall } from "../../../../filter/FilterSlice";
import { fetchE2ECard } from "../../../../e2e-card/E2ECardSlice"
import { numberConversion } from "../../../../app-utils/AppUtils";
import {
  fetchFulfillTooltip,
} from "./../../../../geo-map/GeoMapSlice";
import { Spin } from 'antd';
import fonts from "../../../../style/variable.scss";


const FulfillSufficiency = () => {
  const dispatch = useDispatch();
  const SRGraphData = useSelector((state) => state.fulfill.SRGraphData);
  const loading = useSelector((state) => state.fulfill.loading);
  const fulfillTooltipData = useSelector(
    (state) => state.geoMap.fulfillTooltipData.data
  );
  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const fulFillAPICall = useSelector((state) => state.filter.fulFillAPICall)

  const [globalFilterRequestData, setGlobalFilterRequest] =
    useState(selectedSufficiencyGlobalFilters);
  const XAxisSet = ["Region"];
  const YAxisSet = ["Unit Requirement (M)"];
  const seriesData = [
    {
      type: "bar",
      color: "#D6BEEC",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",

        formatter: function (param) {

          return [
            `Year: <b>${param.seriesName}</b><br/>`,
            `Volume: <b>${numberConversion(param.data[1])}</b><br/>`,
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-medium",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640CC",
        },
      },
    },
    {
      type: "bar",
      color: "#8380EB",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",

        formatter: function (param) {

          return [
            `Year: <b>${param.seriesName}</b><br/>`,
            `Volume: <b>${numberConversion(param.data[2])}</b><br/>`,
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-medium",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640CC",
        },
      },
    },
    {
      type: "bar",
      color: "#BAB8FF",
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = typeof (params.data[4]) == "number" ? Math.round(params.data[4]) : undefined;
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
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",

        formatter: function (param) {

          return [
            `Year: <b>${(param.seriesName)}</b><br/>`,
            "Volume: " + `<b>${numberConversion(param.data[3])}</b>` + "<br/>",
            typeof (param.data[4]) == "number" ? "CAGR%: " + `<b>${Math.round(param.data[4])}%</>` + "<br/>" : "",
          ].join("");
        },
        textStyle: {
          fontFamily: "noto-sans-light",
          fontWeight: 350,
          fontSize: 12,
          color: "#0D1640CC",
        },
      },
    },
  ];
  const [graphChartProps, setGraphChartProps] = useState({
    height: "350px",
    seriesData: seriesData,
    source: SRGraphData,
    xTitleSet: XAxisSet,
    yTitleSet: YAxisSet,
    swap: false,
    isToolBoxNeeded: false,
  });


  useEffect(() => {
    let resultResponse = {};
    Object.entries(selectedSufficiencyGlobalFilters).forEach(([key, value]) => {

      if (key !== "year" && key !== "quarter") resultResponse[key] = value;
    });
    if (!loading)
      dispatch(fetchRSRGraphData({ globalFilter: resultResponse }))
    if (fulFillAPICall) {

      dispatch(fetchE2ECard({ globalFilter: selectedSufficiencyGlobalFilters }));
      dispatch(getE2eNodes({ globalFilter: selectedSufficiencyGlobalFilters }));
      dispatch(getE2eConnections({ globalFilter: selectedSufficiencyGlobalFilters }));
      dispatch(fetchRSRGraphData({ globalFilter: resultResponse }));
      dispatch(fetchFulfillTooltip({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
    dispatch(setAPICall("fulfill"));

  }, [fulFillAPICall]);

  useEffect(() => {
    setGraphChartProps({
      height: "350px",
      seriesData: seriesData,
      source: SRGraphData,
      xTitleSet: XAxisSet,
      yTitleSet: YAxisSet,
      swap: false,
      isToolBoxNeeded: false,
      chartMarginTop: "-2%",
    });
  }, [SRGraphData]);


  return (
    <div className="fulfill-container">
      <Spin spinning={loading} tip="Please Wait....Applying Filter">
        <div className="filter-container">
          <Filter enable={!loading} />
        </div>
        <div className="legend-container">
          <GeoMapLegend type="fulfill" />
        </div>

        <GeoMap type="fulfill" tooltipData={fulfillTooltipData} />

        <E2ECard type="fulfill" />
        <Row className="row-container" gutter={[0, 16]}>
          <Col xs={24}>
            <ChartWrapper
              type="fulfill"
              title="Region of Sale Requirement Growth"
              cardLoading={loading}
              chartDownloadData={Object.keys(graphChartProps.source)?.length > 0 ? graphChartProps.source : []}
              downloadType="chart"
            >
              <BarChartWrapper GraphChartProps={graphChartProps} />
            </ChartWrapper>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default FulfillSufficiency;
