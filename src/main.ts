import Vue from "vue";
import App from "./App.vue";

// #ifdef H5
import { version } from "../package.json";

window.version = version;
// #endif

Vue.config.productionTip = false;

new App().$mount()
