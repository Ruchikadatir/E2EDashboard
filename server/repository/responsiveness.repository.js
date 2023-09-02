const constants = require("../config/constants");
const sql = require("mssql");
// const mockData = require("../config/mockData.json");

const XLSX = require("xlsx");
var fs = require("fs");
const path = require("path");
const { response } = require("express");
const e = require("connect-timeout");

module.exports.getProductionSites = (
  ProductionSitesValue,
  MakeToSaleProductionSitesValue
) => {
  return new Promise((resolve, reject) => {
    try {
      let output = {
        sourceToMake: {
          components: {
            All: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },

              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Europe: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Americas: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Asia: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
          },
          ingredients: {
            All: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },

              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Europe: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Americas: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Asia: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
          },
        },
        makeToSale: {
          all: {
            All: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },

              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Europe: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Americas: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Asia: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
          },
          fert: {
            All: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },

              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Europe: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Americas: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Asia: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
          },
          halb: {
            All: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },

              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Europe: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Americas: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
            Asia: {
              Units: {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
              "FG $": {
                Category: [],
                Americas: [],
                Europe: [],
                Asia: [],
              },
            },
          },
        },
      };
      if (ProductionSitesValue) {
        //component start
        let componentProductVal = ProductionSitesValue.filter(
          (val) => val.Material_Type == "Components"
        );

        let uniquecomponentProductVal = [
          ...new Set(componentProductVal.map((item) => item?.["Plant_Name"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        var compoUnitArrPrd = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };

        var compoFgArrPrd = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };
        uniquecomponentProductVal.map((uniq) => {
          let objALL = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICAS = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPE = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIA = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objALLFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICASFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPEFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIAFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          componentProductVal.map((val) => {
            if (val.Plant_Name == uniq) {
              if (val.Source_Continent == "AMERICAS") {
                objALL.Americas += val.Total_Quantity;
                objALLFg.Americas += val["FG$"];
              }
              if (val.Source_Continent == "EUROPE") {
                objALL.Europe += val.Total_Quantity;
                objALLFg.Europe += val["FG$"];
              }
              if (val.Source_Continent == "ASIA") {
                objALL.Asia += val.Total_Quantity;
                objALLFg.Asia += val["FG$"];
              }

              if (val.Production_Continent == "AMERICAS") {
                if (val.Source_Continent == "AMERICAS") {
                  objAMERICAS.Americas += val.Total_Quantity;
                  objAMERICASFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objAMERICAS.Europe += val.Total_Quantity;
                  objAMERICASFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objAMERICAS.Asia += val.Total_Quantity;
                  objAMERICASFg.Asia += val["FG$"];
                }
              }

              if (val.Production_Continent == "EUROPE") {
                if (val.Source_Continent == "AMERICAS") {
                  objEUROPE.Americas += val.Total_Quantity;
                  objEUROPEFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objEUROPE.Europe += val.Total_Quantity;
                  objEUROPEFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objEUROPE.Asia += val.Total_Quantity;
                  objEUROPEFg.Asia += val["FG$"];
                }
              }
              if (val.Production_Continent == "ASIA") {
                if (val.Source_Continent == "AMERICAS") {
                  objASIA.Americas += val.Total_Quantity;
                  objASIAFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objASIA.Europe += val.Total_Quantity;
                  objASIAFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objASIA.Asia += val.Total_Quantity;
                  objASIAFg.Asia += val["FG$"];
                }
              }
            }
          });
          objALL.total = objALL.Americas + objALL.Asia + objALL.Europe;
          objAMERICAS.total =
            objAMERICAS.Americas + objAMERICAS.Asia + objAMERICAS.Europe;
          objEUROPE.total =
            objEUROPE.Americas + objEUROPE.Asia + objEUROPE.Europe;
          objASIA.total = objASIA.Americas + objASIA.Asia + objASIA.Europe;

          objALL.total > 0 && compoUnitArrPrd.all.push(objALL);
          objAMERICAS.total > 0 && compoUnitArrPrd.Americas.push(objAMERICAS);
          objEUROPE.total > 0 && compoUnitArrPrd.Europe.push(objEUROPE);
          objASIA.total > 0 && compoUnitArrPrd.Asia.push(objASIA);

          objALLFg.total = objALLFg.Americas + objALLFg.Asia + objALLFg.Europe;
          objAMERICASFg.total =
            objAMERICASFg.Americas + objAMERICASFg.Asia + objAMERICASFg.Europe;
          objEUROPEFg.total =
            objEUROPEFg.Americas + objEUROPEFg.Asia + objEUROPEFg.Europe;
          objASIAFg.total =
            objASIAFg.Americas + objASIAFg.Asia + objASIAFg.Europe;

          objALLFg.total > 0 && compoFgArrPrd.all.push(objALLFg);
          objAMERICASFg.total > 0 && compoFgArrPrd.Americas.push(objAMERICASFg);
          objEUROPEFg.total > 0 && compoFgArrPrd.Europe.push(objEUROPEFg);
          objASIAFg.total > 0 && compoFgArrPrd.Asia.push(objASIAFg);
        });

        compoUnitArrPrd.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.sourceToMake.components.All.Units.Category.push(
              val.Category
            );
            output.sourceToMake.components.All.Units.Americas.push(
              val.Americas
            );
            output.sourceToMake.components.All.Units.Europe.push(val.Europe);
            output.sourceToMake.components.All.Units.Asia.push(val.Asia);
          });

        compoUnitArrPrd.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Americas.Units.Category.push(
            val.Category
          );
          output.sourceToMake.components.Americas.Units.Americas.push(
            val.Americas
          );
          output.sourceToMake.components.Americas.Units.Europe.push(val.Europe);
          output.sourceToMake.components.Americas.Units.Asia.push(val.Asia);
        });

        compoUnitArrPrd.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Europe.Units.Category.push(
            val.Category
          );
          output.sourceToMake.components.Europe.Units.Americas.push(
            val.Americas
          );
          output.sourceToMake.components.Europe.Units.Europe.push(val.Europe);
          output.sourceToMake.components.Europe.Units.Asia.push(val.Asia);
        });

        compoUnitArrPrd.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Asia.Units.Category.push(val.Category);
          output.sourceToMake.components.Asia.Units.Americas.push(val.Americas);
          output.sourceToMake.components.Asia.Units.Europe.push(val.Europe);
          output.sourceToMake.components.Asia.Units.Asia.push(val.Asia);
        });

        compoFgArrPrd.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.sourceToMake.components.All["FG $"].Category.push(
              val.Category
            );
            output.sourceToMake.components.All["FG $"].Americas.push(
              val.Americas
            );
            output.sourceToMake.components.All["FG $"].Europe.push(val.Europe);
            output.sourceToMake.components.All["FG $"].Asia.push(val.Asia);
          });

        compoFgArrPrd.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Americas["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.components.Americas["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.components.Americas["FG $"].Europe.push(
            val.Europe
          );
          output.sourceToMake.components.Americas["FG $"].Asia.push(val.Asia);
        });

        compoFgArrPrd.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Europe["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.components.Europe["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.components.Europe["FG $"].Europe.push(val.Europe);
          output.sourceToMake.components.Europe["FG $"].Asia.push(val.Asia);
        });

        compoFgArrPrd.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.components.Asia["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.components.Asia["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.components.Asia["FG $"].Europe.push(val.Europe);
          output.sourceToMake.components.Asia["FG $"].Asia.push(val.Asia);
        });

        //component end

        //ingredient start
        let ingredientProductVal = ProductionSitesValue.filter(
          (val) => val.Material_Type == "Ingredients"
        );

        let uniqueingredientProductVal = [
          ...new Set(ingredientProductVal.map((item) => item?.["Plant_Name"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        var ingredientUnitArrPrd = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };

        var ingredientFgArrPrd = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };
        uniqueingredientProductVal.map((uniq) => {
          let objALL = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICAS = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPE = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIA = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objALLFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICASFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPEFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIAFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          ingredientProductVal.map((val) => {
            if (val.Plant_Name == uniq) {
              if (val.Source_Continent == "AMERICAS") {
                objALL.Americas += val.Total_Quantity;
                objALLFg.Americas += val["FG$"];
              }
              if (val.Source_Continent == "EUROPE") {
                objALL.Europe += val.Total_Quantity;
                objALLFg.Europe += val["FG$"];
              }
              if (val.Source_Continent == "ASIA") {
                objALL.Asia += val.Total_Quantity;
                objALLFg.Asia += val["FG$"];
              }

              if (val.Production_Continent == "AMERICAS") {
                if (val.Source_Continent == "AMERICAS") {
                  objAMERICAS.Americas += val.Total_Quantity;
                  objAMERICASFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objAMERICAS.Europe += val.Total_Quantity;
                  objAMERICASFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objAMERICAS.Asia += val.Total_Quantity;
                  objAMERICASFg.Asia += val["FG$"];
                }
              }

              if (val.Production_Continent == "EUROPE") {
                if (val.Source_Continent == "AMERICAS") {
                  objEUROPE.Americas += val.Total_Quantity;
                  objEUROPEFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objEUROPE.Europe += val.Total_Quantity;
                  objEUROPEFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objEUROPE.Asia += val.Total_Quantity;
                  objEUROPEFg.Asia += val["FG$"];
                }
              }
              if (val.Production_Continent == "ASIA") {
                if (val.Source_Continent == "AMERICAS") {
                  objASIA.Americas += val.Total_Quantity;
                  objASIAFg.Americas += val["FG$"];
                }
                if (val.Source_Continent == "EUROPE") {
                  objASIA.Europe += val.Total_Quantity;
                  objASIAFg.Europe += val["FG$"];
                }
                if (val.Source_Continent == "ASIA") {
                  objASIA.Asia += val.Total_Quantity;
                  objASIAFg.Asia += val["FG$"];
                }
              }
            }
          });
          objALL.total = objALL.Americas + objALL.Asia + objALL.Europe;
          objAMERICAS.total =
            objAMERICAS.Americas + objAMERICAS.Asia + objAMERICAS.Europe;
          objEUROPE.total =
            objEUROPE.Americas + objEUROPE.Asia + objEUROPE.Europe;
          objASIA.total = objASIA.Americas + objASIA.Asia + objASIA.Europe;

          objALL.total > 0 && ingredientUnitArrPrd.all.push(objALL);
          objAMERICAS.total > 0 &&
            ingredientUnitArrPrd.Americas.push(objAMERICAS);
          objEUROPE.total > 0 && ingredientUnitArrPrd.Europe.push(objEUROPE);
          objASIA.total > 0 && ingredientUnitArrPrd.Asia.push(objASIA);

          objALLFg.total = objALLFg.Americas + objALLFg.Asia + objALLFg.Europe;
          objAMERICASFg.total =
            objAMERICASFg.Americas + objAMERICASFg.Asia + objAMERICASFg.Europe;
          objEUROPEFg.total =
            objEUROPEFg.Americas + objEUROPEFg.Asia + objEUROPEFg.Europe;
          objASIAFg.total =
            objASIAFg.Americas + objASIAFg.Asia + objASIAFg.Europe;

          objALLFg.total > 0 && ingredientFgArrPrd.all.push(objALLFg);
          objAMERICASFg.total > 0 &&
            ingredientFgArrPrd.Americas.push(objAMERICASFg);
          objEUROPEFg.total > 0 && ingredientFgArrPrd.Europe.push(objEUROPEFg);
          objASIAFg.total > 0 && ingredientFgArrPrd.Asia.push(objASIAFg);
        });

        ingredientUnitArrPrd.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.sourceToMake.ingredients.All.Units.Category.push(
              val.Category
            );
            output.sourceToMake.ingredients.All.Units.Americas.push(
              val.Americas
            );
            output.sourceToMake.ingredients.All.Units.Europe.push(val.Europe);
            output.sourceToMake.ingredients.All.Units.Asia.push(val.Asia);
          });

        ingredientUnitArrPrd.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Americas.Units.Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Americas.Units.Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Americas.Units.Europe.push(
            val.Europe
          );
          output.sourceToMake.ingredients.Americas.Units.Asia.push(val.Asia);
        });

        ingredientUnitArrPrd.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Europe.Units.Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Europe.Units.Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Europe.Units.Europe.push(val.Europe);
          output.sourceToMake.ingredients.Europe.Units.Asia.push(val.Asia);
        });

        ingredientUnitArrPrd.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Asia.Units.Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Asia.Units.Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Asia.Units.Europe.push(val.Europe);
          output.sourceToMake.ingredients.Asia.Units.Asia.push(val.Asia);
        });

        ingredientFgArrPrd.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.sourceToMake.ingredients.All["FG $"].Category.push(
              val.Category
            );
            output.sourceToMake.ingredients.All["FG $"].Americas.push(
              val.Americas
            );
            output.sourceToMake.ingredients.All["FG $"].Europe.push(val.Europe);
            output.sourceToMake.ingredients.All["FG $"].Asia.push(val.Asia);
          });

        ingredientFgArrPrd.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Americas["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Americas["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Americas["FG $"].Europe.push(
            val.Europe
          );
          output.sourceToMake.ingredients.Americas["FG $"].Asia.push(val.Asia);
        });

        ingredientFgArrPrd.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Europe["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Europe["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Europe["FG $"].Europe.push(
            val.Europe
          );
          output.sourceToMake.ingredients.Europe["FG $"].Asia.push(val.Asia);
        });

        ingredientFgArrPrd.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.sourceToMake.ingredients.Asia["FG $"].Category.push(
            val.Category
          );
          output.sourceToMake.ingredients.Asia["FG $"].Americas.push(
            val.Americas
          );
          output.sourceToMake.ingredients.Asia["FG $"].Europe.push(val.Europe);
          output.sourceToMake.ingredients.Asia["FG $"].Asia.push(val.Asia);
        });

        //ingredient end
      }
      if (MakeToSaleProductionSitesValue) {
        //fert start
        let fertData = MakeToSaleProductionSitesValue.filter(
          (val) => val.MTART == "FERT"
        );

        let uniquefertPlant_Name = [
          ...new Set(fertData.map((item) => item?.["Plant_Name"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        var fertUnitDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };

        var fertFgDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };
        uniquefertPlant_Name.map((uniq) => {
          let objALL = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICAS = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPE = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIA = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objALLFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICASFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPEFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIAFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          fertData.map((val) => {
            if (val.Plant_Name == uniq) {
              if (val.Sales_Continent == "AMERICAS") {
                objALL.Americas += val.Total_Quantity;
                objALLFg.Americas += val["FG$"];
              }
              if (val.Sales_Continent == "EUROPE") {
                objALL.Europe += val.Total_Quantity;
                objALLFg.Europe += val["FG$"];
              }
              if (val.Sales_Continent == "ASIA") {
                objALL.Asia += val.Total_Quantity;
                objALLFg.Asia += val["FG$"];
              }

              if (val.Production_Continent == "AMERICAS") {
                if (val.Sales_Continent == "AMERICAS") {
                  objAMERICAS.Americas += val.Total_Quantity;
                  objAMERICASFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objAMERICAS.Europe += val.Total_Quantity;
                  objAMERICASFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objAMERICAS.Asia += val.Total_Quantity;
                  objAMERICASFg.Asia += val["FG$"];
                }
              }

              if (val.Production_Continent == "EUROPE") {
                if (val.Sales_Continent == "AMERICAS") {
                  objEUROPE.Americas += val.Total_Quantity;
                  objEUROPEFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objEUROPE.Europe += val.Total_Quantity;
                  objEUROPEFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objEUROPE.Asia += val.Total_Quantity;
                  objEUROPEFg.Asia += val["FG$"];
                }
              }
              if (val.Production_Continent == "ASIA") {
                if (val.Sales_Continent == "AMERICAS") {
                  objASIA.Americas += val.Total_Quantity;
                  objASIAFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objASIA.Europe += val.Total_Quantity;
                  objASIAFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objASIA.Asia += val.Total_Quantity;
                  objASIAFg.Asia += val["FG$"];
                }
              }
            }
          });
          objALL.total = objALL.Americas + objALL.Asia + objALL.Europe;
          objAMERICAS.total =
            objAMERICAS.Americas + objAMERICAS.Asia + objAMERICAS.Europe;
          objEUROPE.total =
            objEUROPE.Americas + objEUROPE.Asia + objEUROPE.Europe;
          objASIA.total = objASIA.Americas + objASIA.Asia + objASIA.Europe;

          objALL.total > 0 && fertUnitDataArr.all.push(objALL);
          objAMERICAS.total > 0 && fertUnitDataArr.Americas.push(objAMERICAS);
          objEUROPE.total > 0 && fertUnitDataArr.Europe.push(objEUROPE);
          objASIA.total > 0 && fertUnitDataArr.Asia.push(objASIA);

          objALLFg.total = objALLFg.Americas + objALLFg.Asia + objALLFg.Europe;
          objAMERICASFg.total =
            objAMERICASFg.Americas + objAMERICASFg.Asia + objAMERICASFg.Europe;
          objEUROPEFg.total =
            objEUROPEFg.Americas + objEUROPEFg.Asia + objEUROPEFg.Europe;
          objASIAFg.total =
            objASIAFg.Americas + objASIAFg.Asia + objASIAFg.Europe;

          objALLFg.total > 0 && fertFgDataArr.all.push(objALLFg);
          objAMERICASFg.total > 0 && fertFgDataArr.Americas.push(objAMERICASFg);
          objEUROPEFg.total > 0 && fertFgDataArr.Europe.push(objEUROPEFg);
          objASIAFg.total > 0 && fertFgDataArr.Asia.push(objASIAFg);
        });

        fertUnitDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.fert.All.Units.Category.push(val.Category);
            output.makeToSale.fert.All.Units.Americas.push(val.Americas);
            output.makeToSale.fert.All.Units.Europe.push(val.Europe);
            output.makeToSale.fert.All.Units.Asia.push(val.Asia);
          });

        fertUnitDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Americas.Units.Category.push(val.Category);
          output.makeToSale.fert.Americas.Units.Americas.push(val.Americas);
          output.makeToSale.fert.Americas.Units.Europe.push(val.Europe);
          output.makeToSale.fert.Americas.Units.Asia.push(val.Asia);
        });

        fertUnitDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Europe.Units.Category.push(val.Category);
          output.makeToSale.fert.Europe.Units.Americas.push(val.Americas);
          output.makeToSale.fert.Europe.Units.Europe.push(val.Europe);
          output.makeToSale.fert.Europe.Units.Asia.push(val.Asia);
        });

        fertUnitDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Asia.Units.Category.push(val.Category);
          output.makeToSale.fert.Asia.Units.Americas.push(val.Americas);
          output.makeToSale.fert.Asia.Units.Europe.push(val.Europe);
          output.makeToSale.fert.Asia.Units.Asia.push(val.Asia);
        });

        fertFgDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.fert.All["FG $"].Category.push(val.Category);
            output.makeToSale.fert.All["FG $"].Americas.push(val.Americas);
            output.makeToSale.fert.All["FG $"].Europe.push(val.Europe);
            output.makeToSale.fert.All["FG $"].Asia.push(val.Asia);
          });

        fertFgDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Americas["FG $"].Category.push(val.Category);
          output.makeToSale.fert.Americas["FG $"].Americas.push(val.Americas);
          output.makeToSale.fert.Americas["FG $"].Europe.push(val.Europe);
          output.makeToSale.fert.Americas["FG $"].Asia.push(val.Asia);
        });

        fertFgDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Europe["FG $"].Category.push(val.Category);
          output.makeToSale.fert.Europe["FG $"].Americas.push(val.Americas);
          output.makeToSale.fert.Europe["FG $"].Europe.push(val.Europe);
          output.makeToSale.fert.Europe["FG $"].Asia.push(val.Asia);
        });

        fertFgDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.fert.Asia["FG $"].Category.push(val.Category);
          output.makeToSale.fert.Asia["FG $"].Americas.push(val.Americas);
          output.makeToSale.fert.Asia["FG $"].Europe.push(val.Europe);
          output.makeToSale.fert.Asia["FG $"].Asia.push(val.Asia);
        });

        //fert end

        //halb start
        let halbData = MakeToSaleProductionSitesValue.filter(
          (val) => val.MTART == "HALB"
        );

        let uniquehalbPlant_Name = [
          ...new Set(halbData.map((item) => item?.["Plant_Name"])),
        ].filter((item) => item != "" && item != undefined && item != null);

        var halbUnitDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };

        var halbFgDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };
        uniquehalbPlant_Name.map((uniq) => {
          let objALL = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICAS = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPE = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIA = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objALLFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICASFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPEFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIAFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          halbData.map((val) => {
            if (val.Plant_Name == uniq) {
              if (val.Sales_Continent == "AMERICAS") {
                objALL.Americas += val.Total_Quantity;
                objALLFg.Americas += val["FG$"];
              }
              if (val.Sales_Continent == "EUROPE") {
                objALL.Europe += val.Total_Quantity;
                objALLFg.Europe += val["FG$"];
              }
              if (val.Sales_Continent == "ASIA") {
                objALL.Asia += val.Total_Quantity;
                objALLFg.Asia += val["FG$"];
              }

              if (val.Production_Continent == "AMERICAS") {
                if (val.Sales_Continent == "AMERICAS") {
                  objAMERICAS.Americas += val.Total_Quantity;
                  objAMERICASFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objAMERICAS.Europe += val.Total_Quantity;
                  objAMERICASFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objAMERICAS.Asia += val.Total_Quantity;
                  objAMERICASFg.Asia += val["FG$"];
                }
              }

              if (val.Production_Continent == "EUROPE") {
                if (val.Sales_Continent == "AMERICAS") {
                  objEUROPE.Americas += val.Total_Quantity;
                  objEUROPEFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objEUROPE.Europe += val.Total_Quantity;
                  objEUROPEFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objEUROPE.Asia += val.Total_Quantity;
                  objEUROPEFg.Asia += val["FG$"];
                }
              }
              if (val.Production_Continent == "ASIA") {
                if (val.Sales_Continent == "AMERICAS") {
                  objASIA.Americas += val.Total_Quantity;
                  objASIAFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objASIA.Europe += val.Total_Quantity;
                  objASIAFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objASIA.Asia += val.Total_Quantity;
                  objASIAFg.Asia += val["FG$"];
                }
              }
            }
          });
          objALL.total = objALL.Americas + objALL.Asia + objALL.Europe;
          objAMERICAS.total =
            objAMERICAS.Americas + objAMERICAS.Asia + objAMERICAS.Europe;
          objEUROPE.total =
            objEUROPE.Americas + objEUROPE.Asia + objEUROPE.Europe;
          objASIA.total = objASIA.Americas + objASIA.Asia + objASIA.Europe;

          objALL.total > 0 && halbUnitDataArr.all.push(objALL);
          objAMERICAS.total > 0 && halbUnitDataArr.Americas.push(objAMERICAS);
          objEUROPE.total > 0 && halbUnitDataArr.Europe.push(objEUROPE);
          objASIA.total > 0 && halbUnitDataArr.Asia.push(objASIA);

          objALLFg.total = objALLFg.Americas + objALLFg.Asia + objALLFg.Europe;
          objAMERICASFg.total =
            objAMERICASFg.Americas + objAMERICASFg.Asia + objAMERICASFg.Europe;
          objEUROPEFg.total =
            objEUROPEFg.Americas + objEUROPEFg.Asia + objEUROPEFg.Europe;
          objASIAFg.total =
            objASIAFg.Americas + objASIAFg.Asia + objASIAFg.Europe;

          objALLFg.total > 0 && halbFgDataArr.all.push(objALLFg);
          objAMERICASFg.total > 0 && halbFgDataArr.Americas.push(objAMERICASFg);
          objEUROPEFg.total > 0 && halbFgDataArr.Europe.push(objEUROPEFg);
          objASIAFg.total > 0 && halbFgDataArr.Asia.push(objASIAFg);
        });

        halbUnitDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.halb.All.Units.Category.push(val.Category);
            output.makeToSale.halb.All.Units.Americas.push(val.Americas);
            output.makeToSale.halb.All.Units.Europe.push(val.Europe);
            output.makeToSale.halb.All.Units.Asia.push(val.Asia);
          });

        halbUnitDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Americas.Units.Category.push(val.Category);
          output.makeToSale.halb.Americas.Units.Americas.push(val.Americas);
          output.makeToSale.halb.Americas.Units.Europe.push(val.Europe);
          output.makeToSale.halb.Americas.Units.Asia.push(val.Asia);
        });

        halbUnitDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Europe.Units.Category.push(val.Category);
          output.makeToSale.halb.Europe.Units.Americas.push(val.Americas);
          output.makeToSale.halb.Europe.Units.Europe.push(val.Europe);
          output.makeToSale.halb.Europe.Units.Asia.push(val.Asia);
        });

        halbUnitDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Asia.Units.Category.push(val.Category);
          output.makeToSale.halb.Asia.Units.Americas.push(val.Americas);
          output.makeToSale.halb.Asia.Units.Europe.push(val.Europe);
          output.makeToSale.halb.Asia.Units.Asia.push(val.Asia);
        });

        halbFgDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.halb.All["FG $"].Category.push(val.Category);
            output.makeToSale.halb.All["FG $"].Americas.push(val.Americas);
            output.makeToSale.halb.All["FG $"].Europe.push(val.Europe);
            output.makeToSale.halb.All["FG $"].Asia.push(val.Asia);
          });

        halbFgDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Americas["FG $"].Category.push(val.Category);
          output.makeToSale.halb.Americas["FG $"].Americas.push(val.Americas);
          output.makeToSale.halb.Americas["FG $"].Europe.push(val.Europe);
          output.makeToSale.halb.Americas["FG $"].Asia.push(val.Asia);
        });

        halbFgDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Europe["FG $"].Category.push(val.Category);
          output.makeToSale.halb.Europe["FG $"].Americas.push(val.Americas);
          output.makeToSale.halb.Europe["FG $"].Europe.push(val.Europe);
          output.makeToSale.halb.Europe["FG $"].Asia.push(val.Asia);
        });

        halbFgDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.halb.Asia["FG $"].Category.push(val.Category);
          output.makeToSale.halb.Asia["FG $"].Americas.push(val.Americas);
          output.makeToSale.halb.Asia["FG $"].Europe.push(val.Europe);
          output.makeToSale.halb.Asia["FG $"].Asia.push(val.Asia);
        });

        //halb end

        //all makeTosale start

        let uniqueallMakeTosalePlant_Name = [
          ...new Set(
            MakeToSaleProductionSitesValue.map((item) => item?.["Plant_Name"])
          ),
        ].filter((item) => item != "" && item != undefined && item != null);

        var allMakeTosaleUnitDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };

        var allMakeTosaleFgDataArr = {
          all: [],
          Americas: [],
          Europe: [],
          Asia: [],
        };
        uniqueallMakeTosalePlant_Name.map((uniq) => {
          let objALL = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICAS = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPE = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIA = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objALLFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          let objAMERICASFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objEUROPEFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };

          let objASIAFg = {
            Category: uniq,
            Americas: 0,
            Europe: 0,
            Asia: 0,
            total: 0,
          };
          MakeToSaleProductionSitesValue.map((val) => {
            if (val.Plant_Name == uniq) {
              if (val.Sales_Continent == "AMERICAS") {
                objALL.Americas += val.Total_Quantity;
                objALLFg.Americas += val["FG$"];
              }
              if (val.Sales_Continent == "EUROPE") {
                objALL.Europe += val.Total_Quantity;
                objALLFg.Europe += val["FG$"];
              }
              if (val.Sales_Continent == "ASIA") {
                objALL.Asia += val.Total_Quantity;
                objALLFg.Asia += val["FG$"];
              }

              if (val.Production_Continent == "AMERICAS") {
                if (val.Sales_Continent == "AMERICAS") {
                  objAMERICAS.Americas += val.Total_Quantity;
                  objAMERICASFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objAMERICAS.Europe += val.Total_Quantity;
                  objAMERICASFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objAMERICAS.Asia += val.Total_Quantity;
                  objAMERICASFg.Asia += val["FG$"];
                }
              }

              if (val.Production_Continent == "EUROPE") {
                if (val.Sales_Continent == "AMERICAS") {
                  objEUROPE.Americas += val.Total_Quantity;
                  objEUROPEFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objEUROPE.Europe += val.Total_Quantity;
                  objEUROPEFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objEUROPE.Asia += val.Total_Quantity;
                  objEUROPEFg.Asia += val["FG$"];
                }
              }
              if (val.Production_Continent == "ASIA") {
                if (val.Sales_Continent == "AMERICAS") {
                  objASIA.Americas += val.Total_Quantity;
                  objASIAFg.Americas += val["FG$"];
                }
                if (val.Sales_Continent == "EUROPE") {
                  objASIA.Europe += val.Total_Quantity;
                  objASIAFg.Europe += val["FG$"];
                }
                if (val.Sales_Continent == "ASIA") {
                  objASIA.Asia += val.Total_Quantity;
                  objASIAFg.Asia += val["FG$"];
                }
              }
            }
          });
          objALL.total = objALL.Americas + objALL.Asia + objALL.Europe;
          objAMERICAS.total =
            objAMERICAS.Americas + objAMERICAS.Asia + objAMERICAS.Europe;
          objEUROPE.total =
            objEUROPE.Americas + objEUROPE.Asia + objEUROPE.Europe;
          objASIA.total = objASIA.Americas + objASIA.Asia + objASIA.Europe;

          objALL.total > 0 && allMakeTosaleUnitDataArr.all.push(objALL);
          objAMERICAS.total > 0 &&
            allMakeTosaleUnitDataArr.Americas.push(objAMERICAS);
          objEUROPE.total > 0 &&
            allMakeTosaleUnitDataArr.Europe.push(objEUROPE);
          objASIA.total > 0 && allMakeTosaleUnitDataArr.Asia.push(objASIA);

          objALLFg.total = objALLFg.Americas + objALLFg.Asia + objALLFg.Europe;
          objAMERICASFg.total =
            objAMERICASFg.Americas + objAMERICASFg.Asia + objAMERICASFg.Europe;
          objEUROPEFg.total =
            objEUROPEFg.Americas + objEUROPEFg.Asia + objEUROPEFg.Europe;
          objASIAFg.total =
            objASIAFg.Americas + objASIAFg.Asia + objASIAFg.Europe;

          objALLFg.total > 0 && allMakeTosaleFgDataArr.all.push(objALLFg);
          objAMERICASFg.total > 0 &&
            allMakeTosaleFgDataArr.Americas.push(objAMERICASFg);
          objEUROPEFg.total > 0 &&
            allMakeTosaleFgDataArr.Europe.push(objEUROPEFg);
          objASIAFg.total > 0 && allMakeTosaleFgDataArr.Asia.push(objASIAFg);
        });

        allMakeTosaleUnitDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.all.All.Units.Category.push(val.Category);
            output.makeToSale.all.All.Units.Americas.push(val.Americas);
            output.makeToSale.all.All.Units.Europe.push(val.Europe);
            output.makeToSale.all.All.Units.Asia.push(val.Asia);
          });

        allMakeTosaleUnitDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Americas.Units.Category.push(val.Category);
          output.makeToSale.all.Americas.Units.Americas.push(val.Americas);
          output.makeToSale.all.Americas.Units.Europe.push(val.Europe);
          output.makeToSale.all.Americas.Units.Asia.push(val.Asia);
        });

        allMakeTosaleUnitDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Europe.Units.Category.push(val.Category);
          output.makeToSale.all.Europe.Units.Americas.push(val.Americas);
          output.makeToSale.all.Europe.Units.Europe.push(val.Europe);
          output.makeToSale.all.Europe.Units.Asia.push(val.Asia);
        });

        allMakeTosaleUnitDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Asia.Units.Category.push(val.Category);
          output.makeToSale.all.Asia.Units.Americas.push(val.Americas);
          output.makeToSale.all.Asia.Units.Europe.push(val.Europe);
          output.makeToSale.all.Asia.Units.Asia.push(val.Asia);
        });

        allMakeTosaleFgDataArr.all
          .sort((a, b) => {
            return b.total - a.total;
          })
          .map((val) => {
            output.makeToSale.all.All["FG $"].Category.push(val.Category);
            output.makeToSale.all.All["FG $"].Americas.push(val.Americas);
            output.makeToSale.all.All["FG $"].Europe.push(val.Europe);
            output.makeToSale.all.All["FG $"].Asia.push(val.Asia);
          });

        allMakeTosaleFgDataArr.Americas.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Americas["FG $"].Category.push(val.Category);
          output.makeToSale.all.Americas["FG $"].Americas.push(val.Americas);
          output.makeToSale.all.Americas["FG $"].Europe.push(val.Europe);
          output.makeToSale.all.Americas["FG $"].Asia.push(val.Asia);
        });

        allMakeTosaleFgDataArr.Europe.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Europe["FG $"].Category.push(val.Category);
          output.makeToSale.all.Europe["FG $"].Americas.push(val.Americas);
          output.makeToSale.all.Europe["FG $"].Europe.push(val.Europe);
          output.makeToSale.all.Europe["FG $"].Asia.push(val.Asia);
        });

        allMakeTosaleFgDataArr.Asia.sort((a, b) => {
          return b.total - a.total;
        }).map((val) => {
          output.makeToSale.all.Asia["FG $"].Category.push(val.Category);
          output.makeToSale.all.Asia["FG $"].Americas.push(val.Americas);
          output.makeToSale.all.Asia["FG $"].Europe.push(val.Europe);
          output.makeToSale.all.Asia["FG $"].Asia.push(val.Asia);
        });

        //all makeTosale end
      }
      let response = {};
      response.data = output;

      resolve(response);
      // console.log(ProductionSitesValue[0]);
    } catch (error) {
      reject(error);
    }
  });
};

