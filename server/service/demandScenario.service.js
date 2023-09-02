const demandScenarioRepository = require("../repository/demandScenario.repository");
const sql = require("mssql");
const constants = require("../config/constants");
const downloadAndConvertToExcel = require('../helper/downloadAndConvertToExcel')
//const globalFilter = req.body.globalFilter;

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
function convertFYYear(year) {
  let modifiedYear = null;
  if (year) {
    if (year.length == 4 && year.includes("FY")) {
      modifiedYear = parseInt(`20${year.split("").splice(2).join("")}`);
    }
    if (year.length == 6 && year.includes("FY")) {
      modifiedYear = parseInt(`${year.split("").splice(2).join("")}`);
    }
  }
  return modifiedYear;
}

function isNumber(val) {
  return !isNaN(parseInt(val)) ? Number(val) : null;
}

module.exports.nudgeDVal = async (req, res, next) => {
  try {
    const request = new sql.Request();
    sourceFY22Records = await request.execute("Get_DemandScenario_Alerts");

    const response = await demandScenarioRepository.getnudgeDValValues(
      sourceFY22Records.recordsets[0]
    );
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getFamilyUpsideDownside = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let year = req.query.year;
    if (year?.includes("FY")) {
      year = convertFYYear(year);
    }
    let quarter = req.query.quarter;
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;

    const getFamilyUpsideDownsideUnits = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getFamilyUpsideDownside = request
      .input("offset", sql.Int, offsetBy)
      .input("numberOfRecords", sql.Int, sizeOf)
      .input("year", sql.Int, isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("IsUnitsorRevenue", sql.VarChar, "units")
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Family_code_upside_downside");
      resolve(getFamilyUpsideDownside);
    });
    const getFamilyUpsideDownsideReveue = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getFamilyUpsideDownside = request
      .input("offset", sql.Int, offsetBy)
      .input("numberOfRecords", sql.Int, sizeOf)
      .input("year", sql.Int, isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("IsUnitsorRevenue", sql.VarChar, "revenue")
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Family_code_upside_downside");
      resolve(getFamilyUpsideDownside);
    });
    let aggResponse = await Promise.all([
      getFamilyUpsideDownsideUnits,
      getFamilyUpsideDownsideReveue,

    ]).catch(function (err) {
      throw err;
    });


    // console.log("getFamilyUpsideDownside: ", recordsets.recordsets[0].length);

    const output = await demandScenarioRepository.getFamilyUpsideDownside(
      aggResponse[0].recordset,
      aggResponse[1].recordset,
      false
    );
    const response = {};
    response.statusCode = constants.HTTP_200;
    response.message =
      "Success: demand scenario family code upside downside values";
    response.data = output;
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getFamilyUpsideDownsideDownload = async (req, res, next) => {
  try {
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let year = req.query.year;
    if (year?.includes("FY")) {
      year = convertFYYear(year);
    }
    let quarter = req.query.quarter;
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;

    const getFamilyUpsideDownsideUnits = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getFamilyUpsideDownside = request
      .input("offset", sql.Int, 0)
      .input("numberOfRecords", sql.Int, 17500)
      .input("year", sql.Int, isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("IsUnitsorRevenue", sql.VarChar, "units")
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Family_code_upside_downside");
      resolve(getFamilyUpsideDownside);
    });
    const getFamilyUpsideDownsideReveue = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getFamilyUpsideDownside = request
      .input("offset", sql.Int, 0)
      .input("numberOfRecords", sql.Int, 17500)
      .input("year", sql.Int, isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("IsUnitsorRevenue", sql.VarChar, "revenue")
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Family_code_upside_downside");
      resolve(getFamilyUpsideDownside);
    });
    let aggResponse = await Promise.all([
      getFamilyUpsideDownsideUnits,
      getFamilyUpsideDownsideReveue,

    ]).catch(function (err) {
      throw err;
    });


    // console.log("getFamilyUpsideDownside: ", recordsets.recordsets[0].length);

    const output = await demandScenarioRepository.getFamilyUpsideDownside(
      aggResponse[0].recordset,
      aggResponse[1].recordset,
      true
    );

    const response = {};
    response.statusCode = constants.HTTP_200;
    response.message =
      "Success: demand scenario family code upside downside values";
    response.data = await downloadAndConvertToExcel(output);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getStrategicDemandSignal = async (req, res, next) => {
  try {
    let year = req.query.year !== "null" ? req.query.year : null;

    let quarter = req.query.quarter != "null" ? req.query.quarter : null;
    if (year?.includes("FY")) {
      year = convertFYYear(year);
    }
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    strategicDemandSignalData = await request
      .input("year", isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_strategic_demand_signal");
    // console.log("getFamilyUpsideDownside: ", strategicDemandSignalData);

    const output = await demandScenarioRepository.getStrategicDemandSignal(
      strategicDemandSignalData.recordsets[0]
    );
    const response = {};
    response.statusCode =
      output.units["Actual Shipments"].length > 0 ? constants.HTTP_200 : 204;
    response.message =
      "Success: demand scenario strategic demand signal values";
    response.data = output;
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getGrowthRateReconciliation = async (req, res, next) => {
  try {
    let year = req.query.year !== "null" ? req.query.year : null;
    let quarter = req.query.quarter != "null" ? req.query.quarter : null;
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    if (year?.includes("FY")) {
      year = convertFYYear(year);
    }
    growthRateReconciliationData = await request
      .input("year", isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Growth_Rate_Reconciliation");
    // console.log("growthRateReconciliationData: ", growthRateReconciliationData);

    const output = await demandScenarioRepository.getGrowthRateReconciliation(
      growthRateReconciliationData.recordsets[0]
    );
    const response = {};
    response.statusCode =
      output.units[0].brandAmbitionFY23.length > 0 ? constants.HTTP_200 : 204;
    response.message = "Success: demand scenario growth reconciliation values";
    response.data = output;
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.getUpsideDownside = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    let year = req.query.year !== "null" ? req.query.year : null;
    let quarter = req.query.quarter != "null" ? req.query.quarter : null;
    if (year?.includes("FY")) {
      year = convertFYYear(year);
    }
    getUpsideDownside = await request
      .input("year", sql.Int, isNumber(year))
      .input("quarter", sql.VarChar, multiSelect(quarter))
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
        "invType",
        sql.VarChar,
        multiSelect(globalFilter["Inventory Description"])
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
      .execute("Get_DemandScenario_Upside_Downside");

    //console.log("dd", getUpsideDownside.recordsets[0])
    const response = await demandScenarioRepository.getUpsideDownside(
      getUpsideDownside.recordsets[0]
    );
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};
