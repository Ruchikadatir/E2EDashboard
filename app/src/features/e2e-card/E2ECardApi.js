import { http } from "../../http-common";
import E2ECardData from "./E2ECardData.json";

const getE2ECardData = async (globalFilter) => {
  const res = await http.post("/sufficiency/kpi", globalFilter)
  return res.data

};

export { getE2ECardData };
