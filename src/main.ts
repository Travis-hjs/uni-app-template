import Vue from "vue";
import App from "./App.vue";

// #ifdef H5
const { version } = require("../package.json");
window.version = version;
// #endif

Vue.config.productionTip = false;

new App().$mount()
