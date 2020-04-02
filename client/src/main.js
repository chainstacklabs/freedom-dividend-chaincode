import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

axios.defaults.baseURL = '/api/v1';
axios.defaults.withCredentials = true;

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
