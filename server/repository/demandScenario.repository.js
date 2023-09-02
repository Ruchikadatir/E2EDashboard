const constants = require('../config/constants');
const sql = require('mssql');
// const mockData = require("../config/mockData.json");

const XLSX = require('xlsx');
var fs = require('fs');
const path = require('path');
const { response } = require('express');

function formatCash(num) {
  let n = Math.abs(num);
  if (num > 0) {
    if (!isNaN(n)) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(0) + 'K';
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(0) + 'M';
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(0) + 'B';
      if (n >= 1e12) return +(n / 1e12).toFixed(0) + 'T';
    }
  }
  if (num < 0) {
    let n = Math.abs(num);
    if (!isNaN(n)) {
      if (n < 1e3) return `\(${n}\)`;
      if (n >= 1e3 && n < 1e6) return `\(${+(n / 1e3).toFixed(0) + 'K'}\)`;
      if (n >= 1e6 && n < 1e9) return `\(${+(n / 1e6).toFixed(0) + 'M'}\)`;
      if (n >= 1e9 && n < 1e12) return `\(${+(n / 1e9).toFixed(0) + 'B'}\)`;
      if (n >= 1e12) return `\(${+(n / 1e12).toFixed(0) + 'T'}\)`;
    }
  } else {
    return n;
  }
}

