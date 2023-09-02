const leadTimeRepository = require("../repository/leadTime.repository");
const sql = require("mssql");
const Gremlin = require("gremlin");
const constants = require("../config/constants");
const MATNRs = require("../config/leadTimeBreakDown.json");
const config = require("../config/data/config.json");

module.exports.BreakDownTest = async (req, res, next) => {
  try {
    const KEY =
      "Oy3yh0kvaMbEN3YL07hvnMHkh66mww3lX0z9NCgwBzn2GkWADeBPT4F0eTCojRbPpCWX1aPCJhx1cVKCU4slRA==";

    const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
      "/dbs/" + "SC_Navigator" + "/colls/" + "E2ENetworkV1",

      KEY
    );

    const client = new Gremlin.driver.Client(
      "wss://cosdb-am-eastus-prod-sbx.gremlin.cosmos.azure.com:443/",

      {
        authenticator: authenticator,
        traversalsource: "g",

        mimeType: "application/vnd.gremlin-v2.0+json",

        rejectUnauthorized: true,
      }
    );

    function countVertices(matnr) {
      //   console.log("matnr: ", matnr);
      return client.submit(
        config.GREMLIN_E2ELEADTIMEBREAKDOWN.replaceAll("MATNR", matnr)
      );
    }

    async function forFunction() {
      const arrayOFMatnr = MATNRs.testMATNR;
      let output = [];

      arrayto = arrayOFMatnr.slice(0, 17000);
      for (i = 0; i < arrayto.length; i++) {
        if (i == 0) {
          timeStart = Date.now();
          console.log("Start time: ", timeStart);
        }
        data = await countVertices(arrayto[i]);
        data1 = JSON.stringify(data); //JSON.parse(
        dataNEw = data._items.map((obj) => {
          return Object.values(obj);
        });
        console.log(`data [${i}], arrayto[i]:  ${data.length}`);
        const sqlInsertQuery = `INSERT INTO [dbo].[cosmos_extract_lead_time] 
        ([MATNR]
          ,[MAJOR_CATEGORY]
          ,[BRAND]
          ,[PLANT_ID]
          ,[MK_GRT]
          ,[MK_TMLT]
          ,[SRC_TSLT]
          ,[SRC_SLT]
          ,[SRC_TLT]
          ,[SRC_GRT]
      ,[LAST_DC]
      ,[SALES_REGION]
          ,[FLT]) VALUES ${JSON.stringify(dataNEw)
            .replaceAll("[", "(")
            .replaceAll("]", ")")
            .replaceAll('"', "'")
            .substring(0, JSON.stringify(dataNEw).length - 1)
            .substring(1)}`;
        // console.log("Query: ", sqlInsertQuery);

        let nudgeRegionalizationValues = await sql.query(
          sqlInsertQuery,
          // [JSON.stringify(dataNEw)],
          (err, rows) => {
            if (err) console.log(err);
            console.log("All Rows Inserted", rows);
          }
        );
        if (i == arrayto.length - 1) {
          timeEnd = Date.now() - timeStart;
          console.log(
            "Time Taken: ",
            Math.floor(timeEnd / 1000),
            " secs",
            "Number of MATNR: ",
            i + 1
          );
        }
        output.push(...data);
      }

      console.log("total output: ", output.length);
      return output;
    }

    client
      .open()

      .then(forFunction)

      .catch((error) => {
        console.error("Error running query....");

        console.log(error);
      })

      .then((res) => {
        client.close();
        console.log("End Time: ", Date.now());
        res.json(arrayto);
      })
      .catch((error) => console.error("Fatal error:", error));
  } catch (error) {
    next(error);
  }
};

