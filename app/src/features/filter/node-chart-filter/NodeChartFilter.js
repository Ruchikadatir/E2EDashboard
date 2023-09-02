/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Select, Button } from "antd";
import "./NodeChartFilter.scss"
import { getAllNodesAndConnections } from './../../node-chart/NodeChartSlice';

const NodeChartFilter = () => {

    const [itemCode, setItemCode] = useState('62YM010000');
    const [itemDesc, setItemDesc] = useState('CL HAPPY FOR MEN 100ML/3.4FLOZ');
    // years should be updated based on FY Change
    const [year, setYear] = useState('2023'); // update the default FY Year Value
    const years = [2023, 2024, 2025];

    const dispatch = useDispatch()
    const { itemCodes, itemDescs } = useSelector((state) => state.nodeChartFilter)

    const onItemCodeChange = (value) => {
        setItemCode(value)
        setItemDesc(itemDescs[itemCodes.indexOf(value)])
    }
    const onItemDescChange = (value) => { //one desc can have multiple item codes
        // so we will clear it, and user will have to select the code
        setItemDesc(value);
        setItemCode('');
    }

    const onClickApplyFilters = () => {
        var globalFilter = {
            year: year,
            matnr: itemCode,
            matnrdesc: itemDesc
        }
        dispatch(getAllNodesAndConnections({ globalFilter: globalFilter }));
    }

    return (
        <div className="node-chart-dropdown-container">
            <div className="nodechart-dropdown">Item Code :</div>
            <Select
                showSearch
                style={{ width: 150 }}
                onChange={onItemCodeChange}
                options={itemCodes?.map((item, index) => {
                    return { label: item, value: item, key: index + item }
                })}
                value={itemCode}

            />
            <div className="nodechart-dropdown">Item Description :</div>
            <Select
                showSearch
                disabled
                style={{ width: 380 }}
                onChange={onItemDescChange}
                options={itemDescs?.map((item, index) => {
                    return { label: item, value: item, key: index + item }
                })}
                value={itemDesc}

            />

            <div className="nodechart-dropdown">Year :</div>
            <Select
                style={{ width: 120 }}
                onChange={(value) => setYear(value)}
                options={years?.map(item => {
                    return { label: item, value: item }
                })}
                value={year}
            />
            <div className="add-margin"></div>
            <Button
                className="apply-filter-button custom-button"
                type="primary"
                onClick={onClickApplyFilters}
            >
                Apply Filter
            </Button>,

        </div>
    )
}

export default NodeChartFilter;