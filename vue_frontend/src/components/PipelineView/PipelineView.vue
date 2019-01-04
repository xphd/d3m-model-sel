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
    }
  },
  methods: {
    init(pipeline) {}
  }
};
</script>