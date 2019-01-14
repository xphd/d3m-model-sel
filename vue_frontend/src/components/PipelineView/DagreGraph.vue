<template>
  <div :id="containerId" class="container dagre-graph-container">
    <div class="zoom-div">
      <button
        v-for="item in directions"
        :key="item.prop"
        @click="direction = item.prop"
      >{{item.label}}</button>
      <button @click="zoomCtrl(0)" class="zoom">Zoom out</button>
      <button @click="zoomCtrl(1)">Zoom in</button>
    </div>
    <svg class="dagre">
      <g class="container"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import dagreD3 from "dagre-d3";
let container = null;
export default {
  name: "DagreGraph",
  props: ["nodes", "edges"],
  data() {
    return {
      id: "",
      renderer: null, // new dagreD3.render();
      graph: null, // new dagreD3.graphlib.Graph()
      direction: "LR",
      directions: [
        {
          prop: "LR",
          label: "Left to Right"
        },
        {
          prop: "RL",
          label: "Right to Left"
        },
        {
          prop: "TB",
          label: "Up to Down"
        },
        {
          prop: "BT",
          label: "Down to Up"
        }
      ],
      zoom: null,
      containerId: "",
      width: 0,
      height: 0,
      nodesMap: null
    };
  },
  created() {
    this.containerId = this.getId();
    this.graph = new dagreD3.graphlib.Graph()
      .setGraph({
        rankdir: this.direction
      })
      .setDefaultEdgeLabel(function() {
        return {};
      });

    let nodes = this.nodes;
    this.nodesMap = new Map();
    let nodesMap = this.nodesMap;
    // console.log(nodes.length);
    nodes.forEach(node => {
      let id = node["id"];
      nodesMap.set(id, node);
    });
  },
  methods: {
    getId() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      // let id = s4()+s4()+ "-"+s4() + "-" +s4() +"-" + s4() +"-" +s4() +s4()+s4();
      let id = s4() + "-" + s4();
      return id;
    },
    zoomCtrl(symbal) {
      let scale = symbal === 1 ? 1.1 : 0.8;
      const svg = d3.select(this.$el).select("svg.dagre");
      this.zoom.scaleBy(svg, scale);
    },
    /**
     * @description control the canvas zoom to up or down
     */
    zoomed() {
      d3.select(this.$el)
        .select("g.container")
        .attr("transform", d3.event.transform);
    },
    /**
     * @description 画节点
     */
    strokeNodes() {
      // 获取之前的nodes缓存并清除
      let nodes = this.graph.nodes();
      if (nodes.length) {
        nodes.forEach(item => {
          this.graph.removeNode(item);
        });
      }

      //通过operator来画shape(BranchPythonMapOperator: 分支； JoinOperator：合流)
      this.nodes.forEach(item => {
        let state = item.state ? item.state : "no-status";
        let shape = "rect";
        if (item.value.operator === "BranchPythonMapOperator") {
          shape = "ellipse";
        } else if (item.value.operator === "JoinOperator") {
          shape = "circle";
        }
        this.graph.setNode(item.id, {
          label: item.value.label,
          shape: shape,
          class: item.value.operator + " dagre " + state
        });
      });
      this.renderer(container, this.graph);
    },
    /**
     * @description 画线
     */
    strokeEdges() {
      //一个脚本节点时：不渲染eage
      if (this.nodes.length > 1) {
        this.edges.forEach(item => {
          if (item.label) {
            this.graph.setEdge(item.from, item.to, { label: item.label });
          } else {
            this.graph.setEdge(item.from, item.to);
          }
        });
        this.renderer(container, this.graph);
      }
    }
  },
  mounted() {
    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientHeight;
    // eslint-disable-next-line
    this.renderer = new dagreD3.render();
    const svg = d3
      .select(this.$el)
      .select("svg.dagre")
      .attr("width", this.width)
      .attr("height", this.height);
    container = svg.select("g.container");
    // transform
    const transform = d3.zoomIdentity
      // .translate(this.width / 3, this.height / 6)
      .scale(1);
    this.zoom = d3
      .zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", this.zoomed);
    container
      .transition()
      .duration(750)
      .call(this.zoom.transform, transform);
    svg.call(this.zoom);
    this.strokeNodes();
    this.strokeEdges();
    // once a node is clicked or mouse over, do somthing

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let nodesMap = this.nodesMap;
    // console.log(nodesMap);
    d3.selectAll("svg g.node")
      .on("click", idString => {
        let id = +idString; // convert string to int
        console.log(JSON.stringify(nodesMap.get(id)));
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(JSON.stringify(nodesMap.get(id)))
          .style("left", d3.event.pageX + 5 + "px")
          .style("top", d3.event.pageY - 28 + "px");
        // .style("background", "black");
      })
      .on("mouseout", () => {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
  },
  watch: {
    nodes() {
      this.strokeNodes();
    },
    edges() {
      this.strokeEdges();
    },
    direction() {
      this.graph.setGraph({
        rankdir: this.direction
      });
      this.renderer(container, this.graph);
    }
  }
};
</script>
<style lang="scss">
.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
/************ 图表变量 ***************/
$fail: #f77d6b;
$success: #61b2e4;
$running: #87d86f;
$skipped: #faec91;
$queued: #43e3ed;
$retry: #f8b96c;
$no-status: #fff;
$upstream_failed: rgb(163, 108, 108);
/**************** dagre 节点图************************/
g.node.dagre {
  tspan {
    fill: #fff;
    cursor: pointer;
  }
  &.no-status {
    rect {
      stroke: #333;
      fill: #fff;
    }
    ellipse {
      stroke: #333;
      fill: #fff;
    }
    circle {
      stroke: #333;
      fill: #fff;
    }
    tspan {
      fill: #333;
    }
  }
  &.success {
    rect {
      stroke: #fff;
      fill: $success;
    }
    ellipse {
      stroke: #fff;
      fill: $success;
    }
    circle {
      stroke: #fff;
      fill: $success;
    }
  }
  &.failed {
    rect {
      stroke: #fff;
      fill: $fail;
    }
    ellipse {
      stroke: #fff;
      fill: $fail;
    }
    circle {
      stroke: #fff;
      fill: $fail;
    }
  }
  &.upstream_failed {
    rect {
      stroke: #fff;
      fill: $upstream_failed;
    }
    ellipse {
      stroke: #fff;
      fill: $upstream_failed;
    }
    circle {
      stroke: #fff;
      fill: $upstream_failed;
    }
  }
  &.running {
    rect {
      stroke: #fff;
      fill: $running;
    }
    ellipse {
      stroke: #fff;
      fill: $running;
    }
    circle {
      stroke: #fff;
      fill: $running;
    }
  }
  &.skipped {
    rect {
      stroke: #fff;
      fill: $skipped;
    }
    ellipse {
      stroke: #fff;
      fill: $skipped;
    }
    circle {
      stroke: #fff;
      fill: $skipped;
    }
  }
  &.queued {
    rect {
      stroke: #fff;
      fill: $queued;
    }
    ellipse {
      stroke: #fff;
      fill: $queued;
    }
    circle {
      stroke: #fff;
      fill: $queued;
    }
  }
  &.BashOperator {
    &:hover {
      & > rect {
        cursor: pointer;
        fill: #7cc9fa;
      }
    }
  }
  &.BranchPythonMapOperator {
    &:hover {
      & > ellipse {
        cursor: pointer;
        fill: #c52bd3;
      }
    }
  }
  &.JoinOperator {
    &:hover {
      & > circle {
        cursor: pointer;
        fill: #0beb8d;
      }
    }
  }
}
.zoom {
  margin-left: 40px;
}
</style>