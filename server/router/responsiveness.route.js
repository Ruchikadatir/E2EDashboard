const express = require("express");
const router = new express.Router();
const responsivenessService = require("../service/responsiveness.service");
const leadTimeService = require("../service/leadTime.service");
// const {verifyToken} = require('../middleware/verifyToken')

// router.use('*', verifyToken)

router.post(
  "/regionalization/regionalizationPercentage",
  responsivenessService.getRegionalizationPercentage
);

router.post(
  "/regionalization/regionalizationByMaterialGroup",
  responsivenessService.getRegionalizationByMaterialGroup
);

router.post(
  "/regionalization/regionalizationByMaterial",
  responsivenessService.regionalizationByMaterial
);

router.post(
  "/regionalization/regionalizationByFinishedGoods",
  responsivenessService.regionalizationByFinishedGoods
);

router.post(
  "/regionalization/finishedGoodsBom",
  responsivenessService.finishedGoodsBom
);

router.post(
  "/regionalization/productionSites",
  responsivenessService.getProductionSites
);

//leadTime
router.post(
  "/leadTime/e2eLeadTimeBreakDown",
  leadTimeService.getE2eLeadTimeBreakDownValues
);

router.post(
  "/leadTime/e2eLeadTimeDistribution",
  leadTimeService.getE2eLeadTimeDistributionValues
);

router.post(
  "/leadTime/e2eLeadTimeDistributionByPrioritySubCategory",
  leadTimeService.e2eLeadTimeDistributionByPrioritySubCategory
);

router.post(
  "/leadTime/e2eLeadTimeDistributionBySalesRegion",
  leadTimeService.e2eLeadTimeDistributionBySalesRegion
);

router.post(
  "/leadTime/e2eLeadTimeDistributionByBrand",
  leadTimeService.e2eLeadTimeDistributionByBrand
);

router.post(
  "/leadTime/e2eLeadTimeByFinishedGoods",
  leadTimeService.e2eLeadTimeByFinishedGoods
);

router.post(
  "/leadTime/e2eSourcingLeadOpportunitiesByMaterial",
  leadTimeService.e2eSourcingLeadOpportunitiesByMaterial
);

router.post("/leadTime/nodeChart", leadTimeService.getNodeChartValues);

router.post("/leadTime/breakdownTest", leadTimeService.BreakDownTest);

router.post("/all/nudges", leadTimeService.nudgesValues);

router.get("/all/materialCode", leadTimeService.materialCode);

// exports all routes
module.exports = router;
