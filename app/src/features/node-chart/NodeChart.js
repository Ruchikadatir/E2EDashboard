import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./NodeChart.scss";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { nodeSliceInfo } from "./NodeChartSlice";
import { globalFilter } from "../../variables";
import {
  getAllNodesAndConnections,
  getE2eConnections,
} from "./NodeChartSlice";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { numberConversion } from "../app-utils/AppUtils";

const NodeChart = ({ type }) => {
  const [nodeData, setNodeData] = useState({});
  let nodeInfo = useSelector(nodeSliceInfo);
  

  const nodesState = useSelector((state) => state.nodesState);
  const pendingStates = ['idle', 'pending'];
  const nodeChartLoading = useSelector((state) => state.nodeChart.nodesState)
  const level =useSelector((state) => state.nodeChart.level)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllNodesAndConnections({ globalFilter: globalFilter }));
  }, [globalFilter]);

  useEffect(() => {

setNodeData(nodeInfo);
  }, [nodeInfo]);


  useEffect(() => {
    if (nodeData.statusCode !== 204 &&  level.includes(1) ) {
      createMap()
    }

  }, [nodeData]);

  function createMap() {

    if (Object.keys(nodeData).length != 0) {
      $("#nodemap").html("");

      const margin = { top: 40, right: 90, bottom: 50, left: 90 },
        width = 1600 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;
      const svg = d3.select("#nodemap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom),
        g = svg.append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
      g.append("text").attr("class", "label-text").attr("x", 30).attr("y", -28).text("Source");
      g.append("text").attr("class", "label-text").attr("x", 350).attr("y", -28).text("Make");
      g.append("text").attr("class", "label-text").attr("x", 800).attr("y", -28).text("Fulfill");

      var baseNodes = nodeData?.data?.nodes
      var baseLinks = nodeData?.data?.links

      let nodes = baseNodes.map((x, i, arr) => ({ component_type: x.COMPONENT_TYPE, type: x.level, total: x.TOTAL_QUANTITY, name: x.id, id: x.id_temp, hover_name: x.hover_name, hover_lt: x.lead_time, min: x.min_value, max: x.max_value, matnr_desc: x.MATERIAL_DESCRIPTION, source_lt: x.TSLT, supplier_name: x.VENDOR_NAME, make_lt: x.TMLT, dc_name: x.DC_NAME, fulfill_lt: x.TFLT, plant_name: x.PLANTNAME, comp_name: x.COMPONENT_NAME, source_name: x.SOURCE_NAME, source: x.SOURCE, x: toScale(i, arr.length), y: 60, color_region: x.color_region }))
      let links = baseLinks.map((y, i, arr) => ({ source: nodes.find(x => x.name === y.source), target: nodes.find(x => x.name === y.target) }));
      links = links.filter(x => x.source !== undefined).filter(y => y.target !== undefined);

      var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.name; }).distance(1))
        .force("charge", d3.forceManyBody().distanceMax(nodes.length + 1 / width).strength(1))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaDecay(0.01);

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
          return diagonal(d.target, d.source);
        });

      const scaleSize = d3.scaleLinear().domain([0, 300000]).range([10, 25]);
      var colordict = { 'EUROPE': '#ff8f8f', 'ASIA': '#caaeff', 'AMERICAS': '#acd4fe' }

      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#FFF")
        .html("");

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function (d) {
          const scaleSize = d3.scaleLinear().domain([d.min, d.max]).range([10, 25]);
          return scaleSize(d.total)
        })
        .each(function (d, i) {
          if (d.type >= 2) {
            d.fx = d.type * 230 + (d.hover_lt * 1.5)
          } else {
            d.fx = d.type * 230 - (d.hover_lt * 1.5)
          }
        }).style('fill', function (d) {
          return colordict[d.color_region];
        }).style('stroke', function (d) {
          if (d.component_type == "Components" && d.type == 1) {
            return "black"
          }
        })
        .attr("stroke-width", function (d) { return 2; })
        .attr("class", function (d) { return (d.type == "city") ? "city" : "hero" })
        .on("mouseover", function (d) {
          if (d.type === 1) {
            tooltip.html("<p> Material Name : " + d.comp_name + "</br>" + "Supplier Name :" + d.supplier_name + "</br>" + "Quantity :" + numberConversion(d.total) + "</br>" + " Sourcing Leadtime :" + `${d.source_lt} days` + "</p>");
          } else if (d.type === 2) {
            tooltip.html("<p> Plant Name : " + d.plant_name + "</br>" + "Quantity :" + numberConversion(d.total) + "</br>" + "Manufacturing Leadtime :" + `${d.make_lt} days` + "</p>");
          } else {
            if (d.id === d.source) {
              tooltip.html("<p> DC Name : " + d.source_name + "</br>" + "Quantity :" + numberConversion(d.total) + "</br>" + "Fulfill Leadtime :" + `${d.fulfill_lt} days` + "</p>");
            } else {
              tooltip.html("<p> DC Name : " + d.dc_name + "</br>" + "Quantity :" + numberConversion(d.total) + "</br>" + "Fulfill Leadtime :" + `${d.fulfill_lt} days` + "</p>");
            }
          }
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
          return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        })
        .on('mouseenter', function (d) {
          d3.select(this).classed("selected", true)
          d3.selectAll('.nodes').filter(function (otherD) {
            const deps = [];
            return deps.includes(otherD?.name);
          }).classed("selected", true)
            .raise();
          d3.selectAll('.link').filter(function ({ source, target }) {
            return source.name == d.name || target.name == d.name;
          }).classed("highlighted", true);
        })
        .on('mouseleave', function () {
          d3.selectAll('.node').classed("selected", false);
          d3.selectAll('.link').classed("highlighted", false);
        });
      simulation
        .nodes(nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(links);



      function ticked() {
        var force = this;
        var alpha = force.alpha();
        var padding = 50;
        var targetSeparation = (width - padding) / (nodes.length * 2)
        if (alpha < 0.5) {
          force.force("collide", d3.forceCollide((0.6 - alpha) * 2 * targetSeparation))
            .force("charge", d3.forceManyBody().distanceMax(targetSeparation).strength((0.5 - alpha) * 50))
        }
        node
          .attr("cx", function (d) { if (d.x < padding) d.x = padding; else if (d.x > width - padding) d.x = width - padding; return d.x; })
          .attr("cy", function (d) { if (d.y < padding) d.y = padding; else if (d.y > height - padding) d.y = height - padding; return d.y; });
        link
          .attr("d", function (d) {

            return `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
          });
      }
      function toScale(index, length) {
        const scale = d3.scaleLinear().domain([0, length - 1]).range([0, width]);
        return scale(index);
      }
      function diagonal(target, source) {
        return "M" + target.x + "," + target.y
          + "C" + target.x + "," + source.y
          + " " + source.x + "," + target.y
          + " " + source.x + "," + source.y;
      }
    }
  }
  return (
    <>
      {(nodeChartLoading !== "pending") ?
      (nodeData?.statusCode !== 204 && level.includes(1)) ? <div id="nodemap"></div> :(nodeData?.statusCode !== 204 && !level.includes(1)) ? <div className="text-msg">Missing sourcing data. Unable to display</div> : <div className="text-msg">Data is not available for this item code</div> :
        <Box className="nodeBox" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress style={{ color: "#0b228d" }} />
        </Box>
      }
    </>

  )
};

export default NodeChart;
