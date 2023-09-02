const constants = require("../config/constants");
const sql = require("mssql");
// const mockData = require("../config/mockData.json");

const XLSX = require("xlsx");
var fs = require("fs");
const path = require("path");
const { response } = require("express");
const e = require("connect-timeout");
const { isArray } = require("util");

function nullToZero(val) {
  if (!val) {
    return 0;
  } else {
    return val;
  }
}

module.exports.getNodeChartValuesGraphDB = (
  sourceToMake,
  makeTofulfill,
  sourceData
) => {
  return new Promise((resolve, reject) => {
    try {
      if (sourceToMake && makeTofulfill && sourceData) {
        const response = {};
        response.data = {
          nodes: [],
          links: [],
        };
        var sourcenodes = [
          ...new Map(
            sourceData.map((item) => [item["COMPONENT"], item])
          ).values(),
        ];
        var min = Math.min(
          ...sourcenodes.map((item) => item.SRC_TOTAL_QUANTITY)
        );
        var max = Math.max(
          ...sourcenodes.map((item) => item.SRC_TOTAL_QUANTITY)
        );
        sourcenodes = sourcenodes.map((obj) => ({
          ...obj,
          // level: 1,
          // id: obj["COMPONENT"] + "_source",
          id_temp: obj["COMPONENT"] + "",
          // hover_name: obj["COMPONENT_NAME"],
          color_region: obj["VENDOR_REGION"],
          lead_time: obj["TSLT"],
          max_value: max,
          min_value: min,
        }));
        sourcenodes = sourcenodes.map(
          ({ SRC_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
            TOTAL_QUANTITY,
            ...rest,
          })
        );
        var makenodes = [
          ...new Map(sourceData.map((item) => [item["WERKS"], item])).values(),
        ];

        min = Math.min(...makenodes.map((item) => item.MK_TOTAL_QUANTITY));
        max = Math.max(...makenodes.map((item) => item.MK_TOTAL_QUANTITY));
        makenodes = makenodes.map((obj) => ({
          ...obj,
          // level: 2,
          // id: obj["WERKS"] + "_make",
          id_temp: obj["WERKS"] + "",
          // hover_name: obj["PLANTNAME"],
          color_region: obj["WERKS_REGION"],
          lead_time: obj["TMLT"],
          max_value: max,
          min_value: min,
        }));
        makenodes = makenodes.map(
          ({ MK_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
            TOTAL_QUANTITY,
            ...rest,
          })
        );
        var fulfillnodes1 = [
          ...new Map(sourceData.map((item) => [item["SOURCE"], item])).values(),
        ];
        min = Math.min(
          ...fulfillnodes1.map((item) => item.FULFILL_TOTAL_QUANTITY)
        );
        max = Math.max(
          ...fulfillnodes1.map((item) => item.FULFILL_TOTAL_QUANTITY)
        );
        fulfillnodes1 = fulfillnodes1.map((obj) => ({
          ...obj,
          // level: 3,
          // id: obj["SOURCE"] + "_fulfill1",
          id_temp: obj["SOURCE"] + "",
          // hover_name: obj["SOURCE_NAME"],
          color_region: obj["SOURCE_REGION"],
          lead_time: obj["TLT"],
          max_value: max,
          min_value: min,
        }));
        fulfillnodes1 = fulfillnodes1.map(
          ({ FULFILL_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
            TOTAL_QUANTITY,
            ...rest,
          })
        );
        var fulfillnodes = [
          ...new Map(sourceData.map((item) => [item["DC"], item])).values(),
        ];
        min = Math.min(
          ...fulfillnodes.map((item) => item.FULFILL_TOTAL_QUANTITY)
        );
        max = Math.max(
          ...fulfillnodes.map((item) => item.FULFILL_TOTAL_QUANTITY)
        );
        fulfillnodes = fulfillnodes.map((obj) => ({
          ...obj,
          // level: 4,
          // id: obj["DC"] + "_fulfill",
          id_temp: obj["DC"] + "",
          // hover_name: obj["DC_NAME"],
          color_region: obj["DC_REGION"],
          lead_time: obj["TFLT"],
          max_value: max,
          min_value: min,
        }));
        fulfillnodes = fulfillnodes.map(
          ({ FULFILL_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
            TOTAL_QUANTITY,
            ...rest,
          })
        );
        var nodes = [
          ...sourcenodes,
          ...makenodes,
          ...fulfillnodes1,
          ...fulfillnodes,
        ];
        // console.log("Nodes:", JSON.stringify(nodes));

        let sourceToMakeLevels = [];
        let sourceToFulfillLinks = [];

        sourceToMake.forEach((obj) => {
          let objectForList = {};
          objectForList.id_temp = obj.component;
          objectForList.level = 1;
          let objectTolist = {};
          objectTolist.id_temp = obj.plant_id;
          objectTolist.level = 2;
          sourceToMakeLevels.push(objectForList);
          sourceToMakeLevels.push(objectTolist);
          let objectLink = {};
          objectLink.source = obj.component + "_" + 1;
          objectLink.target = obj.plant_id + "_" + 2;
          sourceToFulfillLinks.push(objectLink);
        });

        let makeToFulfillLevels = [];
        makeTofulfill.forEach((obj) => {
          // console.log(obj.e_dc);
          for (i = 0; i < obj.e_dc.length; i++) {
            // console.log(obj.e_dc[i]);
            let objectForList = {};
            objectForList.id_temp = obj.e_dc[i].src;
            objectForList.level = i + 2;
            let objectTolist = {};
            objectTolist.id_temp = obj.e_dc[i].dst;
            objectTolist.level = i + 3;
            makeToFulfillLevels.push(objectForList);
            makeToFulfillLevels.push(objectTolist);
            let objectLink = {};
            objectLink.source = obj.e_dc[i].src + "_" + (i + 2);
            objectLink.target = obj.e_dc[i].dst + "_" + (i + 3);
            sourceToFulfillLinks.push(objectLink);
          }
        });

        let nodes_list = [];
        // console.log(
        //   "source and make levels: ",
        //   JSON.stringify(sourceToMakeLevels)
        // );

        nodes.forEach(function (objTemp) {
          sourceToMakeLevels.forEach(function (obj2) {
            if (objTemp.id_temp + "" == obj2.id_temp + "") {
              let obj = { ...objTemp };
              // console.log()
              obj.level = obj2.level;
              obj.id = objTemp.id_temp + "_" + obj2.level;
              nodes_list.push(obj);
            }
          });
        });
        // console.log("node list: ", JSON.stringify(nodes_list));
        nodes.forEach(function (objTemp1) {
          makeToFulfillLevels.forEach(function (obj2) {
            if (objTemp1.id_temp + "" == obj2.id_temp + "") {
              let obj1 = { ...objTemp1 };
              // obj.WERKS
              obj1.level = obj2.level;
              obj1.id = objTemp1.id_temp + "_" + obj2.level;
              nodes_list.push(obj1);
            }
          });
        });
        // console.log(nodes_list.length, "----------");
        let nodes_;
        nodes_ = nodes_list.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );
        // console.log(nodes_.length);

        links = sourceToFulfillLinks.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.source === value.source && t.target === value.target
            )
        );

        // console.log("Links: ", JSON.stringify(links));

        response.data.nodes = nodes_;
        response.data.links = links;
        resolve(response);
      } else resolve(null);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getMaterialCodeValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        materialCode: [],
        materialDesc: [],
      };

      if (sourceData) {
        sourceData.map((val) => {
          response.data.materialCode.push(val.MATNR); //.sort((a, b) => a - b)
          response.data.materialDesc.push(val.ITEM_DESCRIPTION);
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eLeadTimeBreakDownValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: {
          aggregated: {
            majorCategory: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
            brand: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
            salesRegion: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
          },
          detailed: {
            majorCategory: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
            brand: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
            salesRegion: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
          },
        },
        revenue: {
          aggregated: {
            majorCategory: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
            brand: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
            salesRegion: {
              dimension: [],
              Source: [],
              Make: [],
              Fulfill: [],
            },
          },
          detailed: {
            majorCategory: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
            brand: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
            salesRegion: {
              dimension: [],
              SLT: [],
              TLT: [],
              "GRT-Source": [],
              "GRT-Make": [],
              "Mfg.LT": [],
              "Fufilment Leadtime": [],
            },
          },
        },
      };

      let arr = [];
      sourceData.map((val) => {
        const descUnitsData = {
          dimension: null,
          call_lead_time: null,
          type: null,
          SLT: null,
          TLT: null,
          src_tslt: null,
          "GRT-Source": null,
          "GRT-Make": null,
          "Mfg.LT": null,
          "Fufilment Leadtime": null,
          total:
            nullToZero(val["SRC_SLT"]) +
            nullToZero(val["SRC_TLT"]) +
            nullToZero(val["SRC_GRT"]) +
            nullToZero(val["MK_TMLT"]) +
            nullToZero(val["MK_GRT"]) +
            nullToZero(val["FLT"]),
        };

        descUnitsData.call_lead_time = val["CAL_LEAD_TIME"];
        descUnitsData.type = val["TYPE"];
        descUnitsData.dimension = val["DIMENSION"];
        descUnitsData.SLT = val["SRC_SLT"];
        descUnitsData.TLT = val["SRC_TLT"];
        descUnitsData["GRT-Source"] = val["SRC_GRT"];
        descUnitsData.srcTotal =
          val["SRC_SLT"] + val["SRC_TLT"] + val["SRC_GRT"];
        descUnitsData["GRT-Make"] = val["MK_GRT"];
        descUnitsData["Mfg.LT"] = val["MK_TMLT"];
        descUnitsData.makeTotal =
          nullToZero(val["MK_TMLT"]) + nullToZero(val["MK_GRT"]);
        descUnitsData["Fufilment Leadtime"] = val["FLT"];
        arr.push(descUnitsData);
      });
      const desSourceData = arr.sort((a, b) => a.total - b.total);

      const unitBrandData = desSourceData.filter(
        (val) => val.call_lead_time == "UNITS" && val.type == "BRAND"
      );

      const unitsMajorCategoryData = desSourceData.filter(
        (val) => val.call_lead_time == "UNITS" && val.type == "MAJOR_CATEGORY"
      );

      const unitsSalesRegion = desSourceData.filter(
        (val) => val.call_lead_time == "UNITS" && val.type == "SALES_REGION"
      );
      unitBrandData.map((val) => {
        response.data.units.detailed.brand.dimension.push(val.dimension);
        response.data.units.detailed.brand.SLT.push(val["SLT"]);
        response.data.units.detailed.brand.TLT.push(val["TLT"]);
        response.data.units.detailed.brand["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.units.detailed.brand["GRT-Make"].push(val["GRT-Make"]);
        response.data.units.detailed.brand["Mfg.LT"].push(val["Mfg.LT"]);
        response.data.units.detailed.brand["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.units.aggregated.brand.dimension.push(val.dimension);
        response.data.units.aggregated.brand.Source.push(val["srcTotal"]);
        response.data.units.aggregated.brand.Make.push(val["makeTotal"]);
        response.data.units.aggregated.brand.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      unitsMajorCategoryData.map((val) => {
        response.data.units.detailed.majorCategory.dimension.push(
          val.dimension
        );
        response.data.units.detailed.majorCategory.SLT.push(val["SLT"]);
        response.data.units.detailed.majorCategory.TLT.push(val["TLT"]);
        response.data.units.detailed.majorCategory["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.units.detailed.majorCategory["GRT-Make"].push(
          val["GRT-Make"]
        );
        response.data.units.detailed.majorCategory["Mfg.LT"].push(
          val["Mfg.LT"]
        );
        response.data.units.detailed.majorCategory["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.units.aggregated.majorCategory.dimension.push(
          val.dimension
        );
        response.data.units.aggregated.majorCategory.Source.push(
          val["srcTotal"]
        );
        response.data.units.aggregated.majorCategory.Make.push(
          val["makeTotal"]
        );
        response.data.units.aggregated.majorCategory.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      unitsSalesRegion.map((val) => {
        response.data.units.detailed.salesRegion.dimension.push(val.dimension);
        response.data.units.detailed.salesRegion.SLT.push(val["SLT"]);
        response.data.units.detailed.salesRegion.TLT.push(val["TLT"]);
        response.data.units.detailed.salesRegion["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.units.detailed.salesRegion["GRT-Make"].push(
          val["GRT-Make"]
        );
        response.data.units.detailed.salesRegion["Mfg.LT"].push(val["Mfg.LT"]);
        response.data.units.detailed.salesRegion["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.units.aggregated.salesRegion.dimension.push(
          val.dimension
        );
        response.data.units.aggregated.salesRegion.Source.push(val["srcTotal"]);
        response.data.units.aggregated.salesRegion.Make.push(val["makeTotal"]);
        response.data.units.aggregated.salesRegion.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      //revenue
      const revenueBrandData = desSourceData.filter(
        (val) => val.call_lead_time == "REVENUE" && val.type == "BRAND"
      );
      const revenueMajorCategoryData = desSourceData.filter(
        (val) => val.call_lead_time == "REVENUE" && val.type == "MAJOR_CATEGORY"
      );
      const revenueSalesRegion = desSourceData.filter(
        (val) => val.call_lead_time == "REVENUE" && val.type == "SALES_REGION"
      );
      revenueBrandData.map((val) => {
        response.data.revenue.detailed.brand.dimension.push(val.dimension);
        response.data.revenue.detailed.brand.SLT.push(val["SLT"]);
        response.data.revenue.detailed.brand.TLT.push(val["TLT"]);
        response.data.revenue.detailed.brand["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.revenue.detailed.brand["GRT-Make"].push(val["GRT-Make"]);
        response.data.revenue.detailed.brand["Mfg.LT"].push(val["Mfg.LT"]);
        response.data.revenue.detailed.brand["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.revenue.aggregated.brand.dimension.push(val.dimension);
        response.data.revenue.aggregated.brand.Source.push(val["srcTotal"]);
        response.data.revenue.aggregated.brand.Make.push(val["makeTotal"]);
        response.data.revenue.aggregated.brand.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      revenueMajorCategoryData.map((val) => {
        response.data.revenue.detailed.majorCategory.dimension.push(
          val.dimension
        );
        response.data.revenue.detailed.majorCategory.SLT.push(val["SLT"]);
        response.data.revenue.detailed.majorCategory.TLT.push(val["TLT"]);
        response.data.revenue.detailed.majorCategory["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.revenue.detailed.majorCategory["GRT-Make"].push(
          val["GRT-Make"]
        );
        response.data.revenue.detailed.majorCategory["Mfg.LT"].push(
          val["Mfg.LT"]
        );
        response.data.revenue.detailed.majorCategory["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.revenue.aggregated.majorCategory.dimension.push(
          val.dimension
        );
        response.data.revenue.aggregated.majorCategory.Source.push(
          val["srcTotal"]
        );
        response.data.revenue.aggregated.majorCategory.Make.push(
          val["makeTotal"]
        );
        response.data.revenue.aggregated.majorCategory.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      revenueSalesRegion.map((val) => {
        response.data.revenue.detailed.salesRegion.dimension.push(
          val.dimension
        );
        response.data.revenue.detailed.salesRegion.SLT.push(val["SLT"]);
        response.data.revenue.detailed.salesRegion.TLT.push(val["TLT"]);
        response.data.revenue.detailed.salesRegion["GRT-Source"].push(
          val["GRT-Source"]
        );
        response.data.revenue.detailed.salesRegion["GRT-Make"].push(
          val["GRT-Make"]
        );
        response.data.revenue.detailed.salesRegion["Mfg.LT"].push(
          val["Mfg.LT"]
        );
        response.data.revenue.detailed.salesRegion["Fufilment Leadtime"].push(
          val["Fufilment Leadtime"]
        );

        //agregate
        response.data.revenue.aggregated.salesRegion.dimension.push(
          val.dimension
        );
        response.data.revenue.aggregated.salesRegion.Source.push(
          val["srcTotal"]
        );
        response.data.revenue.aggregated.salesRegion.Make.push(
          val["makeTotal"]
        );
        response.data.revenue.aggregated.salesRegion.Fulfill.push(
          val["Fufilment Leadtime"]
        );
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eLeadTimeDistributionValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: {
          bucket: [],
          frequency: [],
        },
        revenue: {
          bucket: [],
          frequency: [],
        },
      };
      let arr = [];
      const data = sourceData.map((val) => {
        const bucketVal = val.BUCKET;
        var num = 0;
        if (bucketVal.includes(">")) {
          num = bucketVal.replace(">", "");
          num = num.split("-")[0];
        } else if (bucketVal.includes("<")) {
          num = bucketVal.replace("<", "");
          num = num.split("-")[0];
        } else {
          num = bucketVal.split("-")[0];
        }

        let obj = {
          CAL_LEAD_TIME: null,
          BUCKET: null,
          FREQUENCY: null,
          bucketVal: null,
        };
        obj["CAL_LEAD_TIME"] = val.CAL_LEAD_TIME;
        obj["BUCKET"] = val.BUCKET;
        obj["FREQUENCY"] = val.FREQUENCY;
        obj["bucketVal"] = parseInt(num);
        arr.push(obj);
      });

      const sourceDataDesc = arr.sort((a, b) => a.bucketVal - b.bucketVal);
      const unitsData = sourceDataDesc.filter(
        (val) => val["CAL_LEAD_TIME"] == "UNITS"
      );
      const revenueData = sourceDataDesc.filter(
        (val) => val["CAL_LEAD_TIME"] == "REVENUE"
      );

      unitsData.map((val) => {
        response.data.units.bucket.push(val.BUCKET);
        response.data.units.frequency.push(val.FREQUENCY);
      });

      revenueData.map((val) => {
        response.data.revenue.bucket.push(val.BUCKET);
        response.data.revenue.frequency.push(val.FREQUENCY);
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
// module.exports.getE2eLeadTimeDistributionByPrioritySubCategoryValues = (sourceData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const response = {}
//       response.data = {
//         units: [["category", "fgCode", "fgName", "e2eLt"]],
//         revenue: [["category", "fgCode", "fgName", "e2eLt"]],
//       }
//       let cars = [
//         {
//           "color": "purple",
//           "type": "minivan",
//           "registration": new Date('2017-01-03'),
//           "capacity": 7
//         },
//         {
//           "color": "red",
//           "type": "station wagon",
//           "registration": new Date('2018-03-03'),
//           "capacity": 5
//         },
//         {
//           "color": "purple",
//           "type": "ddd",
//           "registration": "sa",
//           "capacity": 3
//         },
//         {
//           "color": "purple",
//           "type": "ddd",
//           "registration": "ddxxxddd",
//           "capacity": 7
//         },
//       ]
//       if (sourceData) {
// let car = []
// let uniqueCarData = [
//           ...new Set(cars.map((item) => item?.["color"])),
//         ].filter((item) => item != "" && item != undefined && item != null);
//         let uniqueCapacityData = [
//           ...new Set(cars.map((item) => item?.["capacity"])),
//         ].filter((item) => item != "" && item != undefined && item != null);

//         uniqueCarData.map(uniqcar => {
//           var carO =  {
//             "color": uniqcar,
//             "type": "",
//             "registration": "",
//             "capacity": ""
//           }
//           car.map(carObj => {
//             uniqueCapacityData.map(uniqCap => {
//               if(uniqCap == carObj["capacity"] && uniqcar == carObj["color"]){

//               }

//             })

//           })
//         })

//         const unitsData = sourceData.filter(val => val.CAL_LEAD_TIME == "UNITS");
//         const revenueData = sourceData.filter(val => val.CAL_LEAD_TIME == "REVENUE");
//         // let uniqueunitsData = [
//         //   ...new Set(unitsData.map((item) => item?.["DIMENSION"])),
//         // ].filter((item) => item != "" && item != undefined && item != null);

//       }

//       resolve(response)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

module.exports.getE2eLeadTimeDistributionByPrioritySubCategoryValues = (
  sourceData
) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: [["Priority Subcategory", "fgCode", "fgName", "e2eLt"]],
        revenue: [["Priority Subcategory", "fgCode", "fgName", "e2eLt"]],
        download: {
          units: [
            ["Priority Subcategory", "fgCode", "fgName", "e2eLt", "percentile"],
          ],
          revenue: [
            ["Priority Subcategory", "fgCode", "fgName", "e2eLt", "percentile"],
          ],
        },
      };
      if (sourceData) {
        const unitsData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "UNITS"
        );
        const revenueData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "REVENUE"
        );
        unitsData.map((val) => {
          const arr = [
            val.DIMENSION,
            val.MATNR,
            val.ITEM_DESCRIPTION,
            val["E2E_VALUE"],
            val["PRIORITY_SUB_PERCENTILE"],
          ];
          response.data.download.units.push(arr);
        }),
          revenueData.map((val) => {
            const arr = [
              val.DIMENSION,
              val.MATNR,
              val.ITEM_DESCRIPTION,
              val["E2E_VALUE"],
              val["PRIORITY_SUB_PERCENTILE"],
            ];
            response.data.download.revenue.push(arr);
          });
        //start
        let uniqueunitsData = [
          ...new Set(unitsData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLtData = [
          ...new Set(unitsData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniqueunitsData.map((uniqDimension, index) => {
          uniqueE2eLtData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              "Priority Subcategory": uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            unitsData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              let arrN = [
                arr["Priority Subcategory"],
                arr.fgCode,
                arr.fgName,
                arr.e2eLt,
              ];
              arryValue = arr.fgCode.split(",");
              if (Array.isArray(arryValue)) {
                let lengthOfArr = arryValue.length;
                for (let i = 0; i < lengthOfArr; i++) {
                  response.data.units.push(arrN);
                }
              } else {
                response.data.units.push(arrN);
              }
            }
          });
        });
        //end

        //start reveue
        let uniquerevenuesData = [
          ...new Set(revenueData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLRevenueData = [
          ...new Set(revenueData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniquerevenuesData.map((uniqDimension, index) => {
          uniqueE2eLRevenueData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              "Priority Subcategory": uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            revenueData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              const arrN = [
                arr["Priority Subcategory"],
                arr.fgCode,
                arr.fgName,
                arr.e2eLt,
              ];
              arryValue = arr.fgCode.split(",");
              if (Array.isArray(arryValue)) {
                let lengthOfArr = arryValue.length;
                for (let i = 0; i < lengthOfArr; i++) {
                  response.data.revenue.push(arrN);
                }
              } else {
                response.data.revenue.push(arrN);
              }
            }
          });
        });
        //end reveue
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eLeadTimeDistributionBySalesRegionValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: [["Sales Region", "fgCode", "fgName", "e2eLt"]],
        revenue: [["Sales Region", "fgCode", "fgName", "e2eLt"]],
        download: {
          units: [["Sales Region", "fgCode", "fgName", "e2eLt", "percentile"]],
          revenue: [
            ["Sales Region", "fgCode", "fgName", "e2eLt", "percentile"],
          ],
        },
      };
      if (sourceData) {
        const unitsData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "UNITS"
        );
        const revenueData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "REVENUE"
        );
        unitsData.map((val) => {
          const arr = [
            val.DIMENSION,
            val.MATNR,
            val.ITEM_DESCRIPTION,
            val["E2E_VALUE"],
            val["SALES_REGION_PERCENTILE"],
          ];
          response.data.download.units.push(arr);
        }),
          revenueData.map((val) => {
            const arr = [
              val.DIMENSION,
              val.MATNR,
              val.ITEM_DESCRIPTION,
              val["E2E_VALUE"],
              val["SALES_REGION_PERCENTILE"],
            ];
            response.data.download.revenue.push(arr);
          });
        //start
        let uniqueunitsData = [
          ...new Set(unitsData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLtData = [
          ...new Set(unitsData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniqueunitsData.map((uniqDimension, index) => {
          uniqueE2eLtData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              "Sales Region": uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            unitsData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              let arrN = [
                arr["Sales Region"],
                arr.fgCode,
                arr.fgName,
                arr.e2eLt,
              ];
              // arryValue = arr.fgCode.split(",");
              // if (Array.isArray(arryValue)) {
              //   let lengthOfArr = arryValue.length;
              //   for (let i = 0; i < lengthOfArr; i++) {
              //     response.data.units.push(arrN);
              //   }
              // } else {
              response.data.units.push(arrN);
              // }
            }
          });
        });
        //end
        //start reveue
        let uniquerevenuesData = [
          ...new Set(revenueData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLRevenueData = [
          ...new Set(revenueData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniquerevenuesData.map((uniqDimension, index) => {
          uniqueE2eLRevenueData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              "Sales Region": uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            revenueData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              const arrN = [
                arr["Sales Region"],
                arr.fgCode,
                arr.fgName,
                arr.e2eLt,
              ];
              // arryValue = arr.fgCode.split(",");
              // if (Array.isArray(arryValue)) {
              //   let lengthOfArr = arryValue.length;
              //   for (let i = 0; i < lengthOfArr; i++) {
              //     response.data.revenue.push(arrN);
              //   }
              // } else {
              response.data.revenue.push(arrN);
              // }
            }
          });
        });
        //end reveue

        // unitsData.map((val, i) => {
        //   const arr = [val.DIMENSION, val.MATNR, val.ITEM_DESCRIPTION, val.E2E_Value]
        //   response.data.units.push(arr);
        // })
        // revenueData.map(val => {
        //   response.data.revenue.push([val.DIMENSION, val.MATNR, val.ITEM_DESCRIPTION, val.E2E_Value]);
        // })
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getNodeChartValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        nodes: [],
        links: [],
      };
      var sourcenodes = [
        ...new Map(
          sourceData.map((item) => [item["COMPONENT"], item])
        ).values(),
      ];
      var min = Math.min(...sourcenodes.map((item) => item.SRC_TOTAL_QUANTITY));
      var max = Math.max(...sourcenodes.map((item) => item.SRC_TOTAL_QUANTITY));
      sourcenodes = sourcenodes.map((obj) => ({
        ...obj,
        level: 1,
        id: obj["COMPONENT"] + "_source",
        id_temp: obj["COMPONENT"] + "",
        hover_name: obj["COMPONENT_NAME"],
        color_region: obj["VENDOR_REGION"],
        lead_time: obj["TSLT"],
        max_value: max,
        min_value: min,
      }));
      sourcenodes = sourcenodes.map(
        ({ SRC_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
          TOTAL_QUANTITY,
          ...rest,
        })
      );

      var makenodes = [
        ...new Map(sourceData.map((item) => [item["WERKS"], item])).values(),
      ];
      min = Math.min(...makenodes.map((item) => item.MK_TOTAL_QUANTITY));
      max = Math.max(...makenodes.map((item) => item.MK_TOTAL_QUANTITY));
      makenodes = makenodes.map((obj) => ({
        ...obj,
        level: 2,
        id: obj["WERKS"] + "_make",
        id_temp: obj["WERKS"] + "",
        hover_name: obj["PLANTNAME"],
        color_region: obj["WERKS_REGION"],
        lead_time: obj["TMLT"],
        max_value: max,
        min_value: min,
      }));
      makenodes = makenodes.map(
        ({ MK_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
          TOTAL_QUANTITY,
          ...rest,
        })
      );
      var fulfillnodes1 = [
        ...new Map(sourceData.map((item) => [item["SOURCE"], item])).values(),
      ];
      min = Math.min(
        ...fulfillnodes1.map((item) => item.FULFILL_TOTAL_QUANTITY)
      );
      max = Math.max(
        ...fulfillnodes1.map((item) => item.FULFILL_TOTAL_QUANTITY)
      );
      fulfillnodes1 = fulfillnodes1.map((obj) => ({
        ...obj,
        level: 3,
        id: obj["SOURCE"] + "_fulfill1",
        id_temp: obj["SOURCE"] + "",
        hover_name: obj["SOURCE_NAME"],
        color_region: obj["SOURCE_REGION"],
        lead_time: obj["TLT"],
        max_value: max,
        min_value: min,
      }));
      fulfillnodes1 = fulfillnodes1.map(
        ({ FULFILL_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
          TOTAL_QUANTITY,
          ...rest,
        })
      );
      var fulfillnodes = [
        ...new Map(sourceData.map((item) => [item["DC"], item])).values(),
      ];
      min = Math.min(
        ...fulfillnodes.map((item) => item.FULFILL_TOTAL_QUANTITY)
      );
      max = Math.max(
        ...fulfillnodes.map((item) => item.FULFILL_TOTAL_QUANTITY)
      );
      fulfillnodes = fulfillnodes.map((obj) => ({
        ...obj,
        level: 4,
        id: obj["DC"] + "_fulfill",
        id_temp: obj["DC"] + "",
        hover_name: obj["DC_NAME"],
        color_region: obj["DC_REGION"],
        lead_time: obj["TFLT"],
        max_value: max,
        min_value: min,
      }));
      fulfillnodes = fulfillnodes.map(
        ({ FULFILL_TOTAL_QUANTITY: TOTAL_QUANTITY, ...rest }) => ({
          TOTAL_QUANTITY,
          ...rest,
        })
      );
      var nodes = [
        ...sourcenodes,
        ...makenodes,
        ...fulfillnodes1,
        ...fulfillnodes,
      ];

      links = [
        ...sourceData.map((o) => {
          return {
            source: o["COMPONENT"] + "_source",
            target: o["WERKS"] + "_make",
          };
        }),
        ...sourceData.map((o) => {
          return {
            source: o["WERKS"] + "_make",
            target: o["SOURCE"] + "_fulfill1",
          };
        }),
        ...sourceData.map((o) => {
          return {
            source: o["SOURCE"] + "_fulfill1",
            target: o["DC"] + "_fulfill",
          };
        }),
      ];

      var links2 = [
        ...sourceData.map((o) => {
          return {
            source: o["SOURCE"] + "_fulfill1",
            target: o["DC"] + "_fulfill",
          };
        }),
      ];
      var nodes_source = [
        ...sourceData.map((o) => {
          return o["SOURCE"];
        }),
      ];
      nodes_source = [...new Set(nodes_source)];

      links2 = links2.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.source === value.source && t.target === value.target
          )
      );
      // console.log(links2)

      var result = [];
      var count = 0;
      function buildStrings(arr, source, c) {
        return arr.reduce(function (r, e) {
          // console.log(e.source.split("_")[0], source, c)
          if (e.source.split("_")[0] == source) {
            count = count + 1;
            var children = buildStrings(
              arr,
              e.target.split("_")[0],
              c + e.target.split("_")[0] + "_" + count + "->"
            );
            if (!children.length) {
              // count = count-1
              result.push(c + e.target.split("_")[0] + "_" + count);
            }
            // count = 0
            r.push(e);
          }

          return r;
        }, []);
      }

      nodes_source.forEach((element) => {
        count = 0;
        buildStrings(links2, element, element + "->");
        result = [...new Set(result)];
      });

      links = links.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.source === value.source && t.target === value.target
          )
      );

      response.data.nodes = nodes;
      response.data.links = links;
      response.data.result = result;
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eLeadTimeDistributionByBrandValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: [["Brand", "fgCode", "fgName", "e2eLt"]],
        revenue: [["Brand", "fgCode", "fgName", "e2eLt"]],
        download: {
          units: [["Brand", "fgCode", "fgName", "e2eLt", "percentile"]],
          revenue: [["Brand", "fgCode", "fgName", "e2eLt", "percentile"]],
        },
      };
      if (sourceData) {
        const unitsData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "UNITS"
        );
        const revenueData = sourceData.filter(
          (val) => val.CAL_LEAD_TIME == "REVENUE"
        );

        unitsData.map((val) => {
          const arr = [
            val.DIMENSION,
            val.MATNR,
            val.ITEM_DESCRIPTION,
            val["E2E_VALUE"],
            val["BRAND_PERCENTILE"],
          ];
          response.data.download.units.push(arr);
        }),
          revenueData.map((val) => {
            const arr = [
              val.DIMENSION,
              val.MATNR,
              val.ITEM_DESCRIPTION,
              val["E2E_VALUE"],
              val["BRAND_PERCENTILE"],
            ];
            response.data.download.revenue.push(arr);
          });
        //start units
        let uniqueunitsData = [
          ...new Set(unitsData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLtData = [
          ...new Set(unitsData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniqueunitsData.map((uniqDimension, index) => {
          uniqueE2eLtData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              Brand: uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            unitsData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              let arrN = [arr["Brand"], arr.fgCode, arr.fgName, arr.e2eLt];
              arryValue = arr.fgCode.split(",");
              if (Array.isArray(arryValue)) {
                let lengthOfArr = arryValue.length;
                for (let i = 0; i < lengthOfArr; i++) {
                  response.data.units.push(arrN);
                }
              } else {
                response.data.units.push(arrN);
              }
            }
          });
        });
        //end

        //start reveue
        let uniquerevenuesData = [
          ...new Set(revenueData.map((item) => item?.["DIMENSION"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        let uniqueE2eLRevenueData = [
          ...new Set(revenueData.map((item) => item?.["E2E_VALUE"])),
        ].filter((item) => item != "" && item != undefined && item != null);
        uniquerevenuesData.map((uniqDimension, index) => {
          uniqueE2eLRevenueData.map((unqueE2E) => {
            let i = 0;
            const arr = {
              Brand: uniqDimension,
              fgCode: null,
              fgName: null,
              e2eLt: unqueE2E,
            };
            revenueData.map((data) => {
              if (
                data.DIMENSION == uniqDimension &&
                data.E2E_VALUE == unqueE2E
              ) {
                if (i == 0) {
                  arr["fgCode"] = data.MATNR;
                  arr["fgName"] = data.ITEM_DESCRIPTION;
                } else {
                  arr["fgCode"] += `, ${data.MATNR}`;
                  arr["fgName"] += `, ${data.ITEM_DESCRIPTION}`;
                }

                i++;
              }
            });
            if (arr["fgCode"] !== null) {
              const arrN = [arr["Brand"], arr.fgCode, arr.fgName, arr.e2eLt];
              arryValue = arr.fgCode.split(",");
              if (Array.isArray(arryValue)) {
                let lengthOfArr = arryValue.length;
                for (let i = 0; i < lengthOfArr; i++) {
                  response.data.revenue.push(arrN);
                }
              } else {
                response.data.revenue.push(arrN);
              }
            }
          });
        });
        //end reveue
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eLeadTimeByFinishedGoods = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        totalRecordsUnits:
          sourceData.getE2eLeadTimeByFinishedGoodsUnits?.[0]["TotalRows"] || 0,
        totalRecordsRevenue:
          sourceData.getE2eLeadTimeByFinishedGoodsRevenue?.[0]["TotalRows"] ||
          0,
        records: {
          units: [],
          revenue: [],
        },
      };
      if (sourceData?.getE2eLeadTimeByFinishedGoodsUnits) {
        sourceData?.getE2eLeadTimeByFinishedGoodsUnits?.map((val) => {
          let unitRecord = {
            fgItem: null,
            fgName: null,
            fgBrand: null,
            majorCategory: null,
            majorInventoryType: null,
            subCategory: null,
            productLine: null,
            subProductLine: null,
            salesRegion: null,
            prioritySubLtPer: null,
            wtAvgSourceLt: null,
            wtAvgMakeLt: null,
            wtAvgFulfilLt: null,
            e2eLt: null,
            fgUnits: null,
            $fg: null,
          };

          //unit Record
          unitRecord.fgItem = val?.MATNR;
          unitRecord.fgName = val?.ITEM_DESCRIPTION;
          unitRecord.fgBrand = val?.BRAND;
          unitRecord.majorCategory = val?.MAJOR_CATEGORY;
          unitRecord.majorInventoryType = val?.MAJOR_INVENTORY_TYPE;
          unitRecord.subCategory = val.SUBCATEGORY;
          unitRecord.productLine = val?.PRODUCT_LINE;
          unitRecord.subProductLine = val?.SUB_PRODUCT_LINE;
          unitRecord.salesRegion = val?.SALES_REGION;
          unitRecord.prioritySubLtPer =
            val?.PRIORITY_SUBCATEGORY_PERCENTILE_QNT;
          unitRecord.wtAvgSourceLt = val?.SRC_TSLT_QNT;
          unitRecord.wtAvgMakeLt = val?.MK_TMLT_QNT;
          unitRecord.wtAvgFulfilLt = val?.FLT_QNT;
          unitRecord.e2eLt = val?.E2E_QNT;
          unitRecord.fgUnits = val?.TOTAL_QUANTITY;
          //not coming from sp
          unitRecord.$fg = val?.TOTAL_REVENUE;

          response.data.records.units.push(unitRecord);
        });
      }
      if (sourceData?.getE2eLeadTimeByFinishedGoodsRevenue) {
        sourceData?.getE2eLeadTimeByFinishedGoodsRevenue?.map((val) => {
          let revenueRecord = {
            fgItem: null,
            fgName: null,
            fgBrand: null,
            majorCategory: null,
            majorInventoryType: null,
            subCategory: null,
            productLine: null,
            subProductLine: null,
            salesRegion: null,
            prioritySubLtPer: null,
            wtAvgSourceLt: null,
            wtAvgMakeLt: null,
            wtAvgFulfilLt: null,
            e2eLt: null,
            fgUnits: null,
            $fg: null,
          };

          //revenue record
          revenueRecord.fgItem = val?.MATNR;
          revenueRecord.fgName = val?.ITEM_DESCRIPTION;
          revenueRecord.fgBrand = val?.BRAND;
          revenueRecord.majorCategory = val?.MAJOR_CATEGORY;
          revenueRecord.majorInventoryType = val?.MAJOR_INVENTORY_TYPE;
          //not in sp
          revenueRecord.subCategory = val.SUBCATEGORY;
          revenueRecord.productLine = val?.PRODUCT_LINE;
          revenueRecord.subProductLine = val?.SUB_PRODUCT_LINE;
          revenueRecord.salesRegion = val?.SALES_REGION;
          revenueRecord.prioritySubLtPer =
            val?.PRIORITY_SUBCATEGORY_PERCENTILE_REV;
          revenueRecord.wtAvgSourceLt = val?.SRC_TSLT_REV;
          revenueRecord.wtAvgMakeLt = val?.MK_TMLT_REV;
          revenueRecord.wtAvgFulfilLt = val?.FLT_REV;
          revenueRecord.e2eLt = val?.E2E_REV;
          revenueRecord.fgUnits = val?.TOTAL_QUANTITY;
          //not coming from sp
          revenueRecord.$fg = val?.TOTAL_REVENUE;
          response.data.records.revenue.push(revenueRecord);
        });
      }
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getE2eSourcingLeadOpportunitiesByMaterial = (
  sourceData,
  numberOfRecords
) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      response.data = {
        totalRecords: numberOfRecords ? numberOfRecords : 0,
        records: [],
      };

      if (sourceData) {
        sourceData.forEach((val) => {
          const record = {
            Material: null,
            "Material Description": null,
            "Material Group": null,
            "Vendor Name": null,
            "Vendor Region": null,
            Pant: null,
            SLT: null,
            TLT: null,
            GRT: null,
            TSLT: null,
            Units: null,
            "$Fg Impact": null,
          };
          record["Material"] = val?.MATERIAL;
          record["Material Description"] = val?.MATERIAL_DESCRIPTION;
          record["Material Group"] = val?.MATERIAL_GROUP_DESCRIPTION;
          record["Vendor Name"] = val?.VENDOR_NAME;
          record["Vendor Region"] = val?.VENDOR_REGION;
          record["Pant"] = val?.PLANT;
          record["SLT"] = val?.SLT;
          record["TLT"] = val?.TLT;
          record["GRT"] = val?.GRT;
          record["TSLT"] = val?.TSLT;
          record["Units"] = val?.TOTAL_QUANTITY;
          record["$Fg Impact"] = val?.FG_IMPACT;

          response.data.records.push(record);
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports.getNudgeValues = (
  nudgeRegionalizationValues,
  nudgeLeadtimeValues
) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {
        data: {
          nudgeRegionalizationValues: [],
          nudgeLeadtimeValues: [],
        },
      };
      if (nudgeRegionalizationValues) {
        nudgeRegionalizationValues.map((val) => {
          const obj = {
            Sub_Product_line: val.Sub_Product_line,
            Revenue: val.Revenue,
            "Reg_%": val["Reg_%"],
          };
          response.data.nudgeRegionalizationValues.push(obj);
        });
      }

      if (nudgeLeadtimeValues) {
        nudgeLeadtimeValues?.map((val) => {
          const obj = {
            MATNR: val.MATNR,
            ITEM_DESCRIPTION: val.ITEM_DESCRIPTION,
            TOTAL_REVENUE: val.TOTAL_REVENUE,
            E2E_REV_DAYS: val.E2E_REV_DAYS,
            E2E_PERCENT: val.E2E_PERCENT,
          };
          response.data.nudgeLeadtimeValues.push(obj);
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

