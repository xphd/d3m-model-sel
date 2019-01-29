import Vue from "vue";
import App from "./App.vue";

import JsonViewer from "vue-json-viewer";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import "material-design-icons-iconfont/dist/material-design-icons.css";
Vue.use(Vuetify);

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);

import VueSocketIO from "vue-socket.io";
const socket = new VueSocketIO({
  debug: true,
  connection: "http://localhost:9090"
});
Vue.use(socket);

Vue.use(JsonViewer);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
