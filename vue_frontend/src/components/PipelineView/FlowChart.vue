<template>
  <div>
    <p>Flow Chart</p>
    <vue-mermaid :nodes="nodes" v-if="isPipelineShown"></vue-mermaid>
  </div>
</template>

<script>
export default {
  name: "flow-chart",
  props: ["pipeline"],
  data() {
    return {
      isPipelineShown: false,
      // nodesPicked: [],
      nodes: []
    };
  },
  watch: {
    pipeline: function() {
      this.visualizePipeline();
      // updated the vue-mermaid componnent, since somehow that componnet couldn't be updated automatically,
      // use 'v-if' trick, destroy then create the componet
      this.isPipelineShown = false;
      this.$nextTick(function() {
        this.isPipelineShown = true;
      });
    }
  },

  methods: {
    visualizePipeline() {
      // console.log("visualize pipeline");
      const elementId = { id: 0 };
      this.isPipelineShown = true;
      // this.nodesPicked = [];
      this.nodes = [];
      branch(this.pipeline, this.nodes, elementId);
      function branch(pipeline, nodes, elementId) {
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
            text: id + ": " + name,
            next: [id + 1]
          };
          if (i == steps.length - 1 && !step.pipeline) {
            node.next = [];
          }
          nodes.push(node);
          elementId.id += 1;
          if (step.pipeline) {
            branch(step.pipeline, nodes, elementId);
            node.next.push(elementId.id);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
