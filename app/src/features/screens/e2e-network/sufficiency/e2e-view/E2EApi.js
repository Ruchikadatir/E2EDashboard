
import { http } from "../../../../../http-common.js";


const getRevenueGrowthGraphData = async (globalFilter) => {
  const res = await http.post("sufficiency/e2e/revenueGrowth", globalFilter);
  return res.data;

};
const getSourceGraphData = async (globalFilter) => {
  const res = await http.post(
    "sufficiency/e2e/requirementGrowth/source",
    globalFilter
  );
  return res.data;

};
const getMakeGraphData = async (globalFilter) => {
  const res = await http.post("sufficiency/e2e/requirementGrowth/make", globalFilter);
  return res.data;

};
const getFulfillGraphData = async (globalFilter) => {
  const res = await http.post(
    "sufficiency/e2e/requirementGrowth/fulfill",
    globalFilter
  );
  return res.data;

};
const getinventoryByNodeGraphData = async (globalFilter) => {
  const res = await http.post("sufficiency/e2e/inventoryByNode", globalFilter);
  return res.data;

};



export {
  getSourceGraphData,
  getMakeGraphData,
  getFulfillGraphData,
  getinventoryByNodeGraphData,
  getRevenueGrowthGraphData,
};