module.exports.materialCode = async (req, res, next) => {
  try {
    materialCodeRecords =
      await sql.query`SELECT distinct(MATNR), ITEM_DESCRIPTION FROM [dbo].[global_filters_mapping_table]`;

    const response = await leadTimeRepository.getMaterialCodeValues(
      materialCodeRecords.recordset
    );
    if (response) {
      response.statusCode = constants.HTTP_200;
      response.message = "get material Code values";
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.nudgesValues = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;
    const request = new sql.Request();
    const nudgeRegionalizationValues = new Promise((resolve, reject) => {
      const request = new sql.Request();

      let nudgeRegionalizationValues = request.execute(
        "get_Regionalization_Make_to_Sale_Alert"
      );
      resolve(nudgeRegionalizationValues);
    });

    const nudgeLeadtimeValues = new Promise((resolve, reject) => {
      const request = new sql.Request();

      let nudgeLeadtimeValues = request
        .input("year", sql.Int, 2023)
        .execute("get_E2E_LT_BY_FG_Alerts");
      resolve(nudgeLeadtimeValues);
    });

    let aggResponse = await Promise.all([
      nudgeRegionalizationValues,
      nudgeLeadtimeValues,
    ]).catch(function (err) {
      throw err;
    });

    const response = await leadTimeRepository.getNudgeValues(
      aggResponse[0].recordset,
      aggResponse[1].recordset
    );
    response.statusCode = constants.HTTP_200;
    response.message = "get Nudge values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getNodeChartValues = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;
    const request = new sql.Request();
    console.log("flag: ", req.query.flag);

    getNodeChartValues = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input(
        "matnr",
        sql.VarChar,
        multiSelect(globalFilter["matnr"]) || "62YM010000"
      )
      .input("matnrdesc", sql.VarChar, multiSelect(globalFilter["matnrdesc"]))
      .execute("get_LT_Node_Chart");
    if (req.query.flag == "sql") {
      const response = await leadTimeRepository.getNodeChartValues(
        getNodeChartValues.recordsets[0]
      );
      response.statusCode = constants.HTTP_200;
      response.message = "getNodeChartValues values";
      return res.json(response);
    } else {
      const KEY =
        "Oy3yh0kvaMbEN3YL07hvnMHkh66mww3lX0z9NCgwBzn2GkWADeBPT4F0eTCojRbPpCWX1aPCJhx1cVKCU4slRA==";

      const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
        "/dbs/" + "SC_Navigator" + "/colls/" + "E2ENetworkV1",

        KEY
      );
      const client = new Gremlin.driver.Client(
        "wss://cosdb-am-eastus-prod-sbx.gremlin.cosmos.azure.com:443/",

        {
          authenticator: authenticator,
          traversalsource: "g",

          mimeType: "application/vnd.gremlin-v2.0+json",

          rejectUnauthorized: true,
        }
      );

      function countVertices(matnr, query, plants) {
        if (plants) {
          return client.submit(
            query.replaceAll("MATNR", matnr).replaceAll("PLANTS", plants)
          );
        } else {
          return client.submit(query.replaceAll("MATNR", matnr));
        }
      }

      async function forFunction() {
        sourceToMakeDataMid = await countVertices(
          globalFilter["matnr"] || "62YM010000",
          config.GREMLIN_NODECHART_MAKE_TO_FULFILL_LINK_MID_QUERY
        );
        sourceToMakeData = await countVertices(
          globalFilter["matnr"] || "62YM010000",
          config.GREMLIN_NODECHART_SOURCE_TO_MAKE_LINK,
          JSON.stringify(sourceToMakeDataMid._items.map((a) => a.plant_id))
            .replaceAll("[", "")
            .replaceAll("]", "")
            .replaceAll('"', "'")
        );

        makeToFulfillData = await countVertices(
          globalFilter["matnr"] || "62YM010000",
          config.GREMLIN_NODECHART_MAKE_TO_FULFILL_LINK
        );

        // console.log(
        //   "total output: ",
        //   // output.length,
        //   sourceToMakeData,
        //   makeToFulfillData
        // );
        return {
          // nodes: output,
          sourceToMake: sourceToMakeData || null,
          makeTofulfill: makeToFulfillData || null,
        };
      }

      client
        .open()

        .then(forFunction)

        .catch((error) => {
          console.error("Error running query....");

          console.log(error);
        })

        .then(async (dataRes) => {
          client.close();
          console.log("End Time: ", Date.now());
          if ( dataRes &&
            dataRes.sourceToMake &&
            dataRes.makeTofulfill &&
            getNodeChartValues.recordset) {
            let response = {};
            response = await leadTimeRepository.getNodeChartValuesGraphDB(
              dataRes.sourceToMake._items,
              dataRes.makeTofulfill._items,
              getNodeChartValues.recordset
            );
            // response.data = dataresponse;

            response.statusCode = constants.HTTP_200;
            response.message = "getNodeChartValues values";
            return res.json(response);
          } else {
            return res.json({
              statusCode: 204,
              message: "Data not found",
            });
          }
        })
        .catch((error) => console.error("Fatal error:", error));
    }
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2eLeadTimeBreakDownValues = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;

    const request = new sql.Request();

    getE2eLeadTimeBreakDownValues = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))

      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
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
      .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))

      .execute("[get_E2E_LT_Breakdown]");

    const response = await leadTimeRepository.getE2eLeadTimeBreakDownValues(
      getE2eLeadTimeBreakDownValues.recordsets[0]
    );
    response.statusCode = constants.HTTP_200;
    response.message = "getE2eLeadTimeBreakDown  values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.getE2eLeadTimeDistributionValues = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;

    const request = new sql.Request();

    getE2eLeadTimeDistributionValues = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
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
      .input("newBasic", sql.VarChar, multiSelect(globalFilter["New Basic"]))

      .execute("[get_E2E_LT_Distribution]");

    const response = await leadTimeRepository.getE2eLeadTimeDistributionValues(
      getE2eLeadTimeDistributionValues.recordsets[0]
    );

    response.statusCode = constants.HTTP_200;
    response.message = "getE2eLeadTimeDistribution  values";
    res.json(response);
  } catch (error) {
    res.json({
      message: "Failure",
      data: `${error}`,
    });
  }
};

