import { http } from "../../../../../http-common";

const getLeadtimeBreakdownGraphData = async (filterRequest) => {
  const res = await http.post("responsiveness/leadTime/e2eLeadTimeBreakDown", filterRequest)
  return res.data
};
const getLeadTimeDistributioneGraphData = async (filterRequest) => {
  const res = await http.post('responsiveness/leadTime/e2eLeadTimeDistribution', filterRequest);
  return res.data;

};

const getPrioritySubcategoryGraphData = async (filterRequest) => {
  const res = await http.post('responsiveness/leadTime/e2eLeadTimeDistributionByPrioritySubCategory', filterRequest);
  return res.data;

};

const getSalesRegionGraphData = async (filterRequest) => {
  const res = await http.post('/responsiveness/leadTime/e2eLeadTimeDistributionBySalesRegion', filterRequest);
  return res.data;

};

const getDistributionByBrandGraphData = async (filterRequest) => {
  const res = await http.post('responsiveness/leadTime/e2eLeadTimeDistributionByBrand', filterRequest);
  return res.data;

};

const getFinishedGoodGrid = async (filterRequest) => {
  const res = await http.post(`responsiveness/leadTime/e2eLeadTimeByFinishedGoods?page=1&size=50000`, filterRequest);
  return res.data;
}
const getSourceLeadTimeGrid = async (filterRequest) => {
  const res = await http.post(`responsiveness/leadTime/e2eSourcingLeadOpportunitiesByMaterial?page=1&size=50000`, filterRequest);
  return res.data;
}

export {
  getLeadtimeBreakdownGraphData,
  getLeadTimeDistributioneGraphData,
  getPrioritySubcategoryGraphData,
  getSalesRegionGraphData,
  getDistributionByBrandGraphData,
  getFinishedGoodGrid,
  getSourceLeadTimeGrid
};
