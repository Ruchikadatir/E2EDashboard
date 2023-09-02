const responsivenessRepository = require("../repository/responsiveness.repository");
const sql = require("mssql");
const constants = require("../config/constants");


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

module.exports.getProductionSites = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    // let sizeOf = req.query.size || 1000;
    // let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    const getProductionSitesValues = new Promise((resolve, reject) => {
      const request = new sql.Request();
      const getProductionSites = request
        // .input("offset", sql.Int, offsetBy)
        // .input("numberOfRecords", sql.Int, sizeOf)
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
          "materialDes",
          sql.VarChar,
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_by_Region_of_Source");

      resolve(getProductionSites);
    });

    const getMakeToSaleProductionSitesValues = new Promise(
      (resolve, reject) => {
        const request = new sql.Request();
        const getMakeToSaleProductionSites = request
          // .input("offset", sql.Int, offsetBy)
          // .input("numberOfRecords", sql.Int, sizeOf)
          .input("year", sql.Int, isNumber(globalFilter["year"]))
          // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
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
          // .input(
          //   "materialDes",
          //   sql.VarChar,
          //   multiSelect(globalFilter["Material Description"])
          // )
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
            "itemDes",
            sql.VarChar,
            multiSelect(globalFilter["Material Description"])
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
          .execute("get_Regionalization_Make_to_Sale_by_Region_of_Sales");

        resolve(getMakeToSaleProductionSites);
      }
    );

    await Promise.all([
      getProductionSitesValues,
      getMakeToSaleProductionSitesValues,
    ])
      .then(async (values) => {
        const sourceData = {
          ProductionSitesValues: values[0].recordsets[0],
          MakeToSaleProductionSitesValues: values[1].recordsets[0],
        };

        // const isEmpty = handleEmptyResponse([
        //   sourceData.ProductionSitesValues,
        //   sourceData.MakeToSaleProductionSitesValues,
        // ]);
        // if (!isEmpty) {
        return await responsivenessRepository.getProductionSites(
          sourceData?.ProductionSitesValues,
          sourceData?.MakeToSaleProductionSitesValues
        );
        // } else {
        //   const response = {};
        //   response.statusCode = constants.HTTP_204;
        //   response.message = "No Data Found";
        //   return response;
        // }
      })
      .then((response) => {
        response.statusCode = constants.HTTP_200;
        response.message = "Success: Production Site information";
        return res.json(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  } catch (error) {
    res.json(error);
  }
};

module.exports.getRegionalizationPercentage = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;
    const SourceToMakeIngredients = new Promise((resolve, reject) => {
      const request = new sql.Request();
      sourceToMakeIngredients = request
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
          "materialDes",
          sql.VarChar,
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_Source_to_Make_Ingredients");
      resolve(sourceToMakeIngredients);
    });

    const SourceToMakeComponents = new Promise((resolve, reject) => {
      const request = new sql.Request();
      sourceToMakeComponent = request
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
          "materialDes",
          sql.VarChar,
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_Source_to_Make_Components");
      resolve(sourceToMakeComponent);
    });

    const MakeToSaleFERT = new Promise((resolve, reject) => {
      const request = new sql.Request();
      makeToSaleF = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
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
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_Make_to_Sale_FERT");
      resolve(makeToSaleF);
    });

    const MakeToSaleHALB = new Promise((resolve, reject) => {
      const request = new sql.Request();
      makeToSaleH = request
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        // .input("quarter", sql.VarChar, multiSelect(globalFilter["quarter"]))
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
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_Make_to_Sale_HALB");
      resolve(makeToSaleH);
    });

    let aggResponse = await Promise.all([
      SourceToMakeIngredients,
      SourceToMakeComponents,
      MakeToSaleFERT,
      MakeToSaleHALB,
    ]);
    const regionalizationPerOutput =
      await responsivenessRepository.getRegionalizationPercentage(
        aggResponse[0].recordsets[0],
        aggResponse[1].recordsets[0],
        aggResponse[2].recordsets[0],
        aggResponse[3].recordsets[0]
      );

    const response = {};
    response.statusCode = constants.HTTP_200;
    response.message = "Success: Regionalization Percentage information";
    response.data = regionalizationPerOutput;
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports.getRegionalizationByMaterialGroup = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;

    const getRegionalizationByMaterialGroup = new Promise((resolve, reject) => {
      const getRegionalizationByMaterialGroup = request
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
          "materialDes",
          sql.VarChar,
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_by_Material_Group");

      resolve(getRegionalizationByMaterialGroup);
    });

    const requestTwo = new sql.Request();
    const getMakeToSourceData = new Promise((resolve, reject) => {
      const getMakeToSourceData = requestTwo
        .input("year", sql.Int, isNumber(globalFilter["year"]))
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
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
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
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .execute("[get_Regionalization_Make_to_Sale_by_Priority_Subcategory]");

      resolve(getMakeToSourceData);
    });

    await Promise.all([getRegionalizationByMaterialGroup, getMakeToSourceData])
      .then(async (values) => {
        // console.log("getMakeToSourceData:", values[1].recordsets[0]);
        const sourceData = {
          getRegionalizationByMaterialGroup: values[0].recordsets[0],
          getMakeToSourceData: values[1].recordsets[0],
        };
        //const isEmpty = handleEmptyResponse([
        //   sourceData.getRegionalizationByMaterialGroup,
        //   sourceData.getMakeToSourceData,
        // ]);
        // if (!isEmpty) {
        return await responsivenessRepository.getRegionalizationByMaterialGroup(
          sourceData
        );
        // } else {
        //   const response = {};
        //   response.statusCode = constants.HTTP_204;
        //   response.message = "No Data Found";
        //   return response;
        // }
      })
      .then((val) => {
        const response = {};
        response.statusCode = constants.HTTP_200;
        response.message =
          "Success: Regionalization Material Group information";
        response.data = val;
        // res.json(response);
        return res.json(response);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  } catch (error) {
    res.json(error);
  }
};

module.exports.regionalizationByMaterial = async (req, res, next) => {
  try {

    const globalFilter = req.body.globalFilter;
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;

    const getRegionalizationByMaterialSaleToMakeComp = new Promise(
      (resolve, reject) => {
        const request = new sql.Request();
       let getRegionalizationByMaterialSaleComp = request
          .input("offset", sql.Int, offsetBy)
          .input("numberOfRecords", sql.Int, sizeOf)
          .input("year", sql.Int, isNumber(globalFilter["year"]))
          .input("Material_Type", sql.VarChar, "Components")
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
            "materialDes",
            sql.VarChar,
            multiSelect(globalFilter["Material Description"])
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
          .execute("get_Regionalization_by_Material");

        resolve(getRegionalizationByMaterialSaleComp);
      }
    );

    const getRegionalizationByMaterialSourceToMakeIng = new Promise(
      (resolve, reject) => {
        const request = new sql.Request();
        let getRegionalizationByMaterialIng = request
          .input("offset", sql.Int, offsetBy)
          .input("numberOfRecords", sql.Int, sizeOf)
          .input("year", sql.Int, isNumber(globalFilter["year"]))
          .input("Material_Type", sql.VarChar, "Ingredients")
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
            "materialDes",
            sql.VarChar,
            multiSelect(globalFilter["Material Description"])
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
          .execute("get_Regionalization_by_Material");

        resolve(getRegionalizationByMaterialIng);
      }
    );

    await Promise.all([getRegionalizationByMaterialSaleToMakeComp, getRegionalizationByMaterialSourceToMakeIng])
      .then(async (values) => {
        const sourceData = {
          getRegionalizationByMaterialSaleToMakeComp: values[0].recordsets[0],
          getRegionalizationByMaterialSourceToMakeIng: values[1].recordsets[0],
        };

        return await responsivenessRepository.getRegionalizationByMaterial(
          sourceData,
          isNumber(globalFilter["year"])
        );
      })
      .then((response) => {
        response.statusCode = constants.HTTP_200;
        response.message = "Success: Regionalization By Material information";
        return res.json(response);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    res.json(error);
  }
};

module.exports.regionalizationByFinishedGoods = async (req, res, next) => {
  try {

    const globalFilter = req.body.globalFilter;
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    let getRegionalizationByMaterialmakeToSaleAll = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getRegionalizationByMaterialmakeToSale = request
        .input("offset", sql.Int, offsetBy)
        .input("numberOfRecords", sql.Int, sizeOf)
        .input("year", sql.Int, isNumber(globalFilter["year"]))
        .input(
          "majorcategory",
          sql.VarChar,
          multiSelect(globalFilter["Major Category"])
        )
        .input("Product_Type", sql.VarChar, "ALL")
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
          "salesregion",
          sql.VarChar,
          multiSelect(globalFilter["Sales Region"])
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
          "priority_subcategories",
          sql.VarChar,
          multiSelect(globalFilter["Priority Subcategory"])
        )
        .execute("get_Regionalization_Make_to_Sale_by_Finished_Goods");

      resolve(getRegionalizationByMaterialmakeToSale);
    });

    let getRegionalizationByMaterialmakeToSaleFert = new Promise((resolve, reject) => {
      const request = new sql.Request();
      getRegionalizationByMaterialmakeToSale = request
       .input("offset", sql.Int, offsetBy)
       .input("numberOfRecords", sql.Int, sizeOf)
       .input("year", sql.Int, isNumber(globalFilter["year"]))
       .input(
         "majorcategory",
         sql.VarChar,
         multiSelect(globalFilter["Major Category"])
       )
       .input("Product_Type", sql.VarChar, "FERT")
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
         "salesregion",
         sql.VarChar,
         multiSelect(globalFilter["Sales Region"])
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
         "priority_subcategories",
         sql.VarChar,
         multiSelect(globalFilter["Priority Subcategory"])
       )
       .execute("get_Regionalization_Make_to_Sale_by_Finished_Goods");

     resolve(getRegionalizationByMaterialmakeToSale);
   });

   let getRegionalizationByMaterialmakeToSaleHalb = new Promise((resolve, reject) => {
    const request = new sql.Request();
    getRegionalizationByMaterialmakeToSale = request
     .input("offset", sql.Int, offsetBy)
     .input("numberOfRecords", sql.Int, sizeOf)
     .input("year", sql.Int, isNumber(globalFilter["year"]))
     .input(
       "majorcategory",
       sql.VarChar,
       multiSelect(globalFilter["Major Category"])
     )
     .input("Product_Type", sql.VarChar, "HALB")
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
       "salesregion",
       sql.VarChar,
       multiSelect(globalFilter["Sales Region"])
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
       "priority_subcategories",
       sql.VarChar,
       multiSelect(globalFilter["Priority Subcategory"])
     )
     .execute("get_Regionalization_Make_to_Sale_by_Finished_Goods");

   resolve(getRegionalizationByMaterialmakeToSale);
 });

    await Promise.all([getRegionalizationByMaterialmakeToSaleAll, getRegionalizationByMaterialmakeToSaleFert, getRegionalizationByMaterialmakeToSaleHalb])
      .then(async (values) => {

        const sourceData = {
          getRegionalizationByMaterialmakeToSaleAll: values[0].recordsets[0],
          getRegionalizationByMaterialmakeToSaleFert: values[1].recordsets[0],
          getRegionalizationByMaterialmakeToSaleHalb: values[2].recordsets[0],
        };

        return await responsivenessRepository.regionalizationByFinishedGoods(
          sourceData
        );
      })
      .then((response) => {
        response.statusCode = constants.HTTP_200;
        response.message =
          "Success: regionalizationByFinishedGoods information";
        return res.json(response);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    res.json(error);
  }
};

