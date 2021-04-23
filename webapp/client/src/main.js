import Vue from 'vue';
import axios from 'axios';
import TreeView from 'vue-json-tree-view';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

axios.defaults.baseURL = '/api/v1';
axios.defaults.withCredentials = true;

window.$eventHub = new Vue();
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(TreeView);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
