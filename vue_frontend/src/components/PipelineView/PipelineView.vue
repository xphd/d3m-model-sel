<template>
  <div>
    <p>Pipeline View</p>
    <FlowChart :pipeline="pipeline"></FlowChart>
  </div>
</template>

<script>
import FlowChart from "./FlowChart.vue";
export default {
  name: "app",
  data() {
    return {
      pipeline: {}
    };
  },
  components: {
    FlowChart
  },
  sockets: {
    responsePipeline(pipeline) {
      this.pipeline = pipeline;
    }
  }
};
</script>