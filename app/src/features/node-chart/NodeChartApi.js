import { http } from "../../http-common";

const getAllNodes = (globalFilter) => {
  return http.post("responsiveness/leadTime/nodeChart", globalFilter);
};

export {
  getAllNodes,
};
