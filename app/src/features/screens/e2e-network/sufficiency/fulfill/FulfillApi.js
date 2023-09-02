import { http } from "../../../../../http-common.js";

const getRSRGGraphData = async (globalFilterRequestData) => {
  const res = await http.post("sufficiency/fulfill/barCharts", globalFilterRequestData);
  return res.data;

};
export { getRSRGGraphData };
