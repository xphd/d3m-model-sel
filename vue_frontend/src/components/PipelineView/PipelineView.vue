<template>
  <div>
    <p>Pipeline View</p>
    <DagreGraph :nodes="nodes" :edges="edges"/>
  </div>
</template>

<script>
import DagreGraph from "./DagreGraph.vue";
export default {
  name: "pipeline-view",
  data() {
    return {
      // pipeline: {},
      nodes: [],
      edges: []
    };
  },
  components: {
    DagreGraph
  },
  sockets: {
    // requestPipeline defined in ZoomableScatter.vue
    responsePipeline(pipeline) {
      // this.pipeline = pipeline;
      this.init(pipeline);
      // this.init();
    }
  },

  methods: {
    init(pipeline) {
      const elementId = { id: 0 };
      // this.isPipelineShown = true;
      // this.nodesPicked = [];
      // this.nodes = [];
      branch(pipeline, this.nodes, this.edges, elementId);

      function branch(pipeline, nodes, edges, elementId) {
        if (pipeline == null) {
          return;
        }
        let steps = pipeline.steps;

        for (let i = 0; i < steps.length; i++) {
          let step = steps[i];
          let name = step["primitive"]["primitive"]["name"];
          let id = elementId.id;
          let node = {
            id: id,
            state: "success",
            value: {
              label: id + ": " + name
            }
          };

          nodes.push(node);
          elementId.id += 1;

          if (i == steps.length - 1 && !step.pipeline) {
            // node.next = [];
          } else {
            let edge = {
              from: id,
              to: id + 1
            };
            edges.push(edge);
          }

          if (step.pipeline) {
            let cur = id;
            branch(step.pipeline, nodes, edges, elementId);
            // node.next.push(elementId.id);
            let nxt = elementId.id;
            let edge = {
              from: cur,
              to: nxt
            };
            edges.push(edge);
          }
        }
      }
    }
  }
};
</script>