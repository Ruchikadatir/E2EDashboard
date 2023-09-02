const sufficiencyRepository = require("../repository/sufficiency.repository");
const constants = require("../config/constants");
const XLSX = require("xlsx");

var fs = require('fs');
const path = require("path");
const sql = require("mssql");
const { response } = require("express");
const { off, nextTick } = require("process");
const { totalmem } = require("os");
const { createWriteStream } = require("fs");
const downloadAndConvertToExcel = require('../helper/downloadAndConvertToExcel')

//const globalFilter = req.body.globalFilter;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports.downloadData = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const data = await request
      .input("offset", sql.Int, 0)
      .input("numberOfRecords", sql.Int, 100000)
      .input("year", sql.Int, null)
      .input("quarter", sql.VarChar, null)
      .input(
        "majorcategory",
        sql.VarChar,
        null
      )
      .input("category", sql.VarChar, null)
      .input(
        "subCategory",
        sql.VarChar,
        null
      )
      .input("brand", sql.VarChar, null)
      .input("division", sql.VarChar, null)
      .input("item4", sql.VarChar, null)
      .input("item6", sql.VarChar, null)
      .input("item9", sql.VarChar, null)
      .input(
        "itemDes",
        sql.VarChar,
        null)
      .input(
        "ProductLine",
        sql.VarChar,
        null
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        null
      )
      .input("hero", sql.VarChar, null)
      .input(
        "setIndicator",
        sql.VarChar,
        null
      )
      .input("size", sql.VarChar, null)
      .input(
        "productform",
        sql.VarChar,
        null
      )
      .input(
        "majorInvType",
        sql.VarChar,
        null
      )
      .input(
        "invType",
        sql.VarChar,
        null
      )
      .input(
        "subInvType",
        sql.VarChar,
        null
      )
      .input("abcd", sql.VarChar, null)
      .input(
        "demandtype",
        sql.VarChar,
        null
      )
      .input("newBasic", sql.VarChar, null)
      .input(
        "salesregion",
        sql.VarChar,
        null
      )
      .input(
        "materialtype",
        sql.VarChar,
        null
      )
      .input(
        "materialgroupdesc",
        sql.VarChar,
        null
      )
      .input(
        "materialcode",
        sql.VarChar,
        null
      )
      .input(
        "materialname",
        sql.VarChar,
        null
      )
      .input(
        "packagingtype",
        sql.VarChar,
        null
      )
      .input(
        "regionofsource",
        sql.VarChar,
        null
      )
      .input(
        "countryoforigin",
        sql.VarChar,
        null
      )
      .input(
        "suppliername",
        sql.VarChar,
        null
      )
      .input(
        "parentsupplier",
        sql.VarChar,
        null
      )
      .input(
        "suppliersegmentation",
        sql.VarChar,
        null
      )
      .input(
        "chartaggrtype",
        sql.VarChar,
        null
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        null
      )
      .execute("get_SourceTableViz");

  // const data = {}
  //    data.recordset  =  [
  //     {
  //       color: "red",
  //       value: "#f00"
  //     },
  //     {
  //       color: "green",
  //       value: "#0f0"
  //     },
  //     {
  //       color: "blue",
  //       value: "#00f"
  //     },
  //     {
  //       color: "cyan",
  //       value: "#0ff"
  //     },
  //     {
  //       color: "magenta",
  //       value: "#f0f"
  //     },
  //     {
  //       color: "yellow",
  //       value: "#ff0"
  //     },
  //     {
  //       color: "black",
  //       value: "#000"
  //     }
  //   ]

 const val =  await downloadAndConvertToExcel(data.recordset);

    if(val){
      response.statusCode = constants.HTTP_200;
      response.message = "get_Source Table Viz Values";
      //const pathA = path.join(__dirname+'../data.xlsx');
     // const pathOfFile = path.join(__dirname, '..', 'data.xlsx')
      res.json("Downloaded Successfully");
    }
    else{
      response.statusCode = constants.HTTP_500;
     // response.message = "Unable To Download";
      res.json("Unable To Download");
    }

  } catch (error) {
    next(error)
  }
}


