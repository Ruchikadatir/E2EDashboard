import { http } from "../../http-common.js"
const getSufficiencyNudges = async () => {
  const res = await http.post("/sufficiency/all/nudges")
  return res.data

};
const getResponsivenessNudges = async () => {
  const res = await http.post("responsiveness/all/nudges")
  return res.data

};

const getDemandScenarioNudges = async () => {
  const res = await http.get("demandScenario/nudges")
  return res.data
}
export { getSufficiencyNudges, getResponsivenessNudges, getDemandScenarioNudges }