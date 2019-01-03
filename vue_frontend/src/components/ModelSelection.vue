<template>
  <div class="contaienr">
    <p>Model Selection</p>
    <div class="row">
      <div class="col-md-12">
        <TradeSpace/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <PipelineView/>
      </div>
      <div class="col-md-4">
        <ModelType/>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
      <div class="col-md-1">.col-md-1</div>
    </div>
    <div class="row">
      <div class="col-md-8">.col-md-8</div>
      <div class="col-md-4">.col-md-4</div>
    </div>-->
  </div>
</template>

<script>
import TradeSpace from "./TradeSpace/TradeSpace.vue";
import PipelineView from "./PipelineView/PipelineView.vue";
import ModelType from "./ModelType/ModelType.vue";
export default {
  name: "model selection",
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