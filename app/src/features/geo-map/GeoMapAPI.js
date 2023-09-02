import { http } from "../../http-common";

const getAllNodes = (globalFilter) => {
  return http.post("/sufficiency/node", globalFilter);
};

const getAllConnections = (globalFilter) => {
  return http.post("/sufficiency/connection", globalFilter);
};

const getSourceTooltip = async (globalFilter) => {
  const sourceTooltip = await http
    .post("/sufficiency/source/tooltip", globalFilter)
    .then((res) => res.data);
  return sourceTooltip;
};

const getMakeTooltip = async (globalFilter) => {
  const makeTooltip = await http
    .post("/sufficiency/make/tooltip", globalFilter)
    .then((res) => res.data);
  return makeTooltip;
};

const getFulfillTooltip = async (globalFilter) => {
  const fulfillTooltip = await http
    .post("/sufficiency/fulfill/tooltip", globalFilter)
    .then((res) => res.data);
  return fulfillTooltip;
};

export {
  getAllNodes,
  getAllConnections,
  getSourceTooltip,
  getMakeTooltip,
  getFulfillTooltip,
};
