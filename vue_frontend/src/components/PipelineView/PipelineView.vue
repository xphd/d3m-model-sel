<template>
  <div>
    <p>Pipeline View</p>
    <DagreGraph v-if="flag" :nodes="nodes" :edges="edges"/>
  </div>
</template>

<script>
import DagreGraph from "./DagreGraph.vue";
export default {
  name: "pipeline-view",
  data() {
    return {
      // pipeline: {},
      nodes: [
        {
          id: 0,
          state: "",
          value: {
            label: "Start"
          }
        },
        {
          id: 1,
          state: "success",
          value: {
            label: "featuretools.DFS"
          },
          info:
            "Calculates a feature matrix and features given a dictionary of entities and a list of relationships."
        },
        {
          id: 2,
          state: "success",
          value: {
            label: "xgboost.XGBClassifier"
          },
          info:
            "Parallel tree boosting (also known as GBDT, GBM) optimized for classification problems."
        },
        {
          id: 3,
          state: "",
          value: {
            label: "End"
          }
        }
      ],
      edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
      flag: false
    };
  },
  components: {
    DagreGraph
  },
  sockets: {
    // requestPipeline defined in ZoomableScatter.vue
    responsePipeline(pipeline) {
      // this.pipeline = pipeline;
      this.flag = false;

      // this.init(pipeline);

      this.$nextTick(() => {
        this.flag = true;
      });
    }
  },

  methods: {
    init(pipeline) {
      const elementId = { id: 0 };
      // this.isPipelineShown = true;
      // this.nodesPicked = [];
      this.nodes = [];
      this.edges = [];
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