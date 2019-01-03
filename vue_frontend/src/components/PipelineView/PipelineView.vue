<template>
  <div>
    <p>Pipeline View</p>
    <FlowChart :pipeline="pipeline"></FlowChart>
  </div>
</template>

<script>
import FlowChart from "./FlowChart.vue";
export default {
  name: "pipeline-view",
  data() {
    return {
      pipeline: {}
    };
  },
  components: {
    FlowChart
  },
  sockets: {
    // requestPipeline defined in ZoomableScatter.vue
    responsePipeline(pipeline) {
      this.pipeline = pipeline;
    }
  }
};
</script>