// module.exports.getProductionSites = (
//   ProductionSitesValue,
//   MakeToSaleProductionSitesValue
// ) => {
//   return new Promise((resolve, reject) => {
//     try {
//       let ProductionSitesValues = ProductionSitesValue.filter(
//         (item) =>
//           item != "" &&
//           item != undefined &&
//           item != null &&
//           item.Source_Continent !== null
//       );

//       let MakeToSaleProductionSitesValues =
//         MakeToSaleProductionSitesValue.filter(
//           (item) =>
//             item != "" &&
//             item != undefined &&
//             item != null &&
//             item.Source_Continent !== null
//         );

//       let output = {
//         sourceToMake: {
//           components: {
//             All: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },

//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Europe: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Americas: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Asia: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//           },
//           ingredients: {
//             All: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },

//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Europe: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Americas: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Asia: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//           },
//         },
//         makeToSale: {
//           all: {
//             All: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },

//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Europe: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Americas: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Asia: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//           },
//           fert: {
//             All: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },

//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Europe: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Americas: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Asia: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//           },
//           halb: {
//             All: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },

//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Europe: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Americas: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//             Asia: {
//               Units: {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//               "FG $": {
//                 Category: [],
//                 Americas: [],
//                 Europe: [],
//                 Asia: [],
//               },
//             },
//           },
//         },
//       };

//       ProductionSitesValues.forEach((val) => {
//         if (
//           val.Material_Type == "Components" &&
//           val.Production_Continent == "EUROPE"
//         ) {
//           const componentEuropeIndex =
//             output.sourceToMake.components.Europe.Units.Category.indexOf(
//               val.Plant_Name
//             );

//           if (val.Source_Continent == "EUROPE") {
//             if (componentEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Europe[
//                 componentEuropeIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 componentEuropeIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Europe.Units.Americas[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Asia[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 componentEuropeIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               // .push(val.Plant_Name);
//               output.sourceToMake.components.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Europe.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Europe["FG $"].Europe.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Europe.Units.Americas.push(0);
//               output.sourceToMake.components.Europe["FG $"].Americas.push(0);
//               output.sourceToMake.components.Europe.Units.Asia.push(0);
//               output.sourceToMake.components.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (componentEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Americas[
//                 componentEuropeIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 componentEuropeIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Europe.Units.Europe[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Asia[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 componentEuropeIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Europe.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Europe["FG $"].Americas.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Europe.Units.Europe.push(0);
//               output.sourceToMake.components.Europe["FG $"].Europe.push(0);
//               output.sourceToMake.components.Europe.Units.Asia.push(0);
//               output.sourceToMake.components.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (componentEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Asia[
//                 componentEuropeIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 componentEuropeIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Europe.Units.Europe[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Americas[
//                 componentEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 componentEuropeIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Europe.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Europe["FG $"].Asia.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Europe.Units.Europe.push(0);
//               output.sourceToMake.components.Europe["FG $"].Europe.push(0);
//               output.sourceToMake.components.Europe.Units.Americas.push(0);
//               output.sourceToMake.components.Europe["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.Material_Type == "Components" &&
//           val.Production_Continent == "AMERICAS"
//         ) {
//           const componentAmericasIndex =
//             output.sourceToMake.components.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Source_Continent == "EUROPE") {
//             if (componentAmericasIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 componentAmericasIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 componentAmericasIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Americas.Units.Americas[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Asia[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 componentAmericasIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Americas.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Americas["FG $"].Europe.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Americas.Units.Americas.push(0);
//               output.sourceToMake.components.Americas["FG $"].Americas.push(0);
//               output.sourceToMake.components.Americas.Units.Asia.push(0);
//               output.sourceToMake.components.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (componentAmericasIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 componentAmericasIndex
//               ] += 0;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Americas[
//                 componentAmericasIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 componentAmericasIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Americas.Units.Asia[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 componentAmericasIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Americas.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Americas["FG $"].Americas.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Americas.Units.Europe.push(0);
//               output.sourceToMake.components.Americas["FG $"].Europe.push(0);
//               output.sourceToMake.components.Americas.Units.Asia.push(0);
//               output.sourceToMake.components.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (componentAmericasIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 componentAmericasIndex
//               ] += 0;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Americas[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 componentAmericasIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Asia[
//                 componentAmericasIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 componentAmericasIndex
//               ] += val["FG$"];
//             } else {
//               output.sourceToMake.components.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Americas.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Americas["FG $"].Asia.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Americas.Units.Europe.push(0);
//               output.sourceToMake.components.Americas["FG $"].Europe.push(0);
//               output.sourceToMake.components.Americas.Units.Americas.push(0);
//               output.sourceToMake.components.Americas["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.Material_Type == "Components" &&
//           val.Production_Continent == "ASIA"
//         ) {
//           const componentAsiaIndex =
//             output.sourceToMake.components.Asia.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Source_Continent == "EUROPE") {
//             if (componentAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 componentAsiaIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 componentAsiaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Asia.Units.Americas[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Asia[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 componentAsiaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Asia.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Asia["FG $"].Europe.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.components.Asia.Units.Americas.push(0);
//               output.sourceToMake.components.Asia["FG $"].Americas.push(0);
//               output.sourceToMake.components.Asia.Units.Asia.push(0);
//               output.sourceToMake.components.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (componentAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 componentAsiaIndex
//               ] += 0;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Americas[
//                 componentAsiaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 componentAsiaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Asia.Units.Asia[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 componentAsiaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.components.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Asia.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Asia["FG $"].Americas.push(
//                 val["FG$"]
//               );

