const express = require("express");
const router = new express.Router();
const demandScenarioService = require("../service/demandScenario.service");
// const {verifyToken} = require('../middleware/verifyToken')

// router.use('*', verifyToken)

router.post(
  "/strategicDemandSignal",
  demandScenarioService.getStrategicDemandSignal
);
router.post(
  "/growthRateReconciliation",
  demandScenarioService.getGrowthRateReconciliation
);
router.post("/upsideDownside", demandScenarioService.getUpsideDownside);
router.post(
  "/familyCodeUpsideDownside",
  demandScenarioService.getFamilyUpsideDownside
);
router.post(
  "/familyCodeUpsideDownsideDownload",
  demandScenarioService.getFamilyUpsideDownsideDownload
);
router.get(
  "/nudges",
  demandScenarioService.nudgeDVal
);

// router.post(
//   "/all/nudges",
//   demandScenarioService.nudgesValues
// );

// exports all routes
module.exports = router;
