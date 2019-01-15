<template>
  <div>
    <p>Trade Space</p>
    <component
      :is="'ZoomableScatterplot'"
      v-for="(coordinate,i) in coordinates"
      :coordinate="coordinate"
      :solutions="solutions"
      :index="i"
      :key="i"
    ></component>

    <button @click="addPlot">Add One More Plot</button>
  </div>
</template>

<script>
import ZoomableScatterplot from "./ZoomableScatterplot.vue";
export default {
  name: "trade-spece",
  data() {
    return {
      solutions: null,
      coordinates: [
        { xCoor: "pipelineSize", yCoor: "score" },
        { xCoor: "pipelineSize", yCoor: "score" }
      ]
    };
  },

  methods: {
    addPlot() {
      console.log("addPlot");
      this.coordinates.push({ xCoor: "pipelineSize", yCoor: "score" });
    }
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