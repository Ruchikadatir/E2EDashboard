import { Row, Col } from "antd";
import { useEffect, useState } from "react";
import E2ENavigator from "../navigator/e2e-navigator/E2ENavigator";
import ChartWrapper from "../../wrapper/ChartWrapper";
import FamilyCodeUpsideDownsideGrid from "./FamilyCodeUpsideDownsideGrid";
import GrowthRateGrid from "./growth-rate-grid/GrowthRateGrid";
import GrowthCalFilter from "../../filter/growth-cal-filter/GrowthCalFilter";
import Filter from "../../filter/Filter";
import {
  fetchGrowthRate,
  fetchStrategicDemandGraph,
  fetchTopPrioritySubcat,
  fetchFamilyCodeUpsideDownside
} from "./DemandScenarioSlice";
import { setAPICall, fetchGlobalFilterRequest } from "../../filter/FilterSlice"
import BarChartWrapper from "../../chart/bar-chart/BarChartWrapper";
import TopPrioritySubcat from "./top-priority-subcat/TopPrioritySubcat";
import { useSelector, useDispatch } from "react-redux";
import "./DemandScenario.scss";
import ReactEcharts from "echarts-for-react";
import { numberConversion } from "../../app-utils/AppUtils";
import { Spin } from 'antd';
import { updateSufficiencyResActiveTab } from "../../screens/navigator/E2ENavSlice.js"
import fonts from "../../../features/style/variable.scss";
import InputLabel from "@mui/material/InputLabel";


