import Vue from "vue";
import App from "./App.vue";

import BootstrapVue from "bootstrap-vue";
import VueSocketIO from "vue-socket.io";
import JsonViewer from "vue-json-viewer";
import VueMermaid from "vue-mermaid";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

const socket = new VueSocketIO({
  debug: true,
  connection: "http://localhost:9090"
});

Vue.use(BootstrapVue);
Vue.use(socket);
Vue.use(JsonViewer);
Vue.use(VueMermaid);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
