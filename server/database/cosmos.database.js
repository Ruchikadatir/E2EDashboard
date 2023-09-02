const CosmosClient = require("@azure/cosmos").CosmosClient;

const key =
  "Oy3yh0kvaMbEN3YL07hvnMHkh66mww3lX0z9NCgwBzn2GkWADeBPT4F0eTCojRbPpCWX1aPCJhx1cVKCU4slRA==";
const endPoint = "https://cosdb-am-eastus-prod-sbx.documents.azure.com:443/";

const client = new CosmosClient({ endpoint: endPoint, key: key });

const gremlin = require("gremlin");
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

dc = new DriverRemoteConnection(
  `wss://cosdb-am-eastus-prod-sbx.documents.azure.com:8182/gremlin`,
  // "https://cosdb-am-eastus-prod-sbx.documents.azure.com:443/gremlin",
  {}
);

const graph = new Graph();
const g = graph.traversal().withRemote(dc);

(async () => {
  const { database } = await client.databases.createIfNotExists({
    id: "SC_Navigator", //"testDB", //"SC_Navigator",
  });
  console.log("***database:", database);
  console.log(`${database.id} database ready`);
  const { container } = await database.containers.createIfNotExists({
    id: "E2ENetworkV1", //"testContainer", // ,"E2ENetworkV1",
  });
  console.log("***container:", container);

  const data = await g.V().count();
  // .hasLabel("FERT")
  // .as("v_fert")
  // .has("id", "0343010000");
  // g.V().toList();
  // .limit(1)
  // .count()
  // .next();
  // .then((data) => {
  //   console.log(data);
  //   dc.close();
  // })
  // .catch((error) => {
  //   console.log("ERROR", error);
  //   dc.close();
  // });

  console.log("******  DATA: ", JSON.stringify(data), data);
  // const { item } = await container.items.query.g.V();
  //   //   .query(
  //   //     `g.V().hasLabel('FERT').as('v_fert').has('id',within('0343010000','62YM010000'))

  //   // .outE("label","manufactured_at").as('e_fert_pl')

  //   // .inV().hasLabel('PLANT').as('v_plant').path()

  //   // .project('fert_id','plant_id','FG_GRT','FG_TMLT','SRC_TSLT','SRC_SLT','SRC_TLT','SRC_GRT')

  //   // .by(select('v_fert').values(id))

  //   // .by(select('v_plant').values(id))

  //   // .by(select('e_fert_pl').values("fg_grt"))

  //   // .by(select('e_fert_pl').values("fg_tmlt"))

  //   // .by(select('e_fert_pl').values("src_tslt"))

  //   // .by(select('e_fert_pl').values("src_slt"))

  //   // .by(select('e_fert_pl').values("src_tlt"))

  //   // .by(select('e_fert_pl').values("src_grt"))

  //   // .fold()

  //   // .dedup()`
  //   //   )
  //   // .fetchAll();
  //   .create({
  //     id: "testItem2",
  //     value: "testValue1",
  //   });
  // console.log("***created data: ", item);

  // const { item1 } = await container.item(testItem1);

  // console.log("***fetched data: ", item1);
})();