const DemandScenario = () => {
  const dispatch = useDispatch();
  const strategicDemandGraphData = useSelector(
    (state) => state?.demandScenario?.strategicDemandGraphData
  );
  const strategicDemandDataState = useSelector(
    (state) => state.demandScenario.strategicDemandDataState
  );
  const growthRateState = useSelector(
    (state) => state.demandScenario.growthRateState
  );
  //topPrioritySubcatState
  const topPrioritySubcatState = useSelector(
    (state) => state.demandScenario.topPrioritySubcatState
  );
  const selectedDemandScenarioGlobalFilters = useSelector(
    (state) => state.filter.selectedDemandScenarioGlobalFilters
  );

  const demandScenarioAPICall = useSelector((state) => state.filter.demandScenarioAPICall)
  const selectedGrowthCalYearFilter = useSelector((state) => state.filter.selectedGrowthCalYearFilter)
  const selectedGrowthCalQuarterFilter = useSelector((state) => state.filter.selectedGrowthCalQuarterFilter)
  const growthCalFiltersYearAPICall = useSelector((state) => state.filter.growthCalFiltersYearAPICall)
  const growthCalFiltersQuarterAPICall = useSelector((state) => state.filter.growthCalFiltersQuarterAPICall)
  const callGlobalFilterState = useSelector((state) => state.demandScenario.callGlobalFilterState)
  const familyCodeState = useSelector((state) => state.demandScenario.familyCodeState)

  const [option, setOption] = useState({});
  const [revenueOption, setRevenueOption] = useState({});
  const defaultSelectedValue = "units";
  const [activeBtn, setActiveBtn] = useState(defaultSelectedValue);
  const [StrategicGrowthData, setStrategicGrowthData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(true);
  const [demandScenarioGlobalFilters, setdemandScenarioGlobalFilters] = useState({});

  useEffect(() => {
    dispatch(fetchGlobalFilterRequest(selectedDemandScenarioGlobalFilters));
    dispatch(updateSufficiencyResActiveTab("demand_scenario"))
  }, [])

  useEffect(() => {

    let demandScenarioGlobalFilter = {};
    Object.entries(selectedDemandScenarioGlobalFilters).forEach(([key, value]) => {
      if (key !== "year" && key !== "quarter") demandScenarioGlobalFilter[key] = value;
    });
    if (strategicDemandDataState === "pending" || growthRateState === "pending" || topPrioritySubcatState === "pending" || familyCodeState === "pending")
      setPageLoaded(false);
    else
      setPageLoaded(true);

    setdemandScenarioGlobalFilters(demandScenarioGlobalFilter)
    if (strategicDemandDataState === "idle" || growthCalFiltersQuarterAPICall) {
      dispatch(fetchStrategicDemandGraph({ demandScenarioGlobalFilter, selectedGrowthCalQuarterFilter }))
    }
    if (growthRateState === "idle" || growthCalFiltersQuarterAPICall) {
      dispatch(fetchGrowthRate({ demandScenarioGlobalFilter, selectedGrowthCalQuarterFilter }));
    }
    if (topPrioritySubcatState === "idle" || growthCalFiltersYearAPICall || growthCalFiltersQuarterAPICall) {
      dispatch(fetchTopPrioritySubcat({ demandScenarioGlobalFilter, selectedGrowthCalYearFilter, selectedGrowthCalQuarterFilter }));
    }
    if (familyCodeState === "idle" || growthCalFiltersYearAPICall || growthCalFiltersQuarterAPICall) {
      dispatch(fetchFamilyCodeUpsideDownside({ demandScenarioGlobalFilter, selectedGrowthCalYearFilter, selectedGrowthCalQuarterFilter }))
    }

    dispatch(setAPICall("demand-scenario"))
    dispatch(setAPICall("growthCal"))

  }, [growthCalFiltersYearAPICall, growthCalFiltersQuarterAPICall, strategicDemandDataState, growthRateState, topPrioritySubcatState, familyCodeState]);

  const onToggleBtnChange = (btnValue) => {
    setActiveBtn(prev => btnValue == null ? prev : btnValue);
  };

  const unitsSeries = [
    {
      name: "Actual Shipments",
      type: "bar",
      color: "#001F5C",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        left: "5%",
        show: true,
        selectedMode: true,
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `Actual Shipments<br/>`,
            `${param.data[0]}:  <b>${numberConversion(param.data[1])} </b><br/>`,
          ].join("");
        },
      },
    },
    {
      name: "Brand Ambition",
      type: "bar",
      color: "#7EB2FF",
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `Brand Ambition<br/>`,
            `${param.data[0]}:  <b>${numberConversion(param.data[2])} </b><br/>`,
          ].join("");
        },
      },
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "CDP",
      type: "bar",
      color: "#0038A8",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `CDP<br/>`,
            `${param.data[0]}:  <b>${numberConversion(param.data[3])} </b><br/>`,
            "Growth%: " + `<b>${numberConversion(param.data[4])}%</>` + "<br/>",
          ].join("");
        },
      },
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = params.data[4] ? Math.round(params.data[4]) : "";
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
    },
  ]

  const revenueSeries = [
    {
      name: "Actual Revenue",
      type: "bar",
      color: "#001F5C",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `Actual Revenue<br/>`,
            `${param.data[0]}:  <b>$${numberConversion(param.data[1])} </b><br/>`,
          ].join("");
        },
      },
      legend: {
        left: "5%",
        show: true,
        selectedMode: true,
      },
    },
    {
      name: "Brand Ambition",
      type: "bar",
      color: "#7EB2FF",
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `Brand Ambition<br/>`,
            `${param.data[0]}:  <b>$${numberConversion(param.data[2])} </b><br/>`,
          ].join("");
        },
      },
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "CDP",
      type: "bar",
      color: "#0038A8",
      emphasis: {
        focus: "series",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (param) {
          return [
            `CDP<br/>`,
            `${param.data[0]}:  <b>$${numberConversion(param.data[3])} </b><br/>`,
            "Growth%: " + `<b>${numberConversion(param.data[4])}%</>` + "<br/>",
          ].join("");
        },
      },
      label: {
        show: true,
        position: "top",
        formatter: function (params) {
          let values = params.data[4] ? Math.round(params.data[4]) : "";
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
    },
  ]
  useEffect(() => {
    if (
      strategicDemandGraphData[activeBtn] !== undefined &&
      Object.keys(strategicDemandGraphData[activeBtn])?.length > 0
    ) {
      setStrategicGrowthData(strategicDemandGraphData[activeBtn]);
      activeBtn == "units" && setOption({
        tooltip: {},
        grid: {
          containLabel: true,
          left: '05%',
          bottom: '05%',

        },
        legend: {
          left: "5%",
          show: true,
          selectedMode: true,
        },

        dataset: [
          {
            source: strategicDemandGraphData[activeBtn],
          },
        ],

        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {

              fontFamily: "noto-sans-medium",
              fontWeight: 400,
              fontSize: fonts.fontSizeSmall,
              color: "#0D1640CC",

              width: 50, //fixed number of pixels
              overflow: "break", // or 'break' to continue in a new line //truncate for ...
              interval: 0,
            },
            // prettier-ignore
          },
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            alignTicks: true,
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (params) {
                return `${numberConversion(params)}`
              },

              fontFamily: "noto-sans-medium",
              fontWeight: 400,
              fontSize: fonts.fontSizeSmall,
              color: "#0D1640CC",

              width: 45, //fixed number of pixels
              overflow: "truncate", // or 'break' to continue in a new line //truncate for ...
              interval: 0,
            },
          },
        ],
        series: unitsSeries,
      });
      activeBtn == "revenue" && setRevenueOption({
        tooltip: {},
        grid: {
          containLabel: true,
          left: '05%',
          bottom: '5%',

        },
        legend: {
          left: "5%",
          show: true,
          selectedMode: true,
        },

        dataset: [
          {
            source: strategicDemandGraphData[activeBtn],
          },
        ],

        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {

              fontFamily: "noto-sans-medium",
              fontWeight: 400,
              fontSize: fonts.fontSizeSmall,
              color: "#0D1640CC",

              width: 50, //fixed number of pixels
              overflow: "break", // or 'break' to continue in a new line //truncate for ...
              interval: 0,
            },
            // prettier-ignore
          },
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            alignTicks: true,
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (params) {
                return `$${numberConversion(params)}`
              },

              fontFamily: "noto-sans-medium",
              fontWeight: 400,
              fontSize: fonts.fontSizeSmall,
              color: "#0D1640CC",

              width: 45, //fixed number of pixels
              overflow: "truncate", // or 'break' to continue in a new line //truncate for ...
              interval: 0,
            },
          },
        ],
        series: revenueSeries,
      });
    }
  }, [strategicDemandGraphData, activeBtn]);

  return (
    <>
      <E2ENavigator activeBtn={activeBtn} />
      <div className="demand-scenario-container">
        <Spin spinning={!pageLoaded} tip="Please Wait....Applying Filter">
          <Row gutter={[30, 30]} className="add-margin">
            <Col xs={24}>
              <div className="filter-container">
                <Filter

                  enable={true}
                />
              </div>
            </Col>
            <Col xs={24}>
              <GrowthCalFilter
                selectedValue={defaultSelectedValue}
                toggleBtn={onToggleBtnChange}

              />
            </Col>
            <Col xs={24} sm={12} xxl={12}>
              <ChartWrapper
                title="Strategic Demand Signal"
                info="true"
                cardLoading={strategicDemandDataState == "pending"}
                chartDownloadData={
                  Object.keys(StrategicGrowthData)?.length > 0
                    ? StrategicGrowthData
                    : []
                }
                downloadType="chart"
                type="strategyDemand"
              >

                {activeBtn === "units" && (
                  <>
                    <InputLabel id="demo-select-small" className="y-axisTitle">
                      Units
                    </InputLabel>
                    <ReactEcharts
                      option={option}
                      style={{
                        height: "450px",
                        marginTop: "-3%"
                      }}
                    />
                  </>
                )}
                {activeBtn === "revenue" && (
                  <>
                    <InputLabel id="demo-select-small" className="y-axisTitle">
                      $
                    </InputLabel>
                    <ReactEcharts
                      option={revenueOption}
                      style={{
                        height: "450px",
                        marginTop: "-3%"
                      }}
                    />
                  </>
                )}
                <InputLabel id="demo-select-small" className="x-axis">
                  Year
                </InputLabel>
              </ChartWrapper>
            </Col>
            <Col xs={24} sm={12} xxl={12}>
              <GrowthRateGrid activeBtn={activeBtn} />
            </Col>
            <Col xs={24} sm={24} xxl={24}>
              <TopPrioritySubcat activeBtn={activeBtn} />
            </Col>
            <Col xs={24} sm={24} xxl={24}>
              <FamilyCodeUpsideDownsideGrid activeBtn={activeBtn}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </>
  );
};
export default DemandScenario;
