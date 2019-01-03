<template>
  <div>
    <p>Pipeline View</p>
    <FlowChart :pipeline="pipeline"/>
  </div>
</template>

<script>
import FlowChart from "./FlowChart.vue";
export default {
  name: "pipeline view",
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