module.exports.e2eLeadTimeDistributionByPrioritySubCategory = async (
  req,
  res,
  next
) => {
  try {
    const globalFilter = req.body.globalFilter;
    const request = new sql.Request();

    e2eLeadTimeDistributionByPrioritySubCategory = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .execute("[get_WT_AVG_LT_Priority_Sub_Distribution]");

    const response =
      await leadTimeRepository.getE2eLeadTimeDistributionByPrioritySubCategoryValues(
        e2eLeadTimeDistributionByPrioritySubCategory.recordsets[0]
      );

    response.statusCode = constants.HTTP_200;
    response.message =
      "getE2eLeadTimeDistributionByPrioritySubCategory  values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.e2eLeadTimeDistributionBySalesRegion = async (
  req,
  res,
  next
) => {
  try {
    const globalFilter = req.body.globalFilter;
    const request = new sql.Request();

    e2eLeadTimeDistributionBySalesRegion = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .execute("[get_WT_AVG_LT_Sales_Region_Distribution]");

    const response =
      await leadTimeRepository.getE2eLeadTimeDistributionBySalesRegionValues(
        e2eLeadTimeDistributionBySalesRegion.recordsets[0]
      );
    response.statusCode = constants.HTTP_200;
    response.message = "getE2eLeadTimeDistributionBySalesRegion  values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.e2eLeadTimeDistributionByBrand = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;
    const request = new sql.Request();

    e2eLeadTimeDistributionByBrand = await request
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .execute("[get_WT_AVG_LT_Brand_Distribution]");

    const response =
      await leadTimeRepository.getE2eLeadTimeDistributionByBrandValues(
        e2eLeadTimeDistributionByBrand.recordsets[0]
      );

    response.statusCode = constants.HTTP_200;
    response.message = "getE2eLeadTimeDistributionByBrand  values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

module.exports.e2eLeadTimeByFinishedGoods = async (req, res, next) => {
  try {
    const globalFilter = req.body.globalFilter;
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;

    const getE2eLeadTimeByFinishedGoodsUnits = new Promise(
      (resolve, reject) => {
        const request = new sql.Request();
        getE2eLeadTimeByFinishedGoods = request
          .input("offset", sql.Int, offsetBy)
          .input("FilterType", sql.VarChar, "units")
          .input("numberOfRecords", sql.Int, sizeOf)
          .input("year", sql.Int, isNumber(globalFilter["year"]))
          .input(
            "majorcategory",
            sql.VarChar,
            multiSelect(globalFilter["Major Category"])
          )
          .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
          .input(
            "priority_subcategories",
            sql.VarChar,
            multiSelect(globalFilter["Priority Subcategory"])
          )
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
            "newBasic",
            sql.VarChar,
            multiSelect(globalFilter["New Basic"])
          )

          .execute("[get_E2E_LT_BY_FG]");

        resolve(getE2eLeadTimeByFinishedGoods);
      }
    );

    const getE2eLeadTimeByFinishedGoodsRevenue = new Promise(
      (resolve, reject) => {
        const request = new sql.Request();
        getE2eLeadTimeByFinishedGoods = request
          .input("offset", sql.Int, offsetBy)
          .input("FilterType", sql.VarChar, "revenue")
          .input("numberOfRecords", sql.Int, sizeOf)
          .input("year", sql.Int, isNumber(globalFilter["year"]))
          .input(
            "majorcategory",
            sql.VarChar,
            multiSelect(globalFilter["Major Category"])
          )
          .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
          .input(
            "priority_subcategories",
            sql.VarChar,
            multiSelect(globalFilter["Priority Subcategory"])
          )
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
            "newBasic",
            sql.VarChar,
            multiSelect(globalFilter["New Basic"])
          )

          .execute("[get_E2E_LT_BY_FG]");

        resolve(getE2eLeadTimeByFinishedGoods);
      }
    );

    await Promise.all([
      getE2eLeadTimeByFinishedGoodsUnits,
      getE2eLeadTimeByFinishedGoodsRevenue,
    ])
      .then(async (values) => {
        // handleEmptyResponse([values[0].recordsets[0]]);

        const sourceData = {
          getE2eLeadTimeByFinishedGoodsUnits: values[0].recordsets[0],
          getE2eLeadTimeByFinishedGoodsRevenue: values[1].recordsets[0],
        };

        return await leadTimeRepository.getE2eLeadTimeByFinishedGoods(
          sourceData
        );
      })
      .then((val) => {
        val.statusCode = constants.HTTP_200;
        val.message = "get E2e LeadTime By FinishedGoods values";
        return res.json(val);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return next(error);
  }
};

module.exports.e2eSourcingLeadOpportunitiesByMaterial = async (
  req,
  res,
  next
) => {
  try {
    const globalFilter = req.body.globalFilter;

    const request = new sql.Request();
    let sizeOf = req.query.size || 1000;
    let offsetBy = req.query.size * req.query.page - req.query.size || 0;

    getE2eSourcingLeadOpportunitiesByMaterial = await request
      .input("offset", sql.Int, offsetBy)
      .input("numberOfRecords", sql.Int, sizeOf)
      .input("year", sql.Int, isNumber(globalFilter["year"]))
      .input(
        "majorcategory",
        sql.VarChar,
        multiSelect(globalFilter["Major Category"])
      )
      .input("category", sql.VarChar, multiSelect(globalFilter["Category"]))
      .input(
        "priority_subcategories",
        sql.VarChar,
        multiSelect(globalFilter["Priority Subcategory"])
      )
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
      .execute("[get_SRC_LT_Material]");

    const response =
      await leadTimeRepository.getE2eSourcingLeadOpportunitiesByMaterial(
        getE2eSourcingLeadOpportunitiesByMaterial.recordsets[0],
        getE2eSourcingLeadOpportunitiesByMaterial.recordsets[0][0]?.TotalRows
          ? getE2eSourcingLeadOpportunitiesByMaterial.recordsets[0][0]
              ?.TotalRows
          : getE2eSourcingLeadOpportunitiesByMaterial.recordsets[0][1]
              ?.TotalRows
      );
    response.statusCode = constants.HTTP_200;
    response.message = "get E2e Sourcing Lead Opportunities By Material values";
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

function isNumber(val) {
  return !isNaN(parseInt(val)) ? Number(val) : null;
}
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

