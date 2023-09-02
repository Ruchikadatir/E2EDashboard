import { http } from "../../../../../http-common"


const getProductionSitesGraph = async (filterRequest) => {
  const res = await http.post("responsiveness/regionalization/productionSites", filterRequest)
  return res.data
};
const getRegionalizationGraph = async (filterRequest) => {
  const res = await http.post('responsiveness/regionalization/regionalizationByMaterialGroup', filterRequest)
  return res.data

};
const getRegMaterial = async (filterRequest) => {
  const res = await http.post(
    `responsiveness/regionalization/regionalizationByMaterial?page=1&size=5000000`,
    filterRequest
  );
  return res.data;
};

const getFinishedGood = async (globalFilter) => {

  const res = await http.post(
    `responsiveness/regionalization/regionalizationByFinishedGoods?page=1&size=5000000`,
    globalFilter
  );
  return res.data;
};
const getFinishedGoodBOM = async (globalFilter) => {
  const res = await http.post(
    `responsiveness/regionalization/finishedGoodsBom?page=1&size=5000000`,
    globalFilter
  );
  return res.data;
};
const getRegionalizationPer = async (filterRequest) => {
  const res = await http.post('responsiveness/regionalization/regionalizationPercentage', filterRequest)
  return res.data
};
export {
  getFinishedGood,
  getFinishedGoodBOM,
  getRegMaterial,
  getProductionSitesGraph,
  getRegionalizationGraph,
  getRegionalizationPer,
};
