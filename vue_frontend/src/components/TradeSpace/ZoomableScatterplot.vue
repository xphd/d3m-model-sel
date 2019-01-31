<template>
  <div>
    <p>Zoomable Scatterplot!</p>
    <div :id="id"></div>
  </div>
</template>

<script>
import * as d3 from "d3v3";
import d3Tip from "d3-tip";
d3.tip = d3Tip;
export default {
  name: "zoomable-scatterplot",
  props: ["solutions", "coordinate", "index"],
  data() {
    return {
      xCoor: this.coordinate.xCoor, // x-coordinate
      yCoor: this.coordinate.yCoor, //
      id: "zoomable-" + this.index,
      // seletedPoint: "",
      // svgObjects: null
      selectedSolutions: new Set()
    };
  },
  watch: {
    solutions: function() {
      this.getZoomableScatterplot(this.xCoor, this.yCoor);
      console.log(this.solutions);
    }
    // selectedSolutions: function() {
    //   console.log("selectedPoint is called");
    //   // d3.select("#" + this.seletedPoint.id).style("fill", "red");
    //   console.log("cl-" + this.seletedPoint.id);
    //   d3.selectAll(".cl-" + this.seletedPoint.id).style("fill", "red");
    // }
  },
  mounted() {
    if (this.solutions) {
      this.getZoomableScatterplot(this.xCoor, this.yCoor);
    }
  },
  methods: {
    onClick(d) {
      var curSolutionId = d["id"];
      let selectedSolutions = this.selectedSolutions;
      if (selectedSolutions.has(curSolutionId)) {
        selectedSolutions.delete(curSolutionId);
        d3.selectAll(".cl-" + curSolutionId).style("fill", "");
      } else {
        selectedSolutions.add(curSolutionId);
        d3.selectAll(".cl-" + curSolutionId).style("fill", "red");
        this.getPipeline(d);
      }
    },
    getPipeline(d) {
      // d is the element of solutions, aka solution
      if (d) {
        this.$socket.emit("requestPipeline", solutionId);
      }
    },
    getZoomableScatterplot(xCoor, yCoor) {
      // console.log("getZoomableScatterplot");
      var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        outerWidth = 600,
        outerHeight = 400,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;
      var x = d3.scale
        .linear()
        .range([0, width])
        .nice();
      var y = d3.scale
        .linear()
        .range([height, 0])
        .nice();
      // shorthand notation
      var data = this.solutions;
      var xMax =
          d3.max(data, function(d) {
            return d[xCoor];
          }) * 1.05,
        xMin = d3.min(data, function(d) {
          return d[xCoor];
        }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax =
          d3.max(data, function(d) {
            return d[yCoor];
          }) * 1.05,
        yMin = d3.min(data, function(d) {
          return d[yCoor];
        }),
        yMin = yMin > 0 ? 0 : yMin;
      x.domain([xMin, xMax]);
      y.domain([yMin, yMax]);
      var xAxis = d3.svg
        .axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);
      var yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);
      var tip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          return "x: " + d[xCoor] + "<br>" + "y: " + d[yCoor];
        });
      var zoomBeh = d3.behavior
        .zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);
      console.log(this.id);
      var svg = d3
        .select("#" + this.id)
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);
      svg.call(tip);
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "transparent")
        .style("shape-rendering", "crispEdges");
      let xAxisName = xCoor;
      if (xCoor == "timeProduce") {
        xAxisName = "Time Produce (s)";
      } else if (xCoor == "pipelineSize") {
        xAxisName = "Pipeline Size";
      }
      let svgXAxis = svg
        .append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      svgXAxis
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text(xAxisName);
      svgXAxis
        .selectAll("path")
        .style("fill", "none")
        .style("stroke", "rgba(0, 0, 0, 0.1)")
        .style("shape-rendering", "crispEdges");
      svgXAxis
        .selectAll("line")
        .style("fill", "none")
        .style("stroke", "rgba(0, 0, 0, 0.1)")
        .style("shape-rendering", "crispEdges");
      let yAxisName = yCoor;
      if (yCoor == "score") {
        yAxisName = "F1";
      }
      let svgYAxis = svg
        .append("g")
        .classed("y axis", true)
        .call(yAxis);
      svgYAxis
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisName);
      svgYAxis
        .selectAll("path")
        .style("fill", "none")
        .style("stroke", "rgba(0, 0, 0, 0.1)")
        .style("shape-rendering", "crispEdges");
      svgYAxis
        .selectAll("line")
        .style("fill", "none")
        .style("stroke", "rgba(0, 0, 0, 0.1)")
        .style("shape-rendering", "crispEdges");
      var objects = svg
        .append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

      objects
        .append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")")
        .style("fill", "none")
        .style("shape-rendering", "crispEdges")
        .style("stroke", "rgba(0, 0, 0, 0.5)")
        .style("stroke-width", "2px");
      objects
        .append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .style("fill", "none")
        .style("shape-rendering", "crispEdges")
        .style("stroke", "rgba(0, 0, 0, 0.5)")
        .style("stroke-width", "2px");
      // var vm = this; // vue object
      objects
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .classed("dot", true)
        .style("fill-opacity", "0.5")
        .attr("r", function(d) {
          return 6;
        })
        .attr("class", function(d) {
          return "dot" + " cl-" + d.id;
        })
        .attr("transform", transform)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        // .on("click", function(d) {
        //   d3.select(this).style("fill", "magenta");
        //   vm.getPipeline(d);
        // });
        // once clicked, request pipeline associated with this point (solution)
        .on("click", this.onClick);
      // this.svgObjects = objects;
      function zoom() {
        let xa = svg.select(".x.axis").call(xAxis);
        xa.selectAll("path")
          .style("fill", "none")
          .style("stroke", "rgba(0, 0, 0, 0.1)")
          .style("shape-rendering", "crispEdges");
        xa.selectAll("line")
          .style("fill", "none")
          .style("stroke", "rgba(0, 0, 0, 0.1)")
          .style("shape-rendering", "crispEdges");
        let ya = svg.select(".y.axis").call(yAxis);
        ya.selectAll("path")
          .style("fill", "none")
          .style("stroke", "rgba(0, 0, 0, 0.1)")
          .style("shape-rendering", "crispEdges");
        ya.selectAll("line")
          .style("fill", "none")
          .style("stroke", "rgba(0, 0, 0, 0.1)")
          .style("shape-rendering", "crispEdges");
        svg.selectAll(".dot").attr("transform", transform);
      }
      function transform(d) {
        return "translate(" + x(d[xCoor]) + "," + y(d[yCoor]) + ")";
      }
    }
  }
};
</script>

<style>
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  /* width: 100%; */
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}
/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>