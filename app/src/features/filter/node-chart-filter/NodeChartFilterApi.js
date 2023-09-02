import {http} from "../../../http-common";

const getNodeChartFilterDropdownOptions =async()=>{
    const res =  await http.get("responsiveness/all/materialCode")
    return res.data
}
export {getNodeChartFilterDropdownOptions}