module.exports.getnudgeDValValues = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: {},
        revenue: {},
      };
      sourceDataUnits = sourceData
        .filter((val) => val.Year == 2023)
        .sort((a, b) => {
          return b.YOY_Units - a.YOY_Units;
        });
      sourceDataRevenue = sourceData
        .filter((val) => val.Year == 2023)
        .sort((a, b) => {
          return b.YOY_Revenue - a.YOY_Revenue;
        });
      const unArr = [];
      sourceDataUnits.map((val) => {
        const arr = {
          product_line: val.PRODUCT_LINE,
          'YOY%': val.YOY_Units,
        };
        unArr.push(arr);
      });

      const revArr = [];
      sourceDataRevenue.map((val) => {
        const arr = {
          product_line: val.PRODUCT_LINE,
          'YOY%': val.YOY_Revenue,
        };
        revArr.push(arr);
      });

      response.data.units = unArr.slice(0, 2);
      response.data.revenue = revArr.slice(0, 2);

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getStrategicDemandSignal = (strategicSignalData) => {
  return new Promise((resolve, reject) => {
    try {
      const output = {
        units: {
          year: [],
          'Actual Shipments': [],
          'Brand Ambition': [],
          CDP: [],
          growthPer: [],
        },
        revenue: {
          year: [],
          'Actual Revenue': [],
          'Brand Ambition': [],
          CDP: [],
          growthPer: [],
        },
      };
      strategicSignalData.sort((a, b) => {
        return a.year - b.year;
      });
      strategicSignalData.map((val) => {
        let year = `FY${val.year.slice(2)}`;
        output.units['year'].push(year);
        output.units['Actual Shipments'].push(val.Actual_units);
        output.units['Brand Ambition'].push(val.Brand_Ambition_units);
        output.units.CDP.push(val.cdp_units);
        output.units.growthPer.push(
          val.cdp_units !== 0 && val.Brand_Ambition_units !== 0
            ? (
                ((val.cdp_units - val.Brand_Ambition_units) /
                  val.Brand_Ambition_units) *
                100
              ).toFixed(2)
            : null
        );
        output.revenue['year'].push(year);
        output.revenue['Actual Revenue'].push(val.Actual_revenue);
        output.revenue['Brand Ambition'].push(val.Brand_Ambition_revenue);
        output.revenue.CDP.push(val.cdp_revenue);
        output.revenue.growthPer.push(
          val.cdp_revenue !== 0 && val.Brand_Ambition_revenue !== 0
            ? (
                ((val.cdp_revenue - val.Brand_Ambition_revenue) /
                  val.Brand_Ambition_revenue) *
                100
              ).toFixed(2)
            : null
        );
      });

      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getGrowthRateReconciliation = (growthRateReconciliationData) => {
  return new Promise((resolve, reject) => {
    try {
      const output = {
        units: [
          {
            region: 'Total',
            brandAmbitionFY23: null,
            cdpFY23: null,
            brandAmbitionFY24: null,
            cdpFY24: null,
            brandAmbitionFY25: null,
            cdpFY25: null,
          },
        ],
        revenue: [
          {
            region: 'Total',
            brandAmbitionFY23: null,
            cdpFY23: null,
            brandAmbitionFY24: null,
            cdpFY24: null,
            brandAmbitionFY25: null,
            cdpFY25: null,
          },
        ],
      };

      let uniqueRegions = [
        ...new Set(
          growthRateReconciliationData.map((item) => item?.['region'])
        ),
      ].filter((item) => item != '' && item != undefined && item != null);

      // Total
      output.units[0].region = 'Total';
      let fy22ACtualShipUnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2022)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Actual_units)
            ? 0
            : parseFloat(record?.Actual_units);
          return sum + sumAss;
        }, 0);
      let fy22ACtualShipRevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2022)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Actual_revenue)
            ? 0
            : parseFloat(record?.Actual_revenue);
          return sum + sumAss;
        }, 0);
      // unit values
      brandAmbitionFY23UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2023)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_units)
            ? 0
            : parseFloat(record?.Brand_Ambition_units);
          return sum + sumAss;
        }, 0);
      const valbrandAmbitionFY23Total = (
        ((brandAmbitionFY23UnitTotal - fy22ACtualShipUnitTotal) /
          fy22ACtualShipUnitTotal) *
        100
      ).toFixed(2);
      output.units[0].brandAmbitionFY23 = isNaN(valbrandAmbitionFY23Total)
        ? 0
        : valbrandAmbitionFY23Total;
      cdpFY23UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2023)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_units)
            ? 0
            : parseFloat(record?.cdp_units);
          return sum + sumAss;
        }, 0);
      const valcdpFY23Total = (
        ((cdpFY23UnitTotal - fy22ACtualShipUnitTotal) /
          fy22ACtualShipUnitTotal) *
        100
      ).toFixed(2);
      output.units[0].cdpFY23 =
        isNaN(valcdpFY23Total) || !isFinite(valcdpFY23Total)
          ? 0
          : valcdpFYTotal;
      //output.units[0].cdpFY23 = checkNum(valcdpFY23Total) ;
      brandAmbitionFY24UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2024)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_units)
            ? 0
            : parseFloat(record?.Brand_Ambition_units);
          return sum + sumAss;
        }, 0);
      const valbrandAmbitionFY24Total = (
        ((brandAmbitionFY24UnitTotal - brandAmbitionFY23UnitTotal) /
          brandAmbitionFY23UnitTotal) *
        100
      ).toFixed(2);
      output.units[0].brandAmbitionFY24 = isNaN(valbrandAmbitionFY24Total)
        ? 0
        : valbrandAmbitionFY24Total;
      cdpFY24UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2024)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_units)
            ? 0
            : parseFloat(record?.cdp_units);
          return sum + sumAss;
        }, 0);
      const valcdpFY24Total = (
        ((cdpFY24UnitTotal - cdpFY23UnitTotal) / cdpFY23UnitTotal) *
        100
      ).toFixed(2);

      output.units[0].cdpFY24 =
        isNaN(valcdpFY24Total) || !isFinite(valcdpFY24Total)
          ? 0
          : valcdpFY24Total;
      brandAmbitionFY25UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2025)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_units)
            ? 0
            : parseFloat(record?.Brand_Ambition_units);
          return sum + sumAss;
        }, 0);
      const valbrandAmbitionFY25 = (
        ((brandAmbitionFY25UnitTotal - brandAmbitionFY24UnitTotal) /
          brandAmbitionFY24UnitTotal) *
        100
      ).toFixed(2);
      output.units[0].brandAmbitionFY25 = isNaN(valbrandAmbitionFY25)
        ? 0
        : valbrandAmbitionFY25;
      cdpFY25UnitTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2025)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_units)
            ? 0
            : parseFloat(record?.cdp_units);
          return sum + sumAss;
        }, 0);
      const valcdpFY25Total = (
        ((cdpFY25UnitTotal - cdpFY24UnitTotal) / cdpFY24UnitTotal) *
        100
      ).toFixed(2);
      output.units[0].cdpFY25 =
        isNaN(valcdpFY25Total) || !isFinite(valcdpFY25Total)
          ? 0
          : valcdpFY25Total;

      // Total revenue values
      brandAmbitionFY23RevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2023)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_revenue)
            ? 0
            : parseFloat(record?.Brand_Ambition_revenue);
          return sum + sumAss;
        }, 0);

      const valbrandAmbitionFY23TotalNew = (
        ((brandAmbitionFY23RevenueTotal - fy22ACtualShipRevenueTotal) /
          fy22ACtualShipRevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].brandAmbitionFY23 = isNaN(valbrandAmbitionFY23TotalNew)
        ? 0
        : valbrandAmbitionFY23TotalNew;
      cdpFY23RevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2023)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_revenue)
            ? 0
            : parseFloat(record?.cdp_revenue);
          return sum + sumAss;
        }, 0);
      const valcdpFY23TotalNew = (
        ((cdpFY23RevenueTotal - fy22ACtualShipRevenueTotal) /
          fy22ACtualShipRevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].cdpFY23 =
        isNaN(valcdpFY23TotalNew) || !isFinite(valcdpFY23TotalNew)
          ? 0
          : valcdpFY23TotalNew;
      brandAmbitionFY24RevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2024)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_revenue)
            ? 0
            : parseFloat(record?.Brand_Ambition_revenue);
          return sum + sumAss;
        }, 0);
      const valbrandAmbitionFY24TotalNew = (
        ((brandAmbitionFY24RevenueTotal - brandAmbitionFY23RevenueTotal) /
          brandAmbitionFY23RevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].brandAmbitionFY24 = isNaN(valbrandAmbitionFY24TotalNew)
        ? 0
        : valbrandAmbitionFY24TotalNew;
      cdpFY24RevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2024)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_revenue)
            ? 0
            : parseFloat(record?.cdp_revenue);
          return sum + sumAss;
        }, 0);
      const valcdpFY24TotalNew = (
        ((cdpFY24RevenueTotal - cdpFY23RevenueTotal) / cdpFY23RevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].cdpFY24 =
        isNaN(valcdpFY24TotalNew) || !isFinite(valcdpFY24TotalNew)
          ? 0
          : valcdpFY24TotalNew;
      brandAmbitionFY25RevenueTotal = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2025)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.Brand_Ambition_revenue)
            ? 0
            : parseFloat(record?.Brand_Ambition_revenue);
          return sum + sumAss;
        }, 0);
      const valbrandAmbitionFY25Totalnew = (
        ((brandAmbitionFY25RevenueTotal - brandAmbitionFY24RevenueTotal) /
          brandAmbitionFY24RevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].brandAmbitionFY25 = isNaN(valbrandAmbitionFY25Totalnew)
        ? 0
        : valbrandAmbitionFY25Totalnew;
      cdpFY25Revenue = growthRateReconciliationData
        .filter((item) => item?.['year'] == 2025)
        .reduce(function (sum, record) {
          const sumAss = isNaN(record?.cdp_revenue)
            ? 0
            : parseFloat(record?.cdp_revenue);
          return sum + sumAss;
        }, 0);
      const valcdpFY25TotalNew = (
        ((cdpFY25Revenue - cdpFY24RevenueTotal) / cdpFY24RevenueTotal) *
        100
      ).toFixed(2);
      output.revenue[0].cdpFY25 =
        isNaN(valcdpFY25TotalNew) || !isFinite(valcdpFY25TotalNew)
          ? 0
          : valcdpFY25TotalNew;

      uniqueRegions.map((reg) => {
        let growthObject = {
          region: null,
          brandAmbitionFY23: null,
          cdpFY23: null,
          brandAmbitionFY24: null,
          cdpFY24: null,
          brandAmbitionFY25: null,
          cdpFY25: null,
        };
        let growthRevenueObject = {
          region: null,
          brandAmbitionFY23: null,
          cdpFY23: null,
          brandAmbitionFY24: null,
          cdpFY24: null,
          brandAmbitionFY25: null,
          cdpFY25: null,
        };
        let fy22ACtualShipUnit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2022)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Actual_units)
              ? 0
              : parseFloat(record?.Actual_units);
            return sum + sumAss;
          }, 0);
        let fy22ACtualShipRevenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2022)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Actual_revenue)
              ? 0
              : parseFloat(record?.Actual_revenue);
            return sum + sumAss;
          }, 0);
        growthObject.region = reg;
        // unit values
        brandAmbitionFY23Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2023)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_units)
              ? 0
              : parseFloat(record?.Brand_Ambition_units);
            return sum + sumAss;
          }, 0);
        const valbrandAmbitionFY23 = (
          ((brandAmbitionFY23Unit - fy22ACtualShipUnit) / fy22ACtualShipUnit) *
          100
        ).toFixed(2);
        growthObject.brandAmbitionFY23 = isNaN(valbrandAmbitionFY23)
          ? 0
          : valbrandAmbitionFY23;
        cdpFY23Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2023)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_units)
              ? 0
              : parseFloat(record?.cdp_units);
            return sum + sumAss;
          }, 0);
        const valcdpFY23 = (
          ((cdpFY23Unit - fy22ACtualShipUnit) / fy22ACtualShipUnit) *
          100
        ).toFixed(2);
        growthObject.cdpFY23 =
          isNaN(valcdpFY23) || !isFinite(valcdpFY23) ? 0 : valcdpFY23;
        brandAmbitionFY24Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2024)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_units)
              ? 0
              : parseFloat(record?.Brand_Ambition_units);
            return sum + sumAss;
          }, 0);
        const valbrandAmbitionFY24 = (
          ((brandAmbitionFY24Unit - brandAmbitionFY23Unit) /
            brandAmbitionFY23Unit) *
          100
        ).toFixed(2);
        growthObject.brandAmbitionFY24 =
          isNaN(valbrandAmbitionFY24) || !isFinite(valbrandAmbitionFY24)
            ? 0
            : valbrandAmbitionFY24;
        cdpFY24Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2024)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_units)
              ? 0
              : parseFloat(record?.cdp_units);
            return sum + sumAss;
          }, 0);
        const valcdpFY24 = (
          ((cdpFY24Unit - cdpFY23Unit) / cdpFY23Unit) *
          100
        ).toFixed(2);

        growthObject.cdpFY24 =
          isNaN(valcdpFY24) || !isFinite(valcdpFY24) ? 0 : valcdpFY24;
        brandAmbitionFY25Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2025)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_units)
              ? 0
              : parseFloat(record?.Brand_Ambition_units);
            return sum + sumAss;
          }, 0);
        const valbrandAmbitionFY25 = (
          ((brandAmbitionFY25Unit - brandAmbitionFY24Unit) /
            brandAmbitionFY24Unit) *
          100
        ).toFixed(2);
        growthObject.brandAmbitionFY25 = isNaN(valbrandAmbitionFY25)
          ? 0
          : valbrandAmbitionFY25;
        cdpFY25Unit = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2025)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_units)
              ? 0
              : parseFloat(record?.cdp_units);
            return sum + sumAss;
          }, 0);
        const valcdpFY25 = (
          ((cdpFY25Unit - cdpFY24Unit) / cdpFY24Unit) *
          100
        ).toFixed(2);
        growthObject.cdpFY25 =
          isNaN(valcdpFY25) || !isFinite(valcdpFY25) ? 0 : valcdpFY25;

        // add to output
        output.units.push(growthObject);

        // revenue values
        growthRevenueObject.region = reg;
        brandAmbitionFY23Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2023)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_revenue)
              ? 0
              : parseFloat(record?.Brand_Ambition_revenue);
            return sum + sumAss;
          }, 0);

        const valbrandAmbitionFY23New = (
          ((brandAmbitionFY23Revenue - fy22ACtualShipRevenue) /
            fy22ACtualShipRevenue) *
          100
        ).toFixed(2);
        growthRevenueObject.brandAmbitionFY23 = isNaN(valbrandAmbitionFY23New)
          ? 0
          : valbrandAmbitionFY23New;
        cdpFY23Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2023)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_revenue)
              ? 0
              : parseFloat(record?.cdp_revenue);
            return sum + sumAss;
          }, 0);
        const valcdpFY23New = (
          ((cdpFY23Revenue - fy22ACtualShipRevenue) / fy22ACtualShipRevenue) *
          100
        ).toFixed(2);
        growthRevenueObject.cdpFY23 =
          isNaN(valcdpFY23New) || !isFinite(valcdpFY23New) ? 0 : valcdpFY23New;
        brandAmbitionFY24Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2024)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_revenue)
              ? 0
              : parseFloat(record?.Brand_Ambition_revenue);
            return sum + sumAss;
          }, 0);
        const valbrandAmbitionFY24New = (
          ((brandAmbitionFY24Revenue - brandAmbitionFY23Revenue) /
            brandAmbitionFY23Revenue) *
          100
        ).toFixed(2);
        growthRevenueObject.brandAmbitionFY24 = isNaN(valbrandAmbitionFY24New)
          ? 0
          : valbrandAmbitionFY24New;
        cdpFY24Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2024)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_revenue)
              ? 0
              : parseFloat(record?.cdp_revenue);
            return sum + sumAss;
          }, 0);
        const valcdpFY24New = (
          ((cdpFY24Revenue - cdpFY23Revenue) / cdpFY23Revenue) *
          100
        ).toFixed(2);
        growthRevenueObject.cdpFY24 =
          isNaN(valcdpFY24New) || !isFinite(valcdpFY24New) ? 0 : valcdpFY24New;
        brandAmbitionFY25Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2025)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.Brand_Ambition_revenue)
              ? 0
              : parseFloat(record?.Brand_Ambition_revenue);
            return sum + sumAss;
          }, 0);
        const valbrandAmbitionFY25new = (
          ((brandAmbitionFY25Revenue - brandAmbitionFY24Revenue) /
            brandAmbitionFY24Revenue) *
          100
        ).toFixed(2);
        growthRevenueObject.brandAmbitionFY25 = isNaN(valbrandAmbitionFY25new)
          ? 0
          : valbrandAmbitionFY25new;
        cdpFY25Revenue = growthRateReconciliationData
          .filter((item) => item?.['region'] == reg && item?.['year'] == 2025)
          .reduce(function (sum, record) {
            const sumAss = isNaN(record?.cdp_revenue)
              ? 0
              : parseFloat(record?.cdp_revenue);
            return sum + sumAss;
          }, 0);
        const valcdpFY25New = (
          ((cdpFY25Revenue - cdpFY24Revenue) / cdpFY24Revenue) *
          100
        ).toFixed(2);
        growthRevenueObject.cdpFY25 =
          isNaN(valcdpFY25New) || !isFinite(valcdpFY25New) ? 0 : valcdpFY25New;
        // add to output revenue
        output.revenue.push(growthRevenueObject);
      });

      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getFamilyUpsideDownside = (
  unitsData,
  revenueData,
  isDownload
) => {
  return new Promise((resolve, reject) => {
    try {
      const output = {
        totalRecordsUnits: unitsData?.[0]?.TotalRows || 0,
        totalRecordsRevenue: revenueData?.[0]?.TotalRows || 0,
        records: { units: [], revenue: [] },
      };
      if (unitsData) {
        unitsData.map((val) => {
          const objUnits = {
            family_code: null,
            family_description: null,
            priority_subcategory: null,
            brand: null,
            region: null,
            brand_ambition: null,
            cdp: null,
            upside_or_downside: null,
          };

          objUnits.family_code = val.Prod_Family;
          objUnits.family_description = val.Item_Description;
          objUnits.priority_subcategory = val.Priority_Subcategory;
          objUnits.brand = val.brand;
          objUnits.region = val.region;

          if (isDownload) {
            objUnits.brand_ambition = val.Brand_Ambition_units;
            objUnits.cdp = val.cdp_units;
            objUnits.upside_or_downside = objUnits.upside_or_downside =
              val.cdp_units - val.Brand_Ambition_units > 0
                ? val.cdp_units - val.Brand_Ambition_units
                : `(${val.Brand_Ambition_units - val.cdp_units})`;
          } else {
            objUnits.brand_ambition = formatCash(val.Brand_Ambition_units);
            objUnits.cdp = formatCash(val.cdp_units);
            objUnits.upside_or_downside =
              val.cdp_units - val.Brand_Ambition_units > 0
                ? formatCash(val.cdp_units - val.Brand_Ambition_units)
                : `(${formatCash(val.Brand_Ambition_units - val.cdp_units)})`;
          }

          output.records.units.push(objUnits);
        });
      }
      if (revenueData) {
        revenueData.map((val) => {
          const objRevenue = {
            family_code: null,
            family_description: null,
            priority_subcategory: null,
            brand: null,
            region: null,
            brand_ambition: null,
            cdp: null,
            upside_or_downside: null,
          };

          objRevenue.family_code = val.Prod_Family;
          objRevenue.family_description = val.Item_Description;
          objRevenue.priority_subcategory = val.Priority_Subcategory;
          objRevenue.brand = val.brand;
          objRevenue.region = val.region;
          if (isDownload) {
            objRevenue.brand_ambition = `$${val.Brand_Ambition_revenue}`;

            objRevenue.cdp = `$${val.cdp_revenue}`;
            objRevenue.upside_or_downside =
              val.cdp_revenue - val.Brand_Ambition_revenue > 0
                ? `$${val.cdp_revenue - val.Brand_Ambition_revenue}`
                : `$\(${val.Brand_Ambition_revenue - val.cdp_revenue}\)`;
          } else {
            objRevenue.brand_ambition = `$${formatCash(
              val.Brand_Ambition_revenue
            )}`;
            objRevenue.cdp = `$${formatCash(val.cdp_revenue)}`;
            objRevenue.upside_or_downside =
              val.cdp_revenue - val.Brand_Ambition_revenue > 0
                ? `$${formatCash(val.cdp_revenue - val.Brand_Ambition_revenue)}`
                : `$\(${formatCash(
                    val.Brand_Ambition_revenue - val.cdp_revenue
                  )}\)`;
          }

          output.records.revenue.push(objRevenue);
        });
      }
      if (isDownload) {
        const outputData = output.records.units.concat(output.records.revenue);
        resolve(outputData);
      } else {
        resolve(output);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports.getUpsideDownside = (sourceData) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {};
      response.data = {
        units: {
          upside: [],
          downside: [],
        },
        revenue: {
          upside: [],
          downside: [],
        },
      };

      let unitsDataDesc = sourceData.sort(function (a, b) {
        return b.Upside_Downside_Units - a.Upside_Downside_Units;
      });

      for (let index = 0; index < unitsDataDesc.length; index++) {
        let element = unitsDataDesc[index];
        if (element.cdp_units > element.Brand_Ambition_units) {
          const obj1 = {
            prioritySubCat: null,
            brand: null,
            region: null,
            upside: null,
            barPercent: null,
          };

          const percentage =
            index == 0
              ? 100
              : (element.Upside_Downside_Units /
                  unitsDataDesc[0].Upside_Downside_Units) *
                100;
          obj1.prioritySubCat = element.Priority_Subcategory;
          obj1.brand = element.brand;
          obj1.region = element.region;
          obj1.upside = element.Upside_Downside_Units;
          obj1.barPercent = percentage.toFixed(2);
          response.data.units.upside.push(obj1);
        }
      }

      let revenueDataDesc = sourceData.sort(function (a, b) {
        return b.Upside_Downside_Revenue - a.Upside_Downside_Revenue;
      });

      for (let index = 0; index < revenueDataDesc.length; index++) {
        // revenueDataDesc.map((element) => {
        let element = revenueDataDesc[index];
        if (element.cdp_revenue > element.Brand_Ambition_revenue) {
          const obj1 = {
            prioritySubCat: null,
            brand: null,
            region: null,
            upside: null,
            barPercent: null,
          };
          const percentage =
            index == 0
              ? 100
              : (element.Upside_Downside_Revenue /
                  revenueDataDesc[0].Upside_Downside_Revenue) *
                100;

          const val = element.Upside_Downside_Revenue;
          obj1.prioritySubCat = element.Priority_Subcategory;
          obj1.brand = element.brand;
          obj1.region = element.region;
          obj1.upside = `${val}`;
          obj1.barPercent = percentage.toFixed(2);
          response.data.revenue.upside.push(obj1);
        }
      }

      let revenueDataAsc = sourceData.sort(function (a, b) {
        return a.Upside_Downside_Revenue - b.Upside_Downside_Revenue;
      });
      for (let index = 0; index < revenueDataAsc.length; index++) {
        let element = revenueDataAsc[index];
        // revenueDataAsc.map((element) => {
        if (element.cdp_revenue < element.Brand_Ambition_revenue) {
          const obj1 = {
            prioritySubCat: null,
            brand: null,
            region: null,
            downside: null,
            barPercent: null,
          };
          const percentage =
            index == 0
              ? 100
              : (element.Upside_Downside_Revenue /
                  revenueDataAsc[0].Upside_Downside_Revenue) *
                100;

          const val = element.Upside_Downside_Revenue;
          obj1.prioritySubCat = element.Priority_Subcategory;
          obj1.brand = element.brand;
          obj1.region = element.region;
          obj1.downside = `${val}`;
          obj1.barPercent = percentage.toFixed(2);
          response.data.revenue.downside.push(obj1);
        }
      }
      // );

      let unitsDataAsc = sourceData.sort(function (a, b) {
        return a.Upside_Downside_Units - b.Upside_Downside_Units;
      });

      for (let index = 0; index < unitsDataAsc.length; index++) {
        let element = unitsDataAsc[index];
        // unitsDataAsc.map((element) => {
        if (element.cdp_units < element.Brand_Ambition_units) {
          const obj1 = {
            prioritySubCat: null,
            brand: null,
            region: null,
            downside: null,
            barPercent: null,
          };
          const percentage =
            index == 0
              ? 100
              : (element.Upside_Downside_Units /
                  revenueDataAsc[0].Upside_Downside_Units) *
                100;
          obj1.prioritySubCat = element.Priority_Subcategory;
          obj1.brand = element.brand;
          obj1.region = element.region;
          obj1.downside = element.Upside_Downside_Units;
          obj1.barPercent = percentage.toFixed(2);
          response.data.units.downside.push(obj1);
        }
      }
      // );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
// module.exports.getUpsideDownside = (sourceData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const response = {};
//       response.data = {
//         units: {
//           upside: {
//             // prioritySubCat: [],
//             // brand: [],
//             // region: [],
//             // upside: []
//           },
//           downside: {
//             // prioritySubCat: [],
//             // brand: [],
//             // region: [],
//             // downside: []
//           },
//         },
//         revenue: {
//           upside: {
//             // prioritySubCat: [],
//             // brand: [],
//             // region: [],
//             // upside: []
//           },
//           downside: {
//             // prioritySubCat: [],
//             // brand: [],
//             // region: [],
//             // downside: []
//           },
//         },
//       };

//       const obj1 = {
//         prioritySubCat: [],
//         brand: [],
//         region: [],
//         upside: [],
//       };
//       let unitsDataDesc = sourceData.sort(function (a, b) {
//         return b.Upside_Downside_Units - a.Upside_Downside_Units;
//       });

//       unitsDataDesc.map((element) => {
//         if (element.cdp_units > element.Brand_Ambition_units) {
//           obj1.prioritySubCat.push(element.Priority_Subcategory);
//           obj1.brand.push(element.brand);
//           obj1.region.push(element.region);
//           obj1.upside.push(formatCash(element.Upside_Downside_Units));
//         }
//       });
//       response.data.units.upside = obj1;

//       const obj2 = {
//         prioritySubCat: [],
//         brand: [],
//         region: [],
//         upside: [],
//       };
//       let revenueDataDesc = sourceData.sort(function (a, b) {
//         return b.Upside_Downside_Revenue - a.Upside_Downside_Revenue;
//       });
//       revenueDataDesc.map((element) => {
//         if (element.cdp_revenue > element.Brand_Ambition_revenue) {
//           obj2.prioritySubCat.push(element.Priority_Subcategory);
//           obj2.brand.push(element.brand);
//           obj2.region.push(element.region);
//           obj2.upside.push(formatCash(element.Upside_Downside_Revenue));
//         }
//       });
//       response.data.revenue.upside = obj2;

//       const obj3 = {
//         prioritySubCat: [],
//         brand: [],
//         region: [],
//         downside: [],
//       };
//       let revenueDataAsc = sourceData.sort(function (a, b) {
//         return a.Upside_Downside_Revenue - b.Upside_Downside_Revenue;
//       });
//       revenueDataAsc.map((element) => {
//         if (element.cdp_revenue < element.Brand_Ambition_revenue) {
//           obj3.prioritySubCat.push(element.Priority_Subcategory);
//           obj3.brand.push(element.brand);
//           obj3.region.push(element.region);
//           obj3.downside.push(formatCash(element.Upside_Downside_Revenue));
//         }
//       });
//       response.data.revenue.downside = obj3;

//       const obj4 = {
//         prioritySubCat: [],
//         brand: [],
//         region: [],
//         downside: [],
//       };
//       let unitsDataAsc = sourceData.sort(function (a, b) {
//         return a.Upside_Downside_Units - b.Upside_Downside_Units;
//       });

//       unitsDataAsc.map((element) => {
//         if (element.cdp_units < element.Brand_Ambition_units) {
//           obj4.prioritySubCat.push(element.Priority_Subcategory);
//           obj4.brand.push(element.brand);
//           obj4.region.push(element.region);
//           obj4.downside.push(formatCash(element.Upside_Downside_Units));
//         }
//       });
//       response.data.units.downside = obj4;

//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
