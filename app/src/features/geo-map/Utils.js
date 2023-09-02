import * as d3 from "d3";
import data from "./GeoMapData.json"
import { numberConversion } from "../app-utils/AppUtils";

var color_obj = {
  sourceComponent: {
    background: "#68D0CB",
    border: "#68D0CB",
  },
  sourceIngredient: {
    background: "rgba(104, 208, 203, 0.4)",
    border: "#68D0CB",
  },
  plantFnA: {
    background: "#223EE6",
    border: "#223EE6",
  },
  tpmFnA: {
    background: "#7EB2FF",
    border: "#7EB2FF",
  },
  plantComp: {
    background: "rgba(34, 62, 230, 0.4)",
    border: "#223EE6",
  },
  tpmComp: {
    background: "rgba(126, 178, 255, 0.4)",
    border: "#7EB2FF",
  },
  fulfillHub: {
    background: "rgba(164, 84, 235, 0.4)",
    border: "#A454EB",
  },
  fulfillFC: {
    background: "#A454EB",
    border: "#A454EB",
  },
};

var link_obj = {
  source: {
    type: ["SI-SC", "SI-SI", "SC-SC"],
    sourceType: ["SI", "SC"],
    color: "#68D0CB",
  },
  fulfill: {
    type: ["FH-FAFC", "FH-FH", "FAFC-FAFC"],
    fulfillType: ["FH", "FAFC"],
    color: "#A454EB",
  },
  make: {
    type: ["TFA-PC", "PFA-TFA"],
    makeType: ["PC", "TC"],
    makeE2EType: ["MTPM", "MI"],
    color: "#223EE6",
  },
};

// --- Helper functions (for tweening the path)
var lineTransition = function lineTransition(path) {
  path
    .transition()
    .duration(5500)
    .attrTween("stroke-dasharray", tweenDash)
    .each("end", function (d, i) {
      d3.select(this).call(d3.transition);
    });
};

var tweenDash = function tweenDash() {
  var len = this.getTotalLength(),
    interpolate = d3.interpolateString("0," + len, len + "," + len);
  return function (t) {
    return interpolate(t);
  };
};

var createLinks = function (links, linksData, val) {
  for (var i = 0, len = linksData.length - 1; i <= len; i++) {
    if (val == "e2e") {
      var color;
      if (linksData[i].connections.length > 0) {
        linksData[i]?.connections.map((connection) => {
          if (
            connection.coordinates[0].includes(null) !== true &&
            connection.coordinates[1].includes(null) !== true
          ) {
            let x = [...connection.coordinates[0]].reverse();
            let y = [...connection.coordinates[1]].reverse();
            let coordinates = [x, y];
            if (
              link_obj.source.sourceType.includes(
                linksData[i].type.split("-")[0]
              )
            ) {
              color = link_obj.source.color;
            }
            if (
              link_obj.make.makeType.includes(
                linksData[i].type.split("-")[0]
              ) ||
              link_obj.make.makeType.includes(linksData[i].type.split("-")[1])
            ) {
              return;
            } else if (
              link_obj.make.makeE2EType.includes(
                linksData[i].type.split("-")[0]
              )
            ) {
              color = link_obj.make.color;
            }

            if (
              link_obj.fulfill.fulfillType.includes(
                linksData[i].type.split("-")[0]
              )
            ) {
              color = link_obj.fulfill.color;
            }

            links.push({
              type: "LineString",
              coordinates: coordinates,
              color: color,
            });
          }
        });
      }
    }
  }
};

var maxVolume = function (data) {
  let volumes = data?.map((item) => item.volume);
  return Math.max(...volumes);
};


var coloringNodes = (nodeData, node, node_types) => {
  if (Object.keys(nodeData).length > 0) {
    var nodes = nodeData[node][node_types]?.reduce((res, node) => {
      if (node.lat && node.long) {
        res.push({
          ...node,
          nodetype: node_types,
          background: color_obj[node_types].background,
          border: color_obj[node_types].border,
        });
      }
      return res;
    }, []);
    return nodes;
  }
};

var getNodeData = (nodeData, val) => {
  var sourceCompNodes = coloringNodes(nodeData, "source", "sourceComponent");
  var sourceIngNodes = coloringNodes(nodeData, "source", "sourceIngredient");
  var plantFnA = coloringNodes(nodeData, "make", "plantFnA");
  var plantComp = coloringNodes(nodeData, "make", "plantComp");
  var tpmComp = coloringNodes(nodeData, "make", "tpmComp");
  var tpmFnA = coloringNodes(nodeData, "make", "tpmFnA");
  var fulfillHub = coloringNodes(nodeData, "fulfill", "fulfillHub");
  var fulfillFC = coloringNodes(nodeData, "fulfill", "fulfillFC");

  if (val == "source") {
    let maxVol =
      maxVolume(sourceCompNodes) > 0 ? maxVolume(sourceCompNodes) : 1;
    var getRadius = d3.scaleLinear().domain([0, maxVol]).range([5, 20]);
    sourceCompNodes = sourceCompNodes.map((node) => {
      return {
        ...node,
        radius: getRadius(node.volume),
      };
    });
    var data = [...sourceCompNodes, ...sourceIngNodes];
  } else if (val == "fulfill") {
    data = [...fulfillHub, ...fulfillFC];
    let maxVol = maxVolume(data) > 0 ? maxVolume(data) : 1;
    var getRadius = d3.scaleLinear().domain([0, maxVol]).range([5, 20]);
    data = data.map((node) => {
      return {
        ...node,
        radius: getRadius(node.volume),
      };
    });
  } else if (val == "make") {
    let plantWithVol = [...plantFnA, ...tpmFnA];
    let maxVol = maxVolume(plantWithVol) ? maxVolume(plantWithVol) : 1;
    var getRadius = d3.scaleLinear().domain([0, maxVol]).range([5, 20]);
    plantWithVol = plantWithVol.map((node) => {
      return {
        ...node,
        radius: getRadius(node.volume),
      };
    });
    data = [...plantComp, ...tpmComp, ...plantWithVol];
  } else {
    let e2eVol = [
      ...sourceCompNodes,
      ...fulfillFC,
      ...fulfillHub,
      ...plantFnA,
      ...tpmFnA,
    ];
    let maxVol = maxVolume(e2eVol) > 0 ? maxVolume(e2eVol) : 1;
    var getRadius = d3.scaleLinear().domain([0, maxVol]).range([5, 20]);
    e2eVol = e2eVol.map((node) => {
      return {
        ...node,
        radius: getRadius(node.volume),
      };
    });
    data = [...sourceIngNodes, ...e2eVol];
  }
  return data;
};

