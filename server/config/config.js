const fs = require("fs");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV || "default";
let configFilePath = path.resolve(__dirname, "data/config.json");
// if (NODE_ENV !== 'default') {
//     configFilePath = '/etc/config/config.json'
// }
let configBuffer = fs.readFileSync(configFilePath, "utf-8");
// let configBuffer = fs.readFileSync(path.resolve(__dirname, 'data/config.json'), 'utf-8')
let config = JSON.parse(configBuffer);
// get the environment specific variables support for MONGO, Redis, Kafka
// console.log(config)
module.exports = config;
