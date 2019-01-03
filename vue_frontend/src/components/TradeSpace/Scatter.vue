<template>
  <div>
    <h1>Scatter Plot!</h1>

    <div v-for="(solution,index) in solutions" v-bind:key="index">
      <input type="radio" :value="solution.id" v-model="selected">
      <label>{{solution.id}} / {{solution.score}}</label>
      <br>
    </div>
    <button @click="getPipeline">Request:</button>
    <br>
    {{selected}}
    <div id="scatter"></div>
  </div>
</template>


<script>
import * as d3 from "d3v3";
import d3Tip from "d3-tip";
d3.tip = d3Tip;
export default {
  data() {
    return {
      selected: "",
      points: []
    };
  },
  props: ["solutions"],
  watch: {
    solutions: function() {
      console.log("getPoints");
      this.solutions.forEach(solution => {
        // console.log([solution.pipelineSize, solution.score]);
        this.points.push([solution.pipelineSize, solution.score]);
      });
      console.log("Points done");
      this.getZoomableScatterplot();
    }
  },
  // mounted() {
  //   this.getZoomableScatterplot();
  // },
  methods: {
    getPipeline() {
      let selected = this.selected;
      if (selected) {
        console.log(selected);
        // responsePipeline in PipelineView.vue
        this.$socket.emit("requestPipeline", selected);
      }
    },
    getZoomableScatterplot() {
      console.log("getZoomableScatterplot");
      var margin = { top: 50, right: 300, bottom: 50, left: 50 },
        outerWidth = 1050,
        outerHeight = 500,
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

      var data = this.points;
      var xMax =
          d3.max(data, function(d) {
            return d[0];
          }) * 1.05,
        xMin = d3.min(data, function(d) {
          return d[0];
        }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax =
          d3.max(data, function(d) {
            return d[1];
          }) * 1.05,
        yMin = d3.min(data, function(d) {
          return d[1];
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
          return "x: " + d[0] + "<br>" + "y: " + d[1];
        });

      var zoomBeh = d3.behavior
        .zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

      var svg = d3
        .select("#scatter")
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
        .attr("height", height);

      svg
        .append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text("xCat");

      svg
        .append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("yCat");

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
        .attr("transform", "translate(0," + height + ")");

      objects
        .append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

      objects
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("r", function(d) {
          // return 6 * Math.sqrt(d[rCat] / Math.PI);
          return 6;
        })
        .attr("transform", transform)
        .style("fill", function(d) {
          return color(d[colorCat]);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      d3.select("input").on("click", change);

      function change() {
        xCat = "Carbs";
        xMax = d3.max(data, function(d) {
          return d[0];
        });
        xMin = d3.min(data, function(d) {
          return d[0];
        });

        zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

        var svg = d3.select("#scatter").transition();

        svg
          .select(".x.axis")
          .duration(750)
          .call(xAxis)
          .select(".label")
          .text(xCat);

        objects
          .selectAll(".dot")
          .transition()
          .duration(1000)
          .attr("transform", transform);
      }

      function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot").attr("transform", transform);
      }

      function transform(d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
      }
    }
  }
};
</script>

<style>
rect {
  fill: transparent;
  shape-rendering: crispEdges;
}

.axis path,
.axis line {
  fill: none;
  stroke: rgba(0, 0, 0, 0.1);
  shape-rendering: crispEdges;
}

.axisLine {
  fill: none;
  shape-rendering: crispEdges;
  stroke: rgba(0, 0, 0, 0.5);
  stroke-width: 2px;
}

.dot {
  fill-opacity: 0.5;
}

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
  width: 100%;
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