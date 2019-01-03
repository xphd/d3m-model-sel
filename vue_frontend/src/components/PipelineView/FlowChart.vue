<template>
  <div>
    <p>Flow Chart</p>
    <!-- <div align="left" v-for="item in nodes" :key="item.id">
      <input type="checkbox" :id="item.id" :value="item.id" v-model="nodesPicked">
      <label for="jack">{{item.text}}</label>
    </div>
    <span>Select Primitives: {{ nodesPicked }}</span>-->
    <vue-mermaid :nodes="nodes" v-if="isPipelineShown"></vue-mermaid>

    <!-- <div align="left">      
      <json-viewer :value="pipeline" :expand-depth="5" copyable boxed sort></json-viewer>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "FlowChart",
  props: ["pipeline"],
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
  data() {
    return {
      isPipelineShown: false,
      nodesPicked: [],
      nodes: []
    };
  },
  methods: {
    visualizePipeline() {
      // console.log("visualize pipeline");
      const elementId = { id: 0 };
      this.isPipelineShown = true;
      this.nodesPicked = [];
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
