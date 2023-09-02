import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { numberConversion } from "../../../../../app-utils/AppUtils";
import { perPage } from "../../../../../../variables.js"
import DataGrid from "../../../../../data-grid/DataGrid"
import { useSelector } from "react-redux";
const valueFormatter = (params) => {
    return params.value ? `${numberConversion(params.value)}` : ""
}


const productionPOsColumnDefs = [
    { headerName: "Item Id", field: "itemId", filter: true, minWidth: 200 },
    { headerName: "Item Description", field: "itemDes", width: 300, maxWidth: 400, filter: true },
    { headerName: "Major Inventory Type", field: "majorInvType", width: 220, maxWidth: 250, filter: true },
    { headerName: "Platform", field: "platform", filter: true, width: 200, maxWidth: 250 },
    { headerName: "Technology", field: "technology", filter: true, width: 350, maxWidth: 400 },
    { headerName: "Plant Name", field: "plantName", filter: true, maxWidth: 300 },
    { headerName: "I/E Plant", field: "i_ePlant", filter: true },
    { headerName: "Region of Make", field: "regionOfMake", filter: true, width: 200, maxWidth: 220 },
    { headerName: "Resource", field: "resource", filter: true, maxWidth: 200 },
    { headerName: "Resource Type", field: "resourceType", filter: true, width: 200, maxWidth: 220 },
    { headerName: "Production Quantity", field: "productionQuantity", valueFormatter: valueFormatter, width: 230, maxWidth: 250 },
    { headerName: "Unit of Measure", field: "unitOfMeasure", width: 200, maxWidth: 220 },
];


const productionPOsdefaultColDef = {
    maxWidth: 150,
    sortable: true,
    filter: false,
    resizable: true,
};




const ProductionPosGrid = () => {

    const productionPOsGridRef = useRef();

    const productionPos = useSelector((state) => state.make.productionPOsGridData)
    const productionPosGridState = useSelector((state) => state.make.productionPOsGridDataState)

    const productionPOsGridDownload = () => {
        productionPOsGridRef.current.gridDownload();
    };

    return (
        <ChartWrapper
            type="make"
            title="FY22 Historical Actuals - Production POs"
            downloadCsv={productionPOsGridDownload}
            downloadType="grid"
            className="production-card"
            cardLoading={productionPosGridState === "pending"}
        >
            <div className="production-grid">
                <DataGrid
                    className="ag-theme-alpine"
                    rowData={productionPos}
                    columnDefs={productionPOsColumnDefs}
                    ref={productionPOsGridRef}
                    defaultColDef={productionPOsdefaultColDef}
                    pagination={true}
                    animateRow={true}
                    rowModelType={'infinite'}
                    paginationPageSize={perPage}
                    fileName="FY22 Historical Actuals - Production PO"


                />
            </div>
        </ChartWrapper>

    )

}
export default ProductionPosGrid