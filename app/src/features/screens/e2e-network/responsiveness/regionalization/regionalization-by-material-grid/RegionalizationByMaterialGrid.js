import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { perPage } from "../../../../../../variables";



const perRoundValueFormatter = (params) => {
    return params.value ? `${Math.round(params.value)}%` : ""
}

const columnDefs = [
    { headerName: "Material", field: "Material", maxWidth: 120 },
    { headerName: "Material Name", field: "Material_Name", maxWidth: 300 },
    { headerName: "Material Group", field: "Material_Group", minWidth: 400 },
    { headerName: "Supplier Name", field: "Supplier_Name", minWidth: 400 },
    { headerName: "Supplier Region", field: "Supplier_Region" },
    { headerName: "Plant Name", field: "Plant_Name", maxWidth: 200 },
    { headerName: "PDT", field: "pdt", maxWidth: 80 },
    { headerName: "SLT", field: "slt", maxWidth: 80 },
    { headerName: "TLT", field: "tlt", maxWidth: 80 },
    {
        headerName: `Source to Make Regionalized`,
        field: "Source_to_Make_Regionalized"
    },
    { headerName: "Sourced Units", field: "Sourced_Units" },
    { headerName: "CAGR Growth%", field: "Cagr_Growth_Percent", valueFormatter: perRoundValueFormatter, maxWidth: 120 },
];
const defaultColDef = {
    maxWidth: 150,
    sortable: false,
    resizable: true,
    filter: false,
};

const RegionalizationByMaterialGrid = ({ selectedDropdownFilterValue }) => {

    const regionalizationByMaterialGridRef = useRef();

    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;

    const fileName = "Regionalization By Material"
    const params = {
        fileName: `${fileName}_${currentDate}`,
    };

    const regionalizationByMaterialGridDownload = () => {
        regionalizationByMaterialGridRef.current.api.exportDataAsCsv(params);
    };

    const regMaterial = useSelector((state) => state.regionalization.regMaterial)
    const regMaterialState = useSelector((state) => state.regionalization.regMaterialState)


    const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    }
   
    return (
        <ChartWrapper
            type="source"
            title="Regionalization by Material"
            className="grid-card"
            downloadType="grid"
            downloadCsv={regionalizationByMaterialGridDownload}
            cardLoading={regMaterialState === "pending"}
        >
            <div className="finished-good-grid">
                <AgGridReact
                    className="ag-theme-alpine"
                    rowData={regMaterial !== undefined && Object.keys(regMaterial)?.length > 0 ? regMaterial?.sourceToMake[selectedDropdownFilterValue] : []}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    ref={regionalizationByMaterialGridRef}
                    pagination={true}
                    animateRow={true}


                    paginationPageSize={perPage}
                    cacheBlockSize={perPage}
                    onGridReady={onGridReady}

                />
            </div>
        </ChartWrapper>

    )

}
export default RegionalizationByMaterialGrid;