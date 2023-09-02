import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./GeoMap.scss";
import topology from "./GeoMap.json";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { nodeSliceInfo, linkSliceInfo } from "./GeoMapSlice";
import data from "./GeoMapData.json";
import {
  getE2eNodes,
  getE2eConnections,
} from "./GeoMapSlice";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import {
  lineTransition,
  createLinks,
  maxVolume,
  onClickNode,
  getNodeData,
  zoomed,
} from "./Utils.js";

const GeoMap = ({ type, tooltipData }) => {
  const [nodeData, setNodeData] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [tabValue, setTabValue] = useState(type);
  let nodeInfo = useSelector(nodeSliceInfo);
  let linkInfo = useSelector(linkSliceInfo);
  const sourceTooltipDataState = useSelector((state) => state.geoMap.sourceTooltipDataState);
  const makeTooltipDataState = useSelector((state) => state.geoMap.makeTooltipDataState);
  const fulfillTooltipDataState = useSelector((state) => state.geoMap.fulfillTooltipDataState);
  let [tooltipInfo, setTooltipInfo] = useState("")
  const selectedSufficiencyGlobalFilters = useSelector(
    (state) => state.filter.selectedSufficiencyGlobalFilters
  );
  const nodesState = useSelector((state) => state.geoMap.nodesState);
  const connectionsState = useSelector((state) => state.geoMap.connectionsState);
  const [geoMapLoading, setGeoMapLoading] = useState(true);
  const [tooltipLoaded, setTooltipLoaded] = useState(false)
  const pendingStates = ['idle', 'pending'];

  const dispatch = useDispatch();

  useEffect(() => {
    setNodeData(nodeInfo);
    setLinksData(linkInfo);
    setTooltipInfo(tooltipData)
  }, [nodeInfo, linkInfo, tooltipData]);

  useEffect(() => {
    setTooltipLoaded(sourceTooltipDataState !== "pending" && makeTooltipDataState !== "pending" && fulfillTooltipDataState !== "pending")
  }, [sourceTooltipDataState, makeTooltipDataState, fulfillTooltipDataState]);

  useEffect(() => {
    if (geoMapLoading === false && tooltipLoaded == true) {
      createMap()
    }
  }, [nodeData, linksData, geoMapLoading, tooltipLoaded]);

  useEffect(() => () => clearTooltips(), []);

  useEffect(() => {
    if (nodesState === 'idle') {
      dispatch(getE2eNodes({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
    if (connectionsState === 'idle') {
      dispatch(getE2eConnections({ globalFilter: selectedSufficiencyGlobalFilters }));
    }
  }, [selectedSufficiencyGlobalFilters]);

  useEffect(() => {
    setGeoMapLoading(pendingStates.includes(nodesState) && (tabValue === "e2e" ? pendingStates.includes(connectionsState) : true))
  }, [nodesState, connectionsState])

  function clearTooltips() {
    var tooltips = [...document.querySelectorAll("[id='tooltip']")];
    tooltips.forEach(tt => tt.style.display = "none")
  }

  function getSelectedtooltipData(region, nodetype) {
    const sourceNodeTypeMap = {
      "sourceComponent": "component",
      "sourceIngredient": "ingredient"
    }
    const makeNodeTypeMap = {
      "plantFnA": "internalFAndA",
      "plantComp": "internalCompounding",
      "tpmFnA": "TPMFAndA",
      "tpmComp": "TPMCompounding"
    }
    const fulfillNodeTypeMap = {
      "fulfillHub": "regionalFulfillHub",
      "fulfillFC": "affiliateFC",
    }
    const e2eNodeTypeMap = {
      "sourceComponent": "component",
      "sourceIngredient": "ingredient",
      "plantFnA": "internalFAndA",
      "tpmFnA": "TPMFAndA",
      "fulfillHub": "regionalFulfillHub",
      "fulfillFC": "affiliateFC",
    }

    let nodeTypeMap = tabValue == "source" ? sourceNodeTypeMap : tabValue == "make" ? makeNodeTypeMap : tabValue == "fulfill" ? fulfillNodeTypeMap : e2eNodeTypeMap;
    const selectedTooltipData = tooltipInfo !== undefined && tooltipInfo[nodeTypeMap[nodetype]] != undefined ? (tooltipInfo[nodeTypeMap[nodetype]], tooltipInfo[nodeTypeMap[nodetype]]?.find((i) => i?.node === region)) : [];
    return { ...selectedTooltipData };
  }

  function createMap() {
    $("#geomap").html("");
    var links = [];

    var svg = d3
      .select("#geomap")
      .append("svg")
      .attr("class", "map")
      .style("overflow", "hidden");

    var mapWidth = document.getElementsByClassName("map")[0]["clientWidth"];
    var mapHeight = document.getElementsByClassName("map")[0]["clientHeight"];

    var projection = d3
      .geoEquirectangular()
      .scale(mapWidth / 2.5 / Math.PI)
      .rotate([0, 0])
      .center([0, 0])
      .translate([mapWidth / 2, mapHeight / 2]);

    var path = d3.geoPath().projection(projection);

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("display", "none");

    var filter = svg.append("defs").append("filter").attr("id", "drop-shadow");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 4)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    filter
      .append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", "#2424C526")
      .attr("flood-opacity", "1.5")
      .attr("result", "offsetColor");

    filter
      .append("feComposite")
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    svg.append("g").attr("filter", "url(#drop-shadow)");

    // load and display the World
    svg
      .append("g")
      .attr("filter", "url(#drop-shadow)")
      .selectAll("path")
      .data(topology.features)
      .enter()
      .append("path")
      .attr("cursor", "pointer")
      .attr("class", function (d) {
        return d.id;
      })
      .attr("d", function (d) {
        if (d.id !== "ATA") {
          return path(d);
        }
      })

    $(document).on("click", clearTooltips);

    if (Object.keys(nodeData).length > 0) {
      var data = getNodeData(nodeData, tabValue);
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return projection([d.long, d.lat])[0];
        })
        .attr("cy", function (d) {
          return projection([d.long, d.lat])[1];
        })
        .attr("r", (d) => (d.radius ? d.radius : 5))
        .attr("class", "smallnode")
        .style("fill", (d) => d.background)
        .style("stroke", (d) => d.border)
        .attr("cursor", "pointer")
        .on("click", function (d) {
          tooltip.style("display", "block");
          let region = d.nodetype.includes("source") ? "region" : d.nodetype.includes("fulfill") ? "region" : (d.nodetype.includes("plant") || d.nodetype.includes("tpm")) ? "city" : ""
          d3.event.stopPropagation();
          return onClickNode(d.nodetype, tooltip, getSelectedtooltipData(d[region], d.nodetype));
        })
    }

    if (linksData?.length > 0 && data?.length > 0) {
      createLinks(links, linksData, tabValue);
      function marker(color) {
        svg
          .append("svg:defs")
          .append("svg:marker")
          .data(data)
          .attr("id", color.replace("#", ""))
          .attr("refX", 18)
          .attr("refY", 5)
          .attr("markerWidth", 12)
          .attr("markerHeight", 15)
          .attr("markerUnits", "userSpaceOnUse")
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
          .style("fill", color)
          .style("stroke", color)
          .attr("opacity", 1);
        return "url(" + color + ")";
      }

      svg
        .selectAll(null)
        .data(links)
        .enter()
        .append("path")
        .datum(function (d) {
          return d; // d3.line expects an array where each item represents a vertex.
        })
        .attr("d", function (d) {
          var source = projection(d.coordinates[0]);
          var target = projection(d.coordinates[1]);
          var dx = target[0] - source[0],
            dy = target[1] - source[1],
            dr = Math.sqrt(dx * dx + dy * dy);
          return (
            "M" +
            source[0] +
            "," +
            source[1] +
            "A" +
            dr +
            "," +
            dr +
            " 0 0,1 " +
            target[0] +
            "," +
            target[1]
          );
        })
        .style("stroke-width", 1.5)
        .style("fill", "none")
        .attr("class", "arc")
        .style("stroke", (d) => d.color)
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "3,3")
        .attr("arcSharpness", "2")
        .attr("marker-end", (d) => marker(d.color))
        .on("mouseout", function (d) {
          d3.select(this).style("stroke", d.color);
        });
    }
    // svg.call(
    //   d3
    //     .zoom()
    //     .scaleExtent([1, 5])
    //     .on("zoom", () => zoomed(svg))
    // );
  }
  // .call(lineTransition);
  return (<>
    {(geoMapLoading == false && tooltipLoaded == true) ?
      <div id="geomap"></div> :
      <Box className="map" style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress style={{ color: "#0b228d" }} />
      </Box>
    }
  </>
  )
};

export default GeoMap;