//               output.sourceToMake.components.Asia.Units.Europe.push(0);
//               output.sourceToMake.components.Asia["FG $"].Europe.push(0);
//               output.sourceToMake.components.Asia.Units.Asia.push(0);
//               output.sourceToMake.components.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (componentAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 componentAsiaIndex
//               ] += 0;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Americas[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 componentAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Asia[
//                 componentAsiaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 componentAsiaIndex
//               ] += val["FG$"];
//             } else {
//               output.sourceToMake.components.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.components.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.components.Asia.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.components.Asia["FG $"].Asia.push(val["FG$"]);
//               output.sourceToMake.components.Asia.Units.Europe.push(0);
//               output.sourceToMake.components.Asia["FG $"].Europe.push(0);
//               output.sourceToMake.components.Asia.Units.Americas.push(0);
//               output.sourceToMake.components.Asia["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.Material_Type == "Ingredients" &&
//           val.Production_Continent == "EUROPE"
//         ) {
//           const ingredientEuropeIndex =
//             output.sourceToMake.ingredients.Europe.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Source_Continent == "EUROPE") {
//             if (ingredientEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Europe[
//                 ingredientEuropeIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 ingredientEuropeIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Europe.Units.Americas[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Asia[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 ingredientEuropeIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Europe.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Europe.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Europe.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Americas.push(0);
//               output.sourceToMake.ingredients.Europe.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (ingredientEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Europe[
//                 ingredientEuropeIndex
//               ] += 0;

//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Americas[
//                 ingredientEuropeIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 ingredientEuropeIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Europe.Units.Asia[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 ingredientEuropeIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Europe.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Americas.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Europe.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Europe.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (ingredientEuropeIndex >= 0) {
//               output.sourceToMake.components.Europe.Units.Europe[
//                 ingredientEuropeIndex
//               ] += 0;

//               output.sourceToMake.components.Europe["FG $"].Europe[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Americas[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe["FG $"].Americas[
//                 ingredientEuropeIndex
//               ] += 0;
//               output.sourceToMake.components.Europe.Units.Asia[
//                 ingredientEuropeIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Europe["FG $"].Asia[
//                 ingredientEuropeIndex
//               ] += val["FG$"];
//             } else {
//               output.sourceToMake.ingredients.Europe.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Europe.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Europe["FG $"].Asia.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Europe.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Europe.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Europe["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.Material_Type == "Ingredients" &&
//           val.Production_Continent == "AMERICAS"
//         ) {
//           const ingredientAmericaIndex =
//             output.sourceToMake.ingredients.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Source_Continent == "EUROPE") {
//             if (ingredientAmericaIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 ingredientAmericaIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 ingredientAmericaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Americas.Units.Americas[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Asia[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 ingredientAmericaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Americas.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Europe.push(
//                 val["FG$"]
//               );

//               output.sourceToMake.ingredients.Americas.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Americas.push(0);
//               output.sourceToMake.ingredients.Americas.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (ingredientAmericaIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 ingredientAmericaIndex
//               ] += 0;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Americas[
//                 ingredientAmericaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 ingredientAmericaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Americas.Units.Asia[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 ingredientAmericaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Americas.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Americas.push(
//                 val["FG$"]
//               );

//               output.sourceToMake.ingredients.Americas.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Americas.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (ingredientAmericaIndex >= 0) {
//               output.sourceToMake.components.Americas.Units.Europe[
//                 ingredientAmericaIndex
//               ] += 0;

//               output.sourceToMake.components.Americas["FG $"].Europe[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Americas[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas["FG $"].Americas[
//                 ingredientAmericaIndex
//               ] += 0;
//               output.sourceToMake.components.Americas.Units.Asia[
//                 ingredientAmericaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Americas["FG $"].Asia[
//                 ingredientAmericaIndex
//               ] += val["FG$"];
//             } else {
//               output.sourceToMake.ingredients.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Americas.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Americas["FG $"].Asia.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Americas.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Americas.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Americas["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.Material_Type == "Ingredients" &&
//           val.Production_Continent == "ASIA"
//         ) {
//           const ingredientAsiaIndex =
//             output.sourceToMake.ingredients.Asia.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Source_Continent == "EUROPE") {
//             if (ingredientAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 ingredientAsiaIndex
//               ] += val.Total_Quantity;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 ingredientAsiaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Asia.Units.Americas[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Asia[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 ingredientAsiaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Asia.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Europe.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Asia.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Americas.push(0);
//               output.sourceToMake.ingredients.Asia.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "AMERICAS") {
//             if (ingredientAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 ingredientAsiaIndex
//               ] += 0;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Americas[
//                 ingredientAsiaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 ingredientAsiaIndex
//               ] += val["FG$"];
//               output.sourceToMake.components.Asia.Units.Asia[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 ingredientAsiaIndex
//               ] += 0;
//             } else {
//               output.sourceToMake.ingredients.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Asia.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Americas.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Asia.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Asia.Units.Asia.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Source_Continent == "ASIA") {
//             if (ingredientAsiaIndex >= 0) {
//               output.sourceToMake.components.Asia.Units.Europe[
//                 ingredientAsiaIndex
//               ] += 0;

//               output.sourceToMake.components.Asia["FG $"].Europe[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Americas[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia["FG $"].Americas[
//                 ingredientAsiaIndex
//               ] += 0;
//               output.sourceToMake.components.Asia.Units.Asia[
//                 ingredientAsiaIndex
//               ] += val.Total_Quantity;
//               output.sourceToMake.components.Asia["FG $"].Asia[
//                 ingredientAsiaIndex
//               ] += val["FG$"];
//             } else {
//               output.sourceToMake.ingredients.Asia.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.sourceToMake.ingredients.Asia.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.sourceToMake.ingredients.Asia["FG $"].Asia.push(
//                 val["FG$"]
//               );
//               output.sourceToMake.ingredients.Asia.Units.Europe.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Europe.push(0);
//               output.sourceToMake.ingredients.Asia.Units.Americas.push(0);
//               output.sourceToMake.ingredients.Asia["FG $"].Americas.push(0);
//             }
//           }
//         }
//       });

//       // All
//       // Components
//       output.sourceToMake.components.All.Units.Category.push(
//         ...output.sourceToMake.components.Europe.Units.Category,
//         ...output.sourceToMake.components.Americas.Units.Category,
//         ...output.sourceToMake.components.Asia.Units.Category
//       );
//       output.sourceToMake.components.All["FG $"].Category.push(
//         ...output.sourceToMake.components.Europe["FG $"].Category,
//         ...output.sourceToMake.components.Americas["FG $"].Category,
//         ...output.sourceToMake.components.Asia["FG $"].Category
//       );

//       // output.sourceToMake.components.All.Units.Category.
//       output.sourceToMake.components.All.Units.Americas.push(
//         ...output.sourceToMake.components.Europe.Units.Americas,
//         ...output.sourceToMake.components.Americas.Units.Americas,
//         ...output.sourceToMake.components.Asia.Units.Americas
//       );
//       output.sourceToMake.components.All["FG $"].Americas.push(
//         ...output.sourceToMake.components.Europe["FG $"].Americas,
//         ...output.sourceToMake.components.Americas["FG $"].Americas,
//         ...output.sourceToMake.components.Asia["FG $"].Americas
//       );

//       output.sourceToMake.components.All.Units.Europe.push(
//         ...output.sourceToMake.components.Europe.Units.Europe,
//         ...output.sourceToMake.components.Americas.Units.Europe,
//         ...output.sourceToMake.components.Asia.Units.Europe
//       );
//       output.sourceToMake.components.All["FG $"].Europe.push(
//         ...output.sourceToMake.components.Europe["FG $"].Europe,
//         ...output.sourceToMake.components.Americas["FG $"].Europe,
//         ...output.sourceToMake.components.Asia["FG $"].Europe
//       );

//       output.sourceToMake.components.All.Units.Asia.push(
//         ...output.sourceToMake.components.Europe.Units.Asia,
//         ...output.sourceToMake.components.Americas.Units.Asia,
//         ...output.sourceToMake.components.Asia.Units.Asia
//       );
//       output.sourceToMake.components.All["FG $"].Asia.push(
//         ...output.sourceToMake.components.Europe["FG $"].Asia,
//         ...output.sourceToMake.components.Americas["FG $"].Asia,
//         ...output.sourceToMake.components.Asia["FG $"].Asia
//       );

//       // Ingredients
//       output.sourceToMake.ingredients.All.Units.Category.push(
//         ...output.sourceToMake.ingredients.Europe.Units.Category,
//         ...output.sourceToMake.ingredients.Americas.Units.Category,
//         ...output.sourceToMake.ingredients.Asia.Units.Category
//       );
//       output.sourceToMake.ingredients.All["FG $"].Category.push(
//         ...output.sourceToMake.ingredients.Europe["FG $"].Category,
//         ...output.sourceToMake.ingredients.Americas["FG $"].Category,
//         ...output.sourceToMake.ingredients.Asia["FG $"].Category
//       );

//       output.sourceToMake.ingredients.All.Units.Americas.push(
//         ...output.sourceToMake.ingredients.Europe.Units.Americas,
//         ...output.sourceToMake.ingredients.Americas.Units.Americas,
//         ...output.sourceToMake.ingredients.Asia.Units.Americas
//       );
//       output.sourceToMake.ingredients.All["FG $"].Americas.push(
//         ...output.sourceToMake.ingredients.Europe["FG $"].Americas,
//         ...output.sourceToMake.ingredients.Americas["FG $"].Americas,
//         ...output.sourceToMake.ingredients.Asia["FG $"].Americas
//       );

//       output.sourceToMake.ingredients.All.Units.Europe.push(
//         ...output.sourceToMake.ingredients.Europe.Units.Europe,
//         ...output.sourceToMake.ingredients.Americas.Units.Europe,
//         ...output.sourceToMake.ingredients.Asia.Units.Europe
//       );
//       output.sourceToMake.ingredients.All["FG $"].Europe.push(
//         ...output.sourceToMake.ingredients.Europe["FG $"].Europe,
//         ...output.sourceToMake.ingredients.Americas["FG $"].Europe,
//         ...output.sourceToMake.ingredients.Asia["FG $"].Europe
//       );

//       output.sourceToMake.ingredients.All.Units.Asia.push(
//         ...output.sourceToMake.ingredients.Europe.Units.Asia,
//         ...output.sourceToMake.ingredients.Americas.Units.Asia,
//         ...output.sourceToMake.ingredients.Asia.Units.Asia
//       );
//       output.sourceToMake.ingredients.All["FG $"].Asia.push(
//         ...output.sourceToMake.ingredients.Europe["FG $"].Asia,
//         ...output.sourceToMake.ingredients.Americas["FG $"].Asia,
//         ...output.sourceToMake.ingredients.Asia["FG $"].Asia
//       );

//       MakeToSaleProductionSitesValues.forEach((val) => {
//         // uniqueComponentPlants.map((plant) => {
//         if (val.Production_Continent == "EUROPE") {
//           const allEuropeIndex =
//             output.makeToSale.all.Europe.Units.Category.indexOf(val.Plant_Name);
//           if (val.Source_Continent == "EUROPE") {
//             if (allEuropeIndex >= 0) {
//               output.makeToSale.all.Europe.Units.Europe[allEuropeIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.all.Europe["FG $"].Europe[allEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.all.Europe.Units.Americas[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe["FG $"].Americas[
//                 allEuropeIndex
//               ] += 0;
//               output.makeToSale.all.Europe.Units.Asia[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe["FG $"].Asia[allEuropeIndex] += 0;
//             } else {
//               output.makeToSale.all.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Europe.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Europe["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.all.Europe.Units.Americas.push(0);
//               output.makeToSale.all.Europe["FG $"].Americas.push(0);
//               output.makeToSale.all.Europe.Units.Asia.push(0);
//               output.makeToSale.all.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (allEuropeIndex >= 0) {
//               output.makeToSale.all.Europe.Units.Europe[allEuropeIndex] += 0;

//               output.makeToSale.all.Europe["FG $"].Europe[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe.Units.Americas[allEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Europe["FG $"].Americas[allEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.all.Europe.Units.Asia[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe["FG $"].Asia[allEuropeIndex] += 0;
//             } else {
//               output.makeToSale.all.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Europe.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Europe["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.all.Europe.Units.Europe.push(0);
//               output.makeToSale.all.Europe["FG $"].Europe.push(0);
//               output.makeToSale.all.Europe.Units.Asia.push(0);
//               output.makeToSale.all.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (allEuropeIndex >= 0) {
//               output.makeToSale.all.Europe.Units.Europe[allEuropeIndex] += 0;

//               output.makeToSale.all.Europe["FG $"].Europe[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe.Units.Americas[allEuropeIndex] += 0;
//               output.makeToSale.all.Europe["FG $"].Americas[
//                 allEuropeIndex
//               ] += 0;
//               output.makeToSale.all.Europe.Units.Asia[allEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Europe["FG $"].Asia[allEuropeIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.all.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Europe.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.all.Europe["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.all.Europe.Units.Europe.push(0);
//               output.makeToSale.all.Europe["FG $"].Europe.push(0);

//               output.makeToSale.all.Europe.Units.Americas.push(0);
//               output.makeToSale.all.Europe["FG $"].Americas.push(0);
//             }
//           }
//         } else if (val.Production_Continent == "AMERICAS") {
//           const allAmericasIndex =
//             output.makeToSale.all.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (allAmericasIndex >= 0) {
//               output.makeToSale.all.Americas.Units.Europe[allAmericasIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.all.Americas["FG $"].Europe[allAmericasIndex] +=
//                 val["FG$"];
//               output.makeToSale.all.Americas.Units.Americas[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas["FG $"].Americas[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas.Units.Asia[allAmericasIndex] += 0;
//               output.makeToSale.all.Americas["FG $"].Asia[
//                 allAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.all.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.all.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Americas.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Americas["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.all.Americas.Units.Americas.push(0);
//               output.makeToSale.all.Americas["FG $"].Americas.push(0);
//               output.makeToSale.all.Americas.Units.Asia.push(0);
//               output.makeToSale.all.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (allAmericasIndex >= 0) {
//               output.makeToSale.all.Americas.Units.Europe[
//                 allAmericasIndex
//               ] += 0;

//               output.makeToSale.all.Americas["FG $"].Europe[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas.Units.Americas[allAmericasIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Americas["FG $"].Americas[
//                 allAmericasIndex
//               ] += val["FG$"];
//               output.makeToSale.all.Americas.Units.Asia[allAmericasIndex] += 0;
//               output.makeToSale.all.Americas["FG $"].Asia[
//                 allAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.all.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.all.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Americas.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Americas["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.all.Americas.Units.Europe.push(0);
//               output.makeToSale.all.Americas["FG $"].Europe.push(0);
//               output.makeToSale.all.Americas.Units.Asia.push(0);
//               output.makeToSale.all.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (allAmericasIndex >= 0) {
//               output.makeToSale.all.Americas.Units.Europe[
//                 allAmericasIndex
//               ] += 0;

//               output.makeToSale.all.Americas["FG $"].Europe[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas.Units.Americas[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas["FG $"].Americas[
//                 allAmericasIndex
//               ] += 0;
//               output.makeToSale.all.Americas.Units.Asia[allAmericasIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Americas["FG $"].Asia[allAmericasIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.all.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.all.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.all.Americas.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Americas["FG $"].Asia.push(val["FG$"]);
//               output.makeToSale.all.Americas.Units.Europe.push(0);
//               output.makeToSale.all.Americas["FG $"].Europe.push(0);

//               output.makeToSale.all.Americas.Units.Americas.push(0);
//               output.makeToSale.all.Americas["FG $"].Americas.push(0);
//             }
//           }
//         } else if (val.Production_Continent == "ASIA") {
//           const allAsiaIndex =
//             output.makeToSale.all.Asia.Units.Category.indexOf(val.Plant_Name);
//           if (val.Sales_Continent == "EUROPE") {
//             if (allAsiaIndex >= 0) {
//               output.makeToSale.all.Asia.Units.Europe[allAsiaIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.all.Asia["FG $"].Europe[allAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.all.Asia.Units.Americas[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia["FG $"].Americas[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia.Units.Asia[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia["FG $"].Asia[allAsiaIndex] += 0;
//             } else {
//               output.makeToSale.all.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.all.Asia.Units.Europe.push(val.Total_Quantity);
//               output.makeToSale.all.Asia["FG $"].Europe.push(val["FG$"]);
//               output.makeToSale.all.Asia.Units.Americas.push(0);
//               output.makeToSale.all.Asia["FG $"].Americas.push(0);
//               output.makeToSale.all.Asia.Units.Asia.push(0);
//               output.makeToSale.all.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (allAsiaIndex >= 0) {
//               output.makeToSale.all.Asia.Units.Europe[allAsiaIndex] += 0;

//               output.makeToSale.all.Asia["FG $"].Europe[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia.Units.Americas[allAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Asia["FG $"].Americas[allAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.all.Asia.Units.Asia[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia["FG $"].Asia[allAsiaIndex] += 0;
//             } else {
//               output.makeToSale.all.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.all.Asia.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.all.Asia["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.all.Asia.Units.Europe.push(0);
//               output.makeToSale.all.Asia["FG $"].Europe.push(0);
//               output.makeToSale.all.Asia.Units.Asia.push(0);
//               output.makeToSale.all.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (allAsiaIndex >= 0) {
//               output.makeToSale.all.Asia.Units.Europe[allAsiaIndex] += 0;

//               output.makeToSale.all.Asia["FG $"].Europe[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia.Units.Americas[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia["FG $"].Americas[allAsiaIndex] += 0;
//               output.makeToSale.all.Asia.Units.Asia[allAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.all.Asia["FG $"].Asia[allAsiaIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.all.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.all.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.all.Asia.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.all.Asia["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.all.Asia.Units.Americas.push(0);
//               output.makeToSale.all.Asia["FG $"].Americas.push(0);

//               output.makeToSale.all.Asia.Units.Europe.push(0);
//               output.makeToSale.all.Asia["FG $"].Europe.push(0);
//             }
//           }
//         }
//       });

//       output.makeToSale.all.All.Units.Category.push(
//         ...output.makeToSale.all.Europe.Units.Category,
//         ...output.makeToSale.all.Americas.Units.Category,
//         ...output.makeToSale.all.Asia.Units.Category
//       );
//       output.makeToSale.all.All["FG $"].Category.push(
//         ...output.makeToSale.all.Europe["FG $"].Category,
//         ...output.makeToSale.all.Americas["FG $"].Category,
//         ...output.makeToSale.all.Asia["FG $"].Category
//       );

//       output.makeToSale.all.All.Units.Americas.push(
//         ...output.makeToSale.all.Europe.Units.Americas,
//         ...output.makeToSale.all.Americas.Units.Americas,
//         ...output.makeToSale.all.Asia.Units.Americas
//       );
//       output.makeToSale.all.All["FG $"].Americas.push(
//         ...output.makeToSale.all.Europe["FG $"].Americas,
//         ...output.makeToSale.all.Americas["FG $"].Americas,
//         ...output.makeToSale.all.Asia["FG $"].Americas
//       );

//       output.makeToSale.all.All.Units.Europe.push(
//         ...output.makeToSale.all.Europe.Units.Europe,
//         ...output.makeToSale.all.Americas.Units.Europe,
//         ...output.makeToSale.all.Asia.Units.Europe
//       );
//       output.makeToSale.all.All["FG $"].Europe.push(
//         ...output.makeToSale.all.Europe["FG $"].Europe,
//         ...output.makeToSale.all.Americas["FG $"].Europe,
//         ...output.makeToSale.all.Asia["FG $"].Europe
//       );

//       output.makeToSale.all.All.Units.Asia.push(
//         ...output.makeToSale.all.Europe.Units.Asia,
//         ...output.makeToSale.all.Americas.Units.Asia,
//         ...output.makeToSale.all.Asia.Units.Asia
//       );
//       output.makeToSale.all.All["FG $"].Asia.push(
//         ...output.makeToSale.all.Europe["FG $"].Asia,
//         ...output.makeToSale.all.Americas["FG $"].Asia,
//         ...output.makeToSale.all.Asia["FG $"].Asia
//       );

//       // All