const calculateTotal = (tooltipInfo, nodetype) => {
  let total = {};
  if (nodetype == "sourceComponent" || nodetype == "sourceIngredient") {
    total['units'] = tooltipInfo['Units']?.reduce((curr, acc) => curr + acc);
    total['number'] = 3;
    total['extraTD'] = true;
  }

  if (nodetype == "plantFnA" || nodetype == "plantComp") {
    total['units'] = tooltipInfo['Units']?.reduce((curr, acc) => curr + acc);
    total['percent'] = tooltipInfo['Plant Technology Mix']?.reduce((curr, acc) => curr + acc)
    total['number'] = 2
  }
  if (nodetype == "tpmFnA" || nodetype == "tpmComp") {
    total['units'] = tooltipInfo['Units']?.reduce((curr, acc) => curr + acc);
  }

  if (nodetype == "fulfillHub" || nodetype == "fulfillFC") {
    total['units'] = tooltipInfo['Volume']?.reduce((curr, acc) => curr + acc);
    total['percent'] = tooltipInfo['% Total Sales Volume']?.reduce((curr, acc) => curr + acc)
    total['number'] = 2
  }
  return total;
}

let createTable = (tooltipInfo, table, nodetype) => {
  const region = tooltipInfo?.node;
  if (tooltipInfo.hasOwnProperty('node')) {
    delete tooltipInfo['node'];
  }
  let totalRow = calculateTotal(tooltipInfo, nodetype)
  let regionName = nodetype.includes("source") ? "Region" : nodetype.includes("fulfill") ? "Sales Region" : null;

  const numberConversionKeys = ['Units', 'Volume']
  const percentageRound = ['% Material Group Flow To Plant', '% Total Sales Volume', 'Plant Technology Mix']
  table =
    '<table><tbody><tr style="font-weight: bold;"text-align:center;font-size:12px; class="tooltipRow">'
  {
    if (regionName !== null) {
      (table += `<td style="font-weight: bold;"text-align:center"> ` + regionName + '</td>')
    }
  }
  for (var a = 0, len = Object.keys(tooltipInfo)?.length; a < len; a++) {
    table +=
      '<td style="font-weight: bold;"text-align:center;">' +
      Object.keys(tooltipInfo)[a]
      +
      "</td>";
  }
  table += "</tr>";
  for (var i = 0, l = Object.values(tooltipInfo)[0]?.length; i < l; i++) {
    table += "<tr>";
    {
      if (nodetype.includes("plant") || nodetype.includes("tpm")) {
        var start = 1;
        table += '<td>' + tooltipInfo["Plant Name"][i] + "</td>";
      }
      else {
        start = 0
        table += '<td>' + region + "</td>";
      }
    }

    for (var x = start, length = Object.keys(tooltipInfo)?.length; x < length; x++) {
      let tableData = numberConversionKeys.includes(Object.keys(tooltipInfo)[x]) ? numberConversion(Object.values(tooltipInfo)[x][i]) : percentageRound.includes(Object.keys(tooltipInfo)[x]) ? `${Math.round(Object.values(tooltipInfo)[x][i])}%` : Object.values(tooltipInfo)[x][i];
      table +=
        '<td style={{text-align:center}}>' + tableData +
        "</td>";
    }
    table += "</tr>";
  }



  table += '<tr class="toolTipStickyRow">'
  for (let i = 0; i < totalRow['number']; i++) {
    table += '<td>' + "" + '</td>'
  }
  table += '<td>' + "Total" + '</td>'
  table += '<td>' + numberConversion(totalRow.units) + '</td>'
  {
    if (totalRow.percent !== undefined) { return (table += '<td>' + `${Math.round(totalRow.percent)}%` + '</td>') }
    if (totalRow?.extraTD == true) { return (table += '<td>' + "" + '</td>') }
  }
  table += '</tr>';
  table += "</tbody></table>";
  return table;
}

var onClickNode = (nodetype, tooltip, tooltipData) => {
  var table;
  table = createTable(tooltipData, table, nodetype)
  tooltip.data(tooltipData);
  tooltip
    .html(
      table
    )
    .style("left", d3.event.pageX - 50 + "px")
    .style("top", d3.event.pageY - 110 + "px");
};

var zoomed = function (svg) {
  svg.selectAll("path").attr("transform", d3.event.transform);
  svg.selectAll("circle").attr("transform", d3.event.transform);
  svg.selectAll("arcs").attr("transform", d3.event.transform);
  svg.selectAll("marker").attr("transform", d3.event.transform);
};

export {
  lineTransition,
  createLinks,
  maxVolume,
  onClickNode,
  zoomed,
  coloringNodes,
  getNodeData,
};
