<template>
  <div id="app">
    <ModelSelection/>
  </div>
</template>

<script>
import ModelSelection from "./components/ModelSelection.vue";

export default {
  name: "app",
  components: {
    ModelSelection
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
