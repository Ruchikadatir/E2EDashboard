const express = require('express');
const router = new express.Router();
const sufficiencyService = require('../service/sufficiency.service');
// const {verifyToken} = require('../middleware/verifyToken')

// router.use('*', verifyToken)

// router.get("/excel", sufficiencyService.getFromExcel);
router.post('/connection', sufficiencyService.getE2EConnections);
router.post('/node', sufficiencyService.getE2ENodeInformation);
router.post('/kpi', sufficiencyService.getKPIcardvalues);
router.post('/globalFilters', sufficiencyService.getGlobalFilters);
// router.get("/e2e/get/all", sufficiencyService.getAlle2e);
router.get('/source/materialPOs', sufficiencyService.getSourceMaterialPOValues);
//router.post("/source/barCharts", sufficiencyService.getSourceBarChartValues);

router.post(
  '/source/materialGroup',
  sufficiencyService.getMaterialGroupValuesNew
); //getMaterialGroupValues
router.post(
  '/source/materialName',
  sufficiencyService.getMaterialNameRecordValuesNew
); //getMaterialNameRecordValues
// router.post(
//   "/source/materialNameNew",
//   sufficiencyService.getMaterialNameRecordValuesNew
// );
router.post(
  '/source/supplierMix',
  sufficiencyService.getSupplierMixRecordsValuesNew
); //getSupplierMixRecordsValues
router.post(
  '/source/supplierMixNew',
  sufficiencyService.getSupplierMixRecordsValuesNew
);
router.post(
  '/source/projectedMaterial',
  sufficiencyService.getProjectedMaterialReqValuesNew
); // getProjectedMaterialReqValues

router.post('/source/chartFilters', sufficiencyService.getSourceChartFilters);
router.post('/make/chartFilters', sufficiencyService.getMakeChartFilters);
router.post('/make/barCharts', sufficiencyService.getMakeBarChartValues);
router.post('/source/tooltip', sufficiencyService.getSourceTooltipValues);
router.post('/make/tooltip', sufficiencyService.getMakeTooltipValues);
router.post('/fulfill/tooltip', sufficiencyService.getFulfillTooltipValues);
router.post('/make/mix', sufficiencyService.getMakeMixValues);
router.post('/source/whereUsed', sufficiencyService.getWhereUsedValues);
router.get('/make/productionPOs', sufficiencyService.getMakeProductionPOValues);
router.post('/make/whereUsed', sufficiencyService.getMakeWhereUsedValues);
router.post('/make/heatMap', sufficiencyService.getMakeHeatMapValues);
router.post('/fulfill/barCharts', sufficiencyService.getFulfillBarChartValues);
router.post('/e2e/revenueGrowth', sufficiencyService.getE2ERevenueGrowthValues);
router.post(
  '/e2e/requirementGrowth/source',
  sufficiencyService.getE2ERequirementGrowthSourceValues
);
router.post(
  '/e2e/requirementGrowth/make',
  sufficiencyService.getE2ERequirementGrowthMakeValues
);
router.post(
  '/e2e/requirementGrowth/fulfill',
  sufficiencyService.getE2ERequirementGrowthFulfillValues
);
router.post(
  '/e2e/inventoryByNode',
  sufficiencyService.getE2EInventoryByNodeValues
);
router.post('/all/nudges', sufficiencyService.nudgesValues);
router.get('/all/download', sufficiencyService.downloadData);

// exports all routes
module.exports = router;
