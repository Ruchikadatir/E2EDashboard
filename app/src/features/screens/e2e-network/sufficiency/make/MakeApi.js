
import { http } from "../../../../../http-common.js";


const getMakeGraphData = async (globalFilter) => {
  const res = await http.post("sufficiency/make/barCharts", globalFilter);
  return res.data;

};

const getManlocGridData = async (globalFilter) => {
  const res = await http.post(
    "sufficiency/make/whereUsed?page=1&size=500000",
    globalFilter
  );
  return res.data;

};

const getMixDonutChart = async (globalFilter) => {
  const res = await http.post("sufficiency/make/mix", globalFilter);
  return res.data;

};
const getHeatMapGridData = async (globalFilter) => {

  const res = await http.post("sufficiency/make/heatMap", globalFilter);
  return res.data


};
const getProductionPOsGridData = async () => {
  const res = await http.get("sufficiency/make/productionPOs?page=1&size=100000");
  return res.data;

};
export {
  getMakeGraphData,
  getManlocGridData,
  getMixDonutChart,
  getHeatMapGridData,
  getProductionPOsGridData,
};