module.exports.getGlobalFilters = async (req, res, next) => {
  //console.log("api request",globalFilters)
  try {
    const globalFilter = req.body.globalFilter;
    //try {
    // let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());

    const request = new sql.Request();
    recordsets = await request
      // .input("year", sql.VarChar, isNullOrEmpty(globalFilter['year']))
      // .input("quarter", sql.VarChar, isNullOrEmpty(['quarter']))
      .input("index_of", sql.Int, globalFilter["index_of"])
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      //pending in sp
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
      .input(
        "salesregion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .execute("get_Global_Filters");
    // .execute('get_E2E_Inventory_by_Node');

    //console.log("records: ", JSON.stringify(recordsets));

    const response = await sufficiencyRepository.getGlobalFilters(
      recordsets.recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get_Global_Filters values";
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

module.exports.getSourceChartFilters = async (req, res, next) => {
  try {
    // let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("Inisde");
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    recordsets = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input("index_of", sql.Int, sourceChartFilter["index_of"])

      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "materialtype",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Type"])
      )
      .input(
        "materialgroupdesc",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Group Description"])
      )
      .input(
        "matnr",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Code"])
      )
      //not in api sourceChartFilter["Material Group Description"]

      .input(
        "materialname",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Name"])
      )
      .input(
        "packagingtype",
        sql.VarChar,
        multiSelect(sourceChartFilter["Packaging Type"])
      )
      .input(
        "regionofsource",
        sql.VarChar,
        multiSelect(sourceChartFilter["Region of Source"])
      )
      .input(
        "countryoforigin",
        sql.VarChar,
        multiSelect(sourceChartFilter["Country of Origin"])
      )
      .input(
        "suppliername",
        sql.VarChar,
        multiSelect(sourceChartFilter["Supplier Name"])
      )
      .input(
        "parentsupplier",
        sql.VarChar,
        multiSelect(sourceChartFilter["Parent Supplier"])
      )
      .input(
        "suppliersegmentation",
        sql.VarChar,
        multiSelect(sourceChartFilter["Supplier Segmentation"])
      )
      // .input("matnr", sql.VarChar, multiSelect(sourceChartFilter["matnr"]))

      .execute("get_Chart_Filters");
    // .execute('get_E2E_Inventory_by_Node');
    // console.log(recordsets.recordset);
    const response = await sufficiencyRepository.getSourceChartFilters(
      recordsets.recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get_Chart_Filters values";
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports.getMakeChartFilters = async (req, res, next) => {
  try {
    // let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());

    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    const makeChartFilter = req.body.makeChartFilter;

    recordsets = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input("index_of", sql.Int, makeChartFilter["index_of"])

      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "High_Level_Group",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("Platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "Technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "Region_Of_Make",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("Plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input(
        "I_E_Plant",
        sql.VarChar,
        multiSelect(makeChartFilter["Plant Type"])
      )
      .input(
        "Capacity_Scenario",
        sql.VarChar,
        multiSelect(makeChartFilter["Capacity Scenario"])
      )
      .input(
        "Resource_Type",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("Resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "Capex_Project",
        sql.VarChar,
        multiSelect(makeChartFilter["Capex Project"])
      )
      .input("OTC", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .execute("get_Chart_Filters_Make");
    // .execute('get_E2E_Inventory_by_Node');

    const response = await sufficiencyRepository.getMakeChartFilters(
      recordsets.recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "make chart filter values";
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};
// router.post("/kpi", sufficiencyService.getKPIcardvalues)d
module.exports.getMakeMixValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    const globalFilter = req.body.globalFilter;
    const makeChartFilter = req.body.makeChartFilter;
    var request = new sql.Request();
    makeMixExternalInternal = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("otc", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .execute("get_Make_Mix_External_Internal");

    var request = new sql.Request();
    makeMixPromoSaleable = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )

      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("otc", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .execute("get_Make_Mix_Promo_Saleable");

    var request = new sql.Request();
    makeMixRegion = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("otc", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .execute("get_Make_Mix_Region");

    // handleEmptyResponse([
    //   makeMixExternalInternal.recordsets[0],
    //   makeMixPromoSaleable.recordsets[0],
    //   makeMixRegion.recordsets[0],
    // ])

    const sourceData = {
      makeMixExternalInternal: makeMixExternalInternal.recordsets[0],
      makeMixPromoSaleable: makeMixPromoSaleable.recordsets[0],
      makeMixRegion: makeMixRegion.recordsets[0],
    };
    var response = {};
    response = await sufficiencyRepository.getMakeMixValues(sourceData);

    response.statusCode = constants.HTTP_200;
    response.message = "get_Make_Mix_Region  values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getSourceTooltipValues = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    sourceTooltip = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))

      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
      //added on 21.11.22
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      // .input("plant", sql.VarChar, null)
      .execute("get_Source_Geomap_ToolTip");

    // handleEmptyResponse([sourceTooltip.recordsets[0]]);
    var response = {};
    response.data = await sufficiencyRepository.getSourceTooltipValues(
      sourceTooltip.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get_Source_Geomap_ToolTip  values";

    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports.getFulfillTooltipValues = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;

    fulfillTooltip = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "new_basic_zz_newprod",
        sql.VarChar,
        multiSelect(globalFilter["New Basic"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input("plant", sql.VarChar, multiSelect(globalFilter.plant))
      .execute("get_Fulfill_Sell_in_Units_Revenue");

    // handleEmptyResponse([fulfillTooltip.recordsets[0]])

    const response = await sufficiencyRepository.getFulfillTooltipValues(
      fulfillTooltip.recordsets[0]
    );

    response.statusCode = constants.HTTP_200;
    response.message = "Success:Fulfil Tooltip Values";
    // console.log("tooltip", response);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
module.exports.getMakeTooltipValues = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    tooltip = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(globalFilter.regionOfMake)
      )
      .execute("get_Make_GeoMap");

    // handleEmptyResponse(tooltip.recordsets[0])

    const response = await sufficiencyRepository.getMakeTooltipValues(
      tooltip.recordsets[0]
    );

    response.statusCode = constants.HTTP_200;
    response.message = "Success:Make Tooltip Values";
    // console.log("tooltip", response);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
function multiSelect(filterVal) {
  if (Array.isArray(filterVal)) {
    if (filterVal.length > 0 && filterVal[0] != "") {
      return `${filterVal}`.replace(/[\[\]']+/g, "");
    } else {
      return null;
    }
  } else {
    if (filterVal) {
      return filterVal;
    } else {
      return null;
    }
  }
}

function isNumber(val) {
  return !isNaN(parseInt(val)) ? Number(val) : null;
}

module.exports.getKPIcardvalues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log(
    //   "filter: ",
    //   filter,
    //   `${filter.globalFilter["Major Category"]}`.replace(/[\[\]']+/g, "")
    // );
    const globalFilter = req.body.globalFilter;

    const sourceKPIRecords = new Promise((resolve, reject) => {
      const request = new sql.Request();
      sourceKPI = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("salesregion", sql.VarChar, null)
        .input("newBasic", sql.VarChar, null)
        //added 21.11.22
        .input(
          "prioritysubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .execute("get_SourceKPICard");
      resolve(sourceKPI);
    });

    const makeKPIRecords = new Promise((resolve, reject) => {
      const request = new sql.Request();
      makeKPI = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        //pending in sp
        // .input("newBasic", sql.VarChar, null)
        .input("salesregion", sql.VarChar, null)
        .execute("get_Make_KPICard");
      // .execute('get_E2E_Inventory_by_Node');
      resolve(makeKPI);
    });

    // console.log(
    //   "records make kpi: ",
    //   JSON.stringify(makeKPIRecords.recordsets[0].length)
    // );

    const fulfillKPIRecords = new Promise((resolve, reject) => {
      const request = new sql.Request();
      fulfillKPI = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        //pending in sp
        .input(
          "new_basic_zz_newprod",
          sql.VarChar,
          multiSelect(globalFilter["New Basic"])
        )
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .execute("get_Fulfill_KPICard");
      resolve(fulfillKPI);
    });

    let aggResponse = await Promise.all([
      sourceKPIRecords,
      makeKPIRecords,
      fulfillKPIRecords,
    ]).catch(function (err) {
      throw err;
    });

    // handleEmptyResponse([
    //   aggResponse[0].recordset,
    //   aggResponse[1].recordset,
    //   aggResponse[2].recordset
    // ]);

    const response = await sufficiencyRepository.getKPIcardvalues(
      aggResponse[0].recordset,
      aggResponse[1].recordset,
      aggResponse[2].recordset
    );

    response.statusCode = constants.HTTP_200;
    response.message = "get KPI card values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getMaterialGroupValuesNew = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    const materialGroupRecordsOne = new Promise((resolve, reject) => {
      var request = new sql.Request();
      let materialGroupRecordsOne = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        //pending in sp
        //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, null)
        .input("salesregion", sql.VarChar, null)
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        //not in api sourceChartFilter["Material Group Description"]
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        .input(
          "prioritysubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        //   .input("chartaggrtype", sql.VarChar, "volbyGroup")
        .execute("get_SourceMaterialGroupViz_Chart3");
      resolve(materialGroupRecordsOne);
    });

    // chart types: volbyGroup, spendbyGroup, revenuebyGroup
    await Promise.all([materialGroupRecordsOne])
      .then(async (values) => {
        // handleEmptyResponse([values[0].recordsets[0]]);

        const sourceData = {
          materialGroupRecordsVolume: values[0].recordsets[0],
        };

        return await sufficiencyRepository.getMaterialGroupValuesNew(
          globalFilter["year"],
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get Material Group values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(error);
  }
};

// module.exports.getMaterialGroupValues = async (req, res, next) => {
//   try {
//     let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
//     // console.log("inside");

//     const globalFilter = req.body.globalFilter;
//     const sourceChartFilter = req.body.sourceChartFilter;

//     const materialGroupRecordsOne = new Promise((resolve, reject) => {
//       var request = new sql.Request();
//       let materialGroupRecordsOne = request
//         .input("year", sql.Int, isNumber(globalFilter["year"]))
//         .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
//         .input(
//           "majorcategory",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Category"])
//         )
//         .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
//         .input(
//           "subCategory",
//           sql.VarChar,
//           multiSelect(globalFilter["SubCategory"])
//         )
//         //pending in sp
//         //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
//         .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
//         .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
//         .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
//         .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
//         .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
//         .input(
//           "itemDes",
//           sql.VarChar,
//           multiSelect(globalFilter["Item Description"])
//         )
//         .input(
//           "ProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Product Line"])
//         )
//         .input(
//           "SubProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Product Line"])
//         )
//         .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
//         .input(
//           "setIndicator",
//           sql.VarChar,
//           multiSelect(globalFilter["Set Indicator"])
//         )
//         .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
//         .input(
//           "productform",
//           sql.VarChar,
//           multiSelect(globalFilter["Product form"])
//         )
//         .input(
//           "majorInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Inventory Type"])
//         )
//         .input(
//           "invType",
//           sql.VarChar,
//           multiSelect(globalFilter["Inventory Description"])
//         )
//         .input(
//           "subInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Inventory Description"])
//         )
//         .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
//         .input(
//           "demandtype",
//           sql.VarChar,
//           multiSelect(globalFilter["Demand Type"])
//         )
//         .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
//         .input(
//           "salesregion",
//           sql.VarChar,
//           multiSelect(globalFilter["Sales Region"])
//         )
//         .input("materialtype", sql.VarChar, sourceChartFilter["Material Type"])
//         .input(
//           "materialgroupdesc",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Material Group Description"])
//         )
//         //not in api sourceChartFilter["Material Group Description"]
//         .input("materialcode", sql.VarChar, sourceChartFilter["Material Code"])
//         .input("materialname", sql.VarChar, sourceChartFilter["Material Name"])
//         .input(
//           "packagingtype",
//           sql.VarChar,
//           sourceChartFilter["Packaging Type"]
//         )
//         .input(
//           "regionofsource",
//           sql.VarChar,
//           sourceChartFilter["Region of Source"]
//         )
//         .input(
//           "countryoforigin",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Country of Origin"])
//         )
//         .input(
//           "suppliername",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Name"])
//         )
//         .input(
//           "parentsupplier",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Parent Supplier"])
//         )
//         .input(
//           "suppliersegmentation",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Segmentation"])
//         )
//         .input(
//           "priority_subcategories",
//           sql.VarChar,
//           multiSelect(globalFilter["Priority Subcategory"])
//         )
//         .input("chartaggrtype", sql.VarChar, "volbyGroup")
//         .execute("get_SourceMaterialGroupViz");
//       resolve(materialGroupRecordsOne);
//     });

//     const materialGroupRecordsTwo = new Promise((resolve, reject) => {
//       var request = new sql.Request();
//       const materialGroupRecordsTwo = request
//         .input("year", sql.Int, isNumber(globalFilter["year"]))
//         .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
//         .input(
//           "majorcategory",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Category"])
//         )
//         .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
//         .input(
//           "subCategory",
//           sql.VarChar,
//           multiSelect(globalFilter["SubCategory"])
//         )
//         //pending in sp
//         //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
//         .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
//         .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
//         .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
//         .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
//         .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
//         .input(
//           "itemDes",
//           sql.VarChar,
//           multiSelect(globalFilter["Item Description"])
//         )
//         .input(
//           "ProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Product Line"])
//         )
//         .input(
//           "SubProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Product Line"])
//         )
//         .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
//         .input(
//           "setIndicator",
//           sql.VarChar,
//           multiSelect(globalFilter["Set Indicator"])
//         )
//         .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
//         .input(
//           "productform",
//           sql.VarChar,
//           multiSelect(globalFilter["Product form"])
//         )
//         .input(
//           "majorInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Inventory Type"])
//         )
//         .input(
//           "invType",
//           sql.VarChar,
//           multiSelect(globalFilter["Inventory Description"])
//         )
//         .input(
//           "subInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Inventory Description"])
//         )
//         .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
//         .input(
//           "demandtype",
//           sql.VarChar,
//           multiSelect(globalFilter["Demand Type"])
//         )
//         .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
//         .input(
//           "salesregion",
//           sql.VarChar,
//           multiSelect(globalFilter["Sales Region"])
//         )
//         .input("materialtype", sql.VarChar, sourceChartFilter["Material Type"])
//         .input(
//           "materialgroupdesc",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Material Group Description"])
//         )
//         //not in api
//         .input("materialcode", sql.VarChar, null)
//         .input("materialname", sql.VarChar, null)
//         .input(
//           "packagingtype",
//           sql.VarChar,
//           sourceChartFilter["Packaging Type"]
//         )
//         .input(
//           "regionofsource",
//           sql.VarChar,
//           sourceChartFilter["Region of Source"]
//         )
//         .input(
//           "countryoforigin",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Country of Origin"])
//         )
//         .input(
//           "suppliername",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Name"])
//         )
//         .input(
//           "parentsupplier",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Parent Supplier"])
//         )
//         .input(
//           "suppliersegmentation",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Segmentation"])
//         )
//         .input(
//           "priority_subcategories",
//           sql.VarChar,
//           multiSelect(globalFilter["Priority Subcategory"])
//         )
//         .input("chartaggrtype", sql.VarChar, "spendbyGroup")
//         .execute("get_SourceMaterialGroupViz");
//       resolve(materialGroupRecordsTwo);
//     });

//     const materialGroupRecordsThree = new Promise((resolve, reject) => {
//       var request = new sql.Request();
//       const materialGroupRecordsThree = request
//         .input("year", sql.Int, isNumber(globalFilter["year"]))
//         .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
//         .input(
//           "majorcategory",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Category"])
//         )
//         .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
//         .input(
//           "subCategory",
//           sql.VarChar,
//           multiSelect(globalFilter["SubCategory"])
//         )
//         //pending in sp
//         //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
//         .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
//         .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
//         .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
//         .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
//         .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
//         .input(
//           "itemDes",
//           sql.VarChar,
//           multiSelect(globalFilter["Item Description"])
//         )
//         .input(
//           "ProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Product Line"])
//         )
//         .input(
//           "SubProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Product Line"])
//         )
//         .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
//         .input(
//           "setIndicator",
//           sql.VarChar,
//           multiSelect(globalFilter["Set Indicator"])
//         )
//         .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
//         .input(
//           "productform",
//           sql.VarChar,
//           multiSelect(globalFilter["Product form"])
//         )
//         .input(
//           "majorInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Inventory Type"])
//         )
//         .input(
//           "invType",
//           sql.VarChar,
//           multiSelect(globalFilter["Inventory Description"])
//         )
//         .input(
//           "subInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Inventory Description"])
//         )
//         .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
//         .input(
//           "demandtype",
//           sql.VarChar,
//           multiSelect(globalFilter["Demand Type"])
//         )
//         .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
//         .input(
//           "salesregion",
//           sql.VarChar,
//           multiSelect(globalFilter["Sales Region"])
//         )
//         .input("materialtype", sql.VarChar, sourceChartFilter["Material Type"])
//         .input(
//           "materialgroupdesc",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Material Group Description"])
//         )
//         //not in api
//         .input("materialcode", sql.VarChar, null)
//         .input("materialname", sql.VarChar, null)
//         .input(
//           "packagingtype",
//           sql.VarChar,
//           sourceChartFilter["Packaging Type"]
//         )
//         .input(
//           "regionofsource",
//           sql.VarChar,
//           sourceChartFilter["Region of Source"]
//         )
//         .input(
//           "countryoforigin",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Country of Origin"])
//         )
//         .input(
//           "suppliername",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Name"])
//         )
//         .input(
//           "parentsupplier",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Parent Supplier"])
//         )
//         .input(
//           "suppliersegmentation",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Segmentation"])
//         )
//         .input(
//           "priority_subcategories",
//           sql.VarChar,
//           multiSelect(globalFilter["Priority Subcategory"])
//         )
//         .input("chartaggrtype", sql.VarChar, "revenuebyGroup")
//         .execute("get_SourceMaterialGroupViz");
//       resolve(materialGroupRecordsThree);
//     });

//     // chart types: volbyGroup, spendbyGroup, revenuebyGroup
//     await Promise.all([
//       materialGroupRecordsOne,
//       materialGroupRecordsTwo,
//       materialGroupRecordsThree,
//     ])
//       .then(async (values) => {
//         const sourceData = {
//           materialGroupRecordsVolume: values[0].recordsets[0],

//           materialGroupRecordsSpend: values[1].recordsets[0],

//           materialGroupRecordsRevenue: values[2].recordsets[0],
//         };

//         return await sufficiencyRepository.getMaterialGroupValues(
//           isNumber(globalFilter["year"]),
//           sourceData
//         );
//       })
//       .then((val) => {
//         return res.json(val);
//       })
//       .catch((error) => {
//         console.log("Error: ", error);
//       });
//   } catch (error) {
//     res.json({
//       message: "Failure",
//       data: `${error}`,
//     });
//   }
// };

module.exports.getMaterialNameRecordValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    const materialNameRecordsOne = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const materialNameRecordsOne = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        //added 21.11.22
        .input(
          "prioritysubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, null)
        .input("salesregion", sql.VarChar, null)
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        //not in api
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        .input("chartaggrtype", sql.VarChar, "volbyGroup")
        .execute("get_SourceMaterialNameViz");
      resolve(materialNameRecordsOne);
    });

    const materialNameRecordsTwo = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const materialNameRecordsTwo = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, null)
        .input("salesregion", sql.VarChar, null)
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        //added 21.11.22
        .input(
          "prioritysubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .input("chartaggrtype", sql.VarChar, "spendbyGroup")
        .execute("get_SourceMaterialNameViz");
      resolve(materialNameRecordsTwo);
    });
    const materialNameRecordsThree = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const materialNameRecordsThree = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, null)
        .input("salesregion", sql.VarChar, null)
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        //pending in sp
        //added 21.11.22
        .input(
          "prioritysubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .input("chartaggrtype", sql.VarChar, "revenuebyGroup")
        .execute("get_SourceMaterialNameViz");
      resolve(materialNameRecordsThree);
    });

    // chart types: volbyGroup, spendbyGroup, revenuebyGroup
    await Promise.all([
      materialNameRecordsOne,
      materialNameRecordsTwo,
      materialNameRecordsThree,
    ])
      .then(async (values) => {
        // handleEmptyResponse([values[0].recordsets[0], values[1].recordsets[0], values[2].recordsets[0]]);
        const sourceData = {
          materialNameRecordsVolume: values[0].recordsets[0],

          materialNameRecordsSpend: values[1].recordsets[0],

          materialNameRecordsRevenue: values[2].recordsets[0],
        };
        return await sufficiencyRepository.getMaterialNameRecordValues(
          globalFilter["year"],
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get Material Name Record values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(err);
  }
};

module.exports.getSupplierMixRecordsValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    const supplierMixRecordsOne = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const supplierMixRecordsOne = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        ) //added 21.11.22
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )

        //pending in sp
        //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
        // .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        // .input("salesregion", sql.VarChar, multiSelect(globalFilter["Sales Region"]))
        .input("chartaggrtype", sql.VarChar, "volbyGroup")
        .execute("get_SourceSupplierMixViz");
      resolve(supplierMixRecordsOne);
    });
    const supplierMixRecordsTwo = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const supplierMixRecordsTwo = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        //added 21.11.22
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        //pending in sp
        //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
        // .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        // .input("salesregion", sql.VarChar, multiSelect(globalFilter["Sales Region"]))
        .input("chartaggrtype", sql.VarChar, "spendbyGroup")
        .execute("get_SourceSupplierMixViz");
      resolve(supplierMixRecordsTwo);
    });
    const supplierMixRecordsThree = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const supplierMixRecordsThree = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        //added 21.11.22
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        //pending in sp
        //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
        // .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        // .input("salesregion", sql.VarChar, multiSelect(globalFilter["Sales Region"]))
        .input("chartaggrtype", sql.VarChar, "revenuebyGroup")
        .execute("get_SourceSupplierMixViz");
      resolve(supplierMixRecordsThree);
    });

    // chart types: volbyGroup, spendbyGroup, revenuebyGroup
    await Promise.all([
      supplierMixRecordsOne,
      supplierMixRecordsTwo,
      supplierMixRecordsThree,
    ])
      .then(async (values) => {
        //  handleEmptyResponse([values[0].recordsets[0], values[1].recordsets[0], values[2].recordsets[0]])
        const sourceData = {
          supplierMixRecordsVolume: values[0].recordsets[0],

          supplierMixRecordsSpend: values[1].recordsets[0],

          supplierMixRecordsRevenue: values[2].recordsets[0],
        };
        return await sufficiencyRepository.getSupplierMixRecordsValues(
          globalFilter["year"],
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get Supplier Mix Records values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(error);
  }
};

module.exports.getSupplierMixRecordsValuesNew = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    var request = new sql.Request();
    const supplierMixRecordsOne = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("newBasic", sql.VarChar, null)
      .input("salesregion", sql.VarChar, null)
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "materialtype",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Type"])
      )
      .input(
        "materialgroupdesc",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Group Description"])
      )
      .input(
        "materialcode",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Code"])
      )
      .input(
        "materialname",
        sql.VarChar,
        multiSelect(sourceChartFilter["Material Name"])
      )
      .input(
        "packagingtype",
        sql.VarChar,
        multiSelect(sourceChartFilter["Packaging Type"])
      )
      .input(
        "regionofsource",
        sql.VarChar,
        multiSelect(sourceChartFilter["Region of Source"])
      )
      .input(
        "countryoforigin",
        sql.VarChar,
        multiSelect(sourceChartFilter["Country of Origin"])
      )
      .input(
        "suppliername",
        sql.VarChar,
        multiSelect(sourceChartFilter["Supplier Name"])
      )
      .input(
        "parentsupplier",
        sql.VarChar,
        multiSelect(sourceChartFilter["Parent Supplier"])
      )
      .input(
        "suppliersegmentation",
        sql.VarChar,
        multiSelect(sourceChartFilter["Supplier Segmentation"])
      )
      .input(
        "prioritysubcategory",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )

      .execute("get_SourceSupplierMixViz_Chart2");

    //pending in sp
    //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
    // .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
    // .input("salesregion", sql.VarChar, multiSelect(globalFilter["Sales Region"]))
    // .input("chartaggrtype", sql.VarChar, "volbyGroup")

    // console.log(Date.now(), supplierMixRecordsOne.recordsets[0][0]);

    // handleEmptyResponse([supplierMixRecordsOne.recordsets[0]])
    let output = await sufficiencyRepository.getSupplierMixRecordsValuesNew(
      globalFilter["year"],
      supplierMixRecordsOne.recordsets[0]
    );
    output.statusCode = constants.HTTP_200;
    output.message = "get Supplier Mix Records values";
    // console.log(Date.now());
    return res.json(output);
  } catch (error) {
    return next(error);
  }
};

module.exports.getMaterialNameRecordValuesNew = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    const materialNameRecordsOne = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const materialNameRecordsOne = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        //pending in sp
        //.input("priority_subcategories", sql.VarChar, multiSelect(globalFilter["Priority Subcategory"]))
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        //not in api
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        .input(
          "prioritySubcategory",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        // .input("chartaggrtype", sql.VarChar, multiSelect(sourceChartFilter["chartaggrtype"]))
        .execute("get_SourceMaterialNameViz_Chart4");
      resolve(materialNameRecordsOne);
    });

    // chart types: volbyGroup, spendbyGroup, revenuebyGroup
    await Promise.all([materialNameRecordsOne])
      .then(async (values) => {
        // handleEmptyResponse([values[0].recordsets[0]])
        const sourceData = {
          materialNameRecordsVolume: values[0].recordsets[0],
        };
        return await sufficiencyRepository.getMaterialNameRecordValuesNew(
          globalFilter["year"],
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get Material Name Records values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(error);
  }
};

module.exports.getProjectedMaterialReqValuesNew = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("inside");

    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    const projectedMaterialReqOne = new Promise((resolve, reject) => {
      var request = new sql.Request();
      const projectedMaterialReqOne = request
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        //not in api
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        //pending in sp
        // .input("year", sql.Int, isNumber(globalFilter["year"]))
        // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        // .input("chartaggrtype", sql.VarChar, null)
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .execute("get_SourceProjectedMaterialRequirementViz_Chart1");
      resolve(projectedMaterialReqOne);
    });

    // chart types: volbyGroup, spendbyGroup, revenuebyGroup
    await Promise.all([projectedMaterialReqOne])
      .then(async (values) => {
        // console.log("projectedMaterialReqOne", values[0].recordsets[0])
        // handleEmptyResponse([values[0].recordsets[0]])
        const sourceData = {
          projectedMaterialReqVolume: values[0].recordsets[0],
        };
        return await sufficiencyRepository.getProjectedMaterialReqValuesNew(
          filter,
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get Projected Material Req values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(error);
  }
};

// module.exports.getProjectedMaterialReqValues = async (req, res, next) => {
//   try {
//     let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
//     // console.log("inside");

//     const globalFilter = req.body.globalFilter;
//     const sourceChartFilter = req.body.sourceChartFilter;

//     const projectedMaterialReqOne = new Promise((resolve, reject) => {
//       var request = new sql.Request();
//       const projectedMaterialReqOne = request
//         .input(
//           "majorcategory",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Category"])
//         )
//         .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
//         .input(
//           "subCategory",
//           sql.VarChar,
//           multiSelect(globalFilter["SubCategory"])
//         )
//         .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
//         .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
//         .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
//         .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
//         .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
//         .input(
//           "itemDes",
//           sql.VarChar,
//           multiSelect(globalFilter["Item Description"])
//         )
//         .input(
//           "ProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Product Line"])
//         )
//         .input(
//           "SubProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Product Line"])
//         )
//         .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
//         .input(
//           "setIndicator",
//           sql.VarChar,
//           multiSelect(globalFilter["Set Indicator"])
//         )
//         .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
//         .input(
//           "productform",
//           sql.VarChar,
//           multiSelect(globalFilter["Product form"])
//         )
//         .input(
//           "majorInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Inventory Type"])
//         )
//         .input(
//           "invType",
//           sql.VarChar,
//           multiSelect(globalFilter["Inventory Description"])
//         )
//         .input(
//           "subInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Inventory Description"])
//         )
//         .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
//         .input(
//           "demandtype",
//           sql.VarChar,
//           multiSelect(globalFilter["Demand Type"])
//         )
//         .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
//         .input(
//           "salesregion",
//           sql.VarChar,
//           multiSelect(globalFilter["Sales Region"])
//         )
//         .input("materialtype", sql.VarChar, sourceChartFilter["Material Type"])
//         .input(
//           "materialgroupdesc",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Material Group Description"])
//         )
//         .input("materialcode", sql.VarChar, sourceChartFilter["Material Code"])
//         .input("materialname", sql.VarChar, sourceChartFilter["Material Name"])
//         .input(
//           "packagingtype",
//           sql.VarChar,
//           sourceChartFilter["Packaging Type"]
//         )
//         .input(
//           "regionofsource",
//           sql.VarChar,
//           sourceChartFilter["Region of Source"]
//         )
//         .input(
//           "countryoforigin",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Country of Origin"])
//         )
//         .input(
//           "suppliername",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Name"])
//         )
//         .input(
//           "parentsupplier",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Parent Supplier"])
//         )
//         .input(
//           "suppliersegmentation",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Segmentation"])
//         )
//         .input(
//           "priority_subcategories",
//           sql.VarChar,
//           multiSelect(globalFilter["Priority Subcategory"])
//         )
//         //pending in sp
//         // .input("year", sql.Int, isNumber(globalFilter["year"]))
//         // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
//         .input("chartaggrtype", sql.VarChar, "aggrbyVolume")
//         .execute("get_SourceProjectedMaterialRequirementViz");
//       resolve(projectedMaterialReqOne);
//     });

//     const projectedMaterialReqTwo = new Promise((resolve, reject) => {
//       var request = new sql.Request();
//       const projectedMaterialReqTwo = request
//         .input(
//           "majorcategory",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Category"])
//         )
//         .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
//         .input(
//           "subCategory",
//           sql.VarChar,
//           multiSelect(globalFilter["SubCategory"])
//         )
//         .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
//         .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
//         .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
//         .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
//         .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
//         .input(
//           "itemDes",
//           sql.VarChar,
//           multiSelect(globalFilter["Item Description"])
//         )
//         .input(
//           "ProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Product Line"])
//         )
//         .input(
//           "SubProductLine",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Product Line"])
//         )
//         .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
//         .input(
//           "setIndicator",
//           sql.VarChar,
//           multiSelect(globalFilter["Set Indicator"])
//         )
//         .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
//         .input(
//           "productform",
//           sql.VarChar,
//           multiSelect(globalFilter["Product form"])
//         )
//         .input(
//           "majorInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Major Inventory Type"])
//         )
//         .input(
//           "invType",
//           sql.VarChar,
//           multiSelect(globalFilter["Inventory Description"])
//         )
//         .input(
//           "subInvType",
//           sql.VarChar,
//           multiSelect(globalFilter["Sub Inventory Description"])
//         )
//         .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
//         .input(
//           "demandtype",
//           sql.VarChar,
//           multiSelect(globalFilter["Demand Type"])
//         )
//         .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
//         .input(
//           "salesregion",
//           sql.VarChar,
//           multiSelect(globalFilter["Sales Region"])
//         )
//         .input("materialtype", sql.VarChar, sourceChartFilter["Material Type"])
//         .input(
//           "materialgroupdesc",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Material Group Description"])
//         )
//         .input("materialcode", sql.VarChar, sourceChartFilter["Material Code"])
//         .input("materialname", sql.VarChar, sourceChartFilter["Material Name"])
//         .input(
//           "packagingtype",
//           sql.VarChar,
//           sourceChartFilter["Packaging Type"]
//         )
//         .input(
//           "regionofsource",
//           sql.VarChar,
//           sourceChartFilter["Region of Source"]
//         )
//         .input(
//           "countryoforigin",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Country of Origin"])
//         )
//         .input(
//           "suppliername",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Name"])
//         )
//         .input(
//           "parentsupplier",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Parent Supplier"])
//         )
//         .input(
//           "suppliersegmentation",
//           sql.VarChar,
//           multiSelect(sourceChartFilter["Supplier Segmentation"])
//         )
//         .input(
//           "priority_subcategories",
//           sql.VarChar,
//           multiSelect(globalFilter["Priority Subcategory"])
//         )
//         //pending in sp
//         // .input("year", sql.Int, isNumber(globalFilter["year"]))
//         // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
//         .input("chartaggrtype", sql.VarChar, "aggrbyRevenue")
//         .execute("get_SourceProjectedMaterialRequirementViz");
//       resolve(projectedMaterialReqTwo);
//     });

//     // chart types: volbyGroup, spendbyGroup, revenuebyGroup
//     await Promise.all([projectedMaterialReqOne, projectedMaterialReqTwo])
//       .then(async (values) => {
//         const sourceData = {
//           projectedMaterialReqVolume: values[0].recordsets[0],

//           projectedMaterialReqRevenue: values[1].recordsets[0],
//         };
//         return await sufficiencyRepository.getProjectedMaterialReqValues(
//           filter,
//           sourceData
//         );
//       })
//       .then((val) => {
//         // console.log("val", val.data);
//         return res.json(val);
//       })
//       .catch((error) => {
//         console.log("Error: ", error);
//       });
//   } catch (error) {
//     res.json({
//       message: "Failure",
//       data: `${error}`,
//     });
//   }
// };

module.exports.getFromExcel = async (req, res, next) => {
  try {
    const xlsxFilePath = path.resolve(
      __dirname,
      "../config/ELC Demo_Data181022.xlsx"
    );
    // console.log(xlsxFilePath);
    let response = await sufficiencyRepository.getFromExcel(xlsxFilePath);
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getAlle2e = async (req, res, next) => {
  try {
    let response = await sufficiencyRepository.getAlle2e();
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getSourceMaterialPOValues = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    sourceFY22Records = await sql.query`SELECT [MATERIAL_TYPE]
    ,[MATERIAL_CODE]
    ,[MATERIAL_NAME]
    ,[VENDOR_NAME]
    ,[UOM]
    ,[TOTAL_QTY]
    ,[TOTAL_SPEND]
    FROM [dbo].[aggr_fy22_historical_actuals_material_po] ORDER BY MATERIAL_CODE
      OFFSET ${Number(offsetBy)} ROWS FETCH NEXT ${Number(sizeOf)} ROWS ONLY`;

    // console.log(
    //   "records: ",
    //   JSON.stringify(sourceFY22Records.recordsets[0]).length
    // );

    const response = await sufficiencyRepository.getSourceMaterialPOValues(
      sourceFY22Records.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Source Material po values";
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};


module.exports.getMakeBarChartValues = async (req, res, next) => {
  try {
    var request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    const makeChartFilter = req.body.makeChartFilter;

    makeManlocProdReq = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input("salesRegion", sql.VarChar, null)
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("otc", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_Make_Manloc_ProdReq");

    var request = new sql.Request();
    projectedProdUnitVsCapacity = await request
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input(
        "capacityScenario",
        sql.VarChar,
        multiSelect(makeChartFilter["Capacity Scenario"])
      )
      .input(
        "includedCapacity",
        sql.VarChar,
        multiSelect(makeChartFilter["Included Capacity"])
      )
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input(
        "capexProject",
        sql.VarChar,
        multiSelect(makeChartFilter["Capex Project"])
      )
      // .input(
      //   "priority_subcategories",
      //   sql.VarChar,
      //   multiSelect(globalFilter["Priority Subcategory"])
      // )
      .execute("get_Make_ProjUnits");
    // handleEmptyResponse([materialGroupRecords.recordsets[0], makeManlocProdReq.recordsets[0]])
    const sourceData = {
      projectedProdUnitVsCapacity: projectedProdUnitVsCapacity.recordsets[0],
      makeManlocProdReq: makeManlocProdReq.recordsets[0],
    };

    //console.log("records: ", JSON.stringify(makeManlocProdReq.recordsets[0]));
    const response = await sufficiencyRepository.getMakeBarChartValue(
      sourceData,
      makeChartFilter["Included Capacity"]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Make Bar Chart values";
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getWhereUsedValues = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    const globalFilter = req.body.globalFilter;
    const sourceChartFilter = req.body.sourceChartFilter;

    // const totalRecords = new Promise((resolve, reject) => {
    //   const request = new sql.Request();
    //   totalRecordsvalue = request
    //     .input("year", sql.Int, isNumber(globalFilter["year"]))
    //     .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
    //     .input(
    //       "majorcategory",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Major Category"])
    //     )
    //     .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
    //     .input(
    //       "subCategory",
    //       sql.VarChar,
    //       multiSelect(globalFilter["SubCategory"])
    //     )
    //     .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
    //     .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
    //     .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
    //     .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
    //     .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
    //     .input(
    //       "itemDes",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Item Description"])
    //     )
    //     .input(
    //       "ProductLine",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Product Line"])
    //     )
    //     .input(
    //       "SubProductLine",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Sub Product Line"])
    //     )
    //     .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
    //     .input(
    //       "setIndicator",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Set Indicator"])
    //     )
    //     .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
    //     .input(
    //       "productform",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Product form"])
    //     )
    //     .input(
    //       "majorInvType",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Major Inventory Type"])
    //     )
    //     .input(
    //       "invType",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Inventory Description"])
    //     )
    //     .input(
    //       "subInvType",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Sub Inventory Description"])
    //     )
    //     .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
    //     .input(
    //       "demandtype",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Demand Type"])
    //     )
    //     .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
    //     .input(
    //       "salesregion",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Sales Region"])
    //     )
    //     .input(
    //       "materialtype",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Material Type"])
    //     )
    //     .input(
    //       "materialgroupdesc",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Material Group Description"])
    //     )
    //     .input(
    //       "materialcode",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Material Code"])
    //     )
    //     .input(
    //       "materialname",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Material Name"])
    //     )
    //     .input(
    //       "packagingtype",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Packaging Type"])
    //     )
    //     .input(
    //       "regionofsource",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Region of Source"])
    //     )
    //     .input(
    //       "countryoforigin",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Country of Origin"])
    //     )
    //     .input(
    //       "suppliername",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Supplier Name"])
    //     )
    //     .input(
    //       "parentsupplier",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Parent Supplier"])
    //     )
    //     .input(
    //       "suppliersegmentation",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter["Supplier Segmentation"])
    //     )
    //     .input(
    //       "chartaggrtype",
    //       sql.VarChar,
    //       multiSelect(sourceChartFilter.chartaggrtype)
    //     )
    //     .input(
    //       "priority_subcategories",
    //       sql.VarChar,
    //       multiSelect(globalFilter["Priority Subcategory"])
    //     )
    //     .execute("get_SourceTableViz1_TotalRecords");
    //   resolve(totalRecordsvalue);
    // });

    const materialGroupRecords = new Promise((resolve, reject) => {
      const request = new sql.Request();
      materialGroupRecordsValues = request
        .input("offset", sql.Int, offsetBy)
        .input("numberOfRecords", sql.Int, sizeOf)
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
        .input(
          "subCategory",
          sql.VarChar,
          multiSelect(globalFilter["SubCategory"])
        )
        .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
        .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
        .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
        .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
        .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
        .input(
          "itemDes",
          sql.VarChar,
          multiSelect(globalFilter["Item Description"])
        )
        .input(
          "ProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Product Line"])
        )
        .input(
          "SubProductLine",
          sql.VarChar,
          multiSelect(globalFilter["Sub Product Line"])
        )
        .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
        .input(
          "setIndicator",
          sql.VarChar,
          multiSelect(globalFilter["Set Indicator"])
        )
        .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
        .input(
          "productform",
          sql.VarChar,
          multiSelect(globalFilter["Product form"])
        )
        .input(
          "majorInvType",
          sql.VarChar,
          multiSelect(globalFilter["Major Inventory Type"])
        )
        .input(
          "invType",
          sql.VarChar,
          multiSelect(globalFilter["Inventory Description"])
        )
        .input(
          "subInvType",
          sql.VarChar,
          multiSelect(globalFilter["Sub Inventory Description"])
        )
        .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
        .input(
          "demandtype",
          sql.VarChar,
          multiSelect(globalFilter["Demand Type"])
        )
        .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))
        .input(
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
        )
        .input(
          "materialtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Type"])
        )
        .input(
          "materialgroupdesc",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Group Description"])
        )
        .input(
          "materialcode",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Code"])
        )
        .input(
          "materialname",
          sql.VarChar,
          multiSelect(sourceChartFilter["Material Name"])
        )
        .input(
          "packagingtype",
          sql.VarChar,
          multiSelect(sourceChartFilter["Packaging Type"])
        )
        .input(
          "regionofsource",
          sql.VarChar,
          multiSelect(sourceChartFilter["Region of Source"])
        )
        .input(
          "countryoforigin",
          sql.VarChar,
          multiSelect(sourceChartFilter["Country of Origin"])
        )
        .input(
          "suppliername",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Name"])
        )
        .input(
          "parentsupplier",
          sql.VarChar,
          multiSelect(sourceChartFilter["Parent Supplier"])
        )
        .input(
          "suppliersegmentation",
          sql.VarChar,
          multiSelect(sourceChartFilter["Supplier Segmentation"])
        )
        .input(
          "chartaggrtype",
          sql.VarChar,
          multiSelect(sourceChartFilter.chartaggrtype)
        )
        .input(
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .execute("get_SourceTableViz");
      resolve(materialGroupRecordsValues);
    });

    let aggResponse = await Promise.all([materialGroupRecords]);

    // handleEmptyResponse([materialGroupRecords.recordsets[0]])
    // console.log(
    //   "where used records: , agg",
    //   aggResponse[0].recordsets[0][0].TotalRows,
    //   aggResponse[0].recordsets[0][1]
    // );

    const response = await sufficiencyRepository.getWhereUsedValues(
      aggResponse[0].recordsets[0][0]?.TotalRows
        ? aggResponse[0].recordsets[0][0]?.TotalRows
        : aggResponse[0].recordsets[0][1]?.TotalRows,
      aggResponse[0].recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Where Used Values";

    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getAllSource = async (req, res, next) => {
  try {
    const _filter = { "source type": "vendor" }; //req.filter;
    let response = await sufficiencyRepository.getAllSource(_filter);
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
    res.json(error);
  }
};

module.exports.getE2ERevenueGrowthValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log(
    //   "filter: ",
    //   filter,
    //   `${filter.globalFilter["Major Category"]}`.replace(/[\[\]']+/g, "")
    // );
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    // filter.globalFilter["Major Category"].length > 0
    // ? `${filter.globalFilter["Major Category"]}`.replace(/[\[\]']+/g, "")
    // : null
    recordsets = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input(
        "prioritySubCategory",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesregion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .execute("get_E2E_RevenueGrowth_Viz");
    // .execute('get_E2E_Inventory_by_Node');

    // console.log("records: ", JSON.stringify(recordsets.recordsets[0].length));
    //handleEmptyResponse(recordsets.recordsets[0])
    const response = await sufficiencyRepository.getE2ERevenueGrowthValues(
      recordsets.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get E2E Revenue Growth values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2ERequirementGrowthSourceValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;

    requirementGrowthSourceRecords = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_E2E_Source_ReqViz");

    // console.log(
    //   "records: ",
    //   JSON.stringify(requirementGrowthSourceRecords).length
    // );
    // handleEmptyResponse([requirementGrowthSourceRecords.recordsets[0]])
    const response =
      await sufficiencyRepository.getE2ERequirementGrowthSourceValues(
        requirementGrowthSourceRecords.recordsets[0]
      );
      response.statusCode = constants.HTTP_200;
      response.message = "get Requirement Growth Source values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2ERequirementGrowthMakeValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    requirementGrowthSourceRecords = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_E2E_MakeChart_ReqViz");

    // console.log(
    //   "records: ",
    //   JSON.stringify(requirementGrowthSourceRecords.recordsets[0][0])
    // );
    //handleEmptyResponse([requirementGrowthSourceRecords.recordsets[0]])
    const response =
      await sufficiencyRepository.getE2ERequirementGrowthMakeValues(
        requirementGrowthSourceRecords.recordsets[0]
      );
      response.statusCode = constants.HTTP_200;
      response.message = "get Requirement Growth Make values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2ERequirementGrowthFulfillValues = async (
  req,
  res,
  next
) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    requirementGrowthFulfillRecords = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_E2E_Fulfill_ReqViz");
    //handleEmptyResponse([requirementGrowthFulfillRecords.recordsets[0]])
    const response =
      await sufficiencyRepository.getE2ERequirementGrowthFulfillValues(
        requirementGrowthFulfillRecords.recordsets[0]
      );
      response.statusCode = constants.HTTP_200;
      response.message = "get Requirement Growth Fulfill values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2EInventoryByNodeValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    inventoryByNodeRecords = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_E2E_Inventory_by_Node");

    // console.log("records: ", JSON.stringify(inventoryByNodeRecords).length);
    // handleEmptyResponse([inventoryByNodeRecords.recordsets[0]])
    const response = await sufficiencyRepository.getE2EInventoryByNodeValues(
      inventoryByNodeRecords.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get E2E Inventory By Node values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};



module.exports.nudgesValues = async (req, res, next) => {
  try {
    const makeChartFilter = req?.body?.makeChartFilter;
    const nudgeSourceValues = new Promise((resolve, reject) => {
      const request = new sql.Request();

      let nudgeSourceValues = request.execute("get_Source_Sufficiency_Alert");
      resolve(nudgeSourceValues);
    });
    const nudgeMakeValues = new Promise((resolve, reject) => {
      const request = new sql.Request();
      let nudgeMakeValues = request.execute("get_Make_Alerts");
      resolve(nudgeMakeValues);
    });

    let aggResponse = await Promise.all([
      nudgeSourceValues,
      nudgeMakeValues,
    ]).catch(function (err) {
      throw err;
    });

    const response = await sufficiencyRepository.getNudgeValues(
      aggResponse[0].recordset,
      aggResponse[1].recordset,
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Nudge values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};


module.exports.getMakeProductionPOValues = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    makeFY22Records = await sql.query`SELECT [MATERIAL_TYPE]
    ,[MATERIAL_CODE]
    ,[MATERIAL_NAME]
    ,[MAJOR_INVENTORY_DESCRIPTION]
    ,[RESOURCE]
    ,[PLANT]
    ,[PLANT_NAME]
    ,[RESOURCE_TYPE]
    ,[HIGH_LEVEL_GROUPING]
    ,[PLATFORM]
    ,[TECHNOLOGY_GROUPING]
    ,[LOCTYPE_DESC]
    ,[REGION]
    ,[TOTAL_QTY]
    ,[UOM]
    ,[I/E]
FROM [dbo].[aggr_fy22_historical_actuals_production_po] ORDER BY MATERIAL_CODE
      OFFSET ${Number(offsetBy)} ROWS FETCH NEXT ${Number(sizeOf)} ROWS ONLY`;

    // console.log(
    //   "records: ",
    //   JSON.stringify(makeFY22Records.recordsets[0]).length
    // );
    //handleEmptyResponse([makeFY22Records.recordsets[0]])
    const response = await sufficiencyRepository.getMakeProductionPOValues(
      makeFY22Records.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Make Production PO values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getMakeWhereUsedValues = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    const makeChartFilter = req.body.makeChartFilter;
    makeWhereUsedRecords = await request
      .input("offset", sql.Int, offsetBy)
      //is it global ? numberOfRecords
      .input("numberOfRecords", sql.Int, sizeOf)
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesregion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input("otc", sql.VarChar, multiSelect(makeChartFilter["OTC"]))
      .execute("get_Make_Base_Table1");

    // .input("newBasic", sql.VarChar, null)

    // console.log("records: ", makeWhereUsedRecords.recordset.length);

    // handleEmptyResponse([makeWhereUsedRecords.recordset])

    const response = await sufficiencyRepository.getMakeWhereUsedValues(
      makeWhereUsedRecords?.recordset[0]?.TotalRows
        ? makeWhereUsedRecords?.recordset[0]?.TotalRows
        : makeWhereUsedRecords?.recordset[1]?.TotalRows,
      makeWhereUsedRecords.recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Make Where Used values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getMakeHeatMapValues = async (req, res, next) => {
  try {
    //   let sizeOf = req.query.size || 1000;
    //   let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());

    const request = new sql.Request();
    const makeChartFilter = req.body.makeChartFilter;
    // console.log("filter: ", makeChartFilter.includedCapacity);
    makeHeatMapRecords = await request
      .input(
        "highLevelGrouping",
        sql.VarChar,
        multiSelect(makeChartFilter["High Level Grouping"])
      )
      .input("platform", sql.VarChar, multiSelect(makeChartFilter["Platform"]))
      .input(
        "technology",
        sql.VarChar,
        multiSelect(makeChartFilter["Technology"])
      )
      .input(
        "regionOfMake",
        sql.VarChar,
        multiSelect(makeChartFilter["Region of Make"])
      )
      .input("plant", sql.VarChar, multiSelect(makeChartFilter["Plant"]))
      .input("i_e", sql.VarChar, multiSelect(makeChartFilter["Plant Type"]))
      .input(
        "capacityScenario",
        sql.VarChar,
        multiSelect(makeChartFilter["Capacity Scenario"])
      )
      .input(
        "includedCapacity",
        sql.VarChar,
        multiSelect(makeChartFilter["Included Capacity"])
      )
      .input("resource", sql.VarChar, multiSelect(makeChartFilter["Resource"]))
      .input(
        "resourceType",
        sql.VarChar,
        multiSelect(makeChartFilter["Resource Type"])
      )
      .input(
        "capexProject",
        sql.VarChar,
        multiSelect(makeChartFilter["Capex Project"])
      )
      .execute("get_Make_UtiHeatMap");

    // .input("newBasic", sql.VarChar, null)

    // console.log("records: ", makeHeatMapRecords.recordset.length);
    //handleEmptyResponse([makeHeatMapRecords.recordsets[0]])
    const response = await sufficiencyRepository.getMakeHeatMapValues(
      makeHeatMapRecords.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Make Heat Map values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getFulfillBarChartValues = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    fulfillBarChartRecords = await request
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "new_basic_zz_newprod",
        sql.VarChar,
        multiSelect(globalFilter["New Basic"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .input("plant", sql.VarChar, multiSelect(globalFilter.plant))
      .execute("get_Fulfill_Region_Sale_Growth");

    // console.log(
    //   "records: ",
    //   JSON.stringify(fulfillBarChartRecords.recordset).length
    // );
    //handleEmptyResponse([fulfillBarChartRecords.recordsets[0]])
    const response = await sufficiencyRepository.getFulfillBarChartValues(
      fulfillBarChartRecords.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Fulfill Bar Chart values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2ENodeInformation = async (req, res, next) => {
  //   try {
  //     let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());

  //     const sourceData = require("../config/demo_data_source.json");
  //     const makeData = require("../config/demo data make.json");
  //     const fulfillData = require("../config/demo_data_fulfill.json");
  //     console.log("flag value: ", filter);
  //     let response = await sufficiencyRepository.getE2ENodeInformation(
  //       filter,
  //       sourceData,
  //       makeData,
  //       fulfillData
  //     );
  //     res.json(response);
  //   } catch (error) {
  //     res.json({
  //       message: "Failure",
  //       data: `${error}`,
  //     });
  //   }
  // };
  // async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    getE2ENodeInformation = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_Source_Geomap_Nodes");

    // console.log(
    //   "records: ",
    //   JSON.stringify(getE2ENodeInformation.recordset).length
    // );

    const request1 = new sql.Request();
    getE2ENodeInformation_make = await request1
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_Make_Geomap_Nodes");

    // console.log(
    //   "records: ",
    //   JSON.stringify(getE2ENodeInformation_make.recordset).length
    // );

    const request2 = new sql.Request();
    getE2ENodeInformation_fulfill = await request2
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "new_basic_zz_newprod",
        sql.VarChar,
        multiSelect(globalFilter["New Basic"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_Fulfill_Geomap_Nodes");
    // handleEmptyResponse([
    //   getE2ENodeInformation.recordsets,
    //   getE2ENodeInformation_make.recordsets,
    //   getE2ENodeInformation_fulfill.recordsets
    // ])
    const response = await sufficiencyRepository.getE2ENodeInformation(
      getE2ENodeInformation.recordsets,
      getE2ENodeInformation_make.recordsets,
      getE2ENodeInformation_fulfill.recordsets
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get E2E Node Information values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2EConnections = async (req, res, next) => {
  try {
    let filter = JSON.parse(JSON.stringify(req.body).toLowerCase());
    // console.log("filter: ", filter);
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    getE2ENodeConnections = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_Source_Geomap_Connections");

    // console.log(
    //   "records: ",
    //   getE2ENodeConnections.recordset
    // );

    const request1 = new sql.Request();
    getE2ENodeConnections_fulfill = await request1
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "subCategory",
        sql.VarChar,
        multiSelect(globalFilter["SubCategory"])
      )
      .input("brand", sql.VarChar, multiSelect(globalFilter["Brand"]))
      .input("division", sql.VarChar, multiSelect(globalFilter["Division"]))
      .input("item4", sql.VarChar, multiSelect(globalFilter["Item4"]))
      .input("item6", sql.VarChar, multiSelect(globalFilter["Item6"]))
      .input("item9", sql.VarChar, multiSelect(globalFilter["Item9"]))
      .input(
        "itemDes",
        sql.VarChar,
        multiSelect(globalFilter["Item Description"])
      )
      .input(
        "ProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Product Line"])
      )
      .input(
        "SubProductLine",
        sql.VarChar,
        multiSelect(globalFilter["Sub Product Line"])
      )
      .input("hero", sql.VarChar, multiSelect(globalFilter["Hero"]))
      .input(
        "setIndicator",
        sql.VarChar,
        multiSelect(globalFilter["Set Indicator"])
      )
      .input("size", sql.VarChar, multiSelect(globalFilter["Product Size"]))
      .input(
        "productform",
        sql.VarChar,
        multiSelect(globalFilter["Product form"])
      )
      .input(
        "majorInvType",
        sql.VarChar,
        multiSelect(globalFilter["Major Inventory Type"])
      )
      .input(
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
      )
      .input(
        "subInvType",
        sql.VarChar,
        multiSelect(globalFilter["Sub Inventory Description"])
      )
      .input("abcd", sql.VarChar, multiSelect(globalFilter["ABCD"]))
      .input(
        "demandtype",
        sql.VarChar,
        multiSelect(globalFilter["Demand Type"])
      )
      .input(
        "new_basic_zz_newprod",
        sql.VarChar,
        multiSelect(globalFilter["New Basic"])
      )
      .input(
        "salesRegion",
        sql.VarChar,
        multiSelect(globalFilter["Sales Region"])
      )
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
      .execute("get_fulfill_Geomap_Connections");

    // console.log("records: ", getE2ENodeConnections_fulfill.recordset.length);
    // console.log("aa", getE2ENodeConnections.recordsets);
    // console.log("bb", getE2ENodeConnections_fulfill.recordset[0])
    // handleEmptyResponse([
    //   getE2ENodeConnections.recordsets[0],
    //   getE2ENodeConnections_fulfill.recordsets[0]
    // ])
    const response = await sufficiencyRepository.getE2EConnections(
      getE2ENodeConnections.recordsets,
      getE2ENodeConnections_fulfill.recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get E2E Connections values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

function handleEmptyResponse(responseArrOrrStr) {
  if (!responseArrOrrStr) {
    const error = new Error();
    error.message = "Internal Server Error";
    error.code = constants.HTTP_500;
    throw error;
  } else if (Array.isArray(responseArrOrrStr)) {
    let length = responseArrOrrStr.length;
    let count = 0;
    for (let i = 0; i < responseArrOrrStr.length; i++) {
      const element = responseArrOrrStr[i];
      if (element.length == 0) {
        count++;
      }
    }
    if (length == count) {
      const error = new Error();
      error.message = "No Content";
      error.code = constants.HTTP_204;
      throw error;
      // return true;
    } else {
      return false;
    }
  } else if (responseArrOrrStr?.length == 0) {
    const error = new Error();
    error.message = "No Content";
    error.code = constants.HTTP_204;
    throw error;
  } else {
    return false;
  }
}

// function handleEmptyResponseData(data) {
//   if(!data){
//     const error = new Error();
//     error.message = "No Content";
//    error.code = constants.HTTP_204;
//     throw error;
//   }

// if(isObject(data)){
//   let count = 0;
//   for (const [key, value] of Object.entries(data)) {
//     count++;
//   }
//   for (const [key, value] of Object.entries(data)) {

//   }

// }

// }

// function isObject(val) {
//   if (val === null) { return false;}
//   return ( (typeof val === 'function') || (typeof val === 'object') );
// }
