import globalFilterData from "./FilterDropdown.json";
import { http } from "../../http-common.js";
import BarchartFilter from "./bar-chart-filter/BarChartFilter";


const getGlobalFilters = async (globalFilter) => {
  const res = await http.post("sufficiency/globalFilters", { globalFilter });
  return res.data;
  //return { data: globalFilterData };
};

const getSourceChartFilters = async ({ globalFilter, sourceChartFilter }) => {

  let res = await http.post("sufficiency/source/chartFilters", { "globalFilter": globalFilter, "sourceChartFilter": sourceChartFilter });
  return res.data;
  //return { data: globalFilterData };
};
const getMakeChartFilters = async ({ globalFilter, makeChartFilter }) => {

  let res = await http.post("sufficiency/make/chartFilters", { "globalFilter": globalFilter, "makeChartFilter": makeChartFilter });
  return res.data;
  //return { data: globalFilterData };
};

export { getGlobalFilters, getSourceChartFilters, getMakeChartFilters }