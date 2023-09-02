const constants = require("../config/constants");
const sql = require("mssql");
// const mockData = require("../config/mockData.json");

const XLSX = require("xlsx");
var fs = require("fs");
const path = require("path");

module.exports.getFulfillTooltipValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        affiliateFC: [],
        regionalFulfillHub: [],
      };
      sourceData = sourceData.filter((val) => val.Volume !== 0);
      sourceData = sourceData.sort((a, b) => b.Volume - a.Volume);
      const uniqueKeys = [
        ...new Set(sourceData.map((item) => item?.["Sales_Region"])),
      ].filter((item) => item != "" && item != undefined && item != null);
      const fcOrHub = ["Affiliate FC", "regional fulfill Hub"];
      uniqueKeys.forEach((item) => {
        const objOne = {
          node: item,
          "F&A Plant": [],
          "FC Name": [],
          Volume: [],
          "% Total Sales Volume": [],
        };
        const objTwo = {
          node: item,
          "F&A Plant": [],
          "FC Name": [],
          Volume: [],
          "% Total Sales Volume": [],
        };
        for (let i = 0; i < sourceData.length; i++) {
          const element = sourceData[i];
          if (
            element.Sales_Region == item &&
            element.Dest_Type == "Affiliate FC"
          ) {
            objOne["F&A Plant"].push(element.FA_Plant);
            objOne["FC Name"].push(element.FC_Name);
            objOne.Volume.push(element.Volume);
            objOne["% Total Sales Volume"].push(
              element["total_sales_volume_%"]
            );
          }
          if (
            element.Sales_Region == item &&
            element.Dest_Type == "regional fulfill Hub"
          ) {
            objTwo["F&A Plant"].push(element.FA_Plant);
            objTwo["FC Name"].push(element.FC_Name);
            objTwo.Volume.push(element.Volume);
            objTwo[["% Total Sales Volume"]].push(
              element["total_sales_volume_%"]
            );
          }
        }
        response.data.affiliateFC.push(objOne);
        response.data.regionalFulfillHub.push(objTwo);
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getMakeTooltipValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        internalCompounding: [],
        internalFAndA: [],
        TPMCompounding: [],
        TPMFAndA: [],
      };
      sourceData = sourceData.filter(
        (val) => val["Total_Production_Req"] !== 0
      );
      sourceData = sourceData.sort(
        (a, b) => b["Total_Production_Req"] - a["Total_Production_Req"]
      );
      const uniqueKeys = [
        ...new Set(
          sourceData.map((item) => {
            if (
              item?.Plant_Type == "Internal - Compounding" ||
              item?.Plant_Type == "Internal - F&A"
            ) {
              return item?.["DEST_CITY"];
            }
          })
        ),
      ].filter((item) => item != "" && item != undefined && item != null);

      const uniqueKeysRegions = [
        ...new Set(
          sourceData.map((item) => {
            if (
              item?.Plant_Type == "TPM - Compounding" ||
              item?.Plant_Type == "TPM - F&A"
            ) {
              return item?.["Region_Of_Make"];
            }
          })
        ),
      ].filter((item) => item != "" && item != undefined && item != null);

      uniqueKeys.forEach((item) => {
        let objOne = {
          node: item,
          "Plant Name": [],
          Platform: [],
          Technology: [],
          Units: [],
          "Plant Technology Mix": [],
        };
        let objTwo = {
          node: item,
          "Plant Name": [],
          Platform: [],
          Technology: [],
          Units: [],
          "Plant Technology Mix": [],
        };
        // let objThree = {
        //   node: item,
        //   // "node":[],
        //   //platform: [],
        //   // technology: [],
        //   Units: [],
        //   // mixTech: [],
        // };
        // let objFour = {
        //   node: item,
        //   //"node":[],
        //   //platform: [],
        //   // technology: [],
        //   Units: [],
        //   // mixTech: [],
        // };

        for (let i = 0; i < sourceData.length; i++) {
          const element = sourceData[i];

          if (
            element.DEST_CITY == item &&
            element.Plant_Type == "Internal - Compounding"
          ) {
            objOne["Plant Name"].push(element.Plant_Name);
            objOne.Platform.push(element.Platform);
            objOne.Technology.push(element.Technology);
            objOne.Units.push(element.Total_Production_Req);
            objOne["Plant Technology Mix"].push(element["%_Mix_of_Technology"]);
          }

          if (
            element.DEST_CITY == item &&
            element.Plant_Type == "Internal - F&A"
          ) {
            // console.log("hhh", sourceData.length);
            objTwo["Plant Name"].push(element.Plant_Name);
            objTwo.Platform.push(element.Platform);
            objTwo.Technology.push(element.Technology);
            objTwo.Units.push(element.Total_Production_Req);
            objTwo["Plant Technology Mix"].push(element["%_Mix_of_Technology"]);
          }

          // if (
          //   element.Plant_Name == item &&
          //   element.Plant_Type == "TPM - Compounding"
          // ) {
          //   //objThree["Plant Name"].push(element["Plant_Name"]);
          //   // objThree.technology.push(element.Technology);
          //   objThree.Units.push(element.Total_Production_Req);
          //   // objThree.mixTech.push(element["%_Mix_of_Technology"]);
          // }
          // if (element.Plant_Name == item && element.Plant_Type == "TPM - F&A") {
          //   //objFour.platform.push(element["Plant_Name"]);
          //   // objFour.technology.push(element.Technology);
          //   objFour.Units.push(element.Total_Production_Req);
          //   // objFour.mixTech.push(element["%_Mix_of_Technology"]);
          // }
        }

        response.data.internalCompounding.push(objOne);
        response.data.internalFAndA.push(objTwo);
        // response.data.TPMCompounding.push(objThree);
        // response.data.TPMFAndA.push(objFour);
      });

      uniqueKeysRegions.forEach((item) => {
        let objThree = {
          node: item,
          "Plant Name": [],
          // "node":[],
          //platform: [],
          // technology: [],
          Units: [],
          // mixTech: [],
        };
        let objFour = {
          node: item,
          "Plant Name": [],
          //"node":[],
          //platform: [],
          // technology: [],
          Units: [],
          // mixTech: [],
        };
        for (let i = 0; i < sourceData.length; i++) {
          const element = sourceData[i];
          if (
            element.Region_Of_Make == item &&
            element.Plant_Type == "TPM - Compounding" &&
            element.Total_Production_Req !== undefined
          ) {
            //objThree["Plant Name"].push(element["Plant_Name"]);
            // objThree.technology.push(element.Technology);
            objThree.Units.push(element.Total_Production_Req);
            objThree["Plant Name"].push(element.Plant_Name);
            // objThree.mixTech.push(element["%_Mix_of_Technology"]);
          }
          if (
            element.Region_Of_Make == item &&
            element.Plant_Type == "TPM - F&A"
          ) {
            //objFour.platform.push(element["Plant_Name"]);
            // objFour.technology.push(element.Technology);
            objFour.Units.push(element.Total_Production_Req);
            objFour["Plant Name"].push(element.Plant_Name);
            // objFour.mixTech.push(element["%_Mix_of_Technology"]);
          }
        }
        response.data.TPMCompounding.push(objThree);
        response.data.TPMFAndA.push(objFour);
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getMakeMixValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      response.data = {
        regionalMix: [
          // {
          //   category: "EUROPE",
          //   quantity: null,
          //   percentage: null,
          // },
          // {
          //   category: "AMERICAS",
          //   quantity: null,
          //   percentage: null,
          // },
          // {
          //   category: "ASIA",
          //   quantity: null,
          //   percentage: null,
          // },
        ],
        i_e: [
          // {
          //   category: "Internal",
          //   quantity: null,
          //   percentage: null,
          // },
          // {
          //   category: "External",
          //   quantity: null,
          //   percentage: null,
          // },
        ],
        promoMix: [
          // {
          //   category: "Saleable",
          //   quantity: null,
          //   percentage: null,
          // },
          // {
          //   category: "Promotional",
          //   quantity: null,
          //   percentage: null,
          // },
        ],
      };
      //i_e

      const filteredDataForInternal =
        sourceData?.makeMixExternalInternal?.filter(
          (val) => val.Location_Type == "Internal"
        );

      if (
        filteredDataForInternal &&
        Array.isArray(filteredDataForInternal) &&
        filteredDataForInternal?.length > 0
      ) {
        if (
          filteredDataForInternal[0]["&_Mix_Of_External_Internal"] !== 0 ||
          filteredDataForInternal[0] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "Internal";
          obj.percentage =
            filteredDataForInternal[0]["&_Mix_Of_External_Internal"];
          obj.quantity = filteredDataForInternal[0]["Total_Production_Req"];
          response.data.i_e.push(obj);
        }
      }
      const filteredDataForExternal =
        sourceData?.makeMixExternalInternal?.filter(
          (val) => val.Location_Type == "External"
        );
      if (
        filteredDataForExternal &&
        Array.isArray(filteredDataForExternal) &&
        filteredDataForExternal?.length > 0
      ) {
        if (
          filteredDataForExternal[0]["&_Mix_Of_External_Internal"] !== 0 ||
          filteredDataForExternal[0] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "External";
          obj.percentage =
            filteredDataForExternal[0]["&_Mix_Of_External_Internal"];
          obj.quantity = filteredDataForExternal[0]["Total_Production_Req"];
          response.data.i_e.push(obj);
        }
      }

      //promosealable
      const filteredDataForPromo = sourceData.makeMixPromoSaleable.filter(
        (val) => val.Major_Inventory_Type == "Saleable"
      );
      if (
        filteredDataForPromo &&
        Array.isArray(filteredDataForPromo) &&
        filteredDataForPromo?.length > 0
      ) {
        if (
          filteredDataForPromo[0]["&_Mix_Of_Promo_Saleable"] !== 0 ||
          filteredDataForPromo[0]["Total_Production_Req"] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "Saleable";
          obj.percentage = filteredDataForPromo[0]["&_Mix_Of_Promo_Saleable"];
          obj.quantity = filteredDataForPromo[0]["Total_Production_Req"];
          response.data.promoMix.push(obj);
        }
      }

      const filteredDataForSaleable = sourceData.makeMixPromoSaleable.filter(
        (val) => val.Major_Inventory_Type == "Promotional"
      );

      if (
        filteredDataForSaleable &&
        Array.isArray(filteredDataForSaleable) &&
        filteredDataForSaleable?.length > 0
      ) {
        if (
          filteredDataForSaleable[0]["&_Mix_Of_Promo_Saleable"] !== 0 ||
          filteredDataForSaleable[0]["Total_Production_Req"] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };

          obj.category = "Promotional";
          obj.percentage =
            filteredDataForSaleable[0]["&_Mix_Of_Promo_Saleable"];
          obj.quantity = filteredDataForSaleable[0]["Total_Production_Req"];
          response.data.promoMix.push(obj);
        }
      }

      // //regionalMIxxx

      const filteredDataForEurope = sourceData.makeMixRegion.filter(
        (val) => val.Continent == "EUROPE"
      );
      if (
        filteredDataForEurope &&
        Array.isArray(filteredDataForEurope) &&
        filteredDataForEurope?.length > 0
      ) {
        if (
          filteredDataForEurope[0]["&_Mix_Of_Region"] !== 0 ||
          filteredDataForEurope[0]["Total_Production_Req"] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "EUROPE";
          obj.percentage = filteredDataForEurope[0]["&_Mix_Of_Region"];
          obj.quantity = filteredDataForEurope[0]["Total_Production_Req"];
          response.data.regionalMix.push(obj);
        }
      }

      const filteredDataForAmerica = sourceData.makeMixRegion.filter(
        (val) => val.Continent == "AMERICAS"
      );

      if (
        filteredDataForAmerica &&
        Array.isArray(filteredDataForAmerica) &&
        filteredDataForAmerica?.length > 0
      ) {
        if (
          filteredDataForAmerica[0]["&_Mix_Of_Region"] !== 0 ||
          filteredDataForAmerica[0]["Total_Production_Req"] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "AMERICAS";
          obj.percentage = filteredDataForAmerica[0]["&_Mix_Of_Region"];
          obj.quantity = filteredDataForAmerica[0]["Total_Production_Req"];
          response.data.regionalMix.push(obj);
        }
      }

      const filteredDataForAsia = sourceData.makeMixRegion.filter(
        (val) => val.Continent == "ASIA"
      );

      if (
        filteredDataForAsia &&
        Array.isArray(filteredDataForAsia) &&
        filteredDataForAsia?.length > 0
      ) {
        if (
          filteredDataForAsia[0]["&_Mix_Of_Region"] !== 0 ||
          filteredDataForAsia[0]["Total_Production_Req"] !== 0
        ) {
          var obj = {
            category: null,
            quantity: null,
            percentage: null,
          };
          obj.category = "ASIA";
          obj.percentage = filteredDataForAsia[0]["&_Mix_Of_Region"];
          obj.quantity = filteredDataForAsia[0]["Total_Production_Req"];
          response.data.regionalMix.push(obj);
        }
      }
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getFromExcel = (xlsxFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      let jsonFilePath;
      var wb = XLSX.readFile(xlsxFilePath);
      for (let i = 0; i < wb.SheetNames.length; i++) {
        var sheetName = wb.SheetNames[i];
        var sheetValue = wb.Sheets[sheetName];
        var excelData = XLSX.utils.sheet_to_json(sheetValue);
        jsonFilePath = path.resolve(
          __dirname,
          `../config/${sheetName.toLowerCase()}.json`
        );
        fs.writeFileSync(jsonFilePath, JSON.stringify(excelData).toLowerCase());
        if (i + 1 == wb.SheetNames.length) {
          const response = {};
          response.statusCode = constants.HTTP_200;
          response.message = `excel mock data to json completed`;
          resolve(response);
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getE2EConnections = async (sourceData, fulfillData) => {
  return new Promise((resolve, reject) => {
    try {
      // let mock_Data = json;
      let e2eConnectionData = [
        {
          // Source Components to Make Internal F&A
          type: "SC-MI",
          connections: [],
        },
        {
          // Source Ingredients to Make TPM F&A
          type: "SC-MTPM",
          connections: [],
        },
        {
          // Source Ingredients to Make Internal F&A
          type: "SI-MI",
          connections: [],
        },
        {
          // Source Ingredients to Make TPM F&A
          type: "SI-MTPM",
          connections: [],
        },
        {
          // Make Internal to Fulfill Hub
          type: "MI-FH",
          connections: [],
        },
        {
          // Make Internal to Fulfill Affiliate FC
          type: "MI-FAFC",
          connections: [],
        },
        {
          // Make TPM F&A to Fulfill Hub
          type: "MTPM-FH",
          connections: [],
        },
        {
          // Make TPM F&A to Fulfill Affiliate FC
          type: "MTPM-FAFC",
          connections: [],
        },
        {
          // Fulfill Hub to Fulfill Affiliate FC
          type: "FH-FAFC",
          connections: [],
        },
      ];

      // mapping connection data
      const source = sourceData[0].filter(
        (item) => item.region_of_source != null
      );
      const fulfill = fulfillData.filter(
        (item) =>
          // item.source_city != null &&
          // item.dest_region != null &&
          item.source_latitude != null && item.source_longitude != null
        // &&
        // (item.dest_latitude != null) & (item.dest_longitude != null)
      );

      if (source.length) {
        source.forEach((element) => {
          if (element["bmein"] == "EA") {
            //element["source_type"] == "Vendor" &&
            if (element["dest_type"] == "Production Plant") {
              e2eConnectionData[0].connections.push({
                nodes: [element["region_of_source"], element["dest_city"]],
                coordinates: [
                  [element["sourcelatitude"], element["sourcelongitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            } else if (element["dest_type"] == "TPM") {
              e2eConnectionData[1].connections.push({
                nodes: [element["region_of_source"], element["dest_region"]],
                coordinates: [
                  [element["sourcelatitude"], element["sourcelongitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            }
          } else if (
            // element["source_type"] == "Vendor" &&
            element["bmein"] == "KG"
          ) {
            if (element["dest_type"] == "Production Plant") {
              e2eConnectionData[2].connections.push({
                nodes: [element["region_of_source"], element["dest_city"]],
                coordinates: [
                  [element["sourcelatitude"], element["sourcelongitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            } else if (element["dest_type"] == "TPM") {
              e2eConnectionData[3].connections.push({
                nodes: [element["region_of_source"], element["dest_region"]],
                coordinates: [
                  [element["sourcelatitude"], element["sourcelongitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            }
          }
        });
      }

      if (fulfill.length) {
        fulfill.forEach((element) => {
          if (
            element["source_type"] == "Internal Plant - F&A" &&
            element["source_city"] !== null
          ) {
            if (element["dest_type"] == "regional fulfill Hub") {
              e2eConnectionData[4].connections.push({
                nodes: [element["source_city"], element["dest_region"]],
                coordinates: [
                  [element["source_latitude"], element["source_longitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            } else if (element["dest_type"] == "Affiliate FC") {
              e2eConnectionData[5].connections.push({
                nodes: [element["source_city"], element["dest_region"]],
                coordinates: [
                  [element["source_latitude"], element["source_longitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            }
          } else if (
            element["source_type"] == "TPM - F&A" &&
            element["source_region"] !== null &&
            element["source_latitude"] !== null &&
            element["source_longitude"] !== null
          ) {
            if (element["dest_type"] == "regional fulfill Hub") {
              e2eConnectionData[6].connections.push({
                nodes: [element["source_region"], element["dest_region"]], ///need to add source_region
                coordinates: [
                  [element["source_latitude"], element["source_longitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            } else if (element["dest_type"] == "Affiliate FC") {
              e2eConnectionData[7].connections.push({
                nodes: [element["source_region"], element["dest_region"]], ///need to add source_region
                coordinates: [
                  [element["source_latitude"], element["source_longitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            }
          } else if (
            element["source_type"] == "regional fulfill Hub" &&
            element["source_region"]
              ? element["source_region"] !== null
              : false
          ) {
            // if (element["type"] == "fulfill hub") {
            //   e2eConnectionData[6].connections.push({
            //     nodes: [element["source_city"], element["dest_region"]],
            //     coordinates: [
            //       [element["source_latitude"], element["source_longitude"]],
            //       [element["dest_latitude"], element["dest_longitude"]],
            //     ],
            //   });
            // } else
            if (element["dest_type"] == "Affiliate FC") {
              e2eConnectionData[8].connections.push({
                nodes: [element["source_region"], element["dest_region"]],
                coordinates: [
                  [element["source_latitude"], element["source_longitude"]],
                  [element["dest_latitude"], element["dest_longitude"]],
                ],
              });
            }
          }
        });
      }
      // removing duplicates from connection combinations
      for (i = 0; i < e2eConnectionData.length; i++) {
        e2eConnectionData[i].connections =
          e2eConnectionData[i].connections.length >= 1
            ? ((uniqueSM = new Set(
                e2eConnectionData[i].connections.map(JSON.stringify)
              )),
              (e2eConnectionData[i].connections = Array.from(uniqueSM).map(
                JSON.parse
              )))
            : [];
      }

      let response = {};
      response.data = e2eConnectionData;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getE2ENodeInformation = (sourceData, makeData, fulfillData) => {
  return new Promise((resolve, reject) => {
    try {
      let e2eNodeData = {
        source: {
          sourceIngredient: [],
          sourceComponent: [],
        },
        make: { plantFnA: [], plantComp: [], tpmFnA: [], tpmComp: [] },
        fulfill: { fulfillHub: [], fulfillFC: [] },
      };

      if (sourceData.length > 0) {
        const source = sourceData[0];

        if (source.length > 0) {
          source.forEach((element) => {
            if (
              // element["source_type"] == "Vendor" &&
              element["bmein"] == "EA" &&
              element["total_quantity"] !== 0 &&
              element["region_of_source"] !== null
            ) {
              e2eNodeData.source.sourceComponent.push({
                id: [element["source_code"]],
                region: element["region_of_source"],
                lat: element["sourcelatitude"],
                long: element["sourcelongitude"],
                volume: element["total_quantity"] || 0,
              });
            } else if (
              // element["source_type"] == "Vendor" &&
              element["bmein"] == "KG" &&
              element["total_quantity"] !== 0 &&
              element["region_of_source"] !== null
            ) {
              e2eNodeData.source.sourceIngredient.push({
                id: [element["source_code"]],
                region: element["region_of_source"],
                lat: element["sourcelatitude"],
                long: element["sourcelongitude"],
                volume: element["total_quantity"] || 0,
              });
            }
          });

          // removing duplicates from nodes
          // from Source Ingredient Node
          e2eNodeData.source.sourceComponent =
            e2eNodeData.source.sourceComponent.reduce(function (
              accumulator,
              current
            ) {
              var name = current.region,
                found = accumulator.find(function (elem) {
                  return elem.region == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []);

          // from Source Ingredient Node
          e2eNodeData.source.sourceIngredient =
            e2eNodeData.source.sourceIngredient.reduce(function (
              accumulator,
              current
            ) {
              var name = current.region,
                found = accumulator.find(function (elem) {
                  return elem.region == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []);
        }
      }
      if (makeData.length > 0) {
        const make = makeData[0];

        if (make.length > 0) {
          make.forEach((element) => {
            if (
              element["plant_type"] == "Internal - F&A" &&
              element["total_quantity"] !== 0
            ) {
              e2eNodeData.make.plantFnA.push({
                id: [element["plant"]],
                city: element["plant name"],
                lat: element["latitude"],
                long: element["longitude"],
                volume: element["total_quantity"] || 0,
              });
            } else if (
              element["plant_type"] == "Internal - Compounding" &&
              element["total_quantity"] !== 0
            ) {
              e2eNodeData.make.plantComp.push({
                id: [element["plant"]],
                city: element["plant name"],
                lat: Number(element["latitude"]) + 5,
                long: Number(element["longitude"]) + 5,
                volume: element["total_quantity"] || 0,
              });
            } else if (
              element["plant_type"] == "TPM - F&A" &&
              element["total_quantity"] !== 0
            ) {
              e2eNodeData.make.tpmFnA.push({
                id: [element["plant"]],
                city: element["DEST_REGION"],
                lat: element["latitude"],
                long: element["longitude"],
                volume: element["total_quantity"] || 0,
              });
            } else if (
              element["plant_type"] == "TPM - Compounding" &&
              element["total_quantity"] !== 0
            ) {
              e2eNodeData.make.tpmComp.push({
                id: [element["plant"]],
                city: element["DEST_REGION"],
                lat: element["latitude"],
                long: element["longitude"],
                volume: element["total_quantity"] || 0,
              });
            }
          });

          // removing duplicates from nodes
          // from Make Plant F&A Nodes
          e2eNodeData.make.plantFnA = e2eNodeData.make.plantFnA.reduce(
            function (accumulator, current) {
              var name = current.city,
                found = accumulator.find(function (elem) {
                  return elem.city == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []
          );

          // from Make Plant Compounding Nodes
          e2eNodeData.make.plantComp = e2eNodeData.make.plantComp.reduce(
            function (accumulator, current) {
              var name = current.city,
                found = accumulator.find(function (elem) {
                  return elem.city == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []
          );

          // from Make TPM F&A Nodes
          e2eNodeData.make.tpmFnA = e2eNodeData.make.tpmFnA.reduce(function (
            accumulator,
            current
          ) {
            var name = current.city,
              found = accumulator.find(function (elem) {
                return elem.city == name;
              });
            if (found) {
              found.volume += current.volume;
              found.id = found.id.concat(current.id);
            } else accumulator.push(current);
            return accumulator;
          },
          []);

          // from Make TPM Compounding Nodes
          e2eNodeData.make.tpmComp = e2eNodeData.make.tpmComp.reduce(function (
            accumulator,
            current
          ) {
            var name = current.city,
              found = accumulator.find(function (elem) {
                return elem.city == name;
              });
            if (found) {
              found.volume += current.volume;
              found.id = found.id.concat(current.id);
            } else accumulator.push(current);
            return accumulator;
          },
          []);
        }
      }

      // fulfill nodes
      if (fulfillData.length > 0) {
        const fulfill = fulfillData[0];

        // fulfill: { fulfillHub: [], fulfillFC: [] }
        if (fulfill.length > 0) {
          fulfill.forEach((element) => {
            if (
              element["dest_type"] == "regional fulfill Hub" &&
              element["total_quantity"] !== 0 &&
              element["dest_region"] !== null
            ) {
              e2eNodeData.fulfill.fulfillHub.push({
                id: [element["dest"]],
                region: element["dest_region"],
                lat: element["dest_latitude"],
                long: element["dest_longitude"],
                volume: element["total_quantity"] || 0,
              });
            } else if (
              element["dest_type"] == "Affiliate FC" &&
              element["total_quantity"] !== 0 &&
              element["dest_region"] !== null
            ) {
              e2eNodeData.fulfill.fulfillFC.push({
                id: [element["dest"]],
                region: element["dest_region"],
                lat: element["dest_latitude"],
                long: element["dest_longitude"],
                volume: element["total_quantity"] || 0,
              });
            }
          });

          // removing duplicates from nodes
          // from Fulfill Hub Node
          e2eNodeData.fulfill.fulfillHub =
            e2eNodeData.fulfill.fulfillHub.reduce(function (
              accumulator,
              current
            ) {
              var name = current.region,
                found = accumulator.find(function (elem) {
                  return elem.region == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []);

          // from Fulfill FC Node
          e2eNodeData.fulfill.fulfillFC = e2eNodeData.fulfill.fulfillFC.reduce(
            function (accumulator, current) {
              var name = current.region,
                found = accumulator.find(function (elem) {
                  return elem.region == name;
                });
              if (found) {
                found.volume += current.volume;
                found.id = found.id.concat(current.id);
              } else accumulator.push(current);
              return accumulator;
            },
            []
          );
        }
      }

      const response = {};

      response.data = e2eNodeData;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getMakeBarChartValue = (sourceData, includedCapacity) => {
  return new Promise((resolve, reject) => {
    const response = {};
    response.statusCode = constants.HTTP_200;
    response.message = "Success: Make bar charts information";
    const allData = !includedCapacity ? true : false;

    response.data = {
      projectedProdUnitVsCapacity: {
        year: [],
        "24/5": [],
        "24/7": [],
        "Efficiency Gain": [],
        CAPEX: [],
        Gap: [],
        "Production Requirement": [],
        cagr: [],
      },
      manlocProdReq: {
        top10: {
          "Plant & Resource": [],
          Skincare: [],
          Makeup: [],
          Fragrance: [],
          Haircare: [],
          Others: [],
        },
        all: {
          "Plant & Resource": [],
          Skincare: [],
          Makeup: [],
          Fragrance: [],
          Haircare: [],
          Others: [],
        },
      },
    };
    if (sourceData?.projectedProdUnitVsCapacity) {
      projectedProdUnitVsCapacity =
        sourceData.projectedProdUnitVsCapacity?.sort(
          (a, b) => parseInt(a?.Year) - parseInt(b?.Year)
        );
      sourceData.projectedProdUnitVsCapacity.forEach((val) => {
        response.data.projectedProdUnitVsCapacity.year.push(`FY${val.Year}`);

        allData
          ? response.data.projectedProdUnitVsCapacity["24/5"].push(val["24_5"]) // if
          : includedCapacity.includes("24/5")
          ? response.data.projectedProdUnitVsCapacity["24/5"].push(val["24_5"]) // else if
          : null; // else

        allData
          ? response.data.projectedProdUnitVsCapacity["24/7"].push(val["24_7"]) // if
          : includedCapacity.includes("24/7")
          ? response.data.projectedProdUnitVsCapacity["24/7"].push(val["24_7"]) // else if
          : null; // else

        allData
          ? response.data.projectedProdUnitVsCapacity["Efficiency Gain"].push(
              val.Efficiency_Gain
            ) // if
          : includedCapacity.includes("Efficiency Gains")
          ? response.data.projectedProdUnitVsCapacity["Efficiency Gain"].push(
              val.Efficiency_Gain
            ) // else if
          : null; // else

        allData
          ? response.data.projectedProdUnitVsCapacity["CAPEX"].push(val.Capex) // if
          : includedCapacity.includes("Capex")
          ? response.data.projectedProdUnitVsCapacity["CAPEX"].push(val.Capex) // else if
          : null; // else

        response.data.projectedProdUnitVsCapacity["Gap"].push(val.Gap);
        response.data.projectedProdUnitVsCapacity[
          "Production Requirement"
        ].push(val.Production_Req);
        response.data.projectedProdUnitVsCapacity.cagr.push(val.CAGR);
      });
    }

    const uniqueKeys = [
      ...new Set(
        sourceData.makeManlocProdReq.map((item) => item?.["Plant_Resource"])
      ),
    ].filter((item) => item != "" && item != undefined && item != null);
    const totalvolumeAndPlant = [];

    uniqueKeys.forEach((val) => {
      let calcForSkinCare = 0;
      let calcForMakeup = 0;
      let calcForFragrance = 0;
      let calcForHaircare = 0;
      let calcForOther = 0;
      for (let i = 0; i < sourceData.makeManlocProdReq.length; i++) {
        const element = sourceData.makeManlocProdReq[i];

        if (
          val == element.Plant_Resource &&
          element.Major_Category == "Skincare"
        ) {
          calcForSkinCare += element.Total_Production_Req;
        }

        if (
          val == element.Plant_Resource &&
          element.Major_Category == "Makeup"
        ) {
          calcForMakeup += element.Total_Production_Req;
        }

        if (
          val == element.Plant_Resource &&
          element.Major_Category == "Fragrance"
        ) {
          calcForFragrance += element.Total_Production_Req;
        }

        if (
          val == element.Plant_Resource &&
          element.Major_Category == "Haircare"
        ) {
          calcForHaircare += element.Total_Production_Req;
        }
        if (
          val == element.Plant_Resource &&
          element.Major_Category == "Other"
        ) {
          calcForOther += element.Total_Production_Req;
        }
      }

      const totalVolumeForUnique =
        calcForSkinCare +
        calcForMakeup +
        calcForFragrance +
        calcForHaircare +
        calcForOther;

      const obj = {
        plant: val,
        volume: totalVolumeForUnique,
      };
      totalvolumeAndPlant.push(obj);

      // response.data.manlocProdReq.all.Skincare?.push(calcForSkinCare);
      // response.data.manlocProdReq.all.Makeup?.push(calcForMakeup);
      // response.data.manlocProdReq.all.Fragrance?.push(calcForFragrance);
      // response.data.manlocProdReq.all.Haircare?.push(calcForHaircare);
      // response.data.manlocProdReq.all.Others?.push(calcForOther);
    });

    const toptenPlant = totalvolumeAndPlant.sort(function (a, b) {
      return b.volume - a.volume;
    });
    // .reverse()
    // .slice(0, 10);
    let topTen = 0;
    toptenPlant.forEach((val) => {
      let topTencalcForSkinCare = 0;
      let topTencalcForMakeup = 0;
      let topTencalcForFragrance = 0;
      let topTencalcForHaircare = 0;
      let topTencalcForOther = 0;
      for (let i = 0; i < sourceData.makeManlocProdReq.length; i++) {
        const element = sourceData.makeManlocProdReq[i];

        if (
          val.plant == element.Plant_Resource &&
          element.Major_Category == "Skincare"
        ) {
          topTencalcForSkinCare += element.Total_Production_Req;
        }

        if (
          val.plant == element.Plant_Resource &&
          element.Major_Category == "Makeup"
        ) {
          topTencalcForMakeup += element.Total_Production_Req;
        }

        if (
          val.plant == element.Plant_Resource &&
          element.Major_Category == "Fragrance"
        ) {
          topTencalcForFragrance += element.Total_Production_Req;
        }

        if (
          val.plant == element.Plant_Resource &&
          element.Major_Category == "Haircare"
        ) {
          topTencalcForHaircare += element.Total_Production_Req;
        }
        if (
          val.plant == element.Plant_Resource &&
          element.Major_Category == "Other"
        ) {
          topTencalcForOther += element.Total_Production_Req;
        }
      }
      response.data.manlocProdReq.all["Plant & Resource"].push(val.plant);
      response.data.manlocProdReq.all.Skincare?.push(topTencalcForSkinCare);
      response.data.manlocProdReq.all.Makeup?.push(topTencalcForMakeup);
      response.data.manlocProdReq.all.Fragrance?.push(topTencalcForFragrance);
      response.data.manlocProdReq.all.Haircare?.push(topTencalcForHaircare);
      response.data.manlocProdReq.all.Others?.push(topTencalcForOther);

      if (topTen < 10) {
        topTen++;
        response.data.manlocProdReq.top10["Plant & Resource"].push(val.plant);
        response.data.manlocProdReq.top10.Skincare?.push(topTencalcForSkinCare);
        response.data.manlocProdReq.top10.Makeup?.push(topTencalcForMakeup);
        response.data.manlocProdReq.top10.Fragrance?.push(
          topTencalcForFragrance
        );
        response.data.manlocProdReq.top10.Haircare?.push(topTencalcForHaircare);
        response.data.manlocProdReq.top10.Others?.push(topTencalcForOther);
      }
    });

    resolve(response);
  });
};

module.exports.getSourceMaterialPOValues = (materialFY22POs) => {
  return new Promise((resolve, reject) => {
    try {
      let output = {
        totalRecords: 10570,
        records: [],
      };
      if (materialFY22POs) {
        materialFY22POs.forEach((element) => {
          if (element["MATERIAL_CODE"]) {
            let materialPos = {};
            materialPos.material = `${element["MATERIAL_CODE"]}`;
            materialPos.materialName = element["MATERIAL_NAME"];
            materialPos.materialType = element["MATERIAL_TYPE"];
            materialPos.supplierName = element["VENDOR_NAME"];
            materialPos.totalQuantity = element["TOTAL_QTY"];
            materialPos.spend$ = element["TOTAL_SPEND"];
            output.records.push(materialPos);
          }
        });
      }
      const response = {};
      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getGlobalFilters = (globalFilter) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("gilte called",globalFilter)
      // globalFilters.forEach((element) => {
      // if (element["MATERIAL_CODE"]) {
      const data = globalFilter;
      let materialPos = {};
      if (data) {
        materialPos["Major Category"] = [
          ...new Set(data.map((item) => item["Major_Category"])),
        ];
        materialPos["Category"] = [
          ...new Set(data.map((item) => item["Category"])),
        ];
        materialPos["SubCategory"] = [
          ...new Set(data.map((item) => item["Subcategory"])),
        ];
        materialPos["Priority Subcategory"] = [
          ...new Set(data.map((item) => item["Priority_Subcategory"])),
        ];
        materialPos["Brand"] = [...new Set(data.map((item) => item["Brand"]))];
        materialPos["Division"] = [
          ...new Set(data.map((item) => item["Division"])),
        ];
        materialPos["Item4"] = [...new Set(data.map((item) => item["Item_4"]))];
        materialPos["Item6"] = [...new Set(data.map((item) => item["Item_6"]))];
        materialPos["Item9"] = [...new Set(data.map((item) => item["Item_9"]))];
        materialPos["Item Description"] = [
          ...new Set(data.map((item) => item["item_Description"])),
        ];
        materialPos["Sub Product Line"] = [
          ...new Set(data.map((item) => item["Sub_Product_Line"])),
        ];
        materialPos["Product Line"] = [
          ...new Set(data.map((item) => item["Product_Line"])),
        ];
        materialPos["Hero"] = [...new Set(data.map((item) => item["Hero"]))];
        materialPos["Set Indicator"] = [
          ...new Set(data.map((item) => item["Set_Indicator"])),
        ];
        materialPos["Product Size"] = [
          ...new Set(data.map((item) => item["Product_Size"])),
        ];
        materialPos["Product form"] = [
          ...new Set(data.map((item) => item["Product_form"])),
        ];
        // materialPos["Material Type"] = [
        //   ...new Set(data.map((item) => item["Material_Type"])),
        // ];
        materialPos["Sub Inventory Description"] = [
          ...new Set(data.map((item) => item["Sub_Inventory_Description"])),
        ];
        materialPos["ABCD"] = [...new Set(data.map((item) => item["ABCD"]))];
        materialPos["Demand Type"] = [
          ...new Set(data.map((item) => item["Demand_Type"])),
        ];
        materialPos["New Basic"] = [
          ...new Set(data.map((item) => item["new_basic"])),
        ];
        materialPos["Sales Region"] = [
          ...new Set(data.map((item) => item["Sales_Region"])),
        ];
        materialPos["Major Inventory Type"] = [
          ...new Set(data.map((item) => item["Major_Inventory_Type"])),
        ];
        materialPos["Inventory Description"] = [
          ...new Set(data.map((item) => item["Inventory_Description"])),
        ];
      }
      // materialPos["Material Group Description"] = [
      //   ...new Set(data.map((item) => item["Material_Group_Description"])),
      // ];
      // output.records.push(materialPos);
      // }
      // });
      const response = {};
      response.data = materialPos;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getSourceChartFilters = (globalFilters) => {
  return new Promise((resolve, reject) => {
    try {
      // globalFilters.forEach((element) => {
      // if (element["MATERIAL_CODE"]) {
      const data = globalFilters;

      let materialPos = {};
      if (data) {
        // materialPos["matnr"] = [...new Set(data.map((item) => item["matnr"]))];
        //pending is it Material Code
        materialPos["Material Type"] = [
          ...new Set(data.map((item) => item["Material_Type"])),
        ];
        materialPos["Material Group Description"] = [
          ...new Set(data.map((item) => item["Material_Group_Description"])),
        ];
        materialPos["Material Code"] = [
          ...new Set(data.map((item) => item["Material_Code"])),
        ];
        materialPos["Material Name"] = [
          ...new Set(data.map((item) => item["Material_Name"])),
        ];
        materialPos["Packaging Type"] = [
          ...new Set(data.map((item) => item["Packaging_Type"])),
        ];
        materialPos["Region of Source"] = [
          ...new Set(data.map((item) => item["Region_of_Source"])),
        ];
        materialPos["Country of Origin"] = [
          ...new Set(data.map((item) => item["Country_of_Origin"])),
        ];
        materialPos["Supplier Name"] = [
          ...new Set(data.map((item) => item["Supplier_Name"])),
        ];
        materialPos["Parent Supplier"] = [
          ...new Set(data.map((item) => item["Parent_Supplier"])),
        ];
        materialPos["Supplier Segmentation"] = [
          ...new Set(data.map((item) => item["Supplier_Segmentation"])),
        ];
      }
      // output.records.push(materialPos);
      // }
      // });
      const response = {};
      response.data = materialPos;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getMakeChartFilters = (globalFilters) => {
  return new Promise((resolve, reject) => {
    try {
      // globalFilters.forEach((element) => {
      // if (element["MATERIAL_CODE"]) {
      const data = globalFilters;
      let materialPos = {};
      if (data) {
        // materialPos["matnr"] = [...new Set(data.map((item) => item["matnr"]))];
        //pending is it Material Code
        materialPos["High Level Grouping"] = [
          ...new Set(data.map((item) => item["High_Level_Group"])),
        ];
        materialPos["Platform"] = [
          ...new Set(data.map((item) => item["Platform"])),
        ];
        materialPos["Technology"] = [
          ...new Set(data.map((item) => item["Technology"])),
        ];
        materialPos["Region of Make"] = [
          ...new Set(data.map((item) => item["Region_Of_Make"])),
        ];
        materialPos["Plant"] = [...new Set(data.map((item) => item["Plant"]))];
        materialPos["Plant Type"] = [
          ...new Set(data.map((item) => item["I_E_Plant"])),
        ];
        materialPos["Capacity Scenario"] = [
          ...new Set(data.map((item) => item["Capacity_Scenario"])),
        ];
        materialPos["Resource Type"] = [
          ...new Set(data.map((item) => item["Resource_Type"])),
        ];
        materialPos["Resource"] = [
          ...new Set(data.map((item) => item["Resource"])),
        ];
        materialPos["Capex Project"] = [
          ...new Set(data.map((item) => item["Capex_Project"])),
        ];
        materialPos["OTC"] = [...new Set(data.map((item) => item["OTC"]))];
      }

      // output.records.push(materialPos);
      // }
      // });
      const response = {};
      response.data = materialPos;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getAlle2e = () => {
  return new Promise((resolve, reject) => {
    // console.log("mockData: ", filter, mockData);
    const response = {};
    response.statusCode = constants.HTTP_200;
    response.message = "sufficiency e2e data";
    response.data = mockData;
    resolve(response);
  });
};

function allData(sourceData, keyAgainst, volume, cagr) {
  const keysN = [
    ...new Set(sourceData.map((item) => item?.[keyAgainst])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const volumeN = keysN.map((val) => {
    return sourceData
      .filter((item) => item?.[keyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const resultForVolumeDesc = volumeN.reduce(function (result, field, index) {
    result[keysN[index]] = field;
    return result;
  }, {});

  //big5
  let sortableVolumeDataDesc = [];
  for (var val in resultForVolumeDesc) {
    if (!isNaN(resultForVolumeDesc[val]) && resultForVolumeDesc[val]) {
      sortableVolumeDataDesc.push([val, resultForVolumeDesc[val]]);
    }
  }

  let uniqueKeys = [];
  let totalVolume = [];
  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .map((val) => {
      uniqueKeys.push(val[0]);
      totalVolume.push(val[1]);
    });

  //end

  const cagrValues = uniqueKeys.map((val) => {
    return sourceData
      .filter((item) => item?.[keyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  return { uniqueKeys, totalVolume, cagrValues };
}

function fastFiveData(sourceData, keyAgainst, volume, cagr) {
  const uniqueKeys = [
    ...new Set(sourceData.map((item) => item?.[keyAgainst])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const totalCagr = uniqueKeys.map((val) => {
    return sourceData
      .filter((item) => item?.[keyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const result = totalCagr.reduce(function (result, field, index) {
    result[uniqueKeys[index]] = field;
    return result;
  }, {});

  //big5
  let sortable = [];
  for (var val in result) {
    if (!isNaN(result[val]) && result[val]) {
      sortable.push([val, result[val]]);
    }
  }

  let uniqueBigFive = [];
  let cagrValuesBigFive = [];
  sortable
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      uniqueBigFive.push(val[0]);
      cagrValuesBigFive.push(val[1]);
    });

  const totalVolumeBigFive = uniqueBigFive.map((val) => {
    return sourceData
      .filter((item) => item?.[keyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  return { uniqueBigFive, totalVolumeBigFive, cagrValuesBigFive };
}

function allAndbigFiveData(sourceData, volumeKey, volume, cagr) {
  const keysN = [
    ...new Set(sourceData.map((item) => item?.[volumeKey])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const volumeN = keysN.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const resultForVolumeDesc = volumeN.reduce(function (result, field, index) {
    result[keysN[index]] = field;
    return result;
  }, {});

  //big5
  let sortableVolumeDataDesc = [];
  for (var val in resultForVolumeDesc) {
    if (!isNaN(resultForVolumeDesc[val]) && resultForVolumeDesc[val]) {
      sortableVolumeDataDesc.push([val, resultForVolumeDesc[val]]);
    }
  }

  let uniqueKeys = [];
  let totalVolume = [];
  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .map((val) => {
      uniqueKeys.push(val[0]);
      totalVolume.push(val[1]);
    });

  //end

  const totalCagr = keysN.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  // //key values
  // const resultForVolume = totalVolume.reduce(function (result, field, index) {
  //   result[uniqueKeys[index]] = field;
  //   return result;
  // }, {});

  // //big5
  // let sortableVolumeData = [];
  // for (var val in resultForVolume) {
  //   if (!isNaN(resultForVolume[val]) && resultForVolume[val]) {
  //     sortableVolumeData.push([val, resultForVolume[val]]);
  //   }
  // }

  let uniqueBigFiveVolume = [];
  let totalVolumeBigFive = [];
  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      uniqueBigFiveVolume.push(val[0]);
      totalVolumeBigFive.push(val[1]);
    });

  //key values
  const resultForCagr = totalCagr.reduce(function (result, field, index) {
    result[uniqueBigFiveVolume[index]] = field;
    return result;
  }, {});

  //big5
  let sortableCagrData = [];
  for (var val in resultForCagr) {
    if (resultForCagr[val]) {
      sortableCagrData.push([val, resultForCagr[val]]);
    }
  }

  const cagrForBigFiveVolume = uniqueBigFiveVolume.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const resultForBigFiveCagr = totalCagr.reduce(function (
    result,
    field,
    index
  ) {
    result[uniqueKeys[index]] = field;
    return result;
  },
  {});

  //big5
  let sortableForBigFiveCagr = [];
  for (var val in resultForBigFiveCagr) {
    if (!isNaN(resultForBigFiveCagr[val]) && resultForBigFiveCagr[val]) {
      sortableForBigFiveCagr.push([val, resultForBigFiveCagr[val]]);
    }
  }

  let uniqueBigFiveCagr = [];
  let totalCagrBigFive = [];
  sortableForBigFiveCagr
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      uniqueBigFiveCagr.push(val[0]);
      totalCagrBigFive.push(val[1]);
    });

  const totalVolumeForBigFiveCagr = uniqueBigFiveCagr.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  return {
    uniqueKeys,
    totalVolume,
    totalCagr,
    uniqueBigFiveVolume,
    totalVolumeBigFive,
    cagrForBigFiveVolume,
    uniqueBigFiveCagr,
    totalVolumeForBigFiveCagr,
    totalCagrBigFive,
  };
}

function allAndbigFiveDataForETwoE(sourceData, volumeKey, volume, cagr) {
  const uniqueKeys = [
    ...new Set(sourceData.map((item) => item?.[volumeKey])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const totalVolume = uniqueKeys.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  const totalCagr = uniqueKeys.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const resultForVolume = totalVolume.reduce(function (result, field, index) {
    result[uniqueKeys[index]] = field;
    return result;
  }, {});

  //big5
  let sortableVolumeData = [];
  for (var val in resultForVolume) {
    if (!isNaN(resultForVolume[val]) && resultForVolume[val]) {
      sortableVolumeData.push([val, resultForVolume[val]]);
    }
  }

  let uniqueBigFiveVolume = [];
  let totalVolumeBigFive = [];
  sortableVolumeData
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      uniqueBigFiveVolume.push(val[0]);
      totalVolumeBigFive.push(val[1]);
    });

  //key values
  const resultForCagr = totalCagr.reduce(function (result, field, index) {
    result[uniqueBigFiveVolume[index]] = field;
    return result;
  }, {});

  //big5
  let sortableCagrData = [];
  for (var val in resultForCagr) {
    if (resultForCagr[val]) {
      sortableCagrData.push([val, resultForCagr[val]]);
    }
  }

  const cagrForBigFiveVolume = uniqueBigFiveVolume.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //key values
  const resultForBigFiveCagr = totalCagr.reduce(function (
    result,
    field,
    index
  ) {
    result[uniqueKeys[index]] = field;
    return result;
  },
  {});

  //big5
  let sortableForBigFiveCagr = [];
  for (var val in resultForBigFiveCagr) {
    if (!isNaN(resultForBigFiveCagr[val]) && resultForBigFiveCagr[val]) {
      sortableForBigFiveCagr.push([val, resultForBigFiveCagr[val]]);
    }
  }

  let uniqueBigFiveCagr = [];
  let totalCagrBigFive = [];
  sortableForBigFiveCagr
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      uniqueBigFiveCagr.push(val[0]);
      totalCagrBigFive.push(val[1]);
    });

  const totalVolumeForBigFiveCagr = uniqueBigFiveCagr.map((val) => {
    return sourceData
      .filter((item) => item?.[volumeKey] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volume])
          ? 0
          : parseFloat(record?.[volume]);
        return sum + sumAss;
      }, 0);
  });

  return {
    uniqueKeys,
    totalVolume,
    totalCagr,
    uniqueBigFiveVolume,
    totalVolumeBigFive,
    cagrForBigFiveVolume,
    uniqueBigFiveCagr,
    totalVolumeForBigFiveCagr,
    totalCagrBigFive,
  };
}
function categoryYearQuarterWise(data, category, uniqueYearQuarterCombo) {
  const categoryArray = [];

  const filtered = data.filter((elem) => {
    return uniqueYearQuarterCombo.filter(function (keyAgainst) {
      return elem?.Year === keyAgainst?.year &&
        elem?.Quarter == keyAgainst?.quarter &&
        elem["Major_Category"]
        ? elem["Major_Category"] == category
        : true;
    });
  });
  for (i = 0; i < filtered.length; i++) {
    if (
      filtered[i]["Major_Category"]
        ? filtered[i]["Major_Category"] == category
        : true && filtered[i + 1]["Major_Category"]
        ? filtered[i + 1]["Major_Category"] == category
        : true &&
          `${filtered[i]?.["Year"] + filtered[i]?.["Quarter"]}` ==
            `${filtered[i + 1]?.["Year"] + filtered[i + 1]?.["Quarter"]}`
    ) {
      categoryArray.push(filtered[i]?.Revenue + filtered[i + 1]?.Revenue);
    } else {
      categoryArray.push(filtered[i]?.Revenue);
    }
  }

  return categoryArray;
}

module.exports.getMaterialGroupValuesNew = (yearFilter, sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);

      if (yearFilter == 2023 || yearFilter == 2024) {
        response.data = {
          materialGroup: {
            volume: {
              big5: {
                materialGroup: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                // cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                //  cagr: [],
              },
            },
            revenue: {
              big5: {
                materialGroup: [],
                value: [],
                //  cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                //   cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                //   cagr: [],
              },
            },
            spent: {
              big5: {
                materialGroup: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                //cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                // cagr: [],
              },
            },
          },
        };
      } else {
        response.data = {
          materialGroup: {
            volume: {
              big5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
            },
            revenue: {
              big5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
            },
            spent: {
              big5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
              all: {
                materialGroup: [],
                value: [],
                cagr: [],
              },
            },
          },
        };
      }

      const data = sourceData.materialGroupRecordsVolume;
      if (data) {
        const isYear20232024 =
          yearFilter == 2023 || yearFilter == 2024 ? false : true;
        const materialGroupRecordsVolume = data
          .filter((val) => val.Material_Description != null || val.Volume !== 0)
          .sort(function (a, b) {
            return a["Volume"] - b["Volume"];
          });

        const materialGroupRecordsFastFive = data.sort(function (a, b) {
          return a["cagrVolume"] - b["cagrVolume"];
        });

        materialGroupRecordsVolume.map((val) => {
          response.data.materialGroup.volume.all.materialGroup.push(
            val.Material_Description
          );
          response.data.materialGroup.volume.all.value.push(val.Volume);
          if (isYear20232024) {
            response.data.materialGroup.volume.all.cagr.push(val.cagrVolume);
          }
        });

        materialGroupRecordsVolume
          .slice(materialGroupRecordsVolume.length - 5)
          .map((val) => {
            response.data.materialGroup.volume.big5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.volume.big5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.materialGroup.volume.big5.cagr.push(val.cagrVolume);
            }
          });

        materialGroupRecordsFastFive
          .slice(materialGroupRecordsFastFive.length - 5)
          .map((val) => {
            response.data.materialGroup.volume.fast5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.volume.fast5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.materialGroup.volume.fast5.cagr.push(
                val.cagrVolume
              );
            }
          });

        const materialGroupRecordsRevenueVol = data
          .filter(
            (val) => val.Material_Description != null || val["Revenue"] !== 0
          )
          .sort(function (a, b) {
            return a["Revenue"] - b["Revenue"];
          });

        const materialGroupRecordsRevenueCagr = data
          .filter(
            (val) =>
              val.Material_Description != null || val["CagrRevenue"] !== 0
          )
          .sort(function (a, b) {
            return a["CagrRevenue"] - b["CagrRevenue"];
          });

        materialGroupRecordsRevenueVol.map((val) => {
          response.data.materialGroup.revenue.all.materialGroup.push(
            val.Material_Description
          );
          response.data.materialGroup.revenue.all.value.push(val.Revenue);
          if (isYear20232024) {
            response.data.materialGroup.revenue.all.cagr.push(val.CagrRevenue);
          }
        });

        materialGroupRecordsRevenueVol
          .slice(materialGroupRecordsRevenueVol.length - 5)
          .map((val) => {
            response.data.materialGroup.revenue.big5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.revenue.big5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.materialGroup.revenue.big5.cagr.push(
                val.CagrRevenue
              );
            }
          });

        materialGroupRecordsRevenueCagr
          .slice(materialGroupRecordsRevenueCagr.length - 5)
          .map((val) => {
            response.data.materialGroup.revenue.fast5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.revenue.fast5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.materialGroup.revenue.fast5.cagr.push(
                val.CagrRevenue
              );
            }
          });
        const materialGroupRecordsSpendVol = data
          .filter(
            (val) => val.Material_Description != null || val["Spend$"] !== 0
          )
          .sort(function (a, b) {
            return a["Spend$"] - b["Spend$"];
          });

        const materialGroupRecordsSpendCagr = data
          .filter(
            (val) => val.Material_Description != null || val["cagrSpend"] !== 0
          )
          .sort(function (a, b) {
            return a["cagrSpend"] - b["cagrSpend"];
          });

        materialGroupRecordsSpendVol.map((val) => {
          response.data.materialGroup.spent.all.materialGroup.push(
            val.Material_Description
          );
          response.data.materialGroup.spent.all.value.push(val.Spend$);
          if (isYear20232024) {
            response.data.materialGroup.spent.all.cagr.push(val.cagrSpend);
          }
        });

        materialGroupRecordsSpendVol
          .slice(materialGroupRecordsSpendVol.length - 5)
          .map((val) => {
            response.data.materialGroup.spent.big5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.spent.big5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.materialGroup.spent.big5.cagr.push(val.cagrSpend);
            }
          });

        materialGroupRecordsSpendCagr
          .slice(materialGroupRecordsSpendCagr.length - 5)
          .map((val) => {
            response.data.materialGroup.spent.fast5.materialGroup.push(
              val.Material_Description
            );
            response.data.materialGroup.spent.fast5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.materialGroup.spent.fast5.cagr.push(val.cagrSpend);
            }
          });

        resolve(response);
      }
    } catch (error) {}
  });
};

// module.exports.getMaterialGroupValues = (yearFilter, sourceData) => {
//   //console.log("sourceData", sourceData);
//   return new Promise((resolve, reject) => {
//     try {
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message = "Success: getMaterialGroupValues charts information";
//       // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);
//       if (yearFilter == 2023 || yearFilter == 2024) {
//         response.data = {
//           materialGroup: {
//             volume: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 // cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 // cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 //  cagr: [],
//               },
//             },
//             revenue: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 //  cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 //   cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 //   cagr: [],
//               },
//             },
//             spent: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 // cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 //cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 // cagr: [],
//               },
//             },
//           },
//         };
//       } else {
//         response.data = {
//           materialGroup: {
//             volume: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//             },
//             revenue: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//             },
//             spent: {
//               big5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               fast5: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//               all: {
//                 materialGroup: [],
//                 value: [],
//                 cagr: [],
//               },
//             },
//           },
//         };
//       }

//       if (sourceData) {
//         //materialGroupReq Chart
//         //volume all
//         const isYear20232024 =
//           yearFilter == 2023 || yearFilter == 2024 ? false : true;
//         const materialGroupVolume = allAndbigFiveData(
//           sourceData.materialGroupRecordsVolume,
//           "Material_Group_Description",
//           "Volume",
//           "cagr"
//         );

//         //console.log("allAndbigFiveData", materialGroupVolume);
//         response.data.materialGroup.volume.all.materialGroup =
//           materialGroupVolume?.uniqueKeys;
//         response.data.materialGroup.volume.all.value =
//           materialGroupVolume?.totalVolume;
//         if (isYear20232024) {
//           response.data.materialGroup.volume.all.cagr =
//             materialGroupVolume?.totalCagr;
//         }
//         //volume big5

//         response.data.materialGroup.volume.big5.materialGroup =
//           materialGroupVolume?.uniqueBigFiveVolume;
//         response.data.materialGroup.volume.big5.value =
//           materialGroupVolume?.totalVolumeBigFive;
//         if (isYear20232024) {
//           response.data.materialGroup.volume.big5.cagr =
//             materialGroupVolume?.cagrForBigFiveVolume;
//         }
//         //cagr fast5
//         response.data.materialGroup.volume.fast5.materialGroup =
//           materialGroupVolume?.uniqueBigFiveCagr;
//         response.data.materialGroup.volume.fast5.value =
//           materialGroupVolume?.totalVolumeForBigFiveCagr;
//         if (isYear20232024) {
//           response.data.materialGroup.volume.fast5.cagr =
//             materialGroupVolume?.totalCagrBigFive;
//         }
//         //spend All
//         // uniqueKeys, totalVolume, totalCagr, uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive

//         const materialGroupSpend = allAndbigFiveData(
//           sourceData.materialGroupRecordsSpend,
//           "Material_Group_Description",
//           "Spend",
//           "cagr"
//         );
//         response.data.materialGroup.spent.all.materialGroup =
//           materialGroupSpend?.uniqueKeys;
//         response.data.materialGroup.spent.all.value =
//           materialGroupSpend?.totalVolume;
//         if (isYear20232024) {
//           response.data.materialGroup.spent.all.cagr =
//             materialGroupSpend?.totalCagr;
//         }
//         //spend BigFive
//         response.data.materialGroup.spent.big5.materialGroup =
//           materialGroupSpend?.uniqueBigFiveVolume;
//         response.data.materialGroup.spent.big5.value =
//           materialGroupSpend?.totalVolumeBigFive;
//         if (isYear20232024) {
//           response.data.materialGroup.spent.big5.cagr =
//             materialGroupSpend?.cagrForBigFiveVolume;
//         }
//         //spend fast5
//         response.data.materialGroup.spent.fast5.materialGroup =
//           materialGroupSpend?.uniqueBigFiveCagr;
//         response.data.materialGroup.spent.fast5.value =
//           materialGroupSpend?.totalVolumeForBigFiveCagr;
//         if (isYear20232024) {
//           response.data.materialGroup.spent.fast5.cagr =
//             materialGroupSpend?.totalCagrBigFive;
//         }

//         //revenue  all

//         const materialGroupRevenue = allAndbigFiveData(
//           sourceData.materialGroupRecordsRevenue,
//           "Material_Group_Description",
//           "Revenue",
//           "cagr"
//         );
//         response.data.materialGroup.revenue.all.materialGroup =
//           materialGroupRevenue?.uniqueKeys;
//         response.data.materialGroup.revenue.all.value =
//           materialGroupRevenue?.totalVolume;
//         if (isYear20232024) {
//           response.data.materialGroup.revenue.all.cagr =
//             materialGroupRevenue?.totalCagr;
//         }
//         //revenue  BigFive
//         response.data.materialGroup.revenue.big5.materialGroup =
//           materialGroupRevenue?.uniqueBigFiveVolume;
//         response.data.materialGroup.revenue.big5.value =
//           materialGroupRevenue?.totalVolumeBigFive;
//         if (isYear20232024) {
//           response.data.materialGroup.revenue.big5.cagr =
//             materialGroupRevenue?.cagrForBigFiveVolume;
//         }
//         //revenue  fast5
//         response.data.materialGroup.revenue.fast5.materialGroup =
//           materialGroupRevenue?.uniqueBigFiveCagr;
//         response.data.materialGroup.revenue.fast5.value =
//           materialGroupRevenue?.totalVolumeForBigFiveCagr;
//         if (isYear20232024) {
//           response.data.materialGroup.revenue.fast5.cagr =
//             materialGroupRevenue?.totalCagrBigFive;
//         }
//       }

//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

module.exports.getMaterialNameRecordValuesNew = (yearFilter, sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);

      if (yearFilter == 2023 || yearFilter == 2024) {
        response.data = {
          materialName: {
            volume: {
              big5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                // cagr: [],
              },
            },
            revenue: {
              big5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                //cagr: [],
              },
            },
            spent: {
              big5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                // cagr: [],
              },
            },
          },
        };
      } else {
        response.data = {
          materialName: {
            volume: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
            revenue: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
            spent: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
          },
        };
      }
      const data = sourceData.materialNameRecordsVolume;
      if (data) {
        const isYear20232024 =
          yearFilter == 2023 || yearFilter == 2024 ? false : true;
        const materialNameRecordsVolume = data
          .filter((val) => val.Component_Name != null || val.Volume !== 0)
          .sort(function (a, b) {
            return a["Volume"] - b["Volume"];
          });

        const materialNameRecordsFastFive = data.sort(function (a, b) {
          return a["cagrVolume"] - b["cagrVolume"];
        });

        materialNameRecordsVolume.map((val) => {
          response.data.materialName.volume.all.materialName.push(
            val.Component_Name
          );
          response.data.materialName.volume.all.value.push(val.Volume);
          if (isYear20232024) {
            response.data.materialName.volume.all.cagr.push(val.cagrVolume);
          }
        });

        materialNameRecordsVolume
          .slice(materialNameRecordsVolume.length - 5)
          .map((val) => {
            response.data.materialName.volume.big5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.volume.big5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.materialName.volume.big5.cagr.push(val.cagrVolume);
            }
          });

        materialNameRecordsFastFive
          .slice(materialNameRecordsFastFive.length - 5)
          .map((val) => {
            response.data.materialName.volume.fast5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.volume.fast5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.materialName.volume.fast5.cagr.push(val.cagrVolume);
            }
          });

        const materialNameRecordsRevenueVol = data
          .filter((val) => val.Component_Name != null || val.Revenue !== 0)
          .sort(function (a, b) {
            return a["Revenue"] - b["Revenue"];
          });

        const materialNameRecordsRevenueCagr = data
          .filter((val) => val.Component_Name != null || val.CagrRevenue !== 0)
          .sort(function (a, b) {
            return a["CagrRevenue"] - b["CagrRevenue"];
          });

        materialNameRecordsRevenueVol.map((val) => {
          response.data.materialName.revenue.all.materialName.push(
            val.Component_Name
          );
          response.data.materialName.revenue.all.value.push(val.Revenue);
          if (isYear20232024) {
            response.data.materialName.revenue.all.cagr.push(val.CagrRevenue);
          }
        });

        materialNameRecordsRevenueVol
          .slice(materialNameRecordsRevenueVol.length - 5)
          .map((val) => {
            response.data.materialName.revenue.big5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.revenue.big5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.materialName.revenue.big5.cagr.push(
                val.CagrRevenue
              );
            }
          });

        materialNameRecordsRevenueCagr
          .slice(materialNameRecordsRevenueCagr.length - 5)
          .map((val) => {
            response.data.materialName.revenue.fast5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.revenue.fast5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.materialName.revenue.fast5.cagr.push(
                val.CagrRevenue
              );
            }
          });
        const materialNameRecordsSpendVol = data
          .filter((val) => val.Component_Name != null || val["Spend$"] !== 0)
          .sort(function (a, b) {
            return a["Spend$"] - b["Spend$"];
          });

        const materialNameRecordsSpendCagr = data
          .filter((val) => val.Component_Name != null || val["CagrSpend"] !== 0)
          .sort(function (a, b) {
            return a["cagrSpend"] - b["cagrSpend"];
          });

        materialNameRecordsSpendVol.map((val) => {
          response.data.materialName.spent.all.materialName.push(
            val.Component_Name
          );
          response.data.materialName.spent.all.value.push(val.Spend$);
          if (isYear20232024) {
            response.data.materialName.spent.all.cagr.push(val.cagrSpend);
          }
        });

        materialNameRecordsSpendVol
          .slice(materialNameRecordsSpendVol.length - 5)
          .map((val) => {
            response.data.materialName.spent.big5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.spent.big5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.materialName.spent.big5.cagr.push(val.cagrSpend);
            }
          });

        materialNameRecordsSpendCagr
          .slice(materialNameRecordsSpendCagr.length - 5)
          .map((val) => {
            response.data.materialName.spent.fast5.materialName.push(
              val.Component_Name
            );
            response.data.materialName.spent.fast5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.materialName.spent.fast5.cagr.push(val.cagrSpend);
            }
          });

        resolve(response);
      }
    } catch (error) {}
  });
};

module.exports.getMaterialNameRecordValues = (yearFilter, sourceData) => {
  //console.log("sourceData", sourceData);
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);
      if (yearFilter == 2023 || yearFilter == 2024) {
        response.data = {
          materialName: {
            volume: {
              big5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                // cagr: [],
              },
            },
            revenue: {
              big5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                //cagr: [],
              },
            },
            spent: {
              big5: {
                materialName: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                //  cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                // cagr: [],
              },
            },
          },
        };
      } else {
        response.data = {
          materialName: {
            volume: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
            revenue: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
            spent: {
              big5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              fast5: {
                materialName: [],
                value: [],
                cagr: [],
              },
              all: {
                materialName: [],
                value: [],
                cagr: [],
              },
            },
          },
        };
      }
      if (sourceData) {
        //materialNameReq Chart
        //volume all
        const isYear20232024 =
          yearFilter == 2023 || yearFilter == 2024 ? false : true;
        const materialNameVolume = allAndbigFiveData(
          sourceData.materialNameRecordsVolume,
          "Component_Name",
          "Volume",
          "cagr"
        );
        response.data.materialName.volume.all.materialName =
          materialNameVolume?.uniqueKeys;
        response.data.materialName.volume.all.value =
          materialNameVolume?.totalVolume;
        if (isYear20232024) {
          response.data.materialName.volume.all.cagr =
            materialNameVolume?.totalCagr;
        }
        //volume big5

        response.data.materialName.volume.big5.materialName =
          materialNameVolume?.uniqueBigFiveVolume;
        response.data.materialName.volume.big5.value =
          materialNameVolume?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.materialName.volume.big5.cagr =
            materialNameVolume?.cagrForBigFiveVolume;
        }
        //volume fastFive

        response.data.materialName.volume.fast5.materialName =
          materialNameVolume?.uniqueBigFiveCagr;
        response.data.materialName.volume.fast5.value =
          materialNameVolume?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.materialName.volume.fast5.cagr =
            materialNameVolume?.totalCagrBigFive;
        }
        //spend All
        // uniqueKeys, totalVolume, totalCagr, uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive

        const materialNameSpend = allAndbigFiveData(
          sourceData.materialNameRecordsSpend,
          "Component_Name",
          "Spend",
          "cagr"
        );
        response.data.materialName.spent.all.materialName =
          materialNameSpend?.uniqueKeys;
        response.data.materialName.spent.all.value =
          materialNameSpend?.totalVolume;
        if (isYear20232024) {
          response.data.materialName.spent.all.cagr =
            materialNameSpend?.totalCagr;
        }
        //spend BigFive
        response.data.materialName.spent.big5.materialName =
          materialNameSpend?.uniqueBigFiveVolume;
        response.data.materialName.spent.big5.value =
          materialNameSpend?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.materialName.spent.big5.cagr =
            materialNameSpend?.cagrForBigFiveVolume;
        }
        //spend fast5
        response.data.materialName.spent.fast5.materialName =
          materialNameSpend?.uniqueBigFiveCagr;
        response.data.materialName.spent.fast5.value =
          materialNameSpend?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.materialName.spent.fast5.cagr =
            materialNameSpend?.totalCagrBigFive;
        }
        // uniqueKeys, totalVolume, totalCagr, uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive

        //revenue  all
        const materialNameRevenue = allAndbigFiveData(
          sourceData.materialNameRecordsRevenue,
          "Component_Name",
          "Revenue",
          "cagr"
        );
        response.data.materialName.revenue.all.materialName =
          materialNameRevenue?.uniqueKeys;
        response.data.materialName.revenue.all.value =
          materialNameRevenue?.totalVolume;
        if (isYear20232024) {
          response.data.materialName.revenue.all.cagr =
            materialNameRevenue?.cagrForBigFiveVolume;
        }
        //revenue  BigFive
        //  uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive
        response.data.materialName.revenue.big5.materialName =
          materialNameRevenue?.uniqueBigFiveVolume;
        response.data.materialName.revenue.big5.value =
          materialNameRevenue?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.materialName.revenue.big5.cagr =
            materialNameRevenue?.cagrForBigFiveVolume;
        }

        //revenue  fastfive
        response.data.materialName.revenue.fast5.materialName =
          materialNameRevenue?.uniqueBigFiveCagr;
        response.data.materialName.revenue.fast5.value =
          materialNameRevenue?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.materialName.revenue.fast5.cagr =
            materialNameRevenue?.totalCagrBigFive;
        }
      }

      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getSupplierMixRecordsValues = (yearFilter, sourceData) => {
  //console.log("sourceData", sourceData);
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);
      if (yearFilter == 2023 || yearFilter == 2024) {
        response.data = {
          supplierMix: {
            volume: {
              big5: {
                supplier: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                // cagr: [],
              },
            },
            revenue: {
              big5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                //cagr: [],
              },
            },
            spent: {
              big5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                //cagr: [],
              },
            },
          },
        };
      } else {
        response.data = {
          supplierMix: {
            volume: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
            revenue: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
            spent: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
          },
        };
      }

      if (sourceData) {
        //supplierMixReq Chart
        //volume all
        const isYear20232024 =
          yearFilter == 2023 || yearFilter == 2024 ? false : true;
        const supplierMixVolumeMix = allAndbigFiveData(
          sourceData.supplierMixRecordsVolume,
          "Supplier_Name",
          "Volume",
          "cagr"
        );
        response.data.supplierMix.volume.all.supplier =
          supplierMixVolumeMix?.uniqueKeys;
        response.data.supplierMix.volume.all.value =
          supplierMixVolumeMix?.totalVolume;
        if (isYear20232024) {
          response.data.supplierMix.volume.all.cagr =
            supplierMixVolumeMix?.totalCagr;
        }
        //volume big5

        response.data.supplierMix.volume.big5.supplier =
          supplierMixVolumeMix?.uniqueBigFiveVolume;
        response.data.supplierMix.volume.big5.value =
          supplierMixVolumeMix?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.supplierMix.volume.big5.cagr =
            supplierMixVolumeMix?.cagrForBigFiveVolume;
        }
        //volume fast5

        response.data.supplierMix.volume.fast5.supplier =
          supplierMixVolumeMix?.uniqueBigFiveCagr;
        response.data.supplierMix.volume.fast5.value =
          supplierMixVolumeMix?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.supplierMix.volume.fast5.cagr =
            supplierMixVolumeMix?.totalCagrBigFive;
        }

        //spend All
        const supplierMixSpend = allAndbigFiveData(
          sourceData.supplierMixRecordsSpend,
          "Supplier_Name",
          "Spend",
          "cagr"
        );
        // uniqueKeys, totalVolume, totalCagr, uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive

        response.data.supplierMix.spent.all.supplier =
          supplierMixSpend?.uniqueKeys;
        response.data.supplierMix.spent.all.value =
          supplierMixSpend?.totalVolume;
        if (isYear20232024) {
          response.data.supplierMix.spent.all.cagr =
            supplierMixSpend?.totalCagr;
        }
        //spend BigFive

        response.data.supplierMix.spent.big5.supplier =
          supplierMixSpend?.uniqueBigFiveVolume;
        response.data.supplierMix.spent.big5.value =
          supplierMixSpend?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.supplierMix.spent.big5.cagr =
            supplierMixSpend?.cagrForBigFiveVolume;
        }
        //spend fastFive

        response.data.supplierMix.spent.fast5.supplier =
          supplierMixSpend?.uniqueBigFiveCagr;
        response.data.supplierMix.spent.fast5.value =
          supplierMixSpend?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.supplierMix.spent.fast5.cagr =
            supplierMixSpend?.totalCagrBigFive;
        }
        //revenue  all
        const supplierMixRevenue = allAndbigFiveData(
          sourceData.supplierMixRecordsRevenue,
          "Supplier_Name",
          "Revenue",
          "cagr"
        );
        // uniqueKeys, totalVolume, totalCagr, uniqueBigFiveVolume, totalVolumeBigFive, cagrForBigFiveVolume, uniqueBigFiveCagr, totalVolumeForBigFiveCagr, totalCagrBigFive

        response.data.supplierMix.revenue.all.supplier =
          supplierMixRevenue?.uniqueKeys;
        response.data.supplierMix.revenue.all.value =
          supplierMixRevenue?.totalVolume;
        if (isYear20232024) {
          response.data.supplierMix.revenue.all.cagr =
            supplierMixRevenue?.totalCagr;
        }
        //revenue  BigFive

        response.data.supplierMix.revenue.big5.supplier =
          supplierMixRevenue?.uniqueBigFiveVolume;
        response.data.supplierMix.revenue.big5.value =
          supplierMixRevenue?.totalVolumeBigFive;
        if (isYear20232024) {
          response.data.supplierMix.revenue.big5.cagr =
            supplierMixRevenue?.cagrForBigFiveVolume;
        }
        //revenue  fast5

        response.data.supplierMix.revenue.fast5.supplier =
          supplierMixRevenue?.uniqueBigFiveCagr;
        response.data.supplierMix.revenue.fast5.value =
          supplierMixRevenue?.totalVolumeForBigFiveCagr;
        if (isYear20232024) {
          response.data.supplierMix.revenue.fast5.cagr =
            supplierMixRevenue?.totalCagrBigFive;
        }
      }

      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getSupplierMixRecordsValuesNew = (yearFilter, sourceData) => {
  //console.log("sourceData", sourceData);
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);

      if (yearFilter == 2023 || yearFilter == 2024) {
        response.data = {
          supplierMix: {
            volume: {
              big5: {
                supplier: [],
                value: [],
                // cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                // cagr: [],
              },
            },
            revenue: {
              big5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                //cagr: [],
              },
            },
            spent: {
              big5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                //cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                //cagr: [],
              },
            },
          },
        };
      } else {
        response.data = {
          supplierMix: {
            volume: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
            revenue: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
            spent: {
              big5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              fast5: {
                supplier: [],
                value: [],
                cagr: [],
              },
              all: {
                supplier: [],
                value: [],
                cagr: [],
              },
            },
          },
        };
      }

      if (sourceData) {
        const data = sourceData.filter(
          (val) => val.Supplier_Name != null && val.Volume !== 0
        ); // && val.Volume !== 0
        const isYear20232024 =
          yearFilter == 2023 || yearFilter == 2024 ? false : true;
        //supplierMixReq Chart
        //volume all
        const supplierByVolume = data.sort(function (a, b) {
          return a["Volume"] - b["Volume"];
        });

        supplierByVolume.map((val) => {
          response.data.supplierMix.volume.all.supplier.push(val.Supplier_Name);
          response.data.supplierMix.volume.all.value.push(val.Volume);
          if (isYear20232024) {
            response.data.supplierMix.volume.all.cagr.push(val.cagrVolume);
          }
        });

        //volume big5
        supplierByVolume
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.volume.big5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.volume.big5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.supplierMix.volume.big5.cagr.push(val.cagrVolume);
            }
          });

        //volume fast5
        const supplierByVolumeCAGR = data.sort(function (a, b) {
          return a["cagrVolume"] - b["cagrVolume"];
        });
        supplierByVolumeCAGR
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.volume.fast5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.volume.fast5.value.push(val.Volume);
            if (isYear20232024) {
              response.data.supplierMix.volume.fast5.cagr.push(val.cagrVolume);
            }
          });

        //spend All
        const supplierBySpend = data.sort(function (a, b) {
          return a["Spend$"] - b["Spend$"];
        });

        supplierBySpend.map((val) => {
          response.data.supplierMix.spent.all.supplier.push(val.Supplier_Name);
          response.data.supplierMix.spent.all.value.push(val.Spend$);
          if (isYear20232024) {
            response.data.supplierMix.spent.all.cagr.push(val.cagrSpend);
          }
        });
        //spend BigFive
        supplierBySpend
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.spent.big5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.spent.big5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.supplierMix.spent.big5.cagr.push(val.cagrSpend);
            }
          });

        //spend fastFive
        const supplierBySpendCAGR = data.sort(function (a, b) {
          return a["cagrSpend"] - b["cagrSpend"];
        });
        supplierBySpendCAGR
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.spent.fast5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.spent.fast5.value.push(val.Spend$);
            if (isYear20232024) {
              response.data.supplierMix.spent.fast5.cagr.push(val.cagrSpend);
            }
          });

        //revenue  all
        const supplierByRevenue = data.sort(function (a, b) {
          return a["Revenue"] - b["Revenue"];
        });

        supplierByRevenue.map((val) => {
          response.data.supplierMix.revenue.all.supplier.push(
            val.Supplier_Name
          );
          response.data.supplierMix.revenue.all.value.push(val.Revenue);
          if (isYear20232024) {
            response.data.supplierMix.revenue.all.cagr.push(val.CagrRevenue);
          }
        });

        //revenue  BigFive
        supplierByRevenue
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.revenue.big5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.revenue.big5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.supplierMix.revenue.big5.cagr.push(val.CagrRevenue);
            }
          });

        //revenue  fast5
        const supplierByRevenueCAGR = data.sort(function (a, b) {
          return a["CagrRevenue"] - b["CagrRevenue"];
        });
        supplierByRevenueCAGR
          .reverse()
          .slice(0, 5)
          .reverse()
          .map((val) => {
            response.data.supplierMix.revenue.fast5.supplier.push(
              val.Supplier_Name
            );
            response.data.supplierMix.revenue.fast5.value.push(val.Revenue);
            if (isYear20232024) {
              response.data.supplierMix.revenue.fast5.cagr.push(
                val.CagrRevenue
              );
            }
          });
      }

      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getProjectedMaterialReqValuesNew = (filter, sourceData) => {
  //console.log("sourceData", sourceData);
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);

      response.data = {
        projectedMaterialReq: {
          all: {
            volume: [],
            year: [],
            revenue: [],
            volCagr: [],
            revenueCagr: [],
          },
        },
      };
      if (sourceData) {
        let data = sourceData.projectedMaterialReqVolume;
        //projectedMaterialReq Chart
        //volume
        data.map((val) => {
          response.data.projectedMaterialReq.all.volume.push(val.Volume);
          response.data.projectedMaterialReq.all.year.push(`FY${val.Year}`);
          response.data.projectedMaterialReq.all.revenue.push(val.Revenue);
          response.data.projectedMaterialReq.all.volCagr.push(val.volCAGR);
          response.data.projectedMaterialReq.all.revenueCagr.push(val.revCAGR);
        });
      }

      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

// module.exports.getProjectedMaterialReqValues = (filter, sourceData) => {
//   //console.log("sourceData", sourceData);
//   return new Promise((resolve, reject) => {
//     try {
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message =
//         "Success: getProjectedMaterialReqValues charts information";
//       // sourceData = sourceChartAndGlobalFilteredData(sourceData, filter);

//       response.data = {
//         projectedMaterialReq: {
//           all: {
//             volume: [],
//             year: [],
//             revenue: [],
//             cagrVolume: [],
//             cagrRevenue: [],
//           },
//         },
//       };
//       if (sourceData) {
//         //projectedMaterialReq Chart
//         //volume all
//         const projectedMaterialVolumeAll = allData(
//           sourceData.projectedMaterialReqVolume,
//           "year",
//           "Volume",
//           "CAGR%"
//         );
//         let uniq = projectedMaterialVolumeAll?.uniqueKeys;
//         uniq = uniq.map((val) => `FY${val}`);
//         response.data.projectedMaterialReq.all.year = uniq;
//         response.data.projectedMaterialReq.all.volume =
//           projectedMaterialVolumeAll?.totalVolume;
//         response.data.projectedMaterialReq.all.cagrVolume =
//           projectedMaterialVolumeAll?.cagrValues;
//         const projectedMaterialRevenueAll = allData(
//           sourceData.projectedMaterialReqRevenue,
//           "year",
//           "Revenue",
//           "CAGR%"
//         );
//         response.data.projectedMaterialReq.all.revenue =
//           projectedMaterialRevenueAll?.totalVolume;
//         response.data.projectedMaterialReq.all.cagrRevenue =
//           projectedMaterialRevenueAll?.cagrValues;
//       }

//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

module.exports.getE2ERevenueGrowthValues = (fulfillData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let output = {
        category: {
          quarterly: {
            // quarters: [
            //   "FY2023 Q1",
            //   "FY2024 Q1",
            //   "FY2025 Q1",
            //   "FY2023 Q2",
            //   "FY2024 Q2",
            //   "FY2025 Q2",
            //   "FY2023 Q3",
            //   "FY2024 Q3",
            //   "FY2025 Q3",
            //   "FY2023 Q4",
            //   "FY2024 Q4",
            //   "FY2025 Q4",
            // ],
            quarters: [
              "FY2023 Q1",
              "FY2023 Q2",
              "FY2023 Q3",
              "FY2023 Q4",
              "FY2024 Q1",
              "FY2024 Q2",
              "FY2024 Q3",
              "FY2024 Q4",
              "FY2025 Q1",
              "FY2025 Q2",
              "FY2025 Q3",
              "FY2025 Q4",
            ],
            Skincare: [],
            Makeup: [],
            Fragrance: [],
            Haircare: [],
            Other: [],
          },
          yearly: {
            years: ["FY2023", "FY2024", "FY2025"],
            Skincare: [],
            Makeup: [],
            Fragrance: [],
            Haircare: [],
            Other: [],
          },
        },
        total: {
          quarterly: {
            // quarters: [
            //   "FY2023 Q1",
            //   "FY2024 Q1",
            //   "FY2025 Q1",
            //   "FY2023 Q2",
            //   "FY2024 Q2",
            //   "FY2025 Q2",
            //   "FY2023 Q3",
            //   "FY2024 Q3",
            //   "FY2025 Q3",
            //   "FY2023 Q4",
            //   "FY2024 Q4",
            //   "FY2025 Q4",
            // ],
            quarters: [
              "FY2023 Q1",
              "FY2023 Q2",
              "FY2023 Q3",
              "FY2023 Q4",
              "FY2024 Q1",
              "FY2024 Q2",
              "FY2024 Q3",
              "FY2024 Q4",
              "FY2025 Q1",
              "FY2025 Q2",
              "FY2025 Q3",
              "FY2025 Q4",
            ],
            total: [],
          },
          yearly: {
            years: ["FY2023", "FY2024", "FY2025"],
            total: [],
          },
        },
      };
      // console.log(fulfillData[0]);
      if (fulfillData) {
        const categories = [
          "Makeup",
          "Skincare",
          "Haircare",
          "Fragrance",
          "Other",
        ];
        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        const years = [2023, 2024, 2025];

        categories.map((category) => {
          years.map((year) => {
            quarters.map((quarter) => {
              let count = 0;
              for (let i = 0; i < fulfillData.length; i++) {
                const val = fulfillData[i];
                if (
                  val.Major_Category == category &&
                  val.Year == year &&
                  val.Quarter == quarter
                ) {
                  count++;
                  output.category.quarterly[category].push(val.Revenue);
                }
              }
              if (count == 0) {
                output.category.quarterly[category].push(0);
              }
              //   fulfillData.map(val => {
              // if(val.Major_Category == category && val.Year == year && val.Quarter == quarter){
              //   output.category.quarterly[category].push(val.Revenue)
              // }
              // })
            });
          });
        });

        let skin = output.category.quarterly.Skincare;
        let make = output.category.quarterly.Makeup;
        let hair = output.category.quarterly.Haircare;
        let frag = output.category.quarterly.Fragrance;
        let other = output.category.quarterly.Other;

        output.category.yearly.Skincare.push(
          isNumber(skin[0]) +
            isNumber(skin[1]) +
            isNumber(skin[2]) +
            isNumber(skin[3])
        );
        output.category.yearly.Makeup.push(
          isNumber(make[0]) +
            isNumber(make[1]) +
            isNumber(make[2]) +
            isNumber(make[3])
        );
        output.category.yearly.Haircare.push(
          isNumber(hair[0]) +
            isNumber(hair[1]) +
            isNumber(hair[2]) +
            isNumber(hair[3])
        );
        output.category.yearly.Fragrance.push(
          isNumber(frag[0]) +
            isNumber(frag[1]) +
            isNumber(frag[2]) +
            isNumber(frag[3])
        );
        output.category.yearly.Other.push(
          isNumber(other[0]) +
            isNumber(other[1]) +
            isNumber(other[2]) +
            isNumber(other[3])
        );

        output.category.yearly.Skincare.push(
          isNumber(skin[4]) +
            isNumber(skin[5]) +
            isNumber(skin[6]) +
            isNumber(skin[7])
        );
        output.category.yearly.Makeup.push(
          isNumber(make[4]) +
            isNumber(make[5]) +
            isNumber(make[6]) +
            isNumber(make[7])
        );
        output.category.yearly.Haircare.push(
          isNumber(hair[4]) +
            isNumber(hair[5]) +
            isNumber(hair[6]) +
            isNumber(hair[7])
        );
        output.category.yearly.Fragrance.push(
          isNumber(frag[4]) +
            isNumber(frag[5]) +
            isNumber(frag[6]) +
            isNumber(frag[7])
        );
        output.category.yearly.Other.push(
          isNumber(other[4]) +
            isNumber(other[5]) +
            isNumber(other[6]) +
            isNumber(other[7])
        );

        output.category.yearly.Skincare.push(
          isNumber(skin[8]) +
            isNumber(skin[9]) +
            isNumber(skin[10]) +
            isNumber(skin[11])
        );
        output.category.yearly.Makeup.push(
          isNumber(make[8]) +
            isNumber(make[9]) +
            isNumber(make[10]) +
            isNumber(make[11])
        );
        output.category.yearly.Haircare.push(
          isNumber(hair[8]) +
            isNumber(hair[9]) +
            isNumber(hair[10]) +
            isNumber(hair[11])
        );
        output.category.yearly.Fragrance.push(
          isNumber(frag[8]) +
            isNumber(frag[9]) +
            isNumber(frag[10]) +
            isNumber(frag[11])
        );
        output.category.yearly.Other.push(
          isNumber(other[8]) +
            isNumber(other[9]) +
            isNumber(other[10]) +
            isNumber(other[11])
        );
        //total q1 2023

        output.total.quarterly.total.push(
          isNumber(skin[0]) +
            isNumber(make[0]) +
            isNumber(hair[0]) +
            isNumber(frag[0]) +
            isNumber(other[0])
        );
        output.total.quarterly.total.push(
          isNumber(skin[1]) +
            isNumber(make[1]) +
            isNumber(hair[1]) +
            isNumber(frag[1]) +
            isNumber(other[1])
        );
        output.total.quarterly.total.push(
          isNumber(skin[2]) +
            isNumber(make[2]) +
            isNumber(hair[2]) +
            isNumber(frag[2]) +
            isNumber(other[2])
        );
        output.total.quarterly.total.push(
          isNumber(skin[3]) +
            isNumber(make[3]) +
            isNumber(hair[3]) +
            isNumber(frag[3]) +
            isNumber(other[3])
        );
        output.total.quarterly.total.push(
          isNumber(skin[4]) +
            isNumber(make[4]) +
            isNumber(hair[4]) +
            isNumber(frag[4]) +
            isNumber(other[4])
        );
        output.total.quarterly.total.push(
          isNumber(skin[5]) +
            isNumber(make[5]) +
            isNumber(hair[5]) +
            isNumber(frag[5]) +
            isNumber(other[5])
        );
        output.total.quarterly.total.push(
          isNumber(skin[6]) +
            isNumber(make[6]) +
            isNumber(hair[6]) +
            isNumber(frag[6]) +
            isNumber(other[6])
        );
        output.total.quarterly.total.push(
          isNumber(skin[7]) +
            isNumber(make[7]) +
            isNumber(hair[7]) +
            isNumber(frag[7]) +
            isNumber(other[7])
        );
        output.total.quarterly.total.push(
          isNumber(skin[8]) +
            isNumber(make[8]) +
            isNumber(hair[8]) +
            isNumber(frag[8]) +
            isNumber(other[8])
        );
        output.total.quarterly.total.push(
          isNumber(skin[9]) +
            isNumber(make[9]) +
            isNumber(hair[9]) +
            isNumber(frag[9]) +
            isNumber(other[9])
        );
        output.total.quarterly.total.push(
          isNumber(skin[10]) +
            isNumber(make[10]) +
            isNumber(hair[10]) +
            isNumber(frag[10]) +
            isNumber(other[10])
        );
        output.total.quarterly.total.push(
          isNumber(skin[11]) +
            isNumber(make[11]) +
            isNumber(hair[11]) +
            isNumber(frag[11]) +
            isNumber(other[11])
        );

        let quarterVal = output.total.quarterly.total;
        let yearVal = output.total.yearly.total;
        yearVal.push(
          isNumber(quarterVal[0]) +
            isNumber(quarterVal[1]) +
            isNumber(quarterVal[2]) +
            isNumber(quarterVal[3])
        );
        yearVal.push(
          isNumber(quarterVal[4]) +
            isNumber(quarterVal[5]) +
            isNumber(quarterVal[6]) +
            isNumber(quarterVal[7])
        );
        yearVal.push(
          isNumber(quarterVal[8]) +
            isNumber(quarterVal[9]) +
            isNumber(quarterVal[10]) +
            isNumber(quarterVal[11])
        );
      }

      // console.log("output: ", output);
      const response = {};
      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

// module.exports.getE2ERevenueGrowthValues = (fulfillData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let output = {
//         category: {
//           quarterly: {
//             quarters: [
//               "FY2023 Q1",
//               "FY2023 Q2",
//               "FY2023 Q3",
//               "FY2023 Q4",
//               "FY2024 Q1",
//               "FY2024 Q2",
//               "FY2024 Q3",
//               "FY2024 Q4",
//               "FY2025 Q1",
//               "FY2025 Q2",
//               "FY2025 Q3",
//               "FY2025 Q4",
//             ],
//             skincare: [],
//             makeup: [],
//             fragrance: [],
//             haircare: [],
//             others: [],
//           },
//           yearly: {
//             years: ["FY2023", "FY2024", "FY2025"],
//             skincare: [],
//             makeup: [],
//             fragrance: [],
//             haircare: [],
//             others: [],
//           },
//         },
//         total: {
//           quarterly: {
//             quarters: [
//               "FY2023 Q1",
//               "FY2023 Q2",
//               "FY2023 Q3",
//               "FY2023 Q4",
//               "FY2024 Q1",
//               "FY2024 Q2",
//               "FY2024 Q3",
//               "FY2024 Q4",
//               "FY2025 Q1",
//               "FY2025 Q2",
//               "FY2025 Q3",
//               "FY2025 Q4",
//             ],
//             total: [],
//           },
//           yearly: {
//             years: ["FY2023", "FY2024", "FY2025"],
//             total: [],
//           },
//         },
//       };
//       // console.log(fulfillData[0]);
//       if (fulfillData) {
//         const revenueGrowth = fulfillData;

//         const uniqueYearQuarter = [
//           { year: 2023, quarter: "Q1" },
//           { year: 2023, quarter: "Q2" },
//           { year: 2023, quarter: "Q3" },
//           { year: 2023, quarter: "Q4" },
//           { year: 2024, quarter: "Q1" },
//           { year: 2024, quarter: "Q2" },
//           { year: 2024, quarter: "Q3" },
//           { year: 2024, quarter: "Q4" },
//           { year: 2025, quarter: "Q1" },
//           { year: 2025, quarter: "Q2" },
//           { year: 2025, quarter: "Q3" },
//           { year: 2025, quarter: "Q4" },
//         ];
//         // console.log(uniqueYearQuarter);
//         const uniqueYears = [2023, 2024, 2025];
//         // ]
//         //   .filter(
//         //     (item) =>
//         //       item != "" &&
//         //       item != undefined &&
//         //       item != null &&
//         //       item["Year"]  2022
//         //   )
//         //   .sort();
//         // console.log("uniqueYears: ", uniqueYears);

//         revenue = revenueGrowth
//           .filter((a) => {
//             return a.Year > 2022;
//           })
//           .sort(function (a, b) {
//             return `${a["Year"] + a["Quarter"]}`.localeCompare(
//               `${b["Year"] + b["Quarter"]}`
//             );
//           });

//         // category

//         // quarterly
//         // skincare
//         output.category.quarterly.skincare.push(
//           ...revenue
//             .filter((x) => x.Major_Category == "Skincare")
//             .map((x) => x.Revenue)
//         );
//         // fragrance
//         output.category.quarterly.fragrance.push(
//           ...revenue
//             .filter((x) => x.Major_Category == "Fragrance")
//             .map((x) => x.Revenue)
//         );
//         // makeup
//         output.category.quarterly.makeup.push(
//           ...revenue
//             .filter((x) => x.Major_Category == "Makeup")
//             .map((x) => x.Revenue)
//         );
//         // haircare
//         output.category.quarterly.haircare.push(
//           ...revenue
//             .filter((x) => x.Major_Category == "Haircare")
//             .map((x) => x.Revenue)
//         );
//         // others
//         output.category.quarterly.others.push(
//           ...revenue
//             .filter((x) => x.Major_Category == "Other")
//             .map((x) => x.Revenue)
//         );

//         // yearly
//         // skincare
//         output.category.yearly.skincare.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Major_Category"] == "Skincare" && item["Year"] == val)
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = isNaN(record?.["Revenue"])
//                   ? 0
//                   : parseFloat(record?.["Revenue"]);
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // fragrance
//         output.category.yearly.fragrance.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (
//                   item["Major_Category"] == "Fragrance" &&
//                   item["Year"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = isNaN(record?.["Revenue"])
//                   ? 0
//                   : parseFloat(record?.["Revenue"]);
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // makeup
//         output.category.yearly.makeup.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Major_Category"] == "Makeup" && item["Year"] == val)
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = isNaN(record?.["Revenue"])
//                   ? 0
//                   : parseFloat(record?.["Revenue"]);
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // haircare
//         output.category.yearly.haircare.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Major_Category"] == "Haircare" && item["Year"] == val)
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = isNaN(record?.["Revenue"])
//                   ? 0
//                   : parseFloat(record?.["Revenue"]);
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // others
//         output.category.yearly.others.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Major_Category"] == "Other" && item["Year"] == val)
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = isNaN(record?.["Revenue"])
//                   ? 0
//                   : parseFloat(record?.["Revenue"]);
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         //total
//         // quarterly
//         output.total.quarterly.total.push(
//           ...uniqueYearQuarter.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Year"] == val.year && item["Quarter"] == val.quarter)
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Revenue"]
//                   ? parseFloat(record?.["Revenue"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // yearly
//         output.total.yearly.total.push(
//           ...uniqueYears.map((val) => {
//             return revenue
//               .filter((item) => {
//                 if (item["Year"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Revenue"]
//                   ? parseFloat(record?.["Revenue"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//       }

//       // console.log("output: ", output);
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message = "Success: e2e revenue growth information";
//       response.data = output;
//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };
// reqGrowthSource,
// "Compounding",
// "Resource_Type",
// "Platform",
// "2023",
// "2025",
// "cagr"
function allBigFastETwoEE(
  sourceData,
  filterAgainstArr,
  uniqueIdentifier,
  uniqueKeyAgainst,
  volOne,
  volTwo,
  cagr,
  secondFilterKey,
  secondFilter
) {
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  const filterAgainst = sourceData.filter(
    (val) =>
      val?.[uniqueIdentifier] == filterAgainstArr &&
      val?.[secondFilterKey] === secondFilter
  );
  // const ingredients = sourceData.filter(val => val?.[uniqueIdentifier] == filterAgainst[1]);

  const keys = [
    ...new Set(filterAgainst.map((item) => item?.[uniqueKeyAgainst])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const volOneNew = keys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volOne])
          ? 0
          : parseFloat(record?.[volOne]);
        return sum + sumAss;
      }, 0);
  });

  const resultDesc = volOneNew.reduce(function (result, field, index) {
    result[keys[index]] = field;
    return result;
  }, {});

  //big5
  let sortableVolumeDataDesc = [];
  for (var val in resultDesc) {
    if (!isNaN(resultDesc[val]) && resultDesc[val]) {
      sortableVolumeDataDesc.push([val, resultDesc[val]]);
    }
  }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr

  let allKeys = [];
  let allVolOne = [];

  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .map((val) => {
      allKeys.push(val[0]);
      allVolOne.push(val[1]);
    });

  //end

  const allVolTwo = allKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  const allcagrVol = allKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  // const resultForVolume = allVolOne.reduce(function (result, field, index) {
  //   result[allKeys[index]] = field;
  //   return result;
  // }, {});

  // //big5
  // let sortableVolumeData = [];
  // for (var val in resultForVolume) {
  //   if (!isNaN(resultForVolume[val]) && resultForVolume[val]) {
  //     sortableVolumeData.push([val, resultForVolume[val]]);
  //   }
  // }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr

  let bigFiveKeys = [];
  let bigFiveVolOne = [];

  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      bigFiveKeys.push(val[0]);
      bigFiveVolOne.push(val[1]);
    });

  const bigFiveVolTwo = bigFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  const bigFiveCagr = bigFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //fast 5
  const resultForCagr = allcagrVol.reduce(function (result, field, index) {
    result[allKeys[index]] = field;
    return result;
  }, {});

  //big5
  let sortablecagrData = [];
  for (var val in resultForCagr) {
    if (!isNaN(resultForCagr[val]) && resultForCagr[val]) {
      sortablecagrData.push([val, resultForCagr[val]]);
    }
  }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  //fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  let fastFiveKeys = [];
  let fastFiveCagr = [];

  sortablecagrData
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      fastFiveKeys.push(val[0]);
      fastFiveCagr.push(val[1]);
    });

  const fastFiveVolOne = fastFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volOne])
          ? 0
          : parseFloat(record?.[volOne]);
        return sum + sumAss;
      }, 0);
  });

  const fastFiveVolTwo = fastFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  // console.log(fastFiveKeys, fastFiveCagr, fastFiveVolOne, fastFiveVolTwo);

  return {
    allKeys,
    allVolOne,
    allVolTwo,
    allcagrVol,
    bigFiveKeys,
    bigFiveVolOne,
    bigFiveVolTwo,
    bigFiveCagr,
    fastFiveKeys,
    fastFiveVolOne,
    fastFiveVolTwo,
    fastFiveCagr,
  };
}
function allBigFastETwoE(
  sourceData,
  filterAgainstArr,
  uniqueIdentifier,
  uniqueKeyAgainst,
  volOne,
  volTwo,
  cagr
) {
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  const filterAgainst = sourceData.filter(
    (val) => val?.[uniqueIdentifier] == filterAgainstArr
  );
  // const ingredients = sourceData.filter(val => val?.[uniqueIdentifier] == filterAgainst[1]);

  const keys = [
    ...new Set(filterAgainst.map((item) => item?.[uniqueKeyAgainst])),
  ].filter((item) => item != "" && item != undefined && item != null);

  const volOneNew = keys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volOne])
          ? 0
          : parseFloat(record?.[volOne]);
        return sum + sumAss;
      }, 0);
  });

  const resultDesc = volOneNew.reduce(function (result, field, index) {
    result[keys[index]] = field;
    return result;
  }, {});

  //big5
  let sortableVolumeDataDesc = [];
  for (var val in resultDesc) {
    if (!isNaN(resultDesc[val]) && resultDesc[val]) {
      sortableVolumeDataDesc.push([val, resultDesc[val]]);
    }
  }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr

  let allKeys = [];
  let allVolOne = [];

  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .map((val) => {
      allKeys.push(val[0]);
      allVolOne.push(val[1]);
    });

  //end

  const allVolTwo = allKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  const allcagrVol = allKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  // const resultForVolume = allVolOne.reduce(function (result, field, index) {
  //   result[allKeys[index]] = field;
  //   return result;
  // }, {});

  // //big5
  // let sortableVolumeData = [];
  // for (var val in resultForVolume) {
  //   if (!isNaN(resultForVolume[val]) && resultForVolume[val]) {
  //     sortableVolumeData.push([val, resultForVolume[val]]);
  //   }
  // }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr

  let bigFiveKeys = [];
  let bigFiveVolOne = [];

  sortableVolumeDataDesc
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      bigFiveKeys.push(val[0]);
      bigFiveVolOne.push(val[1]);
    });

  const bigFiveVolTwo = bigFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  const bigFiveCagr = bigFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[cagr]) ? 0 : parseFloat(record?.[cagr]);
        return sum + sumAss;
      }, 0);
  });

  //fast 5
  const resultForCagr = allcagrVol.reduce(function (result, field, index) {
    result[allKeys[index]] = field;
    return result;
  }, {});

  //big5
  let sortablecagrData = [];
  for (var val in resultForCagr) {
    if (!isNaN(resultForCagr[val]) && resultForCagr[val]) {
      sortablecagrData.push([val, resultForCagr[val]]);
    }
  }
  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  //fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
  let fastFiveKeys = [];
  let fastFiveCagr = [];

  sortablecagrData
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 5)
    .map((val) => {
      fastFiveKeys.push(val[0]);
      fastFiveCagr.push(val[1]);
    });

  const fastFiveVolOne = fastFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volOne])
          ? 0
          : parseFloat(record?.[volOne]);
        return sum + sumAss;
      }, 0);
  });

  const fastFiveVolTwo = fastFiveKeys.map((val) => {
    return filterAgainst
      .filter((item) => item?.[uniqueKeyAgainst] == val)
      .reduce(function (sum, record) {
        const sumAss = isNaN(record?.[volTwo])
          ? 0
          : parseFloat(record?.[volTwo]);
        return sum + sumAss;
      }, 0);
  });

  // console.log(fastFiveKeys, fastFiveCagr, fastFiveVolOne, fastFiveVolTwo);

  return {
    allKeys,
    allVolOne,
    allVolTwo,
    allcagrVol,
    bigFiveKeys,
    bigFiveVolOne,
    bigFiveVolTwo,
    bigFiveCagr,
    fastFiveKeys,
    fastFiveVolOne,
    fastFiveVolTwo,
    fastFiveCagr,
  };
}
module.exports.getE2ERequirementGrowthSourceValues = (reqGrowthSource) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = {};

      response.data = {
        ingredients: {
          big5: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
          all: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
          fast5: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
        },
        components: {
          big5: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
          all: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
          fast5: {
            materialGroup: [],
            FY2023: [],
            FY2025: [],
            cagr: [],
          },
        },
      };

      if (reqGrowthSource) {
        const componentsVal = allBigFastETwoE(
          reqGrowthSource,
          "Components",
          "Material_type",
          "Material_Group_Description",
          "2023",
          "2025",
          "cagr"
        );
        //  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
        response.data.components.all.materialGroup = componentsVal.allKeys;
        response.data.components.all.FY2023 = componentsVal.allVolOne;
        response.data.components.all.FY2025 = componentsVal.allVolTwo;
        response.data.components.all.cagr = componentsVal.allcagrVol;

        response.data.components.big5.materialGroup = componentsVal.bigFiveKeys;
        response.data.components.big5.FY2023 = componentsVal.bigFiveVolOne;
        response.data.components.big5.FY2025 = componentsVal.bigFiveVolTwo;
        response.data.components.big5.cagr = componentsVal.bigFiveCagr;

        response.data.components.fast5.materialGroup =
          componentsVal.fastFiveKeys;
        response.data.components.fast5.FY2023 = componentsVal.fastFiveVolOne;
        response.data.components.fast5.FY2025 = componentsVal.fastFiveVolTwo;
        response.data.components.fast5.cagr = componentsVal.fastFiveCagr;

        const ingredientsVal = allBigFastETwoE(
          reqGrowthSource,
          "Ingredients",
          "Material_type",
          "Material_Group_Description",
          "2023",
          "2025",
          "cagr"
        );
        response.data.ingredients.all.materialGroup = ingredientsVal.allKeys;
        response.data.ingredients.all.FY2023 = ingredientsVal.allVolOne;
        response.data.ingredients.all.FY2025 = ingredientsVal.allVolTwo;
        response.data.ingredients.all.cagr = ingredientsVal.allcagrVol;

        response.data.ingredients.big5.materialGroup =
          ingredientsVal.bigFiveKeys;
        response.data.ingredients.big5.FY2023 = ingredientsVal.bigFiveVolOne;
        response.data.ingredients.big5.FY2025 = ingredientsVal.bigFiveVolTwo;
        response.data.ingredients.big5.cagr = ingredientsVal.bigFiveCagr;

        response.data.ingredients.fast5.materialGroup =
          ingredientsVal.fastFiveKeys;
        response.data.ingredients.fast5.FY2023 = ingredientsVal.fastFiveVolOne;
        response.data.ingredients.fast5.FY2025 = ingredientsVal.fastFiveVolTwo;
        response.data.ingredients.fast5.cagr = ingredientsVal.fastFiveCagr;
      }
      resolve(response);
    } catch (error) {}
  });
};

module.exports.getE2ERequirementGrowthMakeValues = (reqGrowthSource) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = {};

      response.data = {
        compounding: {
          big5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          all: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          fast5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
        },
        fill: {
          big5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          fast5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          all: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
        },
        assembly: {
          big5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          fast5: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
          all: {
            platform: {
              platform: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
            plant: {
              plant: [],
              FY2023: [],
              FY2025: [],
              cagr: [],
            },
          },
        },
      };
      if (reqGrowthSource) {
        // Resource_Type == "Compounding"
        //function allBigFastETwoE(sourceData, filterAgainstArr, uniqueIdentifier, uniqueKeyAgainst, volOne, volTwo, cagr){

        const compoundingPlatform = allBigFastETwoEE(
          reqGrowthSource,
          "Compounding",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Platform"
        );
        //  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
        response.data.compounding.all.platform.platform =
          compoundingPlatform.allKeys;
        response.data.compounding.all.platform.FY2023 =
          compoundingPlatform.allVolOne;
        response.data.compounding.all.platform.FY2025 =
          compoundingPlatform.allVolTwo;
        response.data.compounding.all.platform.cagr =
          compoundingPlatform.allcagrVol;

        response.data.compounding.big5.platform.platform =
          compoundingPlatform.bigFiveKeys;
        response.data.compounding.big5.platform.FY2023 =
          compoundingPlatform.bigFiveVolOne;
        response.data.compounding.big5.platform.FY2025 =
          compoundingPlatform.bigFiveVolTwo;
        response.data.compounding.big5.platform.cagr =
          compoundingPlatform.bigFiveCagr;

        response.data.compounding.fast5.platform.platform =
          compoundingPlatform.fastFiveKeys;
        response.data.compounding.fast5.platform.FY2023 =
          compoundingPlatform.fastFiveVolOne;
        response.data.compounding.fast5.platform.FY2025 =
          compoundingPlatform.fastFiveVolTwo;
        response.data.compounding.fast5.platform.cagr =
          compoundingPlatform.fastFiveCagr;

        const compoundingPlant = allBigFastETwoEE(
          reqGrowthSource,
          "Compounding",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Plant"
        );
        response.data.compounding.all.plant.plant = compoundingPlant.allKeys;
        response.data.compounding.all.plant.FY2023 = compoundingPlant.allVolOne;
        response.data.compounding.all.plant.FY2025 = compoundingPlant.allVolTwo;
        response.data.compounding.all.plant.cagr = compoundingPlant.allcagrVol;

        response.data.compounding.big5.plant.plant =
          compoundingPlant.bigFiveKeys;
        response.data.compounding.big5.plant.FY2023 =
          compoundingPlant.bigFiveVolOne;
        response.data.compounding.big5.plant.FY2025 =
          compoundingPlant.bigFiveVolTwo;
        response.data.compounding.big5.plant.cagr =
          compoundingPlant.bigFiveCagr;

        response.data.compounding.fast5.plant.plant =
          compoundingPlant.fastFiveKeys;
        response.data.compounding.fast5.plant.FY2023 =
          compoundingPlant.fastFiveVolOne;
        response.data.compounding.fast5.plant.FY2025 =
          compoundingPlant.fastFiveVolTwo;
        response.data.compounding.fast5.plant.cagr =
          compoundingPlant.fastFiveCagr;

        const FillPlatform = allBigFastETwoEE(
          reqGrowthSource,
          "Fill",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Platform"
        );
        //  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
        response.data.fill.all.platform.platform = FillPlatform.allKeys;
        response.data.fill.all.platform.FY2023 = FillPlatform.allVolOne;
        response.data.fill.all.platform.FY2025 = FillPlatform.allVolTwo;
        response.data.fill.all.platform.cagr = FillPlatform.allcagrVol;

        response.data.fill.big5.platform.platform = FillPlatform.bigFiveKeys;
        response.data.fill.big5.platform.FY2023 = FillPlatform.bigFiveVolOne;
        response.data.fill.big5.platform.FY2025 = FillPlatform.bigFiveVolTwo;
        response.data.fill.big5.platform.cagr = FillPlatform.bigFiveCagr;

        response.data.fill.fast5.platform.platform = FillPlatform.fastFiveKeys;
        response.data.fill.fast5.platform.FY2023 = FillPlatform.fastFiveVolOne;
        response.data.fill.fast5.platform.FY2025 = FillPlatform.fastFiveVolTwo;
        response.data.fill.fast5.platform.cagr = FillPlatform.fastFiveCagr;

        const fillgPlant = allBigFastETwoEE(
          reqGrowthSource,
          "Fill",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Plant"
        );
        response.data.fill.all.plant.plant = fillgPlant.allKeys;
        response.data.fill.all.plant.FY2023 = fillgPlant.allVolOne;
        response.data.fill.all.plant.FY2025 = fillgPlant.allVolTwo;
        response.data.fill.all.plant.cagr = fillgPlant.allcagrVol;

        response.data.fill.big5.plant.plant = fillgPlant.bigFiveKeys;
        response.data.fill.big5.plant.FY2023 = fillgPlant.bigFiveVolOne;
        response.data.fill.big5.plant.FY2025 = fillgPlant.bigFiveVolTwo;
        response.data.fill.big5.plant.cagr = fillgPlant.bigFiveCagr;

        response.data.fill.fast5.plant.plant = fillgPlant.fastFiveKeys;
        response.data.fill.fast5.plant.FY2023 = fillgPlant.fastFiveVolOne;
        response.data.fill.fast5.plant.FY2025 = fillgPlant.fastFiveVolTwo;
        response.data.fill.fast5.plant.cagr = fillgPlant.fastFiveCagr;

        const assemblyPlatform = allBigFastETwoEE(
          reqGrowthSource,
          "Assembly",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Platform"
        );
        //  //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr
        response.data.assembly.all.platform.platform = assemblyPlatform.allKeys;
        response.data.assembly.all.platform.FY2023 = assemblyPlatform.allVolOne;
        response.data.assembly.all.platform.FY2025 = assemblyPlatform.allVolTwo;
        response.data.assembly.all.platform.cagr = assemblyPlatform.allcagrVol;

        response.data.assembly.big5.platform.platform =
          assemblyPlatform.bigFiveKeys;
        response.data.assembly.big5.platform.FY2023 =
          assemblyPlatform.bigFiveVolOne;
        response.data.assembly.big5.platform.FY2025 =
          assemblyPlatform.bigFiveVolTwo;
        response.data.assembly.big5.platform.cagr =
          assemblyPlatform.bigFiveCagr;

        response.data.assembly.fast5.platform.platform =
          assemblyPlatform.fastFiveKeys;
        response.data.assembly.fast5.platform.FY2023 =
          assemblyPlatform.fastFiveVolOne;
        response.data.assembly.fast5.platform.FY2025 =
          assemblyPlatform.fastFiveVolTwo;
        response.data.assembly.fast5.platform.cagr =
          assemblyPlatform.fastFiveCagr;

        const assemblyPlant = allBigFastETwoEE(
          reqGrowthSource,
          "Assembly",
          "Resource_Type",
          "Dimension",
          "2023",
          "2025",
          "cagr",
          "Type",
          "Plant"
        );
        response.data.assembly.all.plant.plant = assemblyPlant.allKeys;
        response.data.assembly.all.plant.FY2023 = assemblyPlant.allVolOne;
        response.data.assembly.all.plant.FY2025 = assemblyPlant.allVolTwo;
        response.data.assembly.all.plant.cagr = assemblyPlant.allcagrVol;

        response.data.assembly.big5.plant.plant = assemblyPlant.bigFiveKeys;
        response.data.assembly.big5.plant.FY2023 = assemblyPlant.bigFiveVolOne;
        response.data.assembly.big5.plant.FY2025 = assemblyPlant.bigFiveVolTwo;
        response.data.assembly.big5.plant.cagr = assemblyPlant.bigFiveCagr;

        response.data.assembly.fast5.plant.plant = assemblyPlant.fastFiveKeys;
        response.data.assembly.fast5.plant.FY2023 =
          assemblyPlant.fastFiveVolOne;
        response.data.assembly.fast5.plant.FY2025 =
          assemblyPlant.fastFiveVolTwo;
        response.data.assembly.fast5.plant.cagr = assemblyPlant.fastFiveCagr;

        resolve(response);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

// module.exports.getE2ERequirementGrowthSourceValues = (reqGrowthSource) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let output = {
//         ingredients: {
//           big5: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//           all: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//           fast5: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//         },
//         components: {
//           big5: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//           all: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//           fast5: {
//             materialGroup: [],
//             FY2023: [],
//             FY2025: [],
//             cagr: [],
//           },
//         },
//       };
//       // console.log(reqGrowthSource[0]);
//       if (reqGrowthSource) {
//         reqGrowthSource
//           .filter((a) => {
//             return a.Year > 2022;
//           })
//           .sort(function (a, b) {
//             return a["2023"] - b["2023"];
//           });

//         // ingredients
//         let uniqueIngredientsMaterialGrp = reqGrowthSource
//           .filter((x) => x.Material_type == "Ingredients")
//           .map((x) => x.Material_Group_Description);
//         uniqueIngredientsMaterialGrp = [
//           ...new Set(uniqueIngredientsMaterialGrp),
//         ];

//         // all
//         // all material groups
//         output.ingredients.all.materialGroup.push(
//           ...uniqueIngredientsMaterialGrp
//         );
//         // FY2023
//         output.ingredients.all.FY2023.push(
//           ...uniqueIngredientsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"]
//                   ? parseFloat(record?.["2023"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // FY2025
//         output.ingredients.all.FY2025.push(
//           ...uniqueIngredientsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"]
//                   ? parseFloat(record?.["2025"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // cagr
//         output.ingredients.all.cagr.push(
//           ...uniqueIngredientsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"]
//                   ? parseFloat(record?.["cagr"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         //big 5
//         // big 5 material groups
//         output.ingredients.big5.materialGroup.push(
//           ...uniqueIngredientsMaterialGrp.slice(0, 5)
//         );
//         // FY2023
//         output.ingredients.big5.FY2023.push(
//           ...uniqueIngredientsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"]
//                   ? parseFloat(record?.["2023"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // FY2025
//         output.ingredients.big5.FY2025.push(
//           ...uniqueIngredientsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"]
//                   ? parseFloat(record?.["2025"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // cagr
//         output.ingredients.big5.cagr.push(
//           ...uniqueIngredientsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"]
//                   ? parseFloat(record?.["cagr"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // components
//         let uniqueComponentsMaterialGrp = reqGrowthSource
//           .filter((x) => x.Material_type == "Components")
//           .map((x) => x.Material_Group_Description);
//         uniqueComponentsMaterialGrp = [...new Set(uniqueComponentsMaterialGrp)];
//         // console.log(
//         //   "uniqueComponentsMaterialGrp: ",
//         //   uniqueComponentsMaterialGrp
//         // );

//         // all
//         // all material groups
//         output.components.all.materialGroup.push(
//           ...uniqueComponentsMaterialGrp
//         );
//         // FY2023
//         output.components.all.FY2023.push(
//           ...uniqueComponentsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"]
//                   ? parseFloat(record?.["2023"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // FY2025
//         output.components.all.FY2025.push(
//           ...uniqueComponentsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"]
//                   ? parseFloat(record?.["2025"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // cagr
//         output.components.all.cagr.push(
//           ...uniqueComponentsMaterialGrp.map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"]
//                   ? parseFloat(record?.["cagr"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         //big 5
//         // big 5 material groups
//         // console.log(
//         //   "uniqueComponentsMaterialGrp: **",
//         //   uniqueComponentsMaterialGrp
//         // );
//         output.components.big5.materialGroup.push(
//           ...uniqueComponentsMaterialGrp.slice(0, 5)
//         );
//         // FY2023
//         output.components.big5.FY2023.push(
//           ...uniqueComponentsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"]
//                   ? parseFloat(record?.["2023"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // FY2025
//         output.components.big5.FY2025.push(
//           ...uniqueComponentsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"]
//                   ? parseFloat(record?.["2025"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         //cagr
//         output.components.big5.cagr.push(
//           ...uniqueComponentsMaterialGrp.slice(0, 5).map((val) => {
//             return reqGrowthSource
//               .filter((item) => {
//                 if (item["Material_Group_Description"] == val) return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"]
//                   ? parseFloat(record?.["cagr"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//       }

//       // fast 5
//       //sort data by cagr
//       reqGrowthSource
//         .filter((a) => {
//           return a.Year > 2022;
//         })
//         .sort(function (a, b) {
//           return a["cagr"] - b["cagr"];
//         });

//       // unique components for fast 5
//       let uniqueIngredientsFast5 = reqGrowthSource
//         .filter((x) => x.Material_type == "Ingredients")
//         .map((x) => x.Material_Group_Description);
//       uniqueIngredientsFast5 = [...new Set(uniqueIngredientsFast5)];

//       output.ingredients.fast5.materialGroup.push(
//         ...uniqueIngredientsFast5.slice(0, 5)
//       );
//       // FY2023
//       output.ingredients.fast5.FY2023.push(
//         ...uniqueIngredientsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["2023"] ? parseFloat(record?.["2023"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );
//       // FY2025
//       output.ingredients.fast5.FY2025.push(
//         ...uniqueIngredientsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["2025"] ? parseFloat(record?.["2025"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );
//       // cagr
//       output.ingredients.fast5.cagr.push(
//         ...uniqueIngredientsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["cagr"] ? parseFloat(record?.["cagr"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );

//       //components
//       let uniqueComponentsFast5 = reqGrowthSource
//         .filter((x) => x.Material_type == "Components")
//         .map((x) => x.Material_Group_Description);
//       uniqueComponentsFast5 = [...new Set(uniqueComponentsFast5)];

//       output.components.fast5.materialGroup.push(
//         ...uniqueComponentsFast5.slice(0, 5)
//       );
//       // FY2023
//       output.components.fast5.FY2023.push(
//         ...uniqueComponentsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["2023"] ? parseFloat(record?.["2023"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );
//       // FY2025
//       output.components.fast5.FY2025.push(
//         ...uniqueComponentsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["2025"] ? parseFloat(record?.["2025"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );
//       // cagr
//       output.components.fast5.cagr.push(
//         ...uniqueComponentsFast5.slice(0, 5).map((val) => {
//           return reqGrowthSource
//             .filter((item) => {
//               if (item["Material_Group_Description"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["cagr"] ? parseFloat(record?.["cagr"]) : 0;
//               return sum + sumAss;
//             }, 0);
//         })
//       );

//       // console.log("output: ", output);
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message = "Success: e2e revenue growth information";
//       response.data = output;
//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

// module.exports.getE2ERequirementGrowthMakeValues = (reqGrowthMakeData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let reqGrowthMake = reqGrowthMakeData;
//       let output = {
//         compounding: {
//           big5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           all: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           fast5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//         },
//         fill: {
//           big5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           fast5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           all: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//         },
//         assembly: {
//           big5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           fast5: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//           all: {
//             platform: {
//               platform: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//             plant: {
//               plant: [],
//               FY2023: [],
//               FY2025: [],
//               cagr: [],
//             },
//           },
//         },
//       };
//       // console.log(reqGrowthMake[0]);
//       if (reqGrowthMake) {
//         reqGrowthMake
//           .filter((a) => {
//             return a.Year > 2022;
//           })
//           .sort(function (a, b) {
//             return a["2023"] - b["2023"];
//           });

//         // compounding
//         // platform
//         let uniqueCompoundingPlatform = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Compounding")
//           .map((x) => x.Platform);
//         uniqueCompoundingPlatform = [...new Set(uniqueCompoundingPlatform)];

//         // platform
//         output.compounding.all.platform.platform.push(
//           ...uniqueCompoundingPlatform
//         );
//         //FY2023
//         output.compounding.all.platform.FY2023.push(
//           ...uniqueCompoundingPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.all.platform.FY2025.push(
//           ...uniqueCompoundingPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         ////cagr
//         output.compounding.all.platform.cagr.push(
//           ...uniqueCompoundingPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // compounding
//         // plant
//         let uniqueCompoundingPlants = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Compounding")
//           .map((x) => x.Plant);
//         uniqueCompoundingPlants = [...new Set(uniqueCompoundingPlants)];

//         // platform
//         output.compounding.all.plant.plant.push(...uniqueCompoundingPlants);
//         //FY2023
//         output.compounding.all.plant.FY2023.push(
//           ...uniqueCompoundingPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.all.plant.FY2025.push(
//           ...uniqueCompoundingPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.compounding.all.plant.cagr.push(
//           ...uniqueCompoundingPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // compounding big 5
//         // compounding

//         // platform
//         output.compounding.big5.platform.platform.push(
//           ...uniqueCompoundingPlatform.slice(0, 5)
//         );
//         //FY2023
//         output.compounding.big5.platform.FY2023.push(
//           ...uniqueCompoundingPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.big5.platform.FY2025.push(
//           ...uniqueCompoundingPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.compounding.big5.platform.cagr.push(
//           ...uniqueCompoundingPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // compounding
//         // plant big 5

//         // plant
//         output.compounding.big5.plant.plant.push(
//           ...uniqueCompoundingPlants.slice(0, 5)
//         );
//         //FY2023
//         output.compounding.big5.plant.FY2023.push(
//           ...uniqueCompoundingPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.big5.plant.FY2025.push(
//           ...uniqueCompoundingPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         ////cagr
//         output.compounding.big5.plant.cagr.push(
//           ...uniqueCompoundingPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill all
//         // platform
//         let uniqueFillPlatform = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Fill")
//           .map((x) => x.Platform);
//         uniqueFillPlatform = [...new Set(uniqueFillPlatform)];

//         // platform
//         output.fill.all.platform.platform.push(...uniqueFillPlatform);
//         //FY2023
//         output.fill.all.platform.FY2023.push(
//           ...uniqueFillPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   ////////////
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.all.platform.FY2025.push(
//           ...uniqueFillPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.all.platform.cagr.push(
//           ...uniqueFillPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill
//         // plant
//         let uniqueFillPlants = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Fill")
//           .map((x) => x.Plant);
//         uniqueFillPlants = [...new Set(uniqueFillPlants)];

//         // platform
//         output.fill.all.plant.plant.push(...uniqueFillPlants);
//         //FY2023
//         output.fill.all.plant.FY2023.push(
//           ...uniqueFillPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.all.plant.FY2025.push(
//           ...uniqueFillPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.all.plant.cagr.push(
//           ...uniqueFillPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill big 5
//         let uniqueFillPlatformFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Fill")
//           .map((x) => x.Platform);
//         uniqueFillPlatformFast5 = [...new Set(uniqueFillPlatformFast5)];

//         // platform
//         output.fill.big5.platform.platform.push(
//           ...uniqueFillPlatformFast5.slice(0, 5)
//         );
//         //FY2023
//         output.fill.big5.platform.FY2023.push(
//           ...uniqueFillPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.big5.platform.FY2025.push(
//           ...uniqueFillPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.big5.platform.cagr.push(
//           ...uniqueFillPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill big 5
//         // plant

//         // plant
//         output.fill.big5.plant.plant.push(...uniqueFillPlants);
//         //FY2023
//         output.fill.big5.plant.FY2023.push(
//           ...uniqueFillPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.big5.plant.FY2025.push(
//           ...uniqueFillPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.big5.plant.cagr.push(
//           ...uniqueFillPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // assembly all
//         // platform
//         let uniqueAssemblyPlatform = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Assembly")
//           .map((x) => x.Platform);
//         uniqueAssemblyPlatform = [...new Set(uniqueAssemblyPlatform)];

//         // platform
//         output.assembly.all.platform.platform.push(...uniqueAssemblyPlatform);
//         //FY2023
//         output.assembly.all.platform.FY2023.push(
//           ...uniqueAssemblyPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.all.platform.FY2025.push(
//           ...uniqueAssemblyPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.assembly.all.platform.cagr.push(
//           ...uniqueAssemblyPlatform.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // assembly all
//         // plant
//         let uniqueAssemblyPlants = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Assembly")
//           .map((x) => x.Plant);
//         // console.log("uniqueAssemblyPlants: ", uniqueAssemblyPlants);

//         // plant
//         output.assembly.all.plant.plant.push(...uniqueAssemblyPlants);
//         //FY2023
//         output.assembly.all.plant.FY2023.push(
//           ...uniqueAssemblyPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.all.plant.FY2025.push(
//           ...uniqueAssemblyPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.all.plant.cagr.push(
//           ...uniqueAssemblyPlants.map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // assembly big 5

//         // platform
//         output.assembly.big5.platform.platform.push(
//           ...uniqueAssemblyPlatform.slice(0, 5)
//         );
//         //FY2023
//         output.assembly.big5.platform.FY2023.push(
//           ...uniqueAssemblyPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.big5.platform.FY2025.push(
//           ...uniqueAssemblyPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.assembly.big5.platform.cagr.push(
//           ...uniqueAssemblyPlatform.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // assembly big5
//         //plant

//         // plant
//         output.assembly.big5.plant.plant.push(
//           ...uniqueAssemblyPlants.slice(0, 5)
//         );
//         //FY2023
//         output.assembly.big5.plant.FY2023.push(
//           ...uniqueAssemblyPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.big5.plant.FY2025.push(
//           ...uniqueAssemblyPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.assembly.big5.plant.cagr.push(
//           ...uniqueAssemblyPlants.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fast 5
//         // sort make data by cagr
//         reqGrowthMake
//           .filter((a) => {
//             return a.Year > 2022;
//           })
//           .sort(function (a, b) {
//             return a["cagr"] - b["cagr"];
//           });

//         // assembly fast5
//         // plant
//         let uniqueCompoundingPlantsFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Compounding")
//           .map((x) => x.Plant);
//         uniqueCompoundingPlantsFast5 = [
//           ...new Set(uniqueCompoundingPlantsFast5),
//         ];

//         // plant
//         output.assembly.fast5.plant.plant.push(
//           ...uniqueCompoundingPlantsFast5.slice(0, 5)
//         );
//         //FY2023
//         output.assembly.fast5.plant.FY2023.push(
//           ...uniqueCompoundingPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.fast5.plant.FY2025.push(
//           ...uniqueCompoundingPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.assembly.fast5.plant.cagr.push(
//           ...uniqueCompoundingPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // assembly fast 5
//         // platform
//         let uniqueAssemblyPlatformFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Assembly")
//           .map((x) => x.Platform);
//         uniqueAssemblyPlatformFast5 = [...new Set(uniqueAssemblyPlatformFast5)];

//         // platform
//         output.assembly.fast5.platform.platform.push(
//           ...uniqueAssemblyPlatformFast5.slice(0, 5)
//         );
//         //FY2023
//         output.assembly.fast5.platform.FY2023.push(
//           ...uniqueAssemblyPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.assembly.fast5.platform.FY2025.push(
//           ...uniqueAssemblyPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.assembly.fast5.platform.cagr.push(
//           ...uniqueAssemblyPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill fast 5
//         // plant
//         let uniqueFillPlantsFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Fill")
//           .map((x) => x.Plant);
//         uniqueFillPlantsFast5 = [...new Set(uniqueFillPlantsFast5)];

//         // plant
//         output.fill.fast5.plant.plant.push(...uniqueFillPlantsFast5);
//         //FY2023
//         output.fill.fast5.plant.FY2023.push(
//           ...uniqueFillPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.fast5.plant.FY2025.push(
//           ...uniqueFillPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.fast5.plant.cagr.push(
//           ...uniqueFillPlantsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         let uniqueFillplatformsFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Fill")
//           .map((x) => x.Platform);
//         uniqueFillplatformsFast5 = [...new Set(uniqueFillplatformsFast5)];
//         // platform
//         output.fill.fast5.platform.platform.push(
//           ...uniqueFillplatformsFast5.slice(0, 5)
//         );
//         //FY2023
//         output.fill.fast5.platform.FY2023.push(
//           ...uniqueFillplatformsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.fill.fast5.platform.FY2025.push(
//           ...uniqueFillplatformsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.fill.fast5.platform.cagr.push(
//           ...uniqueFillplatformsFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // fill big 5
//         let uniqueCompoundinglPlatformFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Compounding")
//           .map((x) => x.Platform);
//         uniqueCompoundinglPlatformFast5 = [
//           ...new Set(uniqueCompoundinglPlatformFast5),
//         ];

//         // platform
//         output.compounding.fast5.platform.platform.push(
//           ...uniqueCompoundinglPlatformFast5.slice(0, 5)
//         );
//         //FY2023
//         output.compounding.fast5.platform.FY2023.push(
//           ...uniqueCompoundinglPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.fast5.platform.FY2025.push(
//           ...uniqueCompoundinglPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2025"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.compounding.fast5.platform.cagr.push(
//           ...uniqueCompoundinglPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Platform"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // compounding fast 5

//         let uniqueCompoundingPlatformFast5 = reqGrowthMake
//           .filter((x) => x.Resource_Type == "Compounding")
//           .map((x) => x.Plant);
//         uniqueCompoundingPlatformFast5 = [
//           ...new Set(uniqueCompoundingPlatformFast5),
//         ];

//         // platform
//         output.compounding.fast5.plant.plant.push(
//           ...uniqueCompoundingPlatformFast5.slice(0, 5)
//         );
//         //FY2023
//         output.compounding.fast5.plant.FY2023.push(
//           ...uniqueCompoundingPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2023]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2023"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////FY2025
//         output.compounding.fast5.plant.FY2025.push(
//           ...uniqueCompoundingPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["2023"] ? parseFloat(record["2025"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         ////cagr
//         output.compounding.fast5.plant.cagr.push(
//           ...uniqueCompoundingPlatformFast5.slice(0, 5).map((val) => {
//             return reqGrowthMake
//               .filter((item) => {
//                 // console.log("item", item);
//                 if (item?.["Plant"] == val && item?.[2025]) {
//                   return item;
//                 }
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["cagr"] ? parseFloat(record["cagr"]) : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//       }

//       // console.log("output: ", output);
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message = "Success: e2e requirement growth make information";
//       response.data = output;
//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

module.exports.getE2ERequirementGrowthFulfillValues = (reqGrowthFulfill) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = {};

      response.data = {
        region: [],
        FY2023: [],
        FY2025: [],
        cagr: [],
      };
      // let output = {
      //   region: [],
      //   FY2023: [],
      //   FY2025: [],
      //   cagr: [],
      // };
      // console.log(reqGrowthFulfill[0]);
      if (reqGrowthFulfill) {
        // const filterAgainst = reqGrowthFulfill.filter(
        //   (val) => val?.[uniqueIdentifier] == filterAgainstArr
        // );
        // const ingredients = sourceData.filter(val => val?.[uniqueIdentifier] == filterAgainst[1]);

        const keys = [
          ...new Set(reqGrowthFulfill.map((item) => item?.["DEST_REGION"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        const volOneNew = keys.map((val) => {
          return reqGrowthFulfill
            .filter((item) => item?.["DEST_REGION"] == val)
            .reduce(function (sum, record) {
              const sumAss = isNaN(record?.["2023"])
                ? 0
                : parseFloat(record?.["2023"]);
              return sum + sumAss;
            }, 0);
        });

        const resultDesc = volOneNew.reduce(function (result, field, index) {
          result[keys[index]] = field;
          return result;
        }, {});

        //big5
        let sortableVolumeDataDesc = [];
        for (var val in resultDesc) {
          if (!isNaN(resultDesc[val]) && resultDesc[val]) {
            sortableVolumeDataDesc.push([val, resultDesc[val]]);
          }
        }
        //allKeys, allVolOne, allVolTwo, allcagrVol, bigFiveKeys, bigFiveVolOne, bigFiveVolTwo, bigFiveCagr, fastFiveKeys, fastFiveVolOne, fastFiveVolTwo, fastFiveCagr

        let allKeys = [];
        let vol2023 = [];
        sortableVolumeDataDesc
          .sort(function (a, b) {
            return a[1] - b[1];
          })
          .reverse()
          .map((val) => {
            allKeys.push(val[0]);
            vol2023.push(val[1]);
          });

        response.data.region = allKeys;
        response.data.FY2023 = vol2023;

        const vol2025 = allKeys.map((val) => {
          return reqGrowthFulfill
            .filter((item) => item?.["DEST_REGION"] == val)
            .reduce(function (sum, record) {
              const sumAss = isNaN(record?.["2025"])
                ? 0
                : parseFloat(record?.["2025"]);
              return sum + sumAss;
            }, 0);
        });

        const cagr = allKeys.map((val) => {
          return reqGrowthFulfill
            .filter((item) => item?.["DEST_REGION"] == val)
            .reduce(function (sum, record) {
              const sumAss = isNaN(record?.["cagr"])
                ? 0
                : parseFloat(record?.["cagr"]);
              return sum + sumAss;
            }, 0);
        });

        response.data.FY2025 = vol2025;
        response.data.cagr = cagr;

        // reqGrowthFulfill
        //   .filter((a) => {
        //     return a.Year > 2022;
        //   })
        //   .sort(function (a, b) {
        //     return a["2023"] - b["2023"];
        //   });

        // // ingredients
        // let uniqueRegions = [
        //   ...new Set(reqGrowthFulfill.map((item) => item?.["DEST_REGION"])),
        // ].filter((item) => item != "" && item != undefined && item != null);

        // // all
        // // all regions
        // output.region.push(...uniqueRegions);
        // // FY2023
        // output.FY2023.push(
        //   ...uniqueRegions.map((val) => {
        //     return reqGrowthFulfill
        //       .filter((item) => {
        //         if (item["DEST_REGION"] == val) return item;
        //       })
        //       .reduce(function (sum, record) {
        //         const sumAss = record["2023"]
        //           ? parseFloat(record?.["2023"])
        //           : 0;
        //         return sum + sumAss;
        //       }, 0);
        //   })
        // );
        // // FY2025
        // output.FY2025.push(
        //   ...uniqueRegions.map((val) => {
        //     return reqGrowthFulfill
        //       .filter((item) => {
        //         if (item["DEST_REGION"] == val) return item;
        //       })
        //       .reduce(function (sum, record) {
        //         const sumAss = record["2025"]
        //           ? parseFloat(record?.["2025"])
        //           : 0;
        //         return sum + sumAss;
        //       }, 0);
        //   })
        // );
        // // cagr
        // output.cagr.push(
        //   ...uniqueRegions.map((val) => {
        //     return reqGrowthFulfill
        //       .filter((item) => {
        //         if (item["DEST_REGION"] == val) return item;
        //       })
        //       .reduce(function (sum, record) {
        //         const sumAss = record["cagr"]
        //           ? parseFloat(record?.["cagr"])
        //           : 0;
        //         return sum + sumAss;
        //       }, 0);
        //   })
        // );
      }

      // console.log("output: ", output);

      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

// module.exports.getE2EInventoryByNodeValues = (invByNode) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let output = {
//         all: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         internalMfg: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         tpm: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         dc: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//       };
//      // invByNode =
//       // console.log(invByNode[0]);
//       if (invByNode) {

//         // all
//         // inventoryUnits locationType
//         let uniqueAllLocations = [
//           ...new Set(invByNode.map((item) => item?.["Plant_Name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         let arr = []

//         var invByNodeUnitsDataDesc = uniqueAllLocations.map((val) => {
//           var obj ={
//             name:null,
//             sum:null
//           }
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val)
//                 return item;
//             }).reduce(function (sum, record) {
//               const sumAss = record["Inventory_Units"]
//                 ? parseFloat(record?.["Inventory_Units"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//             arr.push(obj);
//         });

//         const unitsDataDesc = arr.sort(
//           (a, b) => b.sum - a.sum
//         );

// console.log(unitsDataDesc)

//         let uniqueAllLocationsDesc = [
//           ...new Set(invByNode.map((item) => item?.["Plant_Name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         //console.log("invByNodeUnitsDataDesc", invByNodeUnitsDataDesc);

//         // locationType
//         output.all.inventoryUnits["Location Type"].push(...uniqueAllLocationsDesc);
//         // omponents
//         output.all.inventoryUnits.Component.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // console.log(
//         //   "*******output.all.inventoryUnits: ",
//         //   output.all.inventoryUnits
//         // );
//         // finishedGoods
//         output.all.inventoryUnits["Finished Goods"].push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.all.inventoryUnits["MFG Mass"].push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.all.inventoryUnits.Ingredients.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.all.inventoryUnits.WIP.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // locationType
//         output.all.inventory$["Location Type"].push(...uniqueAllLocations);
//         // components
//         output.all.inventory$.Component.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.all.inventory$["Finished Goods"].push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.all.inventory$["MFG Mass"].push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.all.inventory$.Ingredients.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.all.inventory$.WIP.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // internalMfg
//         // inventoryUnits locationType
//         let uniqueInternalMfgLocations = invByNode
//           .filter((x) => x.Plant_Desc == "Internal Mfg")
//           .map((x) => x.Plant_Name);
//         // console.log("uniqueInternalMfgLocations: ", uniqueInternalMfgLocations);

//         // locationType
//         output.internalMfg.inventoryUnits["Location Type"].push(
//           ...uniqueInternalMfgLocations
//         );
//         // components
//         output.internalMfg.inventoryUnits.Component.push(
//           ...uniqueAllLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               }) //
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.internalMfg.inventoryUnits["Finished Goods"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.internalMfg.inventoryUnits["MFG Mass"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.internalMfg.inventoryUnits.Ingredients.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.internalMfg.inventoryUnits.WIP.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // locationType
//         output.internalMfg.inventory$["Location Type"].push(
//           ...uniqueInternalMfgLocations
//         );
//         // components
//         output.internalMfg.inventory$.Component.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.internalMfg.inventory$["Finished Goods"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.internalMfg.inventory$["MFG Mass"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.internalMfg.inventory$.Ingredients.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.internalMfg.inventory$.WIP.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // tpm
//         // inventoryUnits locationType
//         let uniqueTpmLocations = invByNode
//           .filter((x) => x.Plant_Desc == "TPM")
//           .map((x) => x.Plant_Name);
//         // console.log("uniqueTpmLocations: ", uniqueTpmLocations);

//         // locationType
//         output.tpm.inventoryUnits["Location Type"].push(...uniqueAllLocations);
//         // components
//         output.tpm.inventoryUnits.Component.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.tpm.inventoryUnits["Finished Goods"].push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.tpm.inventoryUnits["MFG Mass"].push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.tpm.inventoryUnits.Ingredients.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.tpm.inventoryUnits.WIP.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // locationType
//         output.tpm.inventory$["Location Type"].push(...uniqueTpmLocations);
//         // components
//         output.tpm.inventory$.Component.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.tpm.inventory$["Finished Goods"].push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.tpm.inventory$["MFG Mass"].push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.tpm.inventory$.Ingredients.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.tpm.inventory$.WIP.push(
//           ...uniqueTpmLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // dc
//         // inventoryUnits locationType
//         let uniqueDcLocations = invByNode
//           .filter((x) => x.Plant_Desc == "DC")
//           .map((x) => x.Plant_Name);
//         // console.log("uniqueDcLocations: ", uniqueDcLocations);

//         // locationType
//         output.dc.inventoryUnits["Location Type"].push(...uniqueDcLocations);
//         // components
//         output.dc.inventoryUnits.Component.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.dc.inventoryUnits["Finished Goods"].push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.dc.inventoryUnits["MFG Mass"].push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.dc.inventoryUnits.Ingredients.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.dc.inventoryUnits.WIP.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // locationType
//         output.dc.inventory$["Location Type"].push(...uniqueAllLocations);
//         // components
//         output.dc.inventory$.Component.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.dc.inventory$["Finished Goods"].push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.dc.inventory$["MFG Mass"].push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.dc.inventory$.Ingredients.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.dc.inventory$.WIP.push(
//           ...uniqueDcLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//       }

//       // console.log("output", output);

//       // console.log("output: ", output);
//       const response = {};
//       response.statusCode = constants.HTTP_200;
//       response.message = "Success: e2e inventory by node information";
//       response.data = output;
//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

function e2eInventory(invByNode, IsUnits, isFilter, filterVal) {
  let uniqueAllLocations;
  if (!isFilter) {
    uniqueAllLocations = [
      ...new Set(invByNode.map((item) => item?.["Plant_Name"])),
    ].filter((item) => item != "" && item != undefined && item != null);
  } else {
    uniqueAllLocations = [
      ...new Set(
        invByNode
          .filter((val) => val.Plant_Desc == filterVal)
          .map((item) => item?.["Plant_Name"])
      ),
    ].filter((item) => item != "" && item != undefined && item != null);
  }

  let arrUnitsDesc = [];

  uniqueAllLocations.map((val) => {
    var obj = {
      name: null,
      sum: null,
    };
    obj.name = val;
    if (IsUnits) {
      obj.sum = invByNode
        .filter((item) => {
          if (item["Plant_Name"] == val) return item;
        })
        .reduce(function (sum, record) {
          const sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
          return sum + sumAss;
        }, 0);
    } else {
      obj.sum = invByNode
        .filter((item) => {
          if (item["Plant_Name"] == val) return item;
        })
        .reduce(function (sum, record) {
          const sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
          return sum + sumAss;
        }, 0);
    }
    arrUnitsDesc.push(obj);
  });

  const unitsDataDesc = arrUnitsDesc.sort((a, b) => b.sum - a.sum);

  let LocationType = [];
  unitsDataDesc.map((item) => LocationType.push(item?.["name"]));
  // components

  let Component = LocationType.map((val) => {
    return invByNode
      .filter((item) => {
        if (
          item["MaterialType_desc"] == "Components" &&
          item["Plant_Name"] == val
        )
          return item;
      })
      .reduce(function (sum, record) {
        var sumAss = 0;
        if (IsUnits) {
          sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
        } else {
          sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
        }
        return sum + sumAss;
      }, 0);
  });

  // finishedGoods
  let finishedGoods = LocationType.map((val) => {
    return invByNode
      .filter((item) => {
        if (item["MaterialType_desc"] == "FG" && item["Plant_Name"] == val)
          return item;
      })
      .reduce(function (sum, record) {
        var sumAss = 0;
        if (IsUnits) {
          sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
        } else {
          sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
        }
        return sum + sumAss;
      }, 0);
  });

  // mfgMass
  let mfgMass = LocationType.map((val) => {
    return invByNode
      .filter((item) => {
        if (item["MaterialType_desc"] == "Mass" && item["Plant_Name"] == val)
          return item;
      })
      .reduce(function (sum, record) {
        var sumAss = 0;
        if (IsUnits) {
          sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
        } else {
          sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
        }
        return sum + sumAss;
      }, 0);
  });

  // ingredients

  let Ingredients = LocationType.map((val) => {
    return invByNode
      .filter((item) => {
        if (
          item["MaterialType_desc"] == "Ingredients" &&
          item["Plant_Name"] == val
        )
          return item;
      })
      .reduce(function (sum, record) {
        var sumAss = 0;
        if (IsUnits) {
          sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
        } else {
          sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
        }
        return sum + sumAss;
      }, 0);
  });

  // wip
  let wip = LocationType.map((val) => {
    return invByNode
      .filter((item) => {
        if (item["MaterialType_desc"] == "WIP" && item["Plant_Name"] == val)
          return item;
      })
      .reduce(function (sum, record) {
        var sumAss = 0;
        if (IsUnits) {
          sumAss = record["Inventory_Units"]
            ? parseFloat(record?.["Inventory_Units"])
            : 0;
        } else {
          sumAss = record["Inventory_Cost"]
            ? parseFloat(record?.["Inventory_Cost"])
            : 0;
        }
        return sum + sumAss;
      }, 0);
  });

  return { LocationType, Component, finishedGoods, mfgMass, Ingredients, wip };
}

module.exports.getE2EInventoryByNodeValues = (invByNode) => {
  return new Promise(async (resolve, reject) => {
    try {
      let output = {
        all: {
          inventoryUnits: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
          inventory$: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
        },
        internalMfg: {
          inventoryUnits: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
          inventory$: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
        },
        tpm: {
          inventoryUnits: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
          inventory$: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
        },
        dc: {
          inventoryUnits: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
          inventory$: {
            "Location Type": [],
            Component: [],
            "Finished Goods": [],
            "MFG Mass": [],
            Ingredients: [],
            WIP: [],
          },
        },
      };
      if (invByNode) {
        invByNode = invByNode.filter((val) => val.Plant_Name != null);

        const names = ["Components", "FG", "WIP", "Mass", "Ingredients"];

        invByNode = invByNode.filter((item) => {
          return names.includes(item.MaterialType_desc);
        });

        // invByNode, IsUnits, isFilter, filterVal
        const allInventoryUnits = await e2eInventory(
          invByNode,
          true,
          false,
          ""
        );
        output.all.inventoryUnits["Location Type"] =
          allInventoryUnits?.LocationType;
        output.all.inventoryUnits.Component = allInventoryUnits?.Component;
        output.all.inventoryUnits["Finished Goods"] =
          allInventoryUnits?.finishedGoods;
        output.all.inventoryUnits["MFG Mass"] = allInventoryUnits?.mfgMass;
        output.all.inventoryUnits.Ingredients = allInventoryUnits?.Ingredients;
        output.all.inventoryUnits.WIP = allInventoryUnits?.wip;

        const allinventory$ = await e2eInventory(invByNode, false, false, "");
        output.all.inventory$["Location Type"] = allinventory$?.LocationType;
        output.all.inventory$.Component = allinventory$?.Component;
        output.all.inventory$["Finished Goods"] = allinventory$?.finishedGoods;
        output.all.inventory$["MFG Mass"] = allinventory$?.mfgMass;
        output.all.inventory$.Ingredients = allinventory$?.Ingredients;
        output.all.inventory$.WIP = allinventory$?.wip;
        // Plant_Desc == "Internal Mfg"

        const allinventoryinternalMfgUnits = await e2eInventory(
          invByNode,
          true,
          true,
          "Internal Mfg"
        );
        output.internalMfg.inventoryUnits["Location Type"] =
          allinventoryinternalMfgUnits?.LocationType;
        output.internalMfg.inventoryUnits.Component =
          allinventoryinternalMfgUnits?.Component;
        output.internalMfg.inventoryUnits["Finished Goods"] =
          allinventoryinternalMfgUnits?.finishedGoods;
        output.internalMfg.inventoryUnits["MFG Mass"] =
          allinventoryinternalMfgUnits?.mfgMass;
        output.internalMfg.inventoryUnits.Ingredients =
          allinventoryinternalMfgUnits?.Ingredients;
        output.internalMfg.inventoryUnits.WIP =
          allinventoryinternalMfgUnits?.wip;

        const allinventoryinternalMfgRevenue = await e2eInventory(
          invByNode,
          false,
          true,
          "Internal Mfg"
        );
        output.internalMfg.inventory$["Location Type"] =
          allinventoryinternalMfgRevenue?.LocationType;
        output.internalMfg.inventory$.Component =
          allinventoryinternalMfgRevenue?.Component;
        output.internalMfg.inventory$["Finished Goods"] =
          allinventoryinternalMfgRevenue?.finishedGoods;
        output.internalMfg.inventory$["MFG Mass"] =
          allinventoryinternalMfgRevenue?.mfgMass;
        output.internalMfg.inventory$.Ingredients =
          allinventoryinternalMfgRevenue?.Ingredients;
        output.internalMfg.inventory$.WIP = allinventoryinternalMfgRevenue?.wip;

        const allinventoryTpmUnits = await e2eInventory(
          invByNode,
          true,
          true,
          "TPM"
        );
        output.tpm.inventoryUnits["Location Type"] =
          allinventoryTpmUnits?.LocationType;
        output.tpm.inventoryUnits.Component = allinventoryTpmUnits?.Component;
        output.tpm.inventoryUnits["Finished Goods"] =
          allinventoryTpmUnits?.finishedGoods;
        output.tpm.inventoryUnits["MFG Mass"] = allinventoryTpmUnits?.mfgMass;
        output.tpm.inventoryUnits.Ingredients =
          allinventoryTpmUnits?.Ingredients;
        output.tpm.inventoryUnits.WIP = allinventoryTpmUnits?.wip;

        const allinventoryTpmRevenue = await e2eInventory(
          invByNode,
          false,
          true,
          "TPM"
        );
        output.tpm.inventory$["Location Type"] =
          allinventoryTpmRevenue?.LocationType;
        output.tpm.inventory$.Component = allinventoryTpmRevenue?.Component;
        output.tpm.inventory$["Finished Goods"] =
          allinventoryTpmRevenue?.finishedGoods;
        output.tpm.inventory$["MFG Mass"] = allinventoryTpmRevenue?.mfgMass;
        output.tpm.inventory$.Ingredients = allinventoryTpmRevenue?.Ingredients;
        output.tpm.inventory$.WIP = allinventoryTpmRevenue?.wip;

        const allinventoryDcUnits = await e2eInventory(
          invByNode,
          true,
          true,
          "DC"
        );
        output.dc.inventoryUnits["Location Type"] =
          allinventoryDcUnits?.LocationType;
        output.dc.inventoryUnits.Component = allinventoryDcUnits?.Component;
        output.dc.inventoryUnits["Finished Goods"] =
          allinventoryDcUnits?.finishedGoods;
        output.dc.inventoryUnits["MFG Mass"] = allinventoryDcUnits?.mfgMass;
        output.dc.inventoryUnits.Ingredients = allinventoryDcUnits?.Ingredients;
        output.dc.inventoryUnits.WIP = allinventoryDcUnits?.wip;

        const allinventoryDcRevenue = await e2eInventory(
          invByNode,
          false,
          true,
          "DC"
        );
        output.dc.inventory$["Location Type"] =
          allinventoryDcRevenue?.LocationType;
        output.dc.inventory$.Component = allinventoryDcRevenue?.Component;
        output.dc.inventory$["Finished Goods"] =
          allinventoryDcRevenue?.finishedGoods;
        output.dc.inventory$["MFG Mass"] = allinventoryDcRevenue?.mfgMass;
        output.dc.inventory$.Ingredients = allinventoryDcRevenue?.Ingredients;
        output.dc.inventory$.WIP = allinventoryDcRevenue?.wip;
      }

      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
// module.exports.getE2EInventoryByNodeValues = (invByNode) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let output = {
//         all: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         internalMfg: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         tpm: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//         dc: {
//           inventoryUnits: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//           inventory$: {
//             "Location Type": [],
//             Component: [],
//             "Finished Goods": [],
//             "MFG Mass": [],
//             Ingredients: [],
//             WIP: [],
//           },
//         },
//       };
//       // invByNode =
//       // console.log(invByNode[0]);
//       if (invByNode) {
//         // all
//         // inventoryUnits locationType
//         invByNode = invByNode.filter(val => val.MaterialType_desc != null && val.Plant_Name != null);

//         let uniqueAllLocations = [
//           ...new Set(invByNode.map((item) => item?.["Plant_Name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         let arrUnitsDesc = [];

//         uniqueAllLocations.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Units"]
//                 ? parseFloat(record?.["Inventory_Units"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrUnitsDesc.push(obj);
//         });

//         const unitsDataDesc = arrUnitsDesc.sort((a, b) => b.sum - a.sum);

//         let uniqueAllLocationsDesc = [
//           ...new Set(unitsDataDesc.map((item) => item?.["name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         //console.log("invByNodeUnitsDataDesc", invByNodeUnitsDataDesc);

//         // locationType
//         output.all.inventoryUnits["Location Type"].push(
//           ...uniqueAllLocationsDesc
//         );
//         // omponents
//         output.all.inventoryUnits.Component.push(
//           ...uniqueAllLocationsDesc.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.all.inventoryUnits["Finished Goods"].push(
//           ...uniqueAllLocationsDesc.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.all.inventoryUnits["MFG Mass"].push(
//           ...uniqueAllLocationsDesc.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.all.inventoryUnits.Ingredients.push(
//           ...uniqueAllLocationsDesc.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.all.inventoryUnits.WIP.push(
//           ...uniqueAllLocationsDesc.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         let arrCostDesc = [];
//         uniqueAllLocations.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val) return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Cost"]
//                 ? parseFloat(record?.["Inventory_Cost"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrCostDesc.push(obj);
//         });

//         const costDataDesc = arrCostDesc.sort((a, b) => b.sum - a.sum);

//         let uniqueAllLocationsDescCost = [
//           ...new Set(costDataDesc.map((item) => item?.["name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         // locationType
//         output.all.inventory$["Location Type"].push(
//           ...uniqueAllLocationsDescCost
//         );
//         // components
//         output.all.inventory$.Component.push(
//           ...uniqueAllLocationsDescCost.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.all.inventory$["Finished Goods"].push(
//           ...uniqueAllLocationsDescCost.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.all.inventory$["MFG Mass"].push(
//           ...uniqueAllLocationsDescCost.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.all.inventory$.Ingredients.push(
//           ...uniqueAllLocationsDescCost.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.all.inventory$.WIP.push(
//           ...uniqueAllLocationsDescCost.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // internalMfg

//         let arrUnitsInternalMfgDesc = [];

//         let uniqueAllLocationsInternalMfg = [
//           ...new Set(
//             invByNode
//               .filter((val) => val.Plant_Desc == "Internal Mfg")
//               .map((item) => item?.["Plant_Name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         uniqueAllLocationsInternalMfg.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (
//                 item["Plant_Name"] == val &&
//                 item["Plant_Desc"] == "Internal Mfg"
//               )
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Units"]
//                 ? parseFloat(record?.["Inventory_Units"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrUnitsInternalMfgDesc.push(obj);
//         });

//         const unitsDataInternalMfgDesc = arrUnitsInternalMfgDesc.sort(
//           (a, b) => b.sum - a.sum
//         );

//         let uniqueInternalMfgLocations = [
//           ...new Set(unitsDataInternalMfgDesc.map((item) => item?.["name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);
//         // inventoryUnits locationType
//         // let uniqueInternalMfgLocations = invByNode
//         //   .filter((x) => x.Plant_Desc == "Internal Mfg")
//         //   .map((x) => x.Plant_Name);
//         // console.log("uniqueInternalMfgLocations: ", uniqueInternalMfgLocations);

//         // locationType
//         output.internalMfg.inventoryUnits["Location Type"].push(
//           ...uniqueInternalMfgLocations
//         );
//         // components
//         output.internalMfg.inventoryUnits.Component.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               }) //
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.internalMfg.inventoryUnits["Finished Goods"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.internalMfg.inventoryUnits["MFG Mass"].push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.internalMfg.inventoryUnits.Ingredients.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.internalMfg.inventoryUnits.WIP.push(
//           ...uniqueInternalMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         //START NEW
//         let arrCostsInternalMfgDesc = [];

//         uniqueAllLocationsInternalMfg.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val && item["Plant_Desc"] == "Internal Mfg")
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Cost"]
//                 ? parseFloat(record?.["Inventory_Cost"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrCostsInternalMfgDesc.push(obj);
//         });

//         const unitsDataInternalMfgCostDesc = arrCostsInternalMfgDesc.sort(
//           (a, b) => b.sum - a.sum
//         );

//         let uniqueInternalCostMfgLocations = [
//           ...new Set(
//             unitsDataInternalMfgCostDesc.map((item) => item?.["name"])
//           ),
//         ];

//         output.internalMfg.inventory$["Location Type"].push(
//           ...uniqueInternalCostMfgLocations
//         );
//         // components
//         output.internalMfg.inventory$.Component.push(
//           ...uniqueInternalCostMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.internalMfg.inventory$["Finished Goods"].push(
//           ...uniqueInternalCostMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.internalMfg.inventory$["MFG Mass"].push(
//           ...uniqueInternalCostMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.internalMfg.inventory$.Ingredients.push(
//           ...uniqueInternalCostMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.internalMfg.inventory$.WIP.push(
//           ...uniqueInternalCostMfgLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "Internal Mfg"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // tpm

//         let arrUnitsInternalTpmDesc = [];

//         let uniqueAllLocationsInternalTpm = [
//           ...new Set(
//             invByNode
//               .filter((val) => val.Plant_Desc == "TPM")
//               .map((item) => item?.["Plant_Name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         uniqueAllLocationsInternalTpm.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val && item["Plant_Desc"] == "TPM")
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Units"]
//                 ? parseFloat(record?.["Inventory_Units"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrUnitsInternalTpmDesc.push(obj);
//         });

//         const unitsDataInternalTpmUnitsDesc = arrUnitsInternalTpmDesc.sort(
//           (a, b) => b.sum - a.sum
//         );

//         let uniqueInternalTpmUnitsLocations = [
//           ...new Set(
//             unitsDataInternalTpmUnitsDesc.map((item) => item?.["name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         // // inventoryUnits locationType
//         // let uniqueTpmLocations = invByNode
//         //   .filter((x) => x.Plant_Desc == "TPM")
//         //   .map((x) => x.Plant_Name);
//         // // console.log("uniqueTpmLocations: ", uniqueTpmLocations);

//         // locationType
//         output.tpm.inventoryUnits["Location Type"].push(
//           ...uniqueInternalTpmUnitsLocations
//         );
//         // components
//         output.tpm.inventoryUnits.Component.push(
//           ...uniqueInternalTpmUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.tpm.inventoryUnits["Finished Goods"].push(
//           ...uniqueInternalTpmUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.tpm.inventoryUnits["MFG Mass"].push(
//           ...uniqueInternalTpmUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.tpm.inventoryUnits.Ingredients.push(
//           ...uniqueInternalTpmUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.tpm.inventoryUnits.WIP.push(
//           ...uniqueInternalTpmUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // locationType

//         let arrCostsInternalTpmDesc = [];

//         uniqueAllLocationsInternalTpm.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val && item["Plant_Desc"] == "TPM")
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Cost"]
//                 ? parseFloat(record?.["Inventory_Cost"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrCostsInternalTpmDesc.push(obj);
//         });

//         const unitsDataInternalTpmCostDesc = arrCostsInternalTpmDesc.sort(
//           (a, b) => b.sum - a.sum
//         );
//         console.log()
//         let uniqueInternalTpmCostLocations = [
//           ...new Set(
//             unitsDataInternalTpmCostDesc.map((item) => item?.["name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         output.tpm.inventory$["Location Type"].push(
//           ...uniqueInternalTpmCostLocations
//         );
//         // components
//         output.tpm.inventory$.Component.push(
//           ...uniqueInternalTpmCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.tpm.inventory$["Finished Goods"].push(
//           ...uniqueInternalTpmCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.tpm.inventory$["MFG Mass"].push(
//           ...uniqueInternalTpmCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.tpm.inventory$.Ingredients.push(
//           ...uniqueInternalTpmCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.tpm.inventory$.WIP.push(
//           ...uniqueInternalTpmCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "TPM"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         // dc
//         let arrUnitsInternalDcDesc = [];
//         let uniqueAllLocationsInternalDc = [
//           ...new Set(
//             invByNode
//               .filter((val) => val.Plant_Desc == "DC")
//               .map((item) => item?.["Plant_Name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         uniqueAllLocationsInternalDc.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val && item["Plant_Desc"] == "DC")
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Units"]
//                 ? parseFloat(record?.["Inventory_Units"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrUnitsInternalDcDesc.push(obj);
//         });

//         const unitsDataInternalDcUnitsDesc = arrUnitsInternalDcDesc.sort(
//           (a, b) => b.sum - a.sum
//         );

//         let uniqueInternalDcUnitsLocations = [
//           ...new Set(
//             unitsDataInternalDcUnitsDesc.map((item) => item?.["name"])
//           ),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         // inventoryUnits locationType
//         // let uniqueDcLocations = invByNode
//         //   .filter((x) => x.Plant_Desc == "DC")
//         //   .map((x) => x.Plant_Name);
//         // console.log("uniqueDcLocations: ", uniqueDcLocations);

//         // locationType
//         output.dc.inventoryUnits["Location Type"].push(
//           ...uniqueInternalDcUnitsLocations
//         );
//         // components
//         output.dc.inventoryUnits.Component.push(
//           ...uniqueInternalDcUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.dc.inventoryUnits["Finished Goods"].push(
//           ...uniqueInternalDcUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.dc.inventoryUnits["MFG Mass"].push(
//           ...uniqueInternalDcUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.dc.inventoryUnits.Ingredients.push(
//           ...uniqueInternalDcUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.dc.inventoryUnits.WIP.push(
//           ...uniqueInternalDcUnitsLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Units"]
//                   ? parseFloat(record?.["Inventory_Units"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );

//         let arrCostInternalDcDesc = [];

//         uniqueAllLocationsInternalDc.map((val) => {
//           var obj = {
//             name: null,
//             sum: null,
//           };
//           obj.name = val;
//           obj.sum = invByNode
//             .filter((item) => {
//               if (item["Plant_Name"] == val && item["Plant_Desc"] == "DC")
//                 return item;
//             })
//             .reduce(function (sum, record) {
//               const sumAss = record["Inventory_Cost"]
//                 ? parseFloat(record?.["Inventory_Cost"])
//                 : 0;
//               return sum + sumAss;
//             }, 0);
//           arrCostInternalDcDesc.push(obj);
//         });

//         const unitsDataInternalDcCostDesc = arrCostInternalDcDesc.sort(
//           (a, b) => b.sum - a.sum
//         );

//         let uniqueInternalDcCostLocations = [
//           ...new Set(unitsDataInternalDcCostDesc.map((item) => item?.["name"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         // locationType
//         output.dc.inventory$["Location Type"].push(
//           ...uniqueInternalDcCostLocations
//         );
//         // components
//         output.dc.inventory$.Component.push(
//           ...uniqueInternalDcCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Components" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // finishedGoods
//         output.dc.inventory$["Finished Goods"].push(
//           ...uniqueInternalDcCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "FG" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // mfgMass
//         output.dc.inventory$["MFG Mass"].push(
//           ...uniqueInternalDcCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Mass" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // ingredients
//         output.dc.inventory$.Ingredients.push(
//           ...uniqueInternalDcCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "Ingredients" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//         // wip
//         output.dc.inventory$.WIP.push(
//           ...uniqueInternalDcCostLocations.map((val) => {
//             return invByNode
//               .filter((item) => {
//                 if (
//                   item["MaterialType_desc"] == "WIP" &&
//                   item["Plant_Name"] == val &&
//                   item["Plant_Desc"] == "DC"
//                 )
//                   return item;
//               })
//               .reduce(function (sum, record) {
//                 const sumAss = record["Inventory_Cost"]
//                   ? parseFloat(record?.["Inventory_Cost"])
//                   : 0;
//                 return sum + sumAss;
//               }, 0);
//           })
//         );
//       }

//       // console.log("output", output);

//       // console.log("output: ", output);
//       const response = {};

//       response.data = output;
//       resolve(response);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

module.exports.getMakeProductionPOValues = (productionFY22POs) => {
  return new Promise((resolve, reject) => {
    try {
      let output = {
        totalRecords: 29125,
        records: [],
      };

      productionFY22POs.forEach((element) => {
        if (element["MATERIAL_CODE"]) {
          let materialPos = {};
          materialPos.itemId = `${element["MATERIAL_CODE"]}`;
          materialPos.itemDes = element["MATERIAL_NAME"];
          materialPos.majorInvType = element["MAJOR_INVENTORY_DESCRIPTION"];
          materialPos.highLevelGrouping = element["HIGH_LEVEL_GROUPING"];
          materialPos.platform = element["PLATFORM"];
          materialPos.technology = element["TECHNOLOGY_GROUPING"];
          materialPos.plantName = element["PLANT_NAME"];
          materialPos.i_ePlant = element["I/E"];
          materialPos.regionOfMake = element["REGION"];
          materialPos.resource = element["RESOURCE"];
          materialPos.resourceType = element["RESOURCE_TYPE"];
          materialPos.productionQuantity = element["TOTAL_QTY"];
          materialPos.unitOfMeasure = element["UOM"];
          output.records.push(materialPos);
        }
      });

      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getMakeWhereUsedValues = (totalRecords, makeWhereused) => {
  return new Promise((resolve, reject) => {
    try {
      let output = {
        totalRecords: totalRecords || 0,
        records: [],
      };

      makeWhereused.forEach((element) => {
        if (element["Item_Id"]) {
          let materialPos = {};
          materialPos.itemId = `${element["Item_Id"]}`;
          materialPos.itemDes = element["Item_Description"];
          materialPos.majorCategory = element["Major_Category"];
          materialPos.prioritySubCat = element["Priority_Subcategory"];
          materialPos.brand = element["Brand"];
          materialPos.majorInvType = element["Major_Inventory_Type"];
          materialPos.subInvType = element["Sub_Inventory_Type"];
          materialPos.plantName = element["Plant_Name"];
          materialPos.resource = element["Resource"];
          materialPos.productQty = element["Production_Qty"];
          output.records.push(materialPos);
        }
      });

      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

function formatCash(num) {
  let n = Math.abs(num);
  if (num > 0) {
    if (!isNaN(n)) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return Math.round(n / 1e3) + "K";
      if (n >= 1e6 && n < 1e9) return Math.round(n / 1e6) + "M";
      if (n >= 1e9 && n < 1e12) return Math.round(n / 1e9) + "B";
      if (n >= 1e12) return Math.round(n / 1e12) + "T";
    }
  }
  if (num < 0) {
    let n = Math.abs(num);
    if (!isNaN(n)) {
      if (n < 1e3) return `\(${n}\)`;
      if (n >= 1e3 && n < 1e6) return `\(${Math.round(n / 1e3) + "K"}\)`;
      if (n >= 1e6 && n < 1e9) return `\(${Math.round(n / 1e6) + "M"}\)`;
      if (n >= 1e9 && n < 1e12) return `\(${Math.round(n / 1e9) + "B"}\)`;
      if (n >= 1e12) return `\(${Math.round(n / 1e12) + "T"}\)`;
    }
  } else {
    return n;
  }
}
module.exports.getMakeHeatMapValues = (makeHeatMap) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(makeHeatMap[0], makeHeatMap.length);
      // makeHeatMap = makeHeatMap.slice(50, 100)
      let result = [];
      var data = makeHeatMap;
      (keys = ["Platform", "Technology", "Plant", "Resource", "Year"]),
        (result = []),
        (temp = { _: result });

      data.forEach(function (a) {
        a["child"] = [];
        keys
          .reduce(function (r, k) {
            if (!r[a[k]]) {
              r[a[k]] = { _: [] };
              a["Category"] = k;
              a["categoryName"] = a[k];
              r._.push({ ...a, ...{ ["child"]: r[a[k]]._ } });
            }
            return r[a[k]];
          }, temp)
          ._.push(a);
      });

      // console.log(result);
      function sumUp(object) {
        if (object["2023_Production_Req"]) {
        } else {
          object["2023_Production_Req"] = 0;
          object["2023_Gap"] = 0;
          object["2023_Capacity"] = 0;
          object["2024_Production_Req"] = 0;
          object["2024_Gap"] = 0;
          object["2024_Capacity"] = 0;
          object["2025_Production_Req"] = 0;
          object["2025_Gap"] = 0;
          object["2025_Capacity"] = 0;
        }

        if (object.child) {
          for (child of object.child) {
            let totalValues = sumUp(child);
            object["2023_Production_Req"] += totalValues[0];
            object["2024_Production_Req"] += totalValues[1];
            object["2025_Production_Req"] += totalValues[2];
            object["2023_Capacity"] += totalValues[6];
            object["2024_Capacity"] += totalValues[7];
            object["2025_Capacity"] += totalValues[8];
            let val2023 =
              object["2023_Production_Req"] / 0.75 - object["2023_Capacity"];
            let val2024 =
              object["2024_Production_Req"] / 0.75 - object["2024_Capacity"];
            let val2025 =
              object["2025_Production_Req"] / 0.75 - object["2025_Capacity"];
            object["2023_Gap"] = formatCash(val2023);
            object["2024_Gap"] = formatCash(val2024);
            object["2025_Gap"] = formatCash(val2025);
          }
          return [
            object["2023_Production_Req"],
            object["2024_Production_Req"],
            object["2025_Production_Req"],
            object["2023_Gap"],
            object["2024_Gap"],
            object["2025_Gap"],
            object["2023_Capacity"],
            object["2024_Capacity"],
            object["2025_Capacity"],
          ];
        }
        // })
        // delete object
        return 0;
      }

      function mergeUp(object) {
        if (object.Category == "Year") {
          object.child = [];
          object[object.Year + "_Production_Req"] = object["Production_Req"];
          object[object.Year + "_Capacity"] = object["Capacity"];
          object[object.Year + "_Gap"] =
            object["Production_Req"] / 0.75 - object["Capacity"] > 0
              ? object["Production_Req"] / 0.75 - object["Capacity"]
              : formatCash(
                  object["Production_Req"] / 0.75 - object["Capacity"]
                );

          delete object["Production_Req"];
          delete object["Gap"];
          delete object["Capacity"];
          delete object["Year"];
          return object;
        } else {
          if (object.child) {
            for (child of object.child) {
              object = mergeUp(child);
            }
          }
        }
      }
      function mergeUpResource(object) {
        if (object.Category == "Resource") {
          let object3 = {};
          let object_array = [];
          for (child of object.child) {
            object3 = { ...object3, ...child };
          }
          object.child = [object3];

          return object;
        } else {
          if (object.child) {
            for (child of object.child) {
              object = mergeUpResource(child);
            }
          }
        }
      }

      function removeResource(object) {
        if (object.Category == "Resource") {
          object.child = [];
          return object;
        } else {
          if (object.child) {
            for (child of object.child) {
              object = removeResource(child);
            }
          }
        }
      }
      let count = 0;
      function addIds(object) {
        count = count + 1;
        object["id"] = count;
        object["2023_C_D"] =
          object["2023_Capacity"] / object["2023_Production_Req"];
        object["2023_D_C"] =
          (object["2023_Production_Req"] / object["2023_Capacity"]) * 100;
        object["2024_C_D"] =
          object["2024_Capacity"] / object["2024_Production_Req"];
        object["2024_D_C"] =
          (object["2024_Production_Req"] / object["2024_Capacity"]) * 100;
        object["2025_C_D"] =
          object["2025_Capacity"] / object["2025_Production_Req"];
        object["2025_D_C"] =
          (object["2025_Production_Req"] / object["2025_Capacity"]) * 100;
        // object["2023_Gap"] +=
        //   object["2023_Production_Req"] / 0.75 - object["2023_Capacity"] > 0
        //     ? object["2023_Production_Req"] / 0.75 - object["2023_Capacity"]
        //     : null;
        // object["2024_Gap"] +=
        //   object["2024_Production_Req"] / 0.75 - object["2024_Capacity"] > 0
        //     ? object["2024_Production_Req"] / 0.75 - object["2024_Capacity"]
        //     : null;
        // object["2025_Gap"] +=
        //   object["2025_Production_Req"] / 0.75 - object["2025_Capacity"] > 0
        //     ? object["2025_Production_Req"] / 0.75 - object["2025_Capacity"]
        //     : null;
        if (object.child.length == 0) {
          return object;
        } else {
          if (object.child) {
            for (child of object.child) {
              object = addIds(child);
            }
          }
        }
      }

      result.forEach(function (item, index) {
        const ves = mergeUp(result[index]);
      });
      result.forEach(function (item, index) {
        const ves = mergeUpResource(result[index]);
      });
      result.forEach(function (item, index) {
        const ves = sumUp(result[index]);
      });
      result.forEach(function (item, index) {
        removeResource(result[index]);
      });
      result.forEach(function (item, index) {
        addIds(result[index]);
      });

      const response = {};

      response.data = result;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getFulfillBarChartValues = (reqGrowthFulfill) => {
  return new Promise(async (resolve, reject) => {
    try {
      let output = {
        region: [],
        FY2023: [],
        FY2024: [],
        FY2025: [],
        cagr: [],
      };
      // console.log(reqGrowthFulfill[0]);
      if (reqGrowthFulfill) {
        // ingredients

        let arrFor23 = [];

        let regions = [
          ...new Set(reqGrowthFulfill.map((item) => item?.["Sales_Region"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        regions.map((val) => {
          var obj = {
            name: null,
            sum: null,
          };
          obj.name = val;
          obj.sum = reqGrowthFulfill
            .filter((item) => {
              if (item["Sales_Region"] == val && item["Year"] == 2024)
                return item;
            })
            .reduce(function (sum, record) {
              const sumAss = record["TOTAL_QUANTITY"]
                ? parseFloat(record?.["TOTAL_QUANTITY"])
                : 0;
              return sum + sumAss;
            }, 0);
          arrFor23.push(obj);
        });

        const unitsDataInternalMfgDesc = arrFor23.sort((a, b) => b.sum - a.sum);

        let uniqueRegions = [
          ...new Set(unitsDataInternalMfgDesc.map((item) => item?.["name"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        // all
        // all regions
        output.region.push(...uniqueRegions);
        // FY2023
        output.FY2023.push(
          ...uniqueRegions.map((val) => {
            return reqGrowthFulfill
              .filter((item) => {
                if (item["Sales_Region"] == val && item["Year"] == 2023)
                  return item;
              })
              .reduce(function (sum, record) {
                const sumAss = record["TOTAL_QUANTITY"]
                  ? parseFloat(record?.["TOTAL_QUANTITY"])
                  : 0;
                return sum + sumAss;
              }, 0);
          })
        );
        // FY2024
        output.FY2024.push(
          ...uniqueRegions.map((val) => {
            return reqGrowthFulfill
              .filter((item) => {
                if (item["Sales_Region"] == val && item["Year"] == 2024)
                  return item;
              })
              .reduce(function (sum, record) {
                const sumAss = record["TOTAL_QUANTITY"]
                  ? parseFloat(record?.["TOTAL_QUANTITY"])
                  : 0;
                return sum + sumAss;
              }, 0);
          })
        );
        // FY2025
        output.FY2025.push(
          ...uniqueRegions.map((val) => {
            return reqGrowthFulfill
              .filter((item) => {
                if (item["Sales_Region"] == val && item["Year"] == 2025)
                  return item;
              })
              .reduce(function (sum, record) {
                const sumAss = record["TOTAL_QUANTITY"]
                  ? parseFloat(record?.["TOTAL_QUANTITY"])
                  : 0;
                return sum + sumAss;
              }, 0);
          })
        );
        // cagr 2025 -only this cagr is shown in screen
        output.cagr.push(
          ...uniqueRegions.map((val) => {
            return reqGrowthFulfill
              .filter((item) => {
                if (item["Sales_Region"] == val && item["Year"] == 2025)
                  return item;
              })
              .reduce(function (sum, record) {
                const sumAss = record["CAGR"]
                  ? parseFloat(record?.["CAGR"])
                  : 0;
                return sum + sumAss;
              }, 0);
          })
        );
      }
      const zeroForTwetntyThree = [];
      const zeroForTwetntyFour = [];
      const zeroForTwetntyFive = [];
      output.FY2023?.map((val, index) => {
        if (val == 0) {
          zeroForTwetntyThree.push(index);
        }
      });

      output.FY2024?.map((val, index) => {
        if (val == 0) {
          zeroForTwetntyFour.push(index);
        }
      });

      output.FY2025?.map((val, index) => {
        if (val == 0) {
          zeroForTwetntyFive.push(index);
        }
      });
      const sameIndex = [];
      zeroForTwetntyThree?.map((val) => {
        if (
          zeroForTwetntyFour.includes(val) &&
          zeroForTwetntyFive.includes(val)
        ) {
          sameIndex.push(val);
        }
      });
      sameIndex?.map((val) => {
        output.region.splice(val, val);
        output.FY2023.splice(val, val);
        output.FY2023.splice(val, val);
        output.FY2025.splice(val, val);
        output.cagr.splice(val, val);
      });

      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getWhereUsedValues = (numberOfRecords, sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      output = {
        totalRecords: numberOfRecords || 0,
        records: [],
      };

      sourceData.forEach((elem) => {
        let whereused = {};
        whereused.material = elem.Material ? elem.Material : null;

        whereused.materialName = elem.MaterialName ? elem.MaterialName : null;

        whereused.materialGroup = elem.MaterialGroup
          ? elem.MaterialGroup
          : null;

        whereused.supplierCode = elem.Supplier ? elem.Supplier : null;

        whereused.supplierName = elem.SupplierName ? elem.SupplierName : null;

        whereused.majorCategory = elem.MajorCategory
          ? elem.MajorCategory
          : null;

        whereused.prioritySubCat = elem.PrioritySubCategory
          ? elem.PrioritySubCategory
          : null;

        whereused.inventoryType = elem.InventoryType
          ? elem.InventoryType
          : null;

        whereused.fgCode = elem.FGCode ? elem.FGCode : null;

        whereused.fgName = elem.FGName ? elem.FGName : null;

        whereused.fgBrand = elem.FGBrand ? elem.FGBrand : null;

        whereused.materialVolume = elem.Material_Volume
          ? elem.Material_Volume
          : null;

        whereused.fgConsumptionPer = elem.FGConsumption_perc
          ? elem.FGConsumption_perc
          : null;

        whereused.fg$ = elem.FG$ ? elem.FG$ : null;
        whereused.fy2225CAGR = elem.cagr ? elem.cagr : null;

        whereused.inventory = elem.Ing_Comp_Inventory
          ? elem.Ing_Comp_Inventory
          : null;

        output.records.push(whereused);
      });
      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getKPIcardvalues = (
  sourceKPIRecords,
  makeKPIRecords,
  fulfillKPIRecords
) => {
  return new Promise((resolve, reject) => {
    try {
      output = {
        source: {
          component: null,
          ingredient: null,
          componentYoY: null,
          ingredientYoY: null,
        },
        make: {
          "f&aProduction": null,
          compounding: null,
          "f&aProductionYoY": null,
          compoundingYoY: null,
        },
        fulfill: {
          sellInUnits: fulfillKPIRecords[0].Sell_in_Units,
          sellInReq: fulfillKPIRecords[0].Sell_in_Revenue,
          sellInUnitsYoY: fulfillKPIRecords[0].Yoy,
        },
      };
      sourceKPIRecords.map((source) => {
        if (source.Material_Type == "Components") {
          output.source.component = source.Volume;
          output.source.componentYoY = source.Yoy;
        } else if (source.Material_Type == "Ingredients") {
          output.source.ingredient = source.Volume;
          output.source.ingredientYoY = source.Yoy;
        }
      });

      makeKPIRecords.map((make) => {
        if (make.Resource_Type_1 == "Fill & Assembly") {
          output.make["f&aProduction"] = make.Total_Production_Req;
          output.make["f&aProductionYoY"] = make.Yoy;
        } else if (make.Resource_Type_1 == "Compounding") {
          output.make.compounding = make.Total_Production_Req;
          output.make.compoundingYoY = make.Yoy;
        }
      });

      const response = {};

      response.data = output;
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getNudgeValues = (nudgeSourceValues, nudgeMakeValues) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {
        data: {
          nudgeSourceValues: [],
          nudgeMakeValues: [],
          nudgeE2EValues: {
            nudgeSourceValues: [],
            nudgeMakeValues: [],
          },
        },
      };
      if (nudgeSourceValues) {
        nudgeSourceValues.map((val, index) => {
          const obj = {
            Material: val.Material,
            Material_Description: val.Material_Description,
            Volume: val.Volume,
            CAGR: val.CAGR,
          };
          response.data.nudgeSourceValues.push(obj);
          if (index == 0) {
            response.data.nudgeE2EValues.nudgeSourceValues.push(obj);
          }
        });
      }
      if (nudgeMakeValues) {
        nudgeMakeValues.map((val, index) => {
          const obj = {
            Technology: val?.Technology,
            plant_name: val?.Plant,
            unitlizationPercentage: val?.D_C,
          };
          response.data.nudgeMakeValues.push(obj);
          if (index == 0) {
            response.data.nudgeE2EValues.nudgeMakeValues.push(obj);
          }
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getSourceTooltipValues = (sourceTooltip) => {
  return new Promise((resolve, reject) => {
    try {
      output = {
        component: [],
        ingredient: [],
      };
      sourceTooltip = sourceTooltip.filter((val) => val.Units !== 0);
      sourceTooltip = sourceTooltip.sort((a, b) => b.Units - a.Units);
      let uniqueCompKeys = sourceTooltip
        .filter(
          (x) =>
            x.Material_Type == "Components" &&
            x.Units !== 0 &&
            x.Region !== null
        )
        .map((x) => x.Region);
      uniqueCompKeys = [...new Set(uniqueCompKeys)];

      uniqueCompKeys.forEach((unique) => {
        let obj = {
          node: null,
          "Material Group": [],
          Supplier: [],
          "Manufacturing Site(Fill)": [],
          Units: [],
          "% Material Group Flow To Plant": [],
        };
        obj.node = unique;
        sourceTooltip.filter((val) => {
          if (val.Region === unique && val.Material_Type == "Components") {
            obj["Material Group"].push(val?.Material_Group);
            obj.Supplier.push(val?.Supplier_Name);
            obj["Manufacturing Site(Fill)"].push(val?.Manufacturing_Site);
            obj.Units.push(val?.Units);
            obj["% Material Group Flow To Plant"].push(
              val?.["Material_Group_%"]
            );
          }
        });
        output.component.push(obj);
      });

      let uniqueIngKeys = sourceTooltip
        .filter(
          (x) =>
            x.Material_Type == "Ingredients" &&
            x.Units !== 0 &&
            x.Region !== null
        )
        .map((x) => x.Region);
      uniqueIngKeys = [...new Set(uniqueIngKeys)];

      uniqueIngKeys.forEach((unique) => {
        let obj = {
          node: null,
          "Material Group": [],
          Supplier: [],
          "Manufacturing Site(Make)": [],
          Units: [],
          "% Material Group Flow To Plant": [],
        };
        obj.node = unique;
        sourceTooltip.filter((val) => {
          if (val.Region === unique && val.Material_Type == "Ingredients") {
            obj["Material Group"].push(val?.Material_Group);
            obj.Supplier.push(val?.Supplier_Name);
            obj["Manufacturing Site(Make)"].push(val?.Manufacturing_Site);
            obj.Units.push(val?.Units);
            obj["% Material Group Flow To Plant"].push(
              val?.["Material_Group_%"]
            );
          }
        });
        output.ingredient.push(obj);
      });

      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

// module.exports.getSourceTooltipValues = (sourceTooltip) => {
//   return new Promise((resolve, reject) => {
//     try {
//       output = {
//         component: [],
//         ingredient: [],
//       };
//    console.log("sourceTooltip", sourceTooltip[0])
//   let compsourceTooltip = sourceTooltip.filter(item => item.Region != null && item.Units != 0 && item.Material_Type == "Components");
//   let ingsourceTooltip = sourceTooltip.filter(item => item.Region != null && item.Units != 0 && item.Material_Type == "Ingredients");
//   compsourceTooltip = compsourceTooltip.sort(
//     (a, b) => b.Units - a.Units
//   );
//   ingsourceTooltip = ingsourceTooltip.sort(
//     (a, b) => b.Units - a.Units
//   );
//   const uniqueKeysForComponentsData = [
//     ...new Set(
//       compsourceTooltip.map((item) => item?.["Material_Group_Description"])
//     ),
//   ].filter((item) => item != "" && item != undefined && item != null);

//   const uniqueKeysForIngredientsData = [
//     ...new Set(
//       ingredientsData.map((item) => item?.["Material_Group_Description"])
//     ),
//   ].filter((item) => item != "" && item != undefined && item != null);

//         uniqueCompKeys.forEach((unique) => {
//         let obj = {
//           node: null,
//           "Material Group": [],
//           Supplier: [],
//           "Manufacturing Site(Make)": [],
//           Units: [],
//           "% Material Group Flow To Plant": [],
//         };
//         obj.node = unique;
//         sourceTooltip.filter((val) => {
//           if (val.Region === unique && val.Material_Type == "Ingredients") {
//             obj["Material Group"].push(val?.Material_Group);
//             obj.Supplier.push(val?.Supplier_Name);
//             obj["Manufacturing Site(Make)"].push(val?.Manufacturing_Site);
//             obj.Units.push(val?.Units);
//             obj["% Material Group Flow To Plant"].push(
//               val?.["Material_Group_%"]
//             );
//           }
//         });
//         output.ingredient.push(obj);
//       });

//       resolve(output);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// function formatCash(num) {
//   let n = Math.abs(num);
//   if (num > 0) {
//     if (!isNaN(n)) {
//       if (n < 1e3) return n;
//       if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
//       if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
//       if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
//       if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
//     }
//   }
//   if (num < 0) {
//     let n = Math.abs(num);
//     if (!isNaN(n)) {
//       if (n < 1e3) return `\(${n}\)`;
//       if (n >= 1e3 && n < 1e6) return `\(${+(n / 1e3).toFixed(1) + "K"}\)`;
//       if (n >= 1e6 && n < 1e9) return `\(${+(n / 1e6).toFixed(1) + "M"}\)`;
//       if (n >= 1e9 && n < 1e12) return `\(${+(n / 1e9).toFixed(1) + "B"}\)`;
//       if (n >= 1e12) return `\(${+(n / 1e12).toFixed(1) + "T"}\)`;
//     }
//   } else {
//     return n;
//   }
// }

function isNumber(val) {
  return !isNaN(parseInt(val)) ? Number(val) : 0;
}

