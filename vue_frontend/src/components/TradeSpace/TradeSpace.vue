<template>
  <div>
    <p>Trade Space</p>
    <ZoomableScatterplot :solutions="solutions"/>
  </div>
</template>

<script>
import ZoomableScatterplot from "./ZoomableScatterplot.vue";
export default {
  name: "trade spece",
  data() {
    return {
      solutions: []
    };
  },
  components: {
    ZoomableScatterplot
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestSolutions");
    },
    responseSolutions(solutions) {
      this.solutions = solutions;
    }
  }
};
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>