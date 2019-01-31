<template>
  <div>
    <p>Trade Space</p>
    <div class="row">
      <div class="col-sm-6" v-for="(coordinate,i) in coordinates" :key="i">
        <component
          :is="'ZoomableScatterplot'"
          :coordinate="coordinate"
          :solutions="solutions"
          :index="i"
        ></component>
      </div>
    </div>
    <!-- <component
      :is="'ZoomableScatterplot'"
      v-for="(coordinate,i) in coordinates"
      :coordinate="coordinate"
      :solutions="solutions"
      :index="i"
      :key="i"
    ></component>-->
  </div>
</template>

<script>
// import Coordinate from "./Coordinate.vue";
import ZoomableScatterplot from "./ZoomableScatterplot.vue";
export default {
  name: "trade-spece",
  data() {
    return {
      solutions: [],
      coordinates: [],
      xCoors:["timeProduce","timeFit"],
      yCoors:[]
    };
  },
  methods: {
    addPlot(xCoor,yCoor) {
      console.log("addPlot");
      // this.coordinates.push({ xCoor: "pipelineSize", yCoor: "score" });
      // this.coordinates.push({ xCoor: "timeProduce", yCoor: "score" });
      // this.coordinates.push({ xCoor: "timeFit", yCoor: "score" });
      this.coordinates.push({ xCoor: xCoor, yCoor: yCoor });
    }
  },
  watch: {
    solutions() {
      if (this.solutions.length != 0) {
        this.addPlot("timeProduce",this.yCoors[0]);
        this.addPlot("timeFit",this.yCoors[0]);
      }
    }
  },
  components: {
    // Coordinate,
    ZoomableScatterplot
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      if (this.solutions == null) this.$socket.emit("requestSolutions");
    },
    responseSolutions(solutions) {
      console.log("responseSolutions");
      this.solutions = solutions;
      // console.log(solutions)
      // console.log(solutions.length);
      // this.yCoors.push(solutions[0].scores.getKey())
      // console.log( Object.keys(solutions[0].scores))
      this.yCoors = Object.keys(solutions[0].scores)
    }
  },
  mounted() {
    console.log("TradeSpace mounted()");
    if (this.solutions.length == 0) {
      console.log("requestSolutions");
      this.$socket.emit("requestSolutions");
    }
  }
};
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>