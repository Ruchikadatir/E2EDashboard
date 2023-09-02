
import { http } from "../../../../../http-common.js";


const getMaterialGroupGraphData = async (barRequest) => {
  const res = await http.post("sufficiency/source/materialGroup", barRequest);
  return res.data;

};
const getMaterialNameGraphData = async (barRequest) => {
  const res = await http.post("sufficiency/source/materialName", barRequest);
  return res.data;

};
const getSupplierMixGraphData = async (barRequest) => {
  const res = await http.post("sufficiency/source/supplierMix", barRequest);
  return res.data;

};

const getPMRGraphData = async (barRequest) => {
  const res = await http.post("sufficiency/source/projectedMaterial", barRequest);
  return res.data;

};
const getGraphDataGrid = async (requestParam) => {
  const res = await http.post(
    "sufficiency/source/whereUsed?page=1&size=500000",
    requestParam
  );
  return res.data;

};
const getMaterialPosData = async () => {
  const materialPos = await http
    .get("/sufficiency/source/materialPOs?page=1&size=100000")
    .then((res) => res.data);
  return materialPos;

};

export {
  getGraphDataGrid,
  getMaterialPosData,
  getMaterialGroupGraphData, getMaterialNameGraphData, getPMRGraphData, getSupplierMixGraphData
};