//       MakeToSaleProductionSitesValues.forEach((val) => {
//         // uniqueComponentPlants.map((plant) => {
//         if (val.MTART == "FERT" && val.Production_Continent == "EUROPE") {
//           const fertEuropeIndex =
//             output.makeToSale.fert.Europe.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (fertEuropeIndex >= 0) {
//               output.makeToSale.fert.Europe.Units.Europe[fertEuropeIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.fert.Europe["FG $"].Europe[fertEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.fert.Europe.Units.Americas[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe["FG $"].Americas[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe.Units.Asia[fertEuropeIndex] += 0;
//               output.makeToSale.fert.Europe["FG $"].Asia[fertEuropeIndex] += 0;
//             } else {
//               output.makeToSale.fert.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Europe.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Europe["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.fert.Europe.Units.Americas.push(0);
//               output.makeToSale.fert.Europe["FG $"].Americas.push(0);
//               output.makeToSale.fert.Europe.Units.Asia.push(0);
//             }
//             output.makeToSale.fert.Europe["FG $"].Asia.push(0);
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (fertEuropeIndex >= 0) {
//               output.makeToSale.fert.Europe.Units.Europe[fertEuropeIndex] += 0;

//               output.makeToSale.fert.Europe["FG $"].Europe[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe.Units.Americas[fertEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.fert.Europe["FG $"].Americas[fertEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.fert.Europe.Units.Asia[fertEuropeIndex] += 0;
//               output.makeToSale.fert.Europe["FG $"].Asia[fertEuropeIndex] += 0;
//             } else {
//               output.makeToSale.fert.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Europe.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Europe["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.fert.Europe.Units.Europe.push(0);
//               output.makeToSale.fert.Europe["FG $"].Europe.push(0);
//               output.makeToSale.fert.Europe.Units.Asia.push(0);
//               output.makeToSale.fert.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (fertEuropeIndex >= 0) {
//               output.makeToSale.fert.Europe.Units.Europe[fertEuropeIndex] += 0;

//               output.makeToSale.fert.Europe["FG $"].Europe[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe.Units.Americas[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe["FG $"].Americas[
//                 fertEuropeIndex
//               ] += 0;
//               output.makeToSale.fert.Europe.Units.Asia[fertEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.fert.Europe["FG $"].Asia[fertEuropeIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.fert.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Europe.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.fert.Europe["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.fert.Europe.Units.Europe.push(0);
//               output.makeToSale.fert.Europe["FG $"].Europe.push(0);

//               output.makeToSale.fert.Europe.Units.Americas.push(0);
//               output.makeToSale.fert.Europe["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.MTART == "FERT" &&
//           val.Production_Continent == "AMERICAS"
//         ) {
//           const fertAmericasIndex =
//             output.makeToSale.fert.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (fertAmericasIndex >= 0) {
//               output.makeToSale.fert.Americas.Units.Europe[fertAmericasIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.fert.Americas["FG $"].Europe[
//                 fertAmericasIndex
//               ] += val["FG$"];
//               output.makeToSale.fert.Americas.Units.Americas[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas["FG $"].Americas[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas.Units.Asia[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas["FG $"].Asia[
//                 fertAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.fert.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.fert.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Americas.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Americas["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.fert.Americas.Units.Americas.push(0);
//               output.makeToSale.fert.Americas["FG $"].Americas.push(0);
//               output.makeToSale.fert.Americas.Units.Asia.push(0);
//               output.makeToSale.fert.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (fertAmericasIndex >= 0) {
//               output.makeToSale.fert.Americas.Units.Europe[
//                 fertAmericasIndex
//               ] += 0;

//               output.makeToSale.fert.Americas["FG $"].Europe[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas.Units.Americas[
//                 fertAmericasIndex
//               ] += val.Total_Quantity;
//               output.makeToSale.fert.Americas["FG $"].Americas[
//                 fertAmericasIndex
//               ] += val["FG$"];
//               output.makeToSale.fert.Americas.Units.Asia[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas["FG $"].Asia[
//                 fertAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.fert.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.fert.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Americas.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Americas["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.fert.Americas.Units.Europe.push(0);
//               output.makeToSale.fert.Americas["FG $"].Europe.push(0);
//               output.makeToSale.fert.Americas.Units.Asia.push(0);
//               output.makeToSale.fert.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (fertAmericasIndex >= 0) {
//               output.makeToSale.fert.Americas.Units.Europe[
//                 fertAmericasIndex
//               ] += 0;

//               output.makeToSale.fert.Americas["FG $"].Europe[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas.Units.Americas[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas["FG $"].Americas[
//                 fertAmericasIndex
//               ] += 0;
//               output.makeToSale.fert.Americas.Units.Asia[fertAmericasIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.fert.Americas["FG $"].Asia[fertAmericasIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.fert.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.fert.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.fert.Americas.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Americas["FG $"].Asia.push(val["FG$"]);
//               output.makeToSale.fert.Americas.Units.Europe.push(0);
//               output.makeToSale.fert.Americas["FG $"].Europe.push(0);

//               output.makeToSale.fert.Americas.Units.Americas.push(0);
//               output.makeToSale.fert.Americas["FG $"].Americas.push(0);
//             }
//           }
//         } else if (val.MTART == "FERT" && val.Production_Continent == "ASIA") {
//           const fertAsiaIndex =
//             output.makeToSale.fert.Asia.Units.Category.indexOf(val.Plant_Name);
//           if (val.Sales_Continent == "EUROPE") {
//             if (fertAsiaIndex >= 0) {
//               output.makeToSale.fert.Asia.Units.Europe[fertAsiaIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.fert.Asia["FG $"].Europe[fertAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.fert.Asia.Units.Americas[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia["FG $"].Americas[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia.Units.Asia[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia["FG $"].Asia[fertAsiaIndex] += 0;
//             } else {
//               output.makeToSale.fert.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.fert.Asia.Units.Europe.push(val.Total_Quantity);
//               output.makeToSale.fert.Asia["FG $"].Europe.push(val["FG$"]);
//               output.makeToSale.fert.Asia.Units.Americas.push(0);
//               output.makeToSale.fert.Asia["FG $"].Americas.push(0);
//               output.makeToSale.fert.Asia.Units.Asia.push(0);
//               output.makeToSale.fert.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (fertAsiaIndex >= 0) {
//               output.makeToSale.fert.Asia.Units.Europe[fertAsiaIndex] += 0;

//               output.makeToSale.fert.Asia["FG $"].Europe[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia.Units.Americas[fertAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.fert.Asia["FG $"].Americas[fertAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.fert.Asia.Units.Asia[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia["FG $"].Asia[fertAsiaIndex] += 0;
//             } else {
//               output.makeToSale.fert.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.fert.Asia.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.fert.Asia["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.fert.Asia.Units.Europe.push(0);
//               output.makeToSale.fert.Asia["FG $"].Europe.push(0);
//               output.makeToSale.fert.Asia.Units.Asia.push(0);
//               output.makeToSale.fert.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (fertAsiaIndex >= 0) {
//               output.makeToSale.fert.Asia.Units.Europe[fertAsiaIndex] += 0;

//               output.makeToSale.fert.Asia["FG $"].Europe[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia.Units.Americas[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia["FG $"].Americas[fertAsiaIndex] += 0;
//               output.makeToSale.fert.Asia.Units.Asia[fertAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.fert.Asia["FG $"].Asia[fertAsiaIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.fert.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.fert.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.fert.Asia.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.fert.Asia["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.fert.Asia.Units.Americas.push(0);
//               output.makeToSale.fert.Asia["FG $"].Americas.push(0);

//               output.makeToSale.fert.Asia.Units.Europe.push(0);
//               output.makeToSale.fert.Asia["FG $"].Europe.push(0);
//             }
//           }
//         } else if (
//           val.MTART == "HALB" &&
//           val.Production_Continent == "EUROPE"
//         ) {
//           const halbEuropeIndex =
//             output.makeToSale.halb.Europe.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (halbEuropeIndex >= 0) {
//               output.makeToSale.halb.Europe.Units.Europe[halbEuropeIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.halb.Europe["FG $"].Europe[halbEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.halb.Europe.Units.Americas[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe["FG $"].Americas[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe.Units.Asia[halbEuropeIndex] += 0;
//               output.makeToSale.halb.Europe["FG $"].Asia[halbEuropeIndex] += 0;
//             } else {
//               output.makeToSale.halb.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Europe.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Europe["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.halb.Europe.Units.Americas.push(0);
//               output.makeToSale.halb.Europe["FG $"].Americas.push(0);
//               output.makeToSale.halb.Europe.Units.Asia.push(0);
//               output.makeToSale.halb.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (halbEuropeIndex >= 0) {
//               output.makeToSale.halb.Europe.Units.Europe[halbEuropeIndex] += 0;

//               output.makeToSale.halb.Europe["FG $"].Europe[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe.Units.Americas[halbEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.halb.Europe["FG $"].Americas[halbEuropeIndex] +=
//                 val["FG$"];
//               output.makeToSale.halb.Europe.Units.Asia[halbEuropeIndex] += 0;
//               output.makeToSale.halb.Europe["FG $"].Asia[halbEuropeIndex] += 0;
//             } else {
//               output.makeToSale.halb.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Europe.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Europe["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.halb.Europe.Units.Europe.push(0);
//               output.makeToSale.halb.Europe["FG $"].Europe.push(0);
//               output.makeToSale.halb.Europe.Units.Asia.push(0);
//               output.makeToSale.halb.Europe["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (halbEuropeIndex >= 0) {
//               output.makeToSale.halb.Europe.Units.Europe[halbEuropeIndex] += 0;

//               output.makeToSale.halb.Europe["FG $"].Europe[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe.Units.Americas[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe["FG $"].Americas[
//                 halbEuropeIndex
//               ] += 0;
//               output.makeToSale.halb.Europe.Units.Asia[halbEuropeIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.halb.Europe["FG $"].Asia[halbEuropeIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.halb.Europe.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Europe["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Europe.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.halb.Europe["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.halb.Europe.Units.Europe.push(0);
//               output.makeToSale.halb.Europe["FG $"].Europe.push(0);

//               output.makeToSale.halb.Europe.Units.Americas.push(0);
//               output.makeToSale.halb.Europe["FG $"].Americas.push(0);
//             }
//           }
//         } else if (
//           val.MTART == "HALB" &&
//           val.Production_Continent == "AMERICAS"
//         ) {
//           const halbAmericasIndex =
//             output.makeToSale.halb.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (halbAmericasIndex >= 0) {
//               output.makeToSale.halb.Americas.Units.Europe[halbAmericasIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.halb.Americas["FG $"].Europe[
//                 halbAmericasIndex
//               ] += val["FG$"];
//               output.makeToSale.halb.Americas.Units.Americas[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas["FG $"].Americas[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas.Units.Asia[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas["FG $"].Asia[
//                 halbAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.halb.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.halb.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Americas.Units.Europe.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Americas["FG $"].Europe.push(val["FG$"]);

//               output.makeToSale.halb.Americas.Units.Americas.push(0);
//               output.makeToSale.halb.Americas["FG $"].Americas.push(0);
//               output.makeToSale.halb.Americas.Units.Asia.push(0);
//               output.makeToSale.halb.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (halbAmericasIndex >= 0) {
//               output.makeToSale.halb.Americas.Units.Europe[
//                 halbAmericasIndex
//               ] += 0;

//               output.makeToSale.halb.Americas["FG $"].Europe[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas.Units.Americas[
//                 halbAmericasIndex
//               ] += val.Total_Quantity;
//               output.makeToSale.halb.Americas["FG $"].Americas[
//                 halbAmericasIndex
//               ] += val["FG$"];
//               output.makeToSale.halb.Americas.Units.Asia[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas["FG $"].Asia[
//                 halbAmericasIndex
//               ] += 0;
//             } else {
//               output.makeToSale.halb.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.halb.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Americas.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Americas["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.halb.Americas.Units.Europe.push(0);
//               output.makeToSale.halb.Americas["FG $"].Europe.push(0);
//               output.makeToSale.halb.Americas.Units.Asia.push(0);
//               output.makeToSale.halb.Americas["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (halbAmericasIndex >= 0) {
//               output.makeToSale.halb.Americas.Units.Europe[
//                 halbAmericasIndex
//               ] += 0;

//               output.makeToSale.halb.Americas["FG $"].Europe[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas.Units.Americas[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas["FG $"].Americas[
//                 halbAmericasIndex
//               ] += 0;
//               output.makeToSale.halb.Americas.Units.Asia[halbAmericasIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.halb.Americas["FG $"].Asia[halbAmericasIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.halb.Americas.Units.Category.push(
//                 val.Plant_Name
//               );
//               output.makeToSale.halb.Americas["FG $"].Category.push(
//                 val.Plant_Name
//               );

//               output.makeToSale.halb.Americas.Units.Asia.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Americas["FG $"].Asia.push(val["FG$"]);
//               output.makeToSale.halb.Americas.Units.Europe.push(0);
//               output.makeToSale.halb.Americas["FG $"].Europe.push(0);

//               output.makeToSale.halb.Americas.Units.Americas.push(0);
//               output.makeToSale.halb.Americas["FG $"].Americas.push(0);
//             }
//           }
//         } else if (val.MTART == "HALB" && val.Production_Continent == "ASIA") {
//           const halbAsiaIndex =
//             output.makeToSale.halb.Americas.Units.Category.indexOf(
//               val.Plant_Name
//             );
//           if (val.Sales_Continent == "EUROPE") {
//             if (halbAsiaIndex >= 0) {
//               output.makeToSale.halb.Asia.Units.Europe[halbAsiaIndex] +=
//                 val.Total_Quantity;

//               output.makeToSale.halb.Asia["FG $"].Europe[halbAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.halb.Asia.Units.Americas[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia["FG $"].Americas[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia.Units.Asia[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia["FG $"].Asia[halbAsiaIndex] += 0;
//             } else {
//               output.makeToSale.halb.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.halb.Asia.Units.Europe.push(val.Total_Quantity);
//               output.makeToSale.halb.Asia["FG $"].Europe.push(val["FG$"]);
//               output.makeToSale.halb.Asia.Units.Americas.push(0);
//               output.makeToSale.halb.Asia["FG $"].Americas.push(0);
//               output.makeToSale.halb.Asia.Units.Asia.push(0);
//               output.makeToSale.halb.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "AMERICAS") {
//             if (halbAsiaIndex >= 0) {
//               output.makeToSale.halb.Asia.Units.Europe[halbAsiaIndex] += 0;

//               output.makeToSale.halb.Asia["FG $"].Europe[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia.Units.Americas[halbAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.halb.Asia["FG $"].Americas[halbAsiaIndex] +=
//                 val["FG$"];
//               output.makeToSale.halb.Asia.Units.Asia[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia["FG $"].Asia[halbAsiaIndex] += 0;
//             } else {
//               output.makeToSale.halb.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.halb.Asia.Units.Americas.push(
//                 val.Total_Quantity
//               );
//               output.makeToSale.halb.Asia["FG $"].Americas.push(val["FG$"]);

//               output.makeToSale.halb.Asia.Units.Europe.push(0);
//               output.makeToSale.halb.Asia["FG $"].Europe.push(0);
//               output.makeToSale.halb.Asia.Units.Asia.push(0);
//               output.makeToSale.halb.Asia["FG $"].Asia.push(0);
//             }
//           } else if (val.Sales_Continent == "ASIA") {
//             if (halbAsiaIndex >= 0) {
//               output.makeToSale.halb.Asia.Units.Europe[halbAsiaIndex] += 0;

//               output.makeToSale.halb.Asia["FG $"].Europe[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia.Units.Americas[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia["FG $"].Americas[halbAsiaIndex] += 0;
//               output.makeToSale.halb.Asia.Units.Asia[halbAsiaIndex] +=
//                 val.Total_Quantity;
//               output.makeToSale.halb.Asia["FG $"].Asia[halbAsiaIndex] +=
//                 val["FG$"];
//             } else {
//               output.makeToSale.halb.Asia.Units.Category.push(val.Plant_Name);
//               output.makeToSale.halb.Asia["FG $"].Category.push(val.Plant_Name);

//               output.makeToSale.halb.Asia.Units.Asia.push(val.Total_Quantity);
//               output.makeToSale.halb.Asia["FG $"].Asia.push(val["FG$"]);

//               output.makeToSale.halb.Asia.Units.Europe.push(0);
//               output.makeToSale.halb.Asia["FG $"].Europe.push(0);
//               output.makeToSale.halb.Asia.Units.Americas.push(0);
//               output.makeToSale.halb.Asia["FG $"].Americas.push(0);
//             }
//           }
//         }
//       });

//       // FERT
//       output.makeToSale.fert.All.Units.Category.push(
//         ...output.makeToSale.fert.Europe.Units.Category,
//         ...output.makeToSale.fert.Americas.Units.Category,
//         ...output.makeToSale.fert.Asia.Units.Category
//       );
//       output.makeToSale.fert.All["FG $"].Category.push(
//         ...output.makeToSale.fert.Europe["FG $"].Category,
//         ...output.makeToSale.fert.Americas["FG $"].Category,
//         ...output.makeToSale.fert.Asia["FG $"].Category
//       );

//       output.makeToSale.fert.All.Units.Americas.push(
//         ...output.makeToSale.fert.Europe.Units.Americas,
//         ...output.makeToSale.fert.Americas.Units.Americas,
//         ...output.makeToSale.fert.Asia.Units.Americas
//       );
//       output.makeToSale.fert.All["FG $"].Americas.push(
//         ...output.makeToSale.fert.Europe["FG $"].Americas,
//         ...output.makeToSale.fert.Americas["FG $"].Americas,
//         ...output.makeToSale.fert.Asia["FG $"].Americas
//       );

//       output.makeToSale.fert.All.Units.Europe.push(
//         ...output.makeToSale.fert.Europe.Units.Europe,
//         ...output.makeToSale.fert.Americas.Units.Europe,
//         ...output.makeToSale.fert.Asia.Units.Europe
//       );
//       output.makeToSale.fert.All["FG $"].Europe.push(
//         ...output.makeToSale.fert.Europe["FG $"].Europe,
//         ...output.makeToSale.fert.Americas["FG $"].Europe,
//         ...output.makeToSale.fert.Asia["FG $"].Europe
//       );

//       output.makeToSale.fert.All.Units.Asia.push(
//         ...output.makeToSale.fert.Europe.Units.Asia,
//         ...output.makeToSale.fert.Americas.Units.Asia,
//         ...output.makeToSale.fert.Asia.Units.Asia
//       );
//       output.makeToSale.fert.All["FG $"].Asia.push(
//         ...output.makeToSale.fert.Europe["FG $"].Asia,
//         ...output.makeToSale.fert.Americas["FG $"].Asia,
//         ...output.makeToSale.fert.Asia["FG $"].Asia
//       );

//       // HALB
//       output.makeToSale.halb.All.Units.Category.push(
//         ...output.makeToSale.halb.Europe.Units.Category,
//         ...output.makeToSale.halb.Americas.Units.Category,
//         ...output.makeToSale.halb.Asia.Units.Category
//       );
//       output.makeToSale.halb.All["FG $"].Category.push(
//         ...output.makeToSale.halb.Europe["FG $"].Category,
//         ...output.makeToSale.halb.Americas["FG $"].Category,
//         ...output.makeToSale.halb.Asia["FG $"].Category
//       );

//       output.makeToSale.halb.All.Units.Americas.push(
//         ...output.makeToSale.halb.Europe.Units.Americas,
//         ...output.makeToSale.halb.Americas.Units.Americas,
//         ...output.makeToSale.halb.Asia.Units.Americas
//       );
//       output.makeToSale.halb.All["FG $"].Americas.push(
//         ...output.makeToSale.halb.Europe["FG $"].Americas,
//         ...output.makeToSale.halb.Americas["FG $"].Americas,
//         ...output.makeToSale.halb.Asia["FG $"].Americas
//       );

//       output.makeToSale.halb.All.Units.Europe.push(
//         ...output.makeToSale.halb.Europe.Units.Europe,
//         ...output.makeToSale.halb.Americas.Units.Europe,
//         ...output.makeToSale.halb.Asia.Units.Europe
//       );
//       output.makeToSale.halb.All["FG $"].Europe.push(
//         ...output.makeToSale.halb.Europe["FG $"].Europe,
//         ...output.makeToSale.halb.Americas["FG $"].Europe,
//         ...output.makeToSale.halb.Asia["FG $"].Europe
//       );

//       output.makeToSale.halb.All.Units.Asia.push(
//         ...output.makeToSale.halb.Europe.Units.Asia,
//         ...output.makeToSale.halb.Americas.Units.Asia,
//         ...output.makeToSale.halb.Asia.Units.Asia
//       );
//       output.makeToSale.halb.All["FG $"].Asia.push(
//         ...output.makeToSale.halb.Europe["FG $"].Asia,
//         ...output.makeToSale.halb.Americas["FG $"].Asia,
//         ...output.makeToSale.halb.Asia["FG $"].Asia
//       );
//       // console.log("wait", output);
//       // // });

//       let response = {};
//       response.data = output;

//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports.getRegionalizationPercentage = (
  SourceToMakeIngredients,
  SourceToMakeComponents,
  MakeToSaleFERT,
  MakeToSaleHALB
) => {
  return new Promise((resolve, reject) => {
    try {
      const output = {
        salesToMakeIng: [
          {
            region: "Americas",
            americas: null,
            europe: null,
            asia: null,
          },
          {
            region: "Europe",
            americas: null,
            europe: null,
            asia: null,
          },
          {
            region: "Asia",
            americas: null,
            europe: null,
            asia: null,
          },
        ],
        salesToMakeComp: [
          {
            region: "Americas",
            americas: null,
            europe: null,
            asia: null,
          },
          {
            region: "Europe",
            americas: null,
            europe: null,
            asia: null,
          },
          {
            region: "Asia",
            americas: null,
            europe: null,
            asia: null,
          },
        ],
        makeToSale: {
          all: [
            {
              region: "Americas",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Europe",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Asia",
              americas: null,
              europe: null,
              asia: null,
            },
          ],
          fert: [
            {
              region: "Americas",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Europe",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Asia",
              americas: null,
              europe: null,
              asia: null,
            },
          ],
          halb: [
            {
              region: "Americas",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Europe",
              americas: null,
              europe: null,
              asia: null,
            },
            {
              region: "Asia",
              americas: null,
              europe: null,
              asia: null,
            },
          ],
        },
      };

      SourceToMakeIngredients.map((val) => {
        if (val.vendor_Region == "AMERICAS") {
          output.salesToMakeIng[0].americas = val.AMERICAS;
          output.salesToMakeIng[0].europe = val.EUROPE;
          output.salesToMakeIng[0].asia = val.ASIA;
        } else if (val.vendor_Region == "EUROPE") {
          output.salesToMakeIng[1].americas = val.AMERICAS;
          output.salesToMakeIng[1].europe = val.EUROPE;
          output.salesToMakeIng[1].asia = val.ASIA;
        } else if (val.vendor_Region == "ASIA") {
          output.salesToMakeIng[2].americas = val.AMERICAS;
          output.salesToMakeIng[2].europe = val.EUROPE;
          output.salesToMakeIng[2].asia = val.ASIA;
        }
      });

      SourceToMakeComponents.map((val) => {
        if (val.vendor_Region == "AMERICAS") {
          output.salesToMakeComp[0].americas = val.AMERICAS;
          output.salesToMakeComp[0].europe = val.EUROPE;
          output.salesToMakeComp[0].asia = val.ASIA;
        } else if (val.vendor_Region == "EUROPE") {
          output.salesToMakeComp[1].americas = val.AMERICAS;
          output.salesToMakeComp[1].europe = val.EUROPE;
          output.salesToMakeComp[1].asia = val.ASIA;
        } else if (val.vendor_Region == "ASIA") {
          output.salesToMakeComp[2].americas = val.AMERICAS;
          output.salesToMakeComp[2].europe = val.EUROPE;
          output.salesToMakeComp[2].asia = val.ASIA;
        }
      });

      MakeToSaleFERT.map((val) => {
        if (val.Production_Region == "AMERICAS") {
          output.makeToSale.fert[0].americas = val.AMERICAS;
          output.makeToSale.fert[0].europe = val.EUROPE;
          output.makeToSale.fert[0].asia = val.ASIA;
          output.makeToSale.all[0].americas = val.AMERICAS;
          output.makeToSale.all[0].europe = val.EUROPE;
          output.makeToSale.all[0].asia = val.ASIA;
        } else if (val.Production_Region == "EUROPE") {
          output.makeToSale.fert[1].americas = val.AMERICAS;
          output.makeToSale.fert[1].europe = val.EUROPE;
          output.makeToSale.fert[1].asia = val.ASIA;
          output.makeToSale.all[1].americas = val.AMERICAS;
          output.makeToSale.all[1].europe = val.EUROPE;
          output.makeToSale.all[1].asia = val.ASIA;
        } else if (val.Production_Region == "ASIA") {
          output.makeToSale.fert[2].americas = val.AMERICAS;
          output.makeToSale.fert[2].europe = val.EUROPE;
          output.makeToSale.fert[2].asia = val.ASIA;
          output.makeToSale.all[2].americas = val.AMERICAS;
          output.makeToSale.all[2].europe = val.EUROPE;
          output.makeToSale.all[2].asia = val.ASIA;
        }
      });

      MakeToSaleHALB.map((val) => {
        if (val.Production_Region == "AMERICAS") {
          output.makeToSale.halb[0].americas = val.AMERICAS;
          output.makeToSale.halb[0].europe = val.EUROPE;
          output.makeToSale.halb[0].asia = val.ASIA;
          output.makeToSale.all[0].americas =
            output.makeToSale.all[0].americas + val.AMERICAS;
          output.makeToSale.all[0].europe =
            output.makeToSale.all[0].europe + val.EUROPE;
          output.makeToSale.all[0].asia =
            output.makeToSale.all[0].asia + val.ASIA;
        } else if (val.Production_Region == "EUROPE") {
          output.makeToSale.halb[1].americas = val.AMERICAS;
          output.makeToSale.halb[1].europe = val.EUROPE;
          output.makeToSale.halb[1].asia = val.ASIA;
          output.makeToSale.all[1].americas =
            output.makeToSale.all[1].americas + val.AMERICAS;
          output.makeToSale.all[1].europe =
            output.makeToSale.all[1].europe + val.EUROPE;
          output.makeToSale.all[1].asia =
            output.makeToSale.all[1].asia + val.ASIA;
        } else if (val.Production_Region == "ASIA") {
          output.makeToSale.halb[2].americas = val.AMERICAS;
          output.makeToSale.halb[2].europe = val.EUROPE;
          output.makeToSale.halb[2].asia = val.ASIA;
          output.makeToSale.all[2].americas =
            output.makeToSale.all[2].americas + val.AMERICAS;
          output.makeToSale.all[2].europe =
            output.makeToSale.all[2].europe + val.EUROPE;
          output.makeToSale.all[2].asia =
            output.makeToSale.all[2].asia + val.ASIA;
        }
      });

      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

function regionData(data, percent) {
  const obj = {
    "Material Group": [],
    Regionalized: [],
    "Non-Regionalized": [],
    "%Regionalized": [],
    "%Non-Regionalized": [],
  };

  if (percent == "all") {
    let counter = {};
    data.forEach(function (obj) {
      var key = obj.Material_Group_Description;
      counter[key] = (counter[key] || 0) + 1;
    });

    const uniqueData = [
      ...new Set(data.map((item) => item?.["Material_Group_Description"])),
    ].filter((item) => item != "" && item != undefined && item != null);

    uniqueData.map((val) => {
      obj["Material Group"].push(val);
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (element.Material_Group_Description == val) {
          if (counter[val] == 2) {
            if (element.Regionalized_Flag == "Y") {
              obj["Regionalized"].push(element["Total_Quantity"]);
              obj["%Regionalized"].push(element["Regionalized_%"]);
            }
            if (element.Regionalized_Flag == "N") {
              obj["Non-Regionalized"].push(element["Total_Quantity"]);
              obj["%Non-Regionalized"].push(element["Regionalized_%"]);
            }
          }

          if (counter[val] == 1) {
            if (element.Regionalized_Flag == "Y") {
              obj["Regionalized"].push(element["Total_Quantity"]);
              obj["%Regionalized"].push(element["Regionalized_%"]);
              obj["Non-Regionalized"].push(0);
              obj["%Non-Regionalized"].push(0);
            } else if (element.Regionalized_Flag == "N") {
              obj["Regionalized"].push(0);
              obj["%Regionalized"].push(0);
              obj["Non-Regionalized"].push(element["Total_Quantity"]);
              obj["%Non-Regionalized"].push(element["Regionalized_%"]);
            }
          }
        }
      }
    });
  }

  if (percent == "75") {
    let counter = {};
    data.forEach(function (obj) {
      var key = obj.Material_Group_Description;
      counter[key] = (counter[key] || 0) + 1;
    });

    const uniqueData = [
      ...new Set(data.map((item) => item?.["Material_Group_Description"])),
    ].filter((item) => item != "" && item != undefined && item != null);

    uniqueData.map((val) => {
      obj["Material Group"].push(val);
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (element.Material_Group_Description == val) {
          if (counter[val] == 2) {
            if (element["Regionalized_%"] > 75) {
              if (element.Regionalized_Flag == "Y") {
                obj["Regionalized"].push(element["Total_Quantity"]);
                obj["%Regionalized"].push(element["Regionalized_%"]);
              }
              if (element.Regionalized_Flag == "N") {
                obj["Non-Regionalized"].push(element["Total_Quantity"]);
                obj["%Non-Regionalized"].push(element["Regionalized_%"]);
              }
            }
          }

          if (counter[val] == 1 && element["Regionalized_%"] > 75) {
            if (element.Regionalized_Flag == "Y") {
              obj["Regionalized"].push(element["Total_Quantity"]);
              obj["%Regionalized"].push(element["Regionalized_%"]);
              obj["Non-Regionalized"].push(0);
              obj["%Non-Regionalized"].push(0);
            } else if (element.Regionalized_Flag == "N") {
              obj["Regionalized"].push(0);
              obj["%Regionalized"].push(0);
              obj["Non-Regionalized"].push(element["Total_Quantity"]);
              obj["%Non-Regionalized"].push(element["Regionalized_%"]);
            }
          }
        }
      }
    });
  }

  return obj;
}

// module.exports.getRegionalizationByMaterialGroup = (sourceData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const response = {};
//       response.data = {
//         sourceToMake: {
//           ingredients: {
//             All: {},
//             "<50%": {},
//             "50-75%": {},
//             ">75%": {},
//           },
//           components: {
//             All: {},
//             "<50%": {},
//             "50-75%": {},
//             ">75%": {},
//           },
//         },
//         makeToSale: {
//           fert: {
//             All: {},
//             "<50%": {},
//             "50-75%": {},
//             ">75%": {},
//           },
//           halb: {
//             All: {},
//             "<50%": {},
//             "50-75%": {},
//             ">75%": {},
//           },
//         },
//       };

//       const ingredientsY = sourceData.getRegionalizationByMaterialGroup.filter(
//         (item) =>
//           item?.Material_Type == "Ingredients" && item.Regionalized_Flag === "Y"
//       );
//       const ingredientsN = sourceData.getRegionalizationByMaterialGroup.filter(
//         (item) =>
//           item?.Material_Type == "Ingredients" && item.Regionalized_Flag === "N"
//       );

//       const ingredientsDataY = ingredientsY.sort(
//         (a, b) => a.Total_Quantity - b.Total_Quantity
//       );

//       const ingredientsData = ingredientsDataY.concat(ingredientsN);

//       const allIngredientsData = regionData(ingredientsData, "all");

//       response.data.sourceToMake.ingredients.All = allIngredientsData;

//      const moreseventyFiveIngredientsData = regionData(ingredientsData, "75");

//        response.data.sourceToMake.ingredients[">75%"] =
//        moreseventyFiveIngredientsData;

//        const fiftyToSeventyFiveIngredientsData = regionData(ingredientsData.filter(val => val["Regionalized_%"] > 49 && val["Regionalized_%"] < 75));

//      response.data.sourceToMake.ingredients["50-75%"] =
//        fiftyToSeventyFiveIngredientsData;

//        const lessFiftyIngredientsData = regionData(ingredientsData.filter(val => val["Regionalized_%"] < 50));

//      response.data.sourceToMake.ingredients["<50%"] = lessFiftyIngredientsData;

//       // const ingredientsDataPercentage = ingredientsY.sort(
//       //   (a, b) => b["Regionalized_%"] - a["Regionalized_%"]
//       // );
//       // const ingredientsDataPerDesc =
//       //   ingredientsDataPercentage.concat(ingredientsN);

//       // counter = {};

//       // ingredientsDataPerDesc.forEach(function (obj) {
//       //   var key = obj.Material_Group_Description;
//       //   counter[key] = (counter[key] || 0) + 1;
//       // });

//       // const uniqueKeysForIngredientsDataDesc = [
//       //   ...new Set(
//       //     ingredientsDataPerDesc.map(
//       //       (item) => item?.["Material_Group_Description"]
//       //     )
//       //   ),
//       // ].filter((item) => item != "" && item != undefined && item != null);

//       // const obj2 = {
//       //   "Material Group": [],
//       //   Regionalized: [],
//       //   "Non-Regionalized": [],
//       //   "%Regionalized": [],
//       //   "%Non-Regionalized": [],
//       // };

//       // uniqueKeysForIngredientsDataDesc.map((val) => {
//       //   obj2["Material Group"].push(val);
//       //   for (let i = 0; i < ingredientsData.length; i++) {
//       //     const element = ingredientsData[i];

//       //     if (element.Material_Group_Description == val) {
//       //       if (counter[val] == 2) {
//       //         if (element.Regionalized_Flag == "Y") {
//       //           obj2["Regionalized"].push(element["Total_Quantity"]);
//       //           obj2["%Regionalized"].push(element["Regionalized_%"]);
//       //         }
//       //         if (element.Regionalized_Flag == "N") {
//       //           obj2["Non-Regionalized"].push(element["Total_Quantity"]);
//       //           obj2["%Non-Regionalized"].push(element["Regionalized_%"]);
//       //         }
//       //       }

//       //       if (counter[val] == 1) {
//       //         if (element.Regionalized_Flag == "Y") {
//       //           obj2["Regionalized"].push(element["Total_Quantity"]);
//       //           obj2["%Regionalized"].push(element["Regionalized_%"]);
//       //           obj2["Non-Regionalized"].push(0);
//       //           obj2["%Non-Regionalized"].push(0);
//       //         } else if (element.Regionalized_Flag == "N") {
//       //           obj2["Regionalized"].push(0);
//       //           obj2["%Regionalized"].push(0);
//       //           obj2["Non-Regionalized"].push(element["Total_Quantity"]);
//       //           obj2["%Non-Regionalized"].push(element["Regionalized_%"]);
//       //         }
//       //       }
//       //     }
//       //   }
//       // });

//       // const moreseventyFiveIngredientsData = {
//       //   "Material Group": [],
//       //   Regionalized: [],
//       //   "Non-Regionalized": [],
//       //   "%Regionalized": [],
//       //   "%Non-Regionalized": [],
//       // };

//       // const fiftyToSeventyFiveIngredientsData = {
//       //   "Material Group": [],
//       //   Regionalized: [],
//       //   "Non-Regionalized": [],
//       //   "%Regionalized": [],
//       //   "%Non-Regionalized": [],
//       // };

//       // const lessFiftyIngredientsData = {
//       //   "Material Group": [],
//       //   Regionalized: [],
//       //   "Non-Regionalized": [],
//       //   "%Regionalized": [],
//       //   "%Non-Regionalized": [],
//       // };

//       // const greaterThanSeventyFive = obj2["%Regionalized"].filter(
//       //   (val) => val > 75
//       // ).length;

//       // moreseventyFiveIngredientsData["Material Group"] = obj2["Material Group"]
//       //   .slice(0, greaterThanSeventyFive)
//       //   .map((val) => val);
//       // moreseventyFiveIngredientsData["Regionalized"] = obj2["Regionalized"]
//       //   .slice(0, greaterThanSeventyFive)
//       //   .map((val) => val);
//       // moreseventyFiveIngredientsData["Non-Regionalized"] = obj2[
//       //   "Non-Regionalized"
//       // ]
//       //   .slice(0, greaterThanSeventyFive)
//       //   .map((val) => val);
//       // moreseventyFiveIngredientsData["%Regionalized"] = obj2["%Regionalized"]
//       //   .slice(0, greaterThanSeventyFive)
//       //   .map((val) => val);
//       // moreseventyFiveIngredientsData["%Non-Regionalized"] = obj2[
//       //   "%Non-Regionalized"
//       // ]
//       //   .slice(0, greaterThanSeventyFive)
//       //   .map((val) => val);

//       // const betSeventyFiveToFifity =
//       //   obj2["%Regionalized"].filter((val) => val < 75 && val > 50).length +
//       //   greaterThanSeventyFive;

//       // fiftyToSeventyFiveIngredientsData["Material Group"] = obj2[
//       //   "Material Group"
//       // ]
//       //   .slice(greaterThanSeventyFive, betSeventyFiveToFifity)
//       //   .map((val) => val);
//       // fiftyToSeventyFiveIngredientsData["Regionalized"] = obj2["Regionalized"]
//       //   .slice(greaterThanSeventyFive, betSeventyFiveToFifity)
//       //   .map((val) => val);
//       // fiftyToSeventyFiveIngredientsData["Non-Regionalized"] = obj2[
//       //   "Non-Regionalized"
//       // ]
//       //   .slice(greaterThanSeventyFive, betSeventyFiveToFifity)
//       //   .map((val) => val);
//       // fiftyToSeventyFiveIngredientsData["%Regionalized"] = obj2["%Regionalized"]
//       //   .slice(greaterThanSeventyFive, betSeventyFiveToFifity)
//       //   .map((val) => val);
//       // fiftyToSeventyFiveIngredientsData["%Non-Regionalized"] = obj2[
//       //   "%Non-Regionalized"
//       // ]
//       //   .slice(greaterThanSeventyFive, betSeventyFiveToFifity)
//       //   .map((val) => val);

//       // const lessThanFifty =
//       //   obj2["%Regionalized"].filter((val) => val < 50).length +
//       //   betSeventyFiveToFifity;

//       // lessFiftyIngredientsData["Material Group"] = obj2["Material Group"]
//       //   .slice(betSeventyFiveToFifity, lessThanFifty)
//       //   .map((val) => val);
//       // lessFiftyIngredientsData["Regionalized"] = obj2["Regionalized"]
//       //   .slice(betSeventyFiveToFifity, lessThanFifty)
//       //   .map((val) => val);
//       // lessFiftyIngredientsData["Non-Regionalized"] = obj2["Non-Regionalized"]
//       //   .slice(betSeventyFiveToFifity, lessThanFifty)
//       //   .map((val) => val);
//       // lessFiftyIngredientsData["%Regionalized"] = obj2["%Regionalized"]
//       //   .slice(betSeventyFiveToFifity, lessThanFifty)
//       //   .map((val) => val);
//       // lessFiftyIngredientsData["%Non-Regionalized"] = obj2["%Non-Regionalized"]
//       //   .slice(betSeventyFiveToFifity, lessThanFifty)
//       //   .map((val) => val);

//       //   console.log(moreseventyFiveIngredientsData);

//       //   moreseventyFiveIngredientsData

//       //componet Logic
//       const allComponentsData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const componentsY = sourceData.getRegionalizationByMaterialGroup.filter(
//         (item) =>
//           item?.Material_Type == "Components" && item.Regionalized_Flag === "Y"
//       );
//       const componentsN = sourceData.getRegionalizationByMaterialGroup.filter(
//         (item) =>
//           item?.Material_Type == "Components" && item.Regionalized_Flag === "N"
//       );

//       const componentsDataY = componentsY.sort(
//         (a, b) => a.Total_Quantity - b.Total_Quantity
//       );

//       const componentsData = componentsDataY.concat(componentsN);

//       counterComponents = {};

//       componentsData.forEach(function (obj) {
//         var key = obj.Material_Group_Description;
//         counterComponents[key] = (counterComponents[key] || 0) + 1;
//       });

//       const uniqueKeysForComponentsData = [
//         ...new Set(
//           componentsData.map((item) => item?.["Material_Group_Description"])
//         ),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       uniqueKeysForComponentsData.map((val) => {
//         allComponentsData["Material Group"].push(val);
//         for (let i = 0; i < componentsData.length; i++) {
//           const element = componentsData[i];

//           if (element.Material_Group_Description == val) {
//             if (counterComponents[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 allComponentsData["Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 allComponentsData["%Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//               if (element.Regionalized_Flag == "N") {
//                 allComponentsData["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 allComponentsData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterComponents[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 allComponentsData["Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 allComponentsData["%Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//                 allComponentsData["Non-Regionalized"].push(0);
//                 allComponentsData["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 allComponentsData["Regionalized"].push(0);
//                 allComponentsData["%Regionalized"].push(0);
//                 allComponentsData["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 allComponentsData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       response.data.sourceToMake.components.All = allComponentsData;

//       const componentsDataPercentage = componentsY.sort(
//         (a, b) => b["Regionalized_%"] - a["Regionalized_%"]
//       );
//       const componentsDataPerDesc =
//         componentsDataPercentage.concat(componentsN);

//       counterComponents = {};

//       componentsDataPerDesc.forEach(function (obj) {
//         var key = obj.Material_Group_Description;
//         counterComponents[key] = (counterComponents[key] || 0) + 1;
//       });

//       const uniqueKeysForcomponentsDataDesc = [
//         ...new Set(
//           componentsDataPerDesc.map(
//             (item) => item?.["Material_Group_Description"]
//           )
//         ),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       const componentsDataDesc = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       uniqueKeysForcomponentsDataDesc.map((val) => {
//         componentsDataDesc["Material Group"].push(val);
//         for (let i = 0; i < componentsData.length; i++) {
//           const element = componentsData[i];

//           if (element.Material_Group_Description == val) {
//             if (counterComponents[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 componentsDataDesc["Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 componentsDataDesc["%Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//               if (element.Regionalized_Flag == "N") {
//                 componentsDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 componentsDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterComponents[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 componentsDataDesc["Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 componentsDataDesc["%Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//                 componentsDataDesc["Non-Regionalized"].push(0);
//                 componentsDataDesc["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 componentsDataDesc["Regionalized"].push(0);
//                 componentsDataDesc["%Regionalized"].push(0);
//                 componentsDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 componentsDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       const moreseventyFivecomponentsData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const fiftyToSeventyFiveComponentsData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const lessFiftycomponentsData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const greaterThanSeventyFiveComponentLength = componentsDataDesc[
//         "%Regionalized"
//       ].filter((val) => val > 75).length;

//       moreseventyFivecomponentsData["Material Group"] = componentsDataDesc[
//         "Material Group"
//       ]
//         .slice(0, greaterThanSeventyFiveComponentLength)
//         .map((val) => val);
//       moreseventyFivecomponentsData["Regionalized"] = componentsDataDesc[
//         "Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveComponentLength)
//         .map((val) => val);
//       moreseventyFivecomponentsData["Non-Regionalized"] = componentsDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveComponentLength)
//         .map((val) => val);
//       moreseventyFivecomponentsData["%Regionalized"] = componentsDataDesc[
//         "%Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveComponentLength)
//         .map((val) => val);
//       moreseventyFivecomponentsData["%Non-Regionalized"] = componentsDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveComponentLength)
//         .map((val) => val);
//       // console.log(moreseventyFivecomponentsData);

//       const betSeventyFiveToFifityComponentLength =
//         componentsDataDesc["%Regionalized"].filter(
//           (val) => val < 75 && val > 50
//         ).length + greaterThanSeventyFiveComponentLength;

//       fiftyToSeventyFiveComponentsData["Material Group"] = componentsDataDesc[
//         "Material Group"
//       ]
//         .slice(
//           greaterThanSeventyFiveComponentLength,
//           betSeventyFiveToFifityComponentLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveComponentsData["Regionalized"] = componentsDataDesc[
//         "Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveComponentLength,
//           betSeventyFiveToFifityComponentLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveComponentsData["Non-Regionalized"] = componentsDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveComponentLength,
//           betSeventyFiveToFifityComponentLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveComponentsData["%Regionalized"] = componentsDataDesc[
//         "%Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveComponentLength,
//           betSeventyFiveToFifityComponentLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveComponentsData["%Non-Regionalized"] =
//         componentsDataDesc["%Non-Regionalized"]
//           .slice(
//             greaterThanSeventyFiveComponentLength,
//             betSeventyFiveToFifityComponentLength
//           )
//           .map((val) => val);

//       const lessThanFiftyComponentLength =
//         componentsDataDesc["%Regionalized"].filter((val) => val < 50).length +
//         betSeventyFiveToFifityComponentLength;

//       lessFiftycomponentsData["Material Group"] = componentsDataDesc[
//         "Material Group"
//       ]
//         .slice(
//           betSeventyFiveToFifityComponentLength,
//           lessThanFiftyComponentLength
//         )
//         .map((val) => val);
//       lessFiftycomponentsData["Regionalized"] = componentsDataDesc[
//         "Regionalized"
//       ]
//         .slice(
//           betSeventyFiveToFifityComponentLength,
//           lessThanFiftyComponentLength
//         )
//         .map((val) => val);
//       lessFiftycomponentsData["Non-Regionalized"] = componentsDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(
//           betSeventyFiveToFifityComponentLength,
//           lessThanFiftyComponentLength
//         )
//         .map((val) => val);
//       lessFiftycomponentsData["%Regionalized"] = componentsDataDesc[
//         "%Regionalized"
//       ]
//         .slice(
//           betSeventyFiveToFifityComponentLength,
//           lessThanFiftyComponentLength
//         )
//         .map((val) => val);
//       lessFiftycomponentsData["%Non-Regionalized"] = componentsDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(
//           betSeventyFiveToFifityComponentLength,
//           lessThanFiftyComponentLength
//         )
//         .map((val) => val);

//       response.data.sourceToMake.components[">75%"] =
//         moreseventyFivecomponentsData;
//       response.data.sourceToMake.components["50-75%"] =
//         fiftyToSeventyFiveComponentsData;
//       response.data.sourceToMake.components["<50%"] = lessFiftycomponentsData;

//       //fert data
//       //componet Logic
//       const allFertData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const fertY = sourceData.getMakeToSourceData.filter(
//         (item) => item?.MTART == "FERT" && item.Regionalized_Flag === "Y"
//       );
//       const fertN = sourceData.getMakeToSourceData.filter(
//         (item) => item?.MTART == "FERT" && item.Regionalized_Flag === "N"
//       );

//       const fertDataY = fertY.sort(
//         (a, b) => a.Total_Quantity - b.Total_Quantity
//       );

//       const fertData = fertDataY.concat(fertN);

//       counterFert = {};

//       fertData.forEach(function (obj) {
//         var key = obj.Priority_Subcategory;
//         counterFert[key] = (counterFert[key] || 0) + 1;
//       });

//       const uniqueKeysForFertData = [
//         ...new Set(fertData.map((item) => item?.["Priority_Subcategory"])),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       uniqueKeysForFertData.map((val) => {
//         allFertData["Material Group"].push(val);
//         for (let i = 0; i < fertData.length; i++) {
//           const element = fertData[i];

//           if (element.Priority_Subcategory == val) {
//             if (counterFert[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 allFertData["Regionalized"].push(element["Total_Quantity"]);
//                 allFertData["%Regionalized"].push(element["Regionalized_%"]);
//               }
//               if (element.Regionalized_Flag == "N") {
//                 allFertData["Non-Regionalized"].push(element["Total_Quantity"]);
//                 allFertData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterFert[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 allFertData["Regionalized"].push(element["Total_Quantity"]);
//                 allFertData["%Regionalized"].push(element["Regionalized_%"]);
//                 allFertData["Non-Regionalized"].push(0);
//                 allFertData["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 allFertData["Regionalized"].push(0);
//                 allFertData["%Regionalized"].push(0);
//                 allFertData["Non-Regionalized"].push(element["Total_Quantity"]);
//                 allFertData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       response.data.makeToSale.fert.All = allFertData;

//       const fertDataPercentage = fertY.sort(
//         (a, b) => b["Regionalized_%"] - a["Regionalized_%"]
//       );
//       const fertDataPerDesc = fertDataPercentage.concat(fertN);

//       counterFert = {};

//       fertDataPerDesc.forEach(function (obj) {
//         var key = obj.Priority_Subcategory;
//         counterFert[key] = (counterFert[key] || 0) + 1;
//       });

//       const uniqueKeysForFertDataDesc = [
//         ...new Set(
//           fertDataPerDesc.map((item) => item?.["Priority_Subcategory"])
//         ),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       const fertDataDesc = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       uniqueKeysForFertDataDesc.map((val) => {
//         fertDataDesc["Material Group"].push(val);
//         for (let i = 0; i < fertData.length; i++) {
//           const element = fertData[i];

//           if (element.Priority_Subcategory == val) {
//             if (counterFert[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 fertDataDesc["Regionalized"].push(element["Total_Quantity"]);
//                 fertDataDesc["%Regionalized"].push(element["Regionalized_%"]);
//               }
//               if (element.Regionalized_Flag == "N") {
//                 fertDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 fertDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterFert[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 fertDataDesc["Regionalized"].push(element["Total_Quantity"]);
//                 fertDataDesc["%Regionalized"].push(element["Regionalized_%"]);
//                 fertDataDesc["Non-Regionalized"].push(0);
//                 fertDataDesc["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 fertDataDesc["Regionalized"].push(0);
//                 fertDataDesc["%Regionalized"].push(0);
//                 fertDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 fertDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       const moreseventyFivefertData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const fiftyToSeventyFiveFertData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const lessFiftyFertData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const greaterThanSeventyFiveFertLength = fertDataDesc[
//         "%Regionalized"
//       ].filter((val) => val > 75).length;

//       moreseventyFivefertData["Material Group"] = fertDataDesc["Material Group"]
//         .slice(0, greaterThanSeventyFiveFertLength)
//         .map((val) => val);
//       moreseventyFivefertData["Regionalized"] = fertDataDesc["Regionalized"]
//         .slice(0, greaterThanSeventyFiveFertLength)
//         .map((val) => val);
//       moreseventyFivefertData["Non-Regionalized"] = fertDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveFertLength)
//         .map((val) => val);
//       moreseventyFivefertData["%Regionalized"] = fertDataDesc["%Regionalized"]
//         .slice(0, greaterThanSeventyFiveFertLength)
//         .map((val) => val);
//       moreseventyFivefertData["%Non-Regionalized"] = fertDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveFertLength)
//         .map((val) => val);
//       // console.log(moreseventyFivefertData);

//       const betSeventyFiveToFifityFertLength =
//         fertDataDesc["%Regionalized"].filter((val) => val < 75 && val > 50)
//           .length + greaterThanSeventyFiveFertLength;

//       fiftyToSeventyFiveFertData["Material Group"] = fertDataDesc[
//         "Material Group"
//       ]
//         .slice(
//           greaterThanSeventyFiveFertLength,
//           betSeventyFiveToFifityFertLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveFertData["Regionalized"] = fertDataDesc["Regionalized"]
//         .slice(
//           greaterThanSeventyFiveFertLength,
//           betSeventyFiveToFifityFertLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveFertData["Non-Regionalized"] = fertDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveFertLength,
//           betSeventyFiveToFifityFertLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveFertData["%Regionalized"] = fertDataDesc[
//         "%Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveFertLength,
//           betSeventyFiveToFifityFertLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveFertData["%Non-Regionalized"] = fertDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveFertLength,
//           betSeventyFiveToFifityFertLength
//         )
//         .map((val) => val);

//       const lessThanFiftyFertLength =
//         fertDataDesc["%Regionalized"].filter((val) => val < 50).length +
//         betSeventyFiveToFifityFertLength;

//       lessFiftyFertData["Material Group"] = fertDataDesc["Material Group"]
//         .slice(betSeventyFiveToFifityFertLength, lessThanFiftyFertLength)
//         .map((val) => val);
//       lessFiftyFertData["Regionalized"] = fertDataDesc["Regionalized"]
//         .slice(betSeventyFiveToFifityFertLength, lessThanFiftyFertLength)
//         .map((val) => val);
//       lessFiftyFertData["Non-Regionalized"] = fertDataDesc["Non-Regionalized"]
//         .slice(betSeventyFiveToFifityFertLength, lessThanFiftyFertLength)
//         .map((val) => val);
//       lessFiftyFertData["%Regionalized"] = fertDataDesc["%Regionalized"]
//         .slice(betSeventyFiveToFifityFertLength, lessThanFiftyFertLength)
//         .map((val) => val);
//       lessFiftyFertData["%Non-Regionalized"] = fertDataDesc["%Non-Regionalized"]
//         .slice(betSeventyFiveToFifityFertLength, lessThanFiftyFertLength)
//         .map((val) => val);

//       response.data.makeToSale.fert[">75%"] = moreseventyFivefertData;
//       response.data.makeToSale.fert["50-75%"] = fiftyToSeventyFiveFertData;
//       response.data.makeToSale.fert["<50%"] = lessFiftyFertData;

//       //halb data

//       const allHalbData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const halbY = sourceData.getMakeToSourceData.filter(
//         (item) => item?.MTART == "HALB" && item.Regionalized_Flag === "Y"
//       );
//       const halbN = sourceData.getMakeToSourceData.filter(
//         (item) => item?.MTART == "HALB" && item.Regionalized_Flag === "N"
//       );

//       const halbDataY = halbY.sort(
//         (a, b) => a.Total_Quantity - b.Total_Quantity
//       );

//       const halbData = halbDataY.concat(halbN);

//       counterHalb = {};

//       halbData.forEach(function (obj) {
//         var key = obj.Priority_Subcategory;
//         counterHalb[key] = (counterHalb[key] || 0) + 1;
//       });

//       const uniqueKeysForHalbData = [
//         ...new Set(halbData.map((item) => item?.["Priority_Subcategory"])),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       uniqueKeysForHalbData.map((val) => {
//         allHalbData["Material Group"].push(val);
//         for (let i = 0; i < halbData.length; i++) {
//           const element = halbData[i];

//           if (element.Priority_Subcategory == val) {
//             if (counterHalb[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 allHalbData["Regionalized"].push(element["Total_Quantity"]);
//                 allHalbData["%Regionalized"].push(element["Regionalized_%"]);
//               }
//               if (element.Regionalized_Flag == "N") {
//                 allHalbData["Non-Regionalized"].push(element["Total_Quantity"]);
//                 allHalbData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterHalb[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 allHalbData["Regionalized"].push(element["Total_Quantity"]);
//                 allHalbData["%Regionalized"].push(element["Regionalized_%"]);
//                 allHalbData["Non-Regionalized"].push(0);
//                 allHalbData["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 allHalbData["Regionalized"].push(0);
//                 allHalbData["%Regionalized"].push(0);
//                 allHalbData["Non-Regionalized"].push(element["Total_Quantity"]);
//                 allHalbData["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       response.data.makeToSale.halb.All = allHalbData;

//       const halbDataPercentage = halbY.sort(
//         (a, b) => b["Regionalized_%"] - a["Regionalized_%"]
//       );
//       const halbDataPerDesc = halbDataPercentage.concat(halbN);

//       counterHalb = {};

//       halbDataPerDesc.forEach(function (obj) {
//         var key = obj.Priority_Subcategory;
//         counterHalb[key] = (counterHalb[key] || 0) + 1;
//       });

//       const uniqueKeysForHalbDataDesc = [
//         ...new Set(
//           halbDataPerDesc.map((item) => item?.["Priority_Subcategory"])
//         ),
//       ].filter((item) => item != "" && item != undefined && item != null);

//       const halbDataDesc = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       uniqueKeysForHalbDataDesc.map((val) => {
//         halbDataDesc["Material Group"].push(val);
//         for (let i = 0; i < halbData.length; i++) {
//           if (element.Priority_Subcategory == val) {
//             if (counterHalb[val] == 2) {
//               if (element.Regionalized_Flag == "Y") {
//                 halbDataDesc["Regionalized"].push(element["Total_Quantity"]);
//                 halbDataDesc["%Regionalized"].push(element["Regionalized_%"]);
//               }
//               if (element.Regionalized_Flag == "N") {
//                 halbDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 halbDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }

//             if (counterHalb[val] == 1) {
//               if (element.Regionalized_Flag == "Y") {
//                 halbDataDesc["Regionalized"].push(element["Total_Quantity"]);
//                 halbDataDesc["%Regionalized"].push(element["Regionalized_%"]);
//                 halbDataDesc["Non-Regionalized"].push(0);
//                 halbDataDesc["%Non-Regionalized"].push(0);
//               } else if (element.Regionalized_Flag == "N") {
//                 halbDataDesc["Regionalized"].push(0);
//                 halbDataDesc["%Regionalized"].push(0);
//                 halbDataDesc["Non-Regionalized"].push(
//                   element["Total_Quantity"]
//                 );
//                 halbDataDesc["%Non-Regionalized"].push(
//                   element["Regionalized_%"]
//                 );
//               }
//             }
//           }
//         }
//       });

//       const moreseventyFiveHalbData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const fiftyToSeventyFiveHalbData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const lessFiftyHalbData = {
//         "Material Group": [],
//         Regionalized: [],
//         "Non-Regionalized": [],
//         "%Regionalized": [],
//         "%Non-Regionalized": [],
//       };

//       const greaterThanSeventyFiveHalbLength = halbDataDesc[
//         "%Regionalized"
//       ].filter((val) => val > 75).length;

//       moreseventyFiveHalbData["Material Group"] = halbDataDesc["Material Group"]
//         .slice(0, greaterThanSeventyFiveHalbLength)
//         .map((val) => val);
//       moreseventyFiveHalbData["Regionalized"] = halbDataDesc["Regionalized"]
//         .slice(0, greaterThanSeventyFiveHalbLength)
//         .map((val) => val);
//       moreseventyFiveHalbData["Non-Regionalized"] = halbDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveHalbLength)
//         .map((val) => val);
//       moreseventyFiveHalbData["%Regionalized"] = halbDataDesc["%Regionalized"]
//         .slice(0, greaterThanSeventyFiveHalbLength)
//         .map((val) => val);
//       moreseventyFiveHalbData["%Non-Regionalized"] = halbDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(0, greaterThanSeventyFiveHalbLength)
//         .map((val) => val);
//       // console.log(moreseventyFiveHalbData);

//       const betSeventyFiveToFifityHalbLength =
//         halbDataDesc["%Regionalized"].filter((val) => val < 75 && val > 50)
//           .length + greaterThanSeventyFiveHalbLength;

//       fiftyToSeventyFiveHalbData["Material Group"] = halbDataDesc[
//         "Material Group"
//       ]
//         .slice(
//           greaterThanSeventyFiveHalbLength,
//           betSeventyFiveToFifityHalbLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveHalbData["Regionalized"] = halbDataDesc["Regionalized"]
//         .slice(
//           greaterThanSeventyFiveHalbLength,
//           betSeventyFiveToFifityHalbLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveHalbData["Non-Regionalized"] = halbDataDesc[
//         "Non-Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveHalbLength,
//           betSeventyFiveToFifityHalbLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveHalbData["%Regionalized"] = halbDataDesc[
//         "%Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveHalbLength,
//           betSeventyFiveToFifityHalbLength
//         )
//         .map((val) => val);
//       fiftyToSeventyFiveHalbData["%Non-Regionalized"] = halbDataDesc[
//         "%Non-Regionalized"
//       ]
//         .slice(
//           greaterThanSeventyFiveHalbLength,
//           betSeventyFiveToFifityHalbLength
//         )
//         .map((val) => val);

//       const lessThanFiftyHalbLength =
//         halbDataDesc["%Regionalized"].filter((val) => val < 50).length +
//         betSeventyFiveToFifityHalbLength;

//       lessFiftyHalbData["Material Group"] = halbDataDesc["Material Group"]
//         .slice(betSeventyFiveToFifityHalbLength, lessThanFiftyHalbLength)
//         .map((val) => val);
//       lessFiftyHalbData["Regionalized"] = halbDataDesc["Regionalized"]
//         .slice(betSeventyFiveToFifityHalbLength, lessThanFiftyHalbLength)
//         .map((val) => val);
//       lessFiftyHalbData["Non-Regionalized"] = halbDataDesc["Non-Regionalized"]
//         .slice(betSeventyFiveToFifityHalbLength, lessThanFiftyHalbLength)
//         .map((val) => val);
//       lessFiftyHalbData["%Regionalized"] = halbDataDesc["%Regionalized"]
//         .slice(betSeventyFiveToFifityHalbLength, lessThanFiftyHalbLength)
//         .map((val) => val);
//       lessFiftyHalbData["%Non-Regionalized"] = halbDataDesc["%Non-Regionalized"]
//         .slice(betSeventyFiveToFifityHalbLength, lessThanFiftyHalbLength)
//         .map((val) => val);

//       response.data.makeToSale.halb[">75%"] = moreseventyFiveHalbData;
//       response.data.makeToSale.halb["50-75%"] = fiftyToSeventyFiveHalbData;
//       response.data.makeToSale.halb["<50%"] = lessFiftyHalbData;

//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };


module.exports.getRegionalizationByMaterialGroup = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        sourceToMake: {
          ingredients: {
            All: {},
            "<50%": {},
            "50-75%": {},
            ">75%": {},
          },
          components: {
            All: {},
            "<50%": {},
            "50-75%": {},
            ">75%": {},
          },
        },
        makeToSale: {
          all: {
            All: {},
            "<50%": {},
            "50-75%": {},
            ">75%": {},
          },
          fert: {
            All: {},
            "<50%": {},
            "50-75%": {},
            ">75%": {},
          },
          halb: {
            All: {},
            "<50%": {},
            "50-75%": {},
            ">75%": {},
          },
        },
      };

      //start ingredients
      const ingredientsData = sourceData.getRegionalizationByMaterialGroup.filter((item) => item?.Material_Type == "Ingredients" && item.Regionalized_Flag != null);

      counteringredientsData = {};

      ingredientsData.forEach(function (obj) {
        var key = obj.Material_Group_Description;
        counteringredientsData[key] = (counteringredientsData[key] || 0) + 1;
      });

      const uniqueKeysForIngredientsData = [
        ...new Set(
          ingredientsData.map((item) => item?.["Material_Group_Description"])
        ),
      ].filter((item) => item != "" && item != undefined && item != null);
      const arringredientsData = [];

      uniqueKeysForIngredientsData.map((val) => {
        const obj = {
          "Material Group": val,
          Regionalized: null,
          "Non-Regionalized": null,
          "%Regionalized": null,
          "%Non-Regionalized": null,
          total: 0
        };
        for (let i = 0; i < ingredientsData.length; i++) {

          const element = ingredientsData[i];
          if (element.Material_Group_Description == val) {
            if (counteringredientsData[val] == 2) {
              if (element.Regionalized_Flag == "Y") {
                obj["Regionalized"] =
                  element["Total_Quantity"]

                obj["%Regionalized"] =
                  element["Regionalized_%"]

              }
              if (element.Regionalized_Flag == "N") {
                obj["Non-Regionalized"] =
                  element["Total_Quantity"]

                obj["%Non-Regionalized"] =
                  element["Regionalized_%"]
              }
            }

            if (counteringredientsData[val] == 1) {
              if (element.Regionalized_Flag == "Y") {
                obj["Regionalized"] =
                  element["Total_Quantity"]

                obj["%Regionalized"] =
                  element["Regionalized_%"]

                obj["Non-Regionalized"] = 0;
                obj["%Non-Regionalized"] = 0;
              } else if (element.Regionalized_Flag == "N") {
                obj["Regionalized"] = 0;
                obj["%Regionalized"] = 0;
                obj["Non-Regionalized"] =
                  element["Total_Quantity"]

                obj["%Non-Regionalized"] =
                  element["Regionalized_%"]

              }
            }

          }
        }
        arringredientsData.push(obj)
      });
      var newArringredientsData = [];

      arringredientsData.map(val => {
        const obj = {
          "Material Group": val["Material Group"],
          Regionalized: val["Regionalized"],
          "Non-Regionalized": val["Non-Regionalized"],
          "%Regionalized": val["%Regionalized"],
          "%Non-Regionalized": val["%Non-Regionalized"],
          total: val["Regionalized"] + val["Non-Regionalized"]
        };
        newArringredientsData.push(obj)
      })

      newArringredientsData = newArringredientsData.sort(function (a, b) {
        return a["total"] - b["total"];
      });
      const allIngredientsData = {
        "Material Group": [],
        Regionalized: [],
        "Non-Regionalized": [],
        "%Regionalized": [],
        "%Non-Regionalized": [],
      };
      var moreseventyFiveIngredientsData = {
        "Material Group": [],
        Regionalized: [],
        "Non-Regionalized": [],
        "%Regionalized": [],
        "%Non-Regionalized": [],
      };

      var fiftyToSeventyFiveIngredientsData = {
        "Material Group": [],
        Regionalized: [],
        "Non-Regionalized": [],
        "%Regionalized": [],
        "%Non-Regionalized": [],
      };

      var lessFiftyIngredientsData = {
        "Material Group": [],
        Regionalized: [],
        "Non-Regionalized": [],
        "%Regionalized": [],
        "%Non-Regionalized": [],
      };
      newArringredientsData.map(val => {
        allIngredientsData["Material Group"].push(val["Material Group"])
        allIngredientsData["Regionalized"].push(val.Regionalized)
        allIngredientsData["Non-Regionalized"].push(val["Non-Regionalized"])
        allIngredientsData["%Regionalized"].push(val["%Regionalized"])
        allIngredientsData["%Non-Regionalized"].push(val["%Non-Regionalized"])

        if(val["%Regionalized"] > 75){
          moreseventyFiveIngredientsData["Material Group"].push(val["Material Group"])
          moreseventyFiveIngredientsData["Regionalized"].push(val.Regionalized)
          moreseventyFiveIngredientsData["Non-Regionalized"].push(val["Non-Regionalized"])
          moreseventyFiveIngredientsData["%Regionalized"].push(val["%Regionalized"])
          moreseventyFiveIngredientsData["%Non-Regionalized"].push(val["%Non-Regionalized"])
        }
        if(val["%Regionalized"] < 75 && val["%Regionalized"] >50){
          fiftyToSeventyFiveIngredientsData["Material Group"].push(val["Material Group"])
          fiftyToSeventyFiveIngredientsData["Regionalized"].push(val.Regionalized)
          fiftyToSeventyFiveIngredientsData["Non-Regionalized"].push(val["Non-Regionalized"])
          fiftyToSeventyFiveIngredientsData["%Regionalized"].push(val["%Regionalized"])
          fiftyToSeventyFiveIngredientsData["%Non-Regionalized"].push(val["%Non-Regionalized"])
        }
        if(val["%Regionalized"] < 50){
          lessFiftyIngredientsData["Material Group"].push(val["Material Group"])
          lessFiftyIngredientsData["Regionalized"].push(val.Regionalized)
          lessFiftyIngredientsData["Non-Regionalized"].push(val["Non-Regionalized"])
          lessFiftyIngredientsData["%Regionalized"].push(val["%Regionalized"])
          lessFiftyIngredientsData["%Non-Regionalized"].push(val["%Non-Regionalized"])
        }
      })
      response.data.sourceToMake.ingredients.All = allIngredientsData;
      response.data.sourceToMake.ingredients[">75%"] =
      moreseventyFiveIngredientsData;
      response.data.sourceToMake.ingredients["50-75%"] =
      fiftyToSeventyFiveIngredientsData;
      response.data.sourceToMake.ingredients["<50%"] =
      lessFiftyIngredientsData;
      //end ingredients

 //start components

 const componentssData = sourceData.getRegionalizationByMaterialGroup.filter((item) => item?.Material_Type == "Components" && item.Regionalized_Flag != null);

 countercomponentssData = {};

 componentssData.forEach(function (obj) {
   var key = obj.Material_Group_Description;
   countercomponentssData[key] = (countercomponentssData[key] || 0) + 1;
 });

 const uniqueKeysForcomponentssData= [
   ...new Set(
     componentssData.map((item) => item?.["Material_Group_Description"])
   ),
 ].filter((item) => item != "" && item != undefined && item != null);
 const arrcomponentsData = [];

 uniqueKeysForcomponentssData.map((val) => {
   const obj = {
     "Material Group": val,
     Regionalized: null,
     "Non-Regionalized": null,
     "%Regionalized": null,
     "%Non-Regionalized": null,
     total: 0
   };
   for (let i = 0; i < componentssData.length; i++) {

     const element = componentssData[i];
     if (element.Material_Group_Description == val) {
       if (countercomponentssData[val] == 2) {
         if (element.Regionalized_Flag == "Y") {
           obj["Regionalized"] =
             element["Total_Quantity"]

           obj["%Regionalized"] =
             element["Regionalized_%"]

         }
         if (element.Regionalized_Flag == "N") {
           obj["Non-Regionalized"] =
             element["Total_Quantity"]

           obj["%Non-Regionalized"] =
             element["Regionalized_%"]
         }
       }

       if (countercomponentssData[val] == 1) {
         if (element.Regionalized_Flag == "Y") {
           obj["Regionalized"] =
             element["Total_Quantity"]

           obj["%Regionalized"] =
             element["Regionalized_%"]

           obj["Non-Regionalized"] = 0;
           obj["%Non-Regionalized"] = 0;
         } else if (element.Regionalized_Flag == "N") {
           obj["Regionalized"] = 0;
           obj["%Regionalized"] = 0;
           obj["Non-Regionalized"] =
             element["Total_Quantity"]

           obj["%Non-Regionalized"] =
             element["Regionalized_%"]

         }
       }

     }
   }
   arrcomponentsData.push(obj)
 });
 var newArrComponentsData = [];

 arrcomponentsData.map(val => {
   const obj = {
     "Material Group": val["Material Group"],
     Regionalized: val["Regionalized"],
     "Non-Regionalized": val["Non-Regionalized"],
     "%Regionalized": val["%Regionalized"],
     "%Non-Regionalized": val["%Non-Regionalized"],
     total: val["Regionalized"] + val["Non-Regionalized"]
   };
   newArrComponentsData.push(obj)
 })

 newArrComponentsData = newArrComponentsData.sort(function (a, b) {
   return a["total"] - b["total"];
 });
 const allComponentsData = {
   "Material Group": [],
   Regionalized: [],
   "Non-Regionalized": [],
   "%Regionalized": [],
   "%Non-Regionalized": [],
 };
 const moreseventyFiveComponentsDataData = {
   "Material Group": [],
   Regionalized: [],
   "Non-Regionalized": [],
   "%Regionalized": [],
   "%Non-Regionalized": [],
 };

 const fiftyToSeventyFiveComponentsData = {
   "Material Group": [],
   Regionalized: [],
   "Non-Regionalized": [],
   "%Regionalized": [],
   "%Non-Regionalized": [],
 };

 const lessFiftyComponentsData = {
   "Material Group": [],
   Regionalized: [],
   "Non-Regionalized": [],
   "%Regionalized": [],
   "%Non-Regionalized": [],
 };
 newArrComponentsData.map(val => {
   allComponentsData["Material Group"].push(val["Material Group"])
   allComponentsData["Regionalized"].push(val.Regionalized)
   allComponentsData["Non-Regionalized"].push(val["Non-Regionalized"])
   allComponentsData["%Regionalized"].push(val["%Regionalized"])
   allComponentsData["%Non-Regionalized"].push(val["%Non-Regionalized"])

   if(val["%Regionalized"] > 75){
     moreseventyFiveComponentsDataData["Material Group"].push(val["Material Group"])
     moreseventyFiveComponentsDataData["Regionalized"].push(val.Regionalized)
     moreseventyFiveComponentsDataData["Non-Regionalized"].push(val["Non-Regionalized"])
     moreseventyFiveComponentsDataData["%Regionalized"].push(val["%Regionalized"])
     moreseventyFiveComponentsDataData["%Non-Regionalized"].push(val["%Non-Regionalized"])
   }
   if(val["%Regionalized"] < 75 && val["%Regionalized"] >50){
     fiftyToSeventyFiveComponentsData["Material Group"].push(val["Material Group"])
     fiftyToSeventyFiveComponentsData["Regionalized"].push(val.Regionalized)
     fiftyToSeventyFiveComponentsData["Non-Regionalized"].push(val["Non-Regionalized"])
     fiftyToSeventyFiveComponentsData["%Regionalized"].push(val["%Regionalized"])
     fiftyToSeventyFiveComponentsData["%Non-Regionalized"].push(val["%Non-Regionalized"])
   }
   if(val["%Regionalized"] < 50){
     lessFiftyComponentsData["Material Group"].push(val["Material Group"])
     lessFiftyComponentsData["Regionalized"].push(val.Regionalized)
     lessFiftyComponentsData["Non-Regionalized"].push(val["Non-Regionalized"])
     lessFiftyComponentsData["%Regionalized"].push(val["%Regionalized"])
     lessFiftyComponentsData["%Non-Regionalized"].push(val["%Non-Regionalized"])
   }
 })
 response.data.sourceToMake.components.All = allComponentsData;
 response.data.sourceToMake.components[">75%"] =
 moreseventyFiveComponentsDataData;
 response.data.sourceToMake.components["50-75%"] =
 fiftyToSeventyFiveComponentsData;
 response.data.sourceToMake.components["<50%"] =
 lessFiftyComponentsData;
 //end components

//start makeToselldata

const allMakeToSellData = sourceData.getMakeToSourceData.filter((item) => item.Regionalized_Flag != null);


counterallMakeToSellData = {};

allMakeToSellData.forEach(function (obj) {
  var key = obj.Priority_Subcategory;
  counterallMakeToSellData[key] = (counterallMakeToSellData[key] || 0) + 1;
});


const uniqueKeysForallMakeToSellData= [
  ...new Set(
    allMakeToSellData.map((item) => item?.["Priority_Subcategory"])
  ),
].filter((item) => item != "" && item != undefined && item != null);

arrMakeToSellData = [];

uniqueKeysForallMakeToSellData.map((val) => {
  const obj = {
    "Material Group": val,
    Regionalized: null,
    "Non-Regionalized": null,
    "%Regionalized": null,
    "%Non-Regionalized": null,
    total: 0
  };
  for (let i = 0; i < allMakeToSellData.length; i++) {

    const element = allMakeToSellData[i];
    if (element.Priority_Subcategory == val) {

      if (counterallMakeToSellData[val] == 4) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] += element["Total_Quantity"]

          obj["%Regionalized"] += element["Regionalized_%"] / 2

        }
        if (element.Regionalized_Flag == "N") {
          obj["Non-Regionalized"] += element["Total_Quantity"]

          obj["%Non-Regionalized"] += element["Regionalized_%"] /2
        }
      }


      if (counterallMakeToSellData[val] == 2) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] +=
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

        }
        if (element.Regionalized_Flag == "N") {
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]
        }
      }

      if (counterallMakeToSellData[val] == 1) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] =
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

          obj["Non-Regionalized"] = 0;
          obj["%Non-Regionalized"] = 0;
        } else if (element.Regionalized_Flag == "N") {
          obj["Regionalized"] = 0;
          obj["%Regionalized"] = 0;
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]

        }
      }

    }
  }
  arrMakeToSellData.push(obj)
});

