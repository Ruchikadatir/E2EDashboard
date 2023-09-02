const healthRouter = require("./health");
// other routes
// const e2eRouter = require("./sufficiency.route");
const sufficiencyRouter = require("./sufficiency.route");
const demandScenarioRouter = require("./demandScenario.route");
const responsivenessRouter = require("./responsiveness.route");

const routes = [
  {
    path: "/healthz",
    router: healthRouter,
  },
  {
    path: "/v1/sufficiency",
    router: sufficiencyRouter,
  },
  {
    path: "/v1/demandScenario",
    router: demandScenarioRouter,
  },
  {
    path: "/v1/responsiveness",
    router: responsivenessRouter,
  },

];

module.exports = routes;