module.exports.finishedGoodsBom = async (req, res, next) => {
  try {
    const request = new sql.Request();
    const globalFilter = req.body.globalFilter;
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;
    const getFinishedGoodsBom = new Promise((resolve, reject) => {
      const getFinishedGoodsBom = request
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
          "materialDes",
          sql.VarChar,
          multiSelect(globalFilter["Material Description"])
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
        .execute("get_Regionalization_by_Finished_Goods");

      resolve(getFinishedGoodsBom);
    });

    await Promise.all([getFinishedGoodsBom])
      .then(async (values) => {

        const sourceData = {
          getFinishedGoodsBom: values[0].recordsets[0],
        };

        // const isEmpty = handleEmptyResponse([sourceData.getFinishedGoodsBom]);
        // console.log(isEmpty)
        // if (!isEmpty) {
        return await responsivenessRepository.getFinishedGoodsBom(
          sourceData?.getFinishedGoodsBom
        );
        // } else {
        //   const response = {};
        //   response.statusCode = constants.HTTP_204;
        //   response.message = "No Data Found";
        //   return response;
        // }
      })
      .then((response) => {
        response.statusCode = constants.HTTP_200;
        response.message = "Success: Finished Goods Bom information";
        return res.json(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  } catch (error) {
    res.json(error);
  }
};


// function handleEmptyResponse(responseArrOrrStr) {
//   if (Array.isArray(responseArrOrrStr)) {
//     let length = responseArrOrrStr.length;
//     let count = 0;
//     for (let i = 0; i < responseArrOrrStr.length; i++) {
//       const element = responseArrOrrStr[i];
//       if (element.length == 0) {
//         count++;
//       }
//     }
//     if (length == count) {
//       return true;
//     }
//   } else if (responseArrOrrStr?.length == 0) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function handleEmptyResponse(responseArrOrrStr) {
//   if (!responseArrOrrStr) {
//     const error = new Error();
//     error.message = "Internal Server Error";
//     error.code = constants.HTTP_500;
//     throw error;
//   } else if (Array.isArray(responseArrOrrStr)) {
//     let length = responseArrOrrStr.length;
//     let count = 0;
//     for (let i = 0; i < responseArrOrrStr.length; i++) {
//       const element = responseArrOrrStr[i];
//       if (element.length == 0) {
//         count++;
//       }
//     }
//     if (length == count) {
//       const error = new Error();
//       error.message = "No Content";
//       error.code = constants.HTTP_204;
//       throw error;
//       // return true;
//     } else {
//       return false;
//     }
//   } else if (responseArrOrrStr?.length == 0) {
//     const error = new Error();
//     error.message = "No Content";
//     error.code = constants.HTTP_204;
//     throw error;
//   } else {
//     return false;
//   }
// }