let newArrMakeToSellData = [];

arrMakeToSellData.map(val => {
  const obj = {
    "Material Group": val["Material Group"],
    Regionalized: val["Regionalized"],
    "Non-Regionalized": val["Non-Regionalized"],
    "%Regionalized": val["%Regionalized"],
    "%Non-Regionalized": val["%Non-Regionalized"],
    total: val["Regionalized"] + val["Non-Regionalized"]
  };
  newArrMakeToSellData.push(obj)
})

newArrMakeToSellData = newArrMakeToSellData.sort(function (a, b) {
  return a["total"] - b["total"];
});
const allMakeToSellDataObj = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
const moreseventyFiveMakeToSellDataData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const fiftyToSeventyFiveMakeToSellData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const lessFiftyMakeToSellData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
newArrMakeToSellData.map(val => {
  allMakeToSellDataObj["Material Group"].push(val["Material Group"])
  allMakeToSellDataObj["Regionalized"].push(val.Regionalized)
  allMakeToSellDataObj["Non-Regionalized"].push(val["Non-Regionalized"])
  allMakeToSellDataObj["%Regionalized"].push(val["%Regionalized"])
  allMakeToSellDataObj["%Non-Regionalized"].push(val["%Non-Regionalized"])

  if(val["%Regionalized"] > 75){
    moreseventyFiveMakeToSellDataData["Material Group"].push(val["Material Group"])
    moreseventyFiveMakeToSellDataData["Regionalized"].push(val.Regionalized)
    moreseventyFiveMakeToSellDataData["Non-Regionalized"].push(val["Non-Regionalized"])
    moreseventyFiveMakeToSellDataData["%Regionalized"].push(val["%Regionalized"])
    moreseventyFiveMakeToSellDataData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 75 && val["%Regionalized"] >50){
    fiftyToSeventyFiveMakeToSellData["Material Group"].push(val["Material Group"])
    fiftyToSeventyFiveMakeToSellData["Regionalized"].push(val.Regionalized)
    fiftyToSeventyFiveMakeToSellData["Non-Regionalized"].push(val["Non-Regionalized"])
    fiftyToSeventyFiveMakeToSellData["%Regionalized"].push(val["%Regionalized"])
    fiftyToSeventyFiveMakeToSellData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 50){
    lessFiftyMakeToSellData["Material Group"].push(val["Material Group"])
    lessFiftyMakeToSellData["Regionalized"].push(val.Regionalized)
    lessFiftyMakeToSellData["Non-Regionalized"].push(val["Non-Regionalized"])
    lessFiftyMakeToSellData["%Regionalized"].push(val["%Regionalized"])
    lessFiftyMakeToSellData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
})
response.data.makeToSale.all.All = allMakeToSellDataObj;
response.data.makeToSale.all[">75%"] =
moreseventyFiveMakeToSellDataData;
response.data.makeToSale.all["50-75%"] =
fiftyToSeventyFiveMakeToSellData;
response.data.makeToSale.all["<50%"] =
lessFiftyMakeToSellData;
//end all maketosellData


//start fert data

const allFertData = sourceData.getMakeToSourceData.filter((item) => item.MTART == "FERT" && item.Regionalized_Flag != null);

counterallFertData = {};
 allFertData.forEach(function (obj) {
  var key = obj.Priority_Subcategory;
  counterallFertData[key] = (counterallFertData[key] || 0) + 1;
});

const uniqueKeysForallFertDataData= [
  ...new Set(
   allFertData.map((item) => item?.["Priority_Subcategory"])
  ),
].filter((item) => item != "" && item != undefined && item != null);
const arrfertData = [];

uniqueKeysForallFertDataData.map((val) => {
  const obj = {
    "Material Group": val,
    Regionalized: null,
    "Non-Regionalized": null,
    "%Regionalized": null,
    "%Non-Regionalized": null,
    total: 0
  };
  for (let i = 0; i < allFertData.length; i++) {

    const element = allFertData[i];
    if (element.Priority_Subcategory == val) {
      if (counterallFertData[val] == 2) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] =
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

        }
        if (element.Regionalized_Flag == "N") {
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]
        }
      }

      if (counterallFertData[val] == 1) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] =
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

          obj["Non-Regionalized"] = 0;
          obj["%Non-Regionalized"] = 0;
        } else if (element.Regionalized_Flag == "N") {
          obj["Regionalized"] = 0;
          obj["%Regionalized"] = 0;
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]

        }
      }

    }
  }
  arrfertData.push(obj)
});
let newArrfertData = [];

