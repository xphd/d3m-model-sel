<template>
  <div>
    <p>Trade Space</p>
    <ZoomableScatterplot :solutions="solutions"/>
  </div>
</template>

<script>
import ZoomableScatterplot from "./ZoomableScatterplot.vue";
export default {
  name: "trade-spece",
  data() {
    return {
      solutions: null
      // solution = {
      //   id:"",
      //   score: ,
      //   pipelineSize: ,
      // }
    };
  },
  components: {
    ZoomableScatterplot
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      if (this.solution == null) this.$socket.emit("requestSolutions");
    },
    responseSolutions(solutions) {
      this.solutions = solutions;
      // console.log(solutions.length);
    }
  }
};
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>