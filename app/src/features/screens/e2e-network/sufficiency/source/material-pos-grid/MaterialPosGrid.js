import { useRef } from "react";

import ChartWrapper from "../../../../../wrapper/ChartWrapper";

import { useSelector } from "react-redux";
import { numberConversion } from "../../../../../app-utils/AppUtils";
import { perPage } from "../../../../../../variables";
import DataGrid from "../../../../../data-grid/DataGrid"

const valueFormatter = (params) => {
    return params.value ? `$${numberConversion(params.value)}` : ""
}
const quantityValueFormatter = (params) => {
    return params.value ? `${numberConversion(params.value)}` : ""
}

const materialPOsColumnDef = [
    { headerName: "Material", field: "material", filter: true },
    { headerName: "Material Name", field: "materialName", filter: true },
    { headerName: "Material Type", field: "materialType", filter: true },
    { headerName: "Supplier Name", field: "supplierName", filter: true },
    { headerName: "Total Quantity", field: "totalQuantity", valueFormatter: quantityValueFormatter },
    { headerName: "Spend $", field: "spend$", valueFormatter: valueFormatter },
];

const materialPOsDefaultColDef = {
    sortable: true,
    minWidth: 250,
    resizable: true,
};

const MaterialPosGrid = () => {
    const materialPosGrid = useSelector((state) => state.source.materialPOsData)
    const materialPosSate = useSelector((state) => state.source.materialPOsDataState)

    const materialPosGridRef = useRef();

    const materialPOsGridDownload = () => {
        materialPosGridRef.current.gridDownload();
    };


    return (
        <ChartWrapper
            type="source"
            title="FY22 Historical Actuals - Material POs"
            downloadType="grid"
            downloadCsv={materialPOsGridDownload}
            className="grid-card"
            cardLoading={materialPosSate === "pending"}
        >
            <div className="material-POs-grid">
                <DataGrid
                    className="ag-theme-alpine"
                    rowData={materialPosGrid}
                    columnDefs={materialPOsColumnDef}
                    defaultColDef={materialPOsDefaultColDef}
                    ref={materialPosGridRef}
                    animateRow={true}
                    pagination={true}
                    paginationPageSize={perPage}
                    fileName="FY22 Historical Actuals - Material POs"


                />
            </div>
        </ChartWrapper>

    )

}
export default MaterialPosGrid