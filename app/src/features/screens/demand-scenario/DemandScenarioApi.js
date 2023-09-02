import { http } from "../../../http-common"

const getStrategicDemandGraphData = async (filterRequest) => {
  const res = await http.post(`demandScenario/strategicDemandSignal?year=null&quarter=${filterRequest.selectedGrowthCalQuarterFilter}`, {
    "globalFilter":
      filterRequest.demandScenarioGlobalFilter
  });
  return res.data;

};
const getGrowthRate = async (filterRequest) => {
  const res = await http.post(
    `demandScenario/growthRateReconciliation??year=null&quarter=${filterRequest.selectedGrowthCalQuarterFilter}`,
    {
      "globalFilter":
        filterRequest.demandScenarioGlobalFilter
    }
  );
  return res.data

};
const getTopPrioritySubcat = async (filterRequest) => {
  const res = await http.post(`demandScenario/upsideDownside?year=${filterRequest.selectedGrowthCalYearFilter}&quarter=${filterRequest.selectedGrowthCalQuarterFilter}`,
    {
      "globalFilter":
        filterRequest.demandScenarioGlobalFilter
    });

  return res.data
}

const getFamilyCodeUpsideDownside = async (filterRequest) => {

  const res = await http.post(`/demandScenario/familyCodeUpsideDownside?year=${filterRequest.selectedGrowthCalYearFilter}&quarter=${filterRequest.selectedGrowthCalQuarterFilter}&page=1&size=500000`, {
    "globalFilter":
      filterRequest.demandScenarioGlobalFilter
  });
  return res.data


};

export { getGrowthRate, getStrategicDemandGraphData, getTopPrioritySubcat, getFamilyCodeUpsideDownside };