arrfertData.map(val => {
  const obj = {
    "Material Group": val["Material Group"],
    Regionalized: val["Regionalized"],
    "Non-Regionalized": val["Non-Regionalized"],
    "%Regionalized": val["%Regionalized"],
    "%Non-Regionalized": val["%Non-Regionalized"],
    total: val["Regionalized"] + val["Non-Regionalized"]
  };
  newArrfertData.push(obj)
})

newArrfertData = newArrfertData.sort(function (a, b) {
  return a["total"] - b["total"];
});
const allFertDataObj = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
const moreseventyFiveFertDataData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const fiftyToSeventyFertData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const lessFiftyFertData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
newArrfertData.map(val => {
  allFertDataObj["Material Group"].push(val["Material Group"])
  allFertDataObj["Regionalized"].push(val.Regionalized)
  allFertDataObj["Non-Regionalized"].push(val["Non-Regionalized"])
  allFertDataObj["%Regionalized"].push(val["%Regionalized"])
  allFertDataObj["%Non-Regionalized"].push(val["%Non-Regionalized"])

  if(val["%Regionalized"] > 75){
    moreseventyFiveFertDataData["Material Group"].push(val["Material Group"])
    moreseventyFiveFertDataData["Regionalized"].push(val.Regionalized)
    moreseventyFiveFertDataData["Non-Regionalized"].push(val["Non-Regionalized"])
    moreseventyFiveFertDataData["%Regionalized"].push(val["%Regionalized"])
    moreseventyFiveFertDataData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 75 && val["%Regionalized"] >50){
    fiftyToSeventyFertData["Material Group"].push(val["Material Group"])
    fiftyToSeventyFertData["Regionalized"].push(val.Regionalized)
    fiftyToSeventyFertData["Non-Regionalized"].push(val["Non-Regionalized"])
    fiftyToSeventyFertData["%Regionalized"].push(val["%Regionalized"])
    fiftyToSeventyFertData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 50){
    lessFiftyFertData["Material Group"].push(val["Material Group"])
    lessFiftyFertData["Regionalized"].push(val.Regionalized)
    lessFiftyFertData["Non-Regionalized"].push(val["Non-Regionalized"])
    lessFiftyFertData["%Regionalized"].push(val["%Regionalized"])
    lessFiftyFertData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
})
response.data.makeToSale.fert.All = allFertDataObj;
response.data.makeToSale.fert[">75%"] =
moreseventyFiveFertDataData;
response.data.makeToSale.fert["50-75%"] =
fiftyToSeventyFertData;
response.data.makeToSale.fert["<50%"] =
lessFiftyFertData;
//end fert maketosellData


//start halb data

const allHalbData = sourceData.getMakeToSourceData.filter((item) => item.MTART == "HALB" && item.Regionalized_Flag != null);

counterallHalbData = {};
 allHalbData.forEach(function (obj) {
  var key = obj.Priority_Subcategory;
  counterallHalbData[key] = (counterallHalbData[key] || 0) + 1;
});

const uniqueKeysForallHalbData= [
  ...new Set(
   allHalbData.map((item) => item?.["Priority_Subcategory"])
  ),
].filter((item) => item != "" && item != undefined && item != null);
const arrHalbData = [];

uniqueKeysForallHalbData.map((val) => {
  const obj = {
    "Material Group": val,
    Regionalized: null,
    "Non-Regionalized": null,
    "%Regionalized": null,
    "%Non-Regionalized": null,
    total: 0
  };
  for (let i = 0; i < allHalbData.length; i++) {

    const element = allHalbData[i];
    if (element.Priority_Subcategory == val) {
      if (counterallHalbData[val] == 2) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] =
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

        }
        if (element.Regionalized_Flag == "N") {
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]
        }
      }

      if (counterallHalbData[val] == 1) {
        if (element.Regionalized_Flag == "Y") {
          obj["Regionalized"] =
            element["Total_Quantity"]

          obj["%Regionalized"] =
            element["Regionalized_%"]

          obj["Non-Regionalized"] = 0;
          obj["%Non-Regionalized"] = 0;
        } else if (element.Regionalized_Flag == "N") {
          obj["Regionalized"] = 0;
          obj["%Regionalized"] = 0;
          obj["Non-Regionalized"] =
            element["Total_Quantity"]

          obj["%Non-Regionalized"] =
            element["Regionalized_%"]

        }
      }

    }
  }
  arrHalbData.push(obj)
});
let newArrHalbData = [];

