<template>
  <div>
    <p>Trade Space</p>
    <Scatter :solutions="solutions"></Scatter>
  </div>
</template>

<script>
import Scatter from "./Scatter.vue";
export default {
  data() {
    return {
      solutions: []
    };
  },
  components: {
    Scatter
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestSolutions");
    },
    responseSolutions(solutions) {
      this.solutions = solutions;
      // console.log(solutions[0]);
    }
  }
};
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>