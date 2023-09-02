const Gremlin = require("gremlin");
const sql = require("mssql");
const MATNRs = require("../config/leadTimeBreakDown.json");
const config = require("../config/data/config.json");

const KEY =
  "Oy3yh0kvaMbEN3YL07hvnMHkh66mww3lX0z9NCgwBzn2GkWADeBPT4F0eTCojRbPpCWX1aPCJhx1cVKCU4slRA==";

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
  "/dbs/" + "SC_Navigator" + "/colls/" + "E2ENetworkV1",

  KEY
);

const client = new Gremlin.driver.Client(
  "wss://cosdb-am-eastus-prod-sbx.gremlin.cosmos.azure.com:443/",

  {
    authenticator: authenticator,
    traversalsource: "g",

    mimeType: "application/vnd.gremlin-v2.0+json",

    rejectUnauthorized: true,
  }
);

function countVertices(matnr) {
  //   console.log("matnr: ", matnr);
  return client.submit(
    config.GREMLIN_E2ELEADTIMEBREAKDOWN.replaceAll("MATNR", matnr) //   "g.V().hasLabel('FERT').as('v_fert').has('id',within('0343010000','62YM010000')).outE('label','manufactured_at').as('e_fert_pl').inV().hasLabel('PLANT').as('v_plant').path().project('fert_id','plant_id','FG_GRT','FG_TMLT','SRC_TSLT','SRC_SLT','SRC_TLT','SRC_GRT').by(select('v_fert').values(id)).by(select('v_plant').values(id)).by(select('e_fert_pl').values('fg_grt')).by(select('e_fert_pl').values('fg_tmlt')).by(select('e_fert_pl').values('src_tslt')).by(select('e_fert_pl').values('src_slt')).by(select('e_fert_pl').values('src_tlt')).by(select('e_fert_pl').values('src_grt')).fold().dedup()"
    // `g.V().hasLabel('FERT').as('v_fert').has('id',within('${matnr}')).outE('label','manufactured_at').as('e_fert_pl').inV().hasLabel('PLANT').as('v_plant').repeat(outE('label','distribute_to').where(has('itemid',within('${matnr}'))).as('e_dist').inV()).until(outE('label','distribute_to').where(has('itemid',within('${matnr}'))).count().is(0)).path().project('fert_id','major_category_description','brand_description','plant_id','mk_grt','mk_tmlt','src_tslt','src_slt','src_tlt','src_grt','last_dc','sales_region','flt').by(select('v_fert').values(id)).by(select('v_fert').values('major_category_description')).by(select('v_fert').values('brand_description')).by(select('v_plant').values(id)).by(select('e_fert_pl').values('fg_grt')).by(select('e_fert_pl').values('fg_tmlt')).by(select('e_fert_pl').values('src_tslt')).by(select('e_fert_pl').values('src_slt')).by(select('e_fert_pl').values('src_tlt')).by(select('e_fert_pl').values('src_grt')).by(select('e_dist').unfold().tail().inV().id()).by(select('e_dist').unfold().tail().inV().values('continent')).by(union(select('e_dist').by(unfold().coalesce(values('durat'), constant(0)).sum()),select('e_dist').by(unfold().coalesce(values('grt'), constant(0)).sum())).sum())`
  );
}

async function forFunction() {
  const arrayOFMatnr = MATNRs.testMATNR;
  let output = [];

  arrayto = arrayOFMatnr.slice(0, 17000);
  for (i = 0; i < arrayto.length; i++) {
    if (i == 0) {
      timeStart = Date.now();
      console.log("Start time: ", timeStart);
    }
    data = await countVertices(arrayto[i]);
    data1 = JSON.stringify(data); //JSON.parse(
    console.log(`data [${i}]:  ${data.length}`, typeof data, data[0], data1);
    // dataNEw = [];
    dataNEw = data._items.map((obj) => {
      return "[" + Object.values(obj) + "]";
    });
    // const request = new sql.Request();

    let nudgeRegionalizationValues = sql.query(
      `INSERT INTO cosmos_extract_lead_time 
      (MATNR
        ,MAJOR_CATEGORY
        ,BRAND
        ,PLANT_ID
        ,MK_GRT
        ,MK_TMLT
        ,SRC_TSLT
        ,SRC_SLT
        ,SRC_TLT
        ,SRC_GRT
        ,LAST_DC
        ,SALES_REGION
        ,FLT) VALUES ?;`,
      [data],
      (err, rows) => {
        if (err) throw err;
        console.log("All Rows Inserted");
      }
    );
    if (i == arrayto.length - 1) {
      timeEnd = Date.now() - timeStart;
      console.log(
        "Time Taken: ",
        Math.floor(timeEnd / 1000),
        " secs",
        "Number of MATNR: ",
        i + 1
      );
    }
    output.push(...data);
  }

  console.log("total output: ", output.length);
  return output;
}

client
  .open()

  .then(forFunction)

  .catch((error) => {
    console.error("Error running query....");

    console.log(error);
  })

  .then((res) => {
    client.close();
    console.log("End Time: ", Date.now());
  })
  .catch((error) => console.error("Fatal error:", error));