arrHalbData.map(val => {
  const obj = {
    "Material Group": val["Material Group"],
    Regionalized: val["Regionalized"],
    "Non-Regionalized": val["Non-Regionalized"],
    "%Regionalized": val["%Regionalized"],
    "%Non-Regionalized": val["%Non-Regionalized"],
    total: val["Regionalized"] + val["Non-Regionalized"]
  };
  newArrHalbData.push(obj)
})

newArrHalbData = newArrHalbData.sort(function (a, b) {
  return a["total"] - b["total"];
});
const allHalbDataObj = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
const moreseventyFiveHalbData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const fiftyToSeventyHalbData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};

const lessFiftyHalbData = {
  "Material Group": [],
  Regionalized: [],
  "Non-Regionalized": [],
  "%Regionalized": [],
  "%Non-Regionalized": [],
};
newArrHalbData.map(val => {
  allHalbDataObj["Material Group"].push(val["Material Group"])
  allHalbDataObj["Regionalized"].push(val.Regionalized)
  allHalbDataObj["Non-Regionalized"].push(val["Non-Regionalized"])
  allHalbDataObj["%Regionalized"].push(val["%Regionalized"])
  allHalbDataObj["%Non-Regionalized"].push(val["%Non-Regionalized"])

  if(val["%Regionalized"] > 75){
    moreseventyFiveHalbData["Material Group"].push(val["Material Group"])
    moreseventyFiveHalbData["Regionalized"].push(val.Regionalized)
    moreseventyFiveHalbData["Non-Regionalized"].push(val["Non-Regionalized"])
    moreseventyFiveHalbData["%Regionalized"].push(val["%Regionalized"])
    moreseventyFiveHalbData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 75 && val["%Regionalized"] >50){
    fiftyToSeventyHalbData["Material Group"].push(val["Material Group"])
    fiftyToSeventyHalbData["Regionalized"].push(val.Regionalized)
    fiftyToSeventyHalbData["Non-Regionalized"].push(val["Non-Regionalized"])
    fiftyToSeventyHalbData["%Regionalized"].push(val["%Regionalized"])
    fiftyToSeventyHalbData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
  if(val["%Regionalized"] < 50){
    lessFiftyHalbData["Material Group"].push(val["Material Group"])
    lessFiftyHalbData["Regionalized"].push(val.Regionalized)
    lessFiftyHalbData["Non-Regionalized"].push(val["Non-Regionalized"])
    lessFiftyHalbData["%Regionalized"].push(val["%Regionalized"])
    lessFiftyHalbData["%Non-Regionalized"].push(val["%Non-Regionalized"])
  }
})
response.data.makeToSale.halb.All = allHalbDataObj;
response.data.makeToSale.halb[">75%"] =
moreseventyFiveHalbData;
response.data.makeToSale.halb["50-75%"] =
fiftyToSeventyHalbData;
response.data.makeToSale.halb["<50%"] =
lessFiftyHalbData;
//end halb maketosellData

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getRegionalizationByMaterial = (sourceData, year) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};

      response.data = {
        totalRecordsComp:
          sourceData.getRegionalizationByMaterialSaleToMakeComp[0]?.TotalRows ||
          0,
        totalRecordsIng:
          sourceData.getRegionalizationByMaterialSourceToMakeIng[0]
            ?.TotalRows || 0,
        sourceToMake: {
          components: [],
          ingredients: [],
        },
      };

      var componentsData =
        sourceData.getRegionalizationByMaterialSaleToMakeComp.sort(
          (a, b) => b.Sourced_Units - a.Sourced_Units
        );
      var ingredientssData =
        sourceData.getRegionalizationByMaterialSourceToMakeIng.sort(
          (a, b) => b.Sourced_Units - a.Sourced_Units
        );
      componentsData.map((val) => {
        const sourceToMakeObj = {
          Material: null,
          Material_Name: null,
          Material_Group: null,
          // Material_Type: 'Components',
          Supplier_Name: null,
          Supplier_Region: null,
          Plant_Name: null,
          //not in sp
          pdt: null,
          slt: null,
          tlt: null,
          Cagr_Growth_Percent: null,
          //not in sp
          Source_to_Make_Regionalized: null,
          Sourced_Units: null,
          //cagr: null
        };
        let cagrVal = null;
        if (year == 2025) {
          cagrVal = val.cagr;
        }
        sourceToMakeObj.Material = val.Material;
        sourceToMakeObj.Material_Name = val.Material_Name;
        sourceToMakeObj.Material_Group = val.Material_Group;
        // Material_Type: 'Components',
        sourceToMakeObj.Supplier_Name = val.Supplier_Name;
        sourceToMakeObj.Supplier_Region = val.Supplier_Region;
        sourceToMakeObj.Plant_Name = val.Plant_Name;
        //not in sp
        sourceToMakeObj.pdt = val.PDT;
        sourceToMakeObj.slt = val.SLT;
        sourceToMakeObj.tlt = val.TLT;
        sourceToMakeObj.Cagr_Growth_Percent = cagrVal;
        //not in sp
        sourceToMakeObj.Source_to_Make_Regionalized =
          val.Source_to_Make_Regionalized;
        sourceToMakeObj.Sourced_Units = formatCash(val.Sourced_Units);
        // sourceToMakeObj.cagr = val.cagr;

        response.data.sourceToMake.components.push(sourceToMakeObj);
      });
      ingredientssData.map((val) => {
        const sourceToMakeObj = {
          Material: null,
          Material_Name: null,
          Material_Group: null,
          // Material_Type: 'Components',
          Supplier_Name: null,
          Supplier_Region: null,
          Plant_Name: null,
          //not in sp
          pdt: null,
          slt: null,
          tlt: null,
          Cagr_Growth_Percent: null,
          //not in sp
          Source_to_Make_Regionalized: null,
          Sourced_Units: null,
          cagr: null,
        }; //

        let cagrVal = null;
        if (year == 2025) {
          cagrVal = val.cagr;
        }

        sourceToMakeObj.Material = val.Material;
        sourceToMakeObj.Material_Name = val.Material_Name;
        sourceToMakeObj.Material_Group = val.Material_Group;
        // Material_Type: 'Components',
        sourceToMakeObj.Supplier_Name = val.Supplier_Name;
        sourceToMakeObj.Supplier_Region = val.Supplier_Region;
        sourceToMakeObj.Plant_Name = val.Plant_Name;
        //not in sp
        sourceToMakeObj.pdt = val.PDT;
        sourceToMakeObj.slt = val.SLT;
        sourceToMakeObj.tlt = val.TLT;
        sourceToMakeObj.Cagr_Growth_Percent = cagrVal;
        //not in sp
        sourceToMakeObj.Source_to_Make_Regionalized =
          val.Source_to_Make_Regionalized;
        sourceToMakeObj.Sourced_Units = formatCash(val.Sourced_Units);
        //sourceToMakeObj.cagr = val?.cagr;

        response.data.sourceToMake.ingredients.push(sourceToMakeObj);
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.regionalizationByFinishedGoods = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        totalRecordsAll:
          sourceData.getRegionalizationByMaterialmakeToSaleAll[0]?.TotalRows ||
          0,
        totalRecordsFert:
          sourceData.getRegionalizationByMaterialmakeToSaleFert[0]?.TotalRows ||
          0,
        totalRecordsHalb:
          sourceData.getRegionalizationByMaterialmakeToSaleHalb[0]?.TotalRows ||
          0,
        makeToSale: {
          all: [],
          fert: [],
          halb: [],
        },
      };

      let data = sourceData?.getRegionalizationByMaterialmakeToSaleAll;
      let fertData = sourceData.getRegionalizationByMaterialmakeToSaleFert;
      let halbData = sourceData.getRegionalizationByMaterialmakeToSaleHalb;
      if (data) {
        data.map((val) => {
          const makeToSaleObj = {
            fGCode: null,
            fGItemDescription: null,
            category: null,
            prioritySubcategory: null,
            brand: null,
            plantName: null,
            productionRegion: null,
            //not coming from api
            avgMakeSale: null,
            //not coming from api
            cagrGrothPercent: null,
            americaMakeUnits: null,
            asiaMakeUnits: null,
            europeMakeUnits: null,
            //  CAGR: null,
            TotalSaleUnits: null,
            "reg_%": null,
          };

          makeToSaleObj.fGCode = val.FG_Code;
          makeToSaleObj.fGItemDescription = val.FG_Item_Description;
          makeToSaleObj.category = val.Category;
          makeToSaleObj.prioritySubcategory = val.Priority_Subcategory;
          makeToSaleObj.brand = val.Brand;
          makeToSaleObj.plantName = val.PlantName;
          makeToSaleObj.productionRegion = val.Production_Region;
          //not coming from api
          makeToSaleObj.avgMakeSale = val.Wt_Avg_Make_Sale_LT;
          //not coming from api
          makeToSaleObj.cagrGrothPercent = val["CAGR_Growth_%"];
          makeToSaleObj.americaMakeUnits = formatCash(val.AMERICAS_SALE_UNITS);
          makeToSaleObj.asiaMakeUnits = formatCash(val.ASIA_SALE_UNITS);
          makeToSaleObj.europeMakeUnits = formatCash(val.EUROPE_SALE_UNITS);
          // makeToSaleObj.CAGR = val.CAGR;
          makeToSaleObj.TotalSaleUnits = formatCash(val.Total_Sale_Units);
          makeToSaleObj["reg_%"] = val["Reg_%"];
          response.data.makeToSale.all.push(makeToSaleObj);
        });

        fertData.map((val) => {
          const makeToSaleObj = {
            fGCode: null,
            fGItemDescription: null,
            category: null,
            prioritySubcategory: null,
            brand: null,
            plantName: null,
            productionRegion: null,
            //not coming from api
            avgMakeSale: null,
            //not coming from api
            cagrGrothPercent: null,
            americaMakeUnits: null,
            asiaMakeUnits: null,
            europeMakeUnits: null,
            //  CAGR: null,
            TotalSaleUnits: null,
            "reg_%": null,
          };

          makeToSaleObj.fGCode = val.FG_Code;
          makeToSaleObj.fGItemDescription = val.FG_Item_Description;
          makeToSaleObj.category = val.Category;
          makeToSaleObj.prioritySubcategory = val.Priority_Subcategory;
          makeToSaleObj.brand = val.Brand;
          makeToSaleObj.plantName = val.PlantName;
          makeToSaleObj.productionRegion = val.Production_Region;
          //not coming from api
          makeToSaleObj.avgMakeSale = val.Wt_Avg_Make_Sale_LT;
          //not coming from api
          makeToSaleObj.cagrGrothPercent = val["CAGR_Growth_%"];
          makeToSaleObj.americaMakeUnits = formatCash(val.AMERICAS_SALE_UNITS);
          makeToSaleObj.asiaMakeUnits = formatCash(val.ASIA_SALE_UNITS);
          makeToSaleObj.europeMakeUnits = formatCash(val.EUROPE_SALE_UNITS);
          // makeToSaleObj.CAGR = val.CAGR;
          makeToSaleObj.TotalSaleUnits = formatCash(val.Total_Sale_Units);
          makeToSaleObj["reg_%"] = val["Reg_%"];
          response.data.makeToSale.fert.push(makeToSaleObj);
        });

        halbData.map((val) => {
          const makeToSaleObj = {
            fGCode: null,
            fGItemDescription: null,
            category: null,
            prioritySubcategory: null,
            brand: null,
            plantName: null,
            productionRegion: null,
            //not coming from api
            avgMakeSale: null,
            //not coming from api
            cagrGrothPercent: null,
            americaMakeUnits: null,
            asiaMakeUnits: null,
            europeMakeUnits: null,
            //  CAGR: null,
            TotalSaleUnits: null,
            "reg_%": null,
          };

          makeToSaleObj.fGCode = val.FG_Code;
          makeToSaleObj.fGItemDescription = val.FG_Item_Description;
          makeToSaleObj.category = val.Category;
          makeToSaleObj.prioritySubcategory = val.Priority_Subcategory;
          makeToSaleObj.brand = val.Brand;
          makeToSaleObj.plantName = val.PlantName;
          makeToSaleObj.productionRegion = val.Production_Region;
          //not coming from api
          makeToSaleObj.avgMakeSale = val.Wt_Avg_Make_Sale_LT;
          //not coming from api
          makeToSaleObj.cagrGrothPercent = val["CAGR_Growth_%"];
          makeToSaleObj.americaMakeUnits = formatCash(val.AMERICAS_SALE_UNITS);
          makeToSaleObj.asiaMakeUnits = formatCash(val.ASIA_SALE_UNITS);
          makeToSaleObj.europeMakeUnits = formatCash(val.EUROPE_SALE_UNITS);
          // makeToSaleObj.CAGR = val.CAGR;
          makeToSaleObj.TotalSaleUnits = formatCash(val.Total_Sale_Units);
          makeToSaleObj["reg_%"] = val["Reg_%"];
          response.data.makeToSale.halb.push(makeToSaleObj);
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getFinishedGoodsBom = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        totalRecords: sourceData[0]?.TotalRows || 0,
        getFinishedGoodsBom: [],
      };

      sourceData?.map((val) => {
        const getFinishedGoodsBomObj = {
          FG_Code: null,
          FG_Item_Description: null,
          FG_Brand: null,
          Material_Code: null,
          Material_Name: null,
          Material_Group: null,
          Supplier_Name: null,
          Supplier_Region: null,
          Material_Volume: null,
          Material_Inventory: null,
          //not in sp
          cagr_Growth_Percent: null,
        };

        getFinishedGoodsBomObj.FG_Code = val?.FG_Code;
        getFinishedGoodsBomObj.FG_Item_Description = val?.FG_Item_Description;
        getFinishedGoodsBomObj.FG_Brand = val?.FG_Brand;
        getFinishedGoodsBomObj.Material_Code = val?.Material_Code;
        getFinishedGoodsBomObj.Material_Name = val?.Material_Name;
        getFinishedGoodsBomObj.Material_Group = val?.Material_Group;
        getFinishedGoodsBomObj.Supplier_Name = val?.Supplier_Name;
        getFinishedGoodsBomObj.Supplier_Region = val?.Supplier_Region;
        getFinishedGoodsBomObj.Material_Volume = val?.Material_Volume;
        getFinishedGoodsBomObj.Material_Inventory = val?.Material_Inventory;
        getFinishedGoodsBomObj.cagr_Growth_Percent = val?.cagr;
        response.data.getFinishedGoodsBom.push(getFinishedGoodsBomObj);
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

function formatCash(num) {
  let n = Math.abs(num);
  if (num > 0) {
    if (!isNaN(n)) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    }
  }
  if (num < 0) {
    let n = Math.abs(num);
    if (!isNaN(n)) {
      if (n < 1e3) return `\(${n}\)`;
      if (n >= 1e3 && n < 1e6) return `\(${+(n / 1e3).toFixed(1) + "K"}\)`;
      if (n >= 1e6 && n < 1e9) return `\(${+(n / 1e6).toFixed(1) + "M"}\)`;
      if (n >= 1e9 && n < 1e12) return `\(${+(n / 1e9).toFixed(1) + "B"}\)`;
      if (n >= 1e12) return `\(${+(n / 1e12).toFixed(1) + "T"}\)`;
    }
  } else {
    return n;
  }
}
