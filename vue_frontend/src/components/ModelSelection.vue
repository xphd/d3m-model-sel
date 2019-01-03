<template>
  <div class="contaienr">
    <h1>Model Selection</h1>
    <div class="row">
      <div class="col-md-12">
        <TradeSpace></TradeSpace>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <PipelineView></PipelineView>
      </div>
      <div class="col-md-4">
        <ModelType></ModelType>
      </div>
    </div>
  </div>
</template>

<script>
import TradeSpace from "./TradeSpace/TradeSpace.vue";
import PipelineView from "./PipelineView/PipelineView.vue";
import ModelType from "./ModelType/ModelType.vue";
export default {
  name: "model-selection",
  components: {
    TradeSpace,
    PipelineView,
    ModelType
  }
};